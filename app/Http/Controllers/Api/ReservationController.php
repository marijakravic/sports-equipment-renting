<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\EquipmentItem;
use App\Models\Reservation;
use App\Models\ReservationState;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReservationController extends Controller
{
    private function reservationRelations(): array
    {
        return [
            'user:id,name,surname,email',
            'reservationState',
            'reservedEquipments.equipmentType.sport',
            'reservedEquipments.equipmentState',
        ];
    }

    public function index(Request $request)
    {
        $query = Reservation::with($this->reservationRelations());

        if ($request->filled('from')) {
            $query->whereDate('reservation_date', '>=', $request->string('from'));
        }
        if ($request->filled('to')) {
            $query->whereDate('return_date', '<=', $request->string('to'));
        }
        if ($request->filled('worker')) {
            $query->where('user_id', $request->integer('worker'));
        }
        if ($request->filled('customer')) {
            $customer = $request->string('customer')->trim();
            $query->where(function ($customerQuery) use ($customer) {
                $customerQuery->whereLike('name', "%{$customer}%")
                    ->orWhereLike('surname', "%{$customer}%")
                    ->orWhereLike('phone', "%{$customer}%");
            });
        }
        if ($request->filled('status')) {
            $query->whereHas('reservationState', fn ($stateQuery) => $stateQuery->where('name', $request->string('status')));
        }
        if ($request->filled('sport')) {
            $query->whereHas('reservedEquipments.equipmentType', fn ($typeQuery) => $typeQuery->where('sport_id', $request->integer('sport')));
        }

        return $query->orderByDesc('id')->get();
    }

    public function show(Reservation $reservation)
    {
        return $reservation->load($this->reservationRelations());
    }

    public function update(Request $request, Reservation $reservation)
    {
        $this->requireAdmin($request);
        abort_if(in_array($reservation->reservationState?->name, ['Zavrsena', 'Otkazana'], true), 422, 'Završena ili otkazana rezervacija se ne može mijenjati.');

        $validated = $request->validate([
            'reservation_date' => 'required|date',
            'return_date' => 'required|date|after_or_equal:reservation_date',
            'name' => 'required|string|max:255',
            'surname' => 'required|string|max:255',
            'phone' => 'required|string|max:255',
            'identification_document' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
            'equipment_item_ids' => 'required|array|min:1',
            'equipment_item_ids.*' => 'required|integer|distinct|exists:equipment_items,id',
        ]);

        return DB::transaction(function () use ($reservation, $validated) {
            $reservation = Reservation::lockForUpdate()->findOrFail($reservation->id);
            $equipment = EquipmentItem::with('equipmentState')
                ->whereIn('id', $validated['equipment_item_ids'])
                ->lockForUpdate()
                ->get()
                ->keyBy('id');

            abort_unless($equipment->count() === count($validated['equipment_item_ids']), 422, 'Odabrana oprema više ne postoji.');
            $this->ensureEquipmentIsRentable($equipment, $reservation->id);

            $rentalDays = Carbon::parse($validated['reservation_date'])->startOfDay()
                ->diffInDays(Carbon::parse($validated['return_date'])->startOfDay()) + 1;
            $totalPrice = $equipment->sum(fn (EquipmentItem $item) => $item->price * $rentalDays);

            $reservation->update([
                ...collect($validated)->except('equipment_item_ids')->all(),
                'rental_days' => $rentalDays,
                'total_price' => $totalPrice,
            ]);
            $reservation->reservedEquipments()->sync(
                collect($validated['equipment_item_ids'])->mapWithKeys(fn ($id) => [$id => ['daily_price' => $equipment[$id]->price]])->all()
            );

            return $reservation->fresh()->load($this->reservationRelations());
        });
    }

    public function addEquipmentItem(Request $request, Reservation $reservation)
    {
        $this->requireAdmin($request);
        abort_if(in_array($reservation->reservationState?->name, ['Zavrsena', 'Otkazana'], true), 422, 'Završena ili otkazana rezervacija se ne može mijenjati.');
        $validated = $request->validate(['equipment_item_id' => 'required|integer|exists:equipment_items,id']);

        return DB::transaction(function () use ($reservation, $validated) {
            $reservation = Reservation::lockForUpdate()->findOrFail($reservation->id);
            abort_if($reservation->reservedEquipments()->whereKey($validated['equipment_item_id'])->exists(), 422, 'Oprema je već dodana u ovu rezervaciju.');

            $equipment = EquipmentItem::with('equipmentState')->lockForUpdate()->findOrFail($validated['equipment_item_id']);
            $this->ensureEquipmentIsRentable([$equipment], $reservation->id);
            $reservation->reservedEquipments()->attach($equipment->id, ['daily_price' => $equipment->price]);

            $rentalDays = $reservation->rental_days ?: Carbon::parse($reservation->reservation_date)->startOfDay()
                ->diffInDays(Carbon::parse($reservation->return_date)->startOfDay()) + 1;
            $totalPrice = $reservation->reservedEquipments()->get()
                ->sum(fn (EquipmentItem $item) => ($item->pivot->daily_price ?? $item->price) * $rentalDays);
            $reservation->update(['rental_days' => $rentalDays, 'total_price' => $totalPrice]);

            return $reservation->fresh()->load($this->reservationRelations());
        });
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'reservation_date' => 'required|date',
            'return_date' => 'required|date|after_or_equal:reservation_date',
            'name' => 'required|string|max:255',
            'surname' => 'required|string|max:255',
            'phone' => 'required|string|max:255',
            'identification_document' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
            'equipment_item_ids' => 'required|array|min:1',
            'equipment_item_ids.*' => 'required|integer|distinct|exists:equipment_items,id',
        ]);

        $reservation = DB::transaction(function () use ($request, $validated) {
            $equipment = EquipmentItem::with('equipmentState')
                ->whereIn('id', $validated['equipment_item_ids'])
                ->lockForUpdate()
                ->get()
                ->keyBy('id');

            abort_unless($equipment->count() === count($validated['equipment_item_ids']), 422, 'Odabrana oprema više ne postoji.');
            $this->ensureEquipmentIsRentable($equipment);

            $requestedState = ReservationState::where('name', 'Zatrazena')->firstOrFail();
            $rentalDays = Carbon::parse($validated['reservation_date'])->startOfDay()
                ->diffInDays(Carbon::parse($validated['return_date'])->startOfDay()) + 1;
            $totalPrice = $equipment->sum(fn (EquipmentItem $item) => $item->price * $rentalDays);
            $reservation = Reservation::create([
                'user_id' => $request->user()->id,
                'reservation_date' => $validated['reservation_date'],
                'return_date' => $validated['return_date'],
                'rental_days' => $rentalDays,
                'total_price' => $totalPrice,
                'notes' => $validated['notes'] ?? null,
                'name' => $validated['name'],
                'surname' => $validated['surname'],
                'phone' => $validated['phone'],
                'identification_document' => $validated['identification_document'] ?? null,
                'reservation_state_id' => $requestedState->id,
            ]);

            $reservation->reservedEquipments()->attach(
                collect($validated['equipment_item_ids'])->mapWithKeys(fn ($id) => [$id => ['daily_price' => $equipment[$id]->price]])->all()
            );

            return $reservation;
        });

        return response($reservation->load($this->reservationRelations()), 201);
    }

    public function activate(Request $request, Reservation $reservation)
    {
        $this->requireAdmin($request);

        return DB::transaction(function () use ($reservation) {
            $reservation = Reservation::lockForUpdate()->findOrFail($reservation->id);
            $reservation->load('reservationState');
            abort_unless($reservation->reservationState?->name === 'Zatrazena', 422, 'Rezervacija nije u odgovarajućem stanju.');

            $equipment = $reservation->reservedEquipments()
                ->with('equipmentState')
                ->lockForUpdate()
                ->get();
            $this->ensureEquipmentIsRentable($equipment, $reservation->id);

            $activeState = ReservationState::where('name', 'Aktivna')->firstOrFail();
            $reservation->update([
                'activated_at' => now(),
                'reservation_state_id' => $activeState->id,
            ]);

            return $reservation->fresh()->load($this->reservationRelations());
        });
    }

    public function cancel(Request $request, Reservation $reservation)
    {
        $this->requireAdmin($request);
        abort_if(in_array($reservation->reservationState?->name, ['Zavrsena', 'Otkazana'], true), 422, 'Ova rezervacija se više ne može otkazati.');

        $cancelledState = ReservationState::where('name', 'Otkazana')->firstOrFail();
        $reservation->update(['reservation_state_id' => $cancelledState->id, 'cancelled_at' => now()]);

        return $reservation->fresh()->load($this->reservationRelations());
    }

    public function complete(Request $request, Reservation $reservation)
    {
        $this->requireAdmin($request);
        abort_if(in_array($reservation->reservationState?->name, ['Zavrsena', 'Otkazana'], true), 422, 'Ova rezervacija se ne može završiti.');

        $validated = $request->validate([
            'items' => 'required|array|min:1',
            'items.*.id' => 'required|integer|exists:equipment_items,id',
            'items.*.equipment_state_id' => 'required|integer|exists:equipment_states,id',
            'items.*.notes' => 'nullable|string',
            'items.*.price' => 'required|numeric|min:0',
            'payment_status' => 'required|in:unpaid,paid',
            'payment_method' => 'nullable|required_if:payment_status,paid|in:cash,card,bank_transfer',
        ]);

        $reservedItemIds = $reservation->reservedEquipments()->pluck('equipment_items.id')->sort()->values()->all();
        $submittedItemIds = collect($validated['items'])->pluck('id')->sort()->values()->all();
        abort_if($submittedItemIds !== $reservedItemIds, 422, 'Morate unijeti podatke za svu opremu iz ove rezervacije.');

        $completedState = ReservationState::where('name', 'Zavrsena')->firstOrFail();
        $rentalDays = $reservation->rental_days ?: Carbon::parse($reservation->reservation_date)->startOfDay()
            ->diffInDays(Carbon::parse($reservation->return_date)->startOfDay()) + 1;
        $totalPrice = $reservation->total_price ?: $reservation->reservedEquipments()
            ->get()
            ->sum(fn (EquipmentItem $item) => ($item->pivot->daily_price ?? $item->price) * $rentalDays);
        DB::transaction(function () use ($validated, $reservation, $completedState, $rentalDays, $totalPrice) {
            foreach ($validated['items'] as $item) {
                EquipmentItem::whereKey($item['id'])->update([
                    'equipment_state_id' => $item['equipment_state_id'],
                    'notes' => $item['notes'] ?? null,
                    'price' => $item['price'],
                ]);
            }

            $reservation->update([
                'reservation_state_id' => $completedState->id,
                'payment_status' => $validated['payment_status'],
                'payment_method' => $validated['payment_status'] === 'paid' ? $validated['payment_method'] : null,
                'receipt_number' => $reservation->receipt_number ?: 'SR-' . str_pad((string) $reservation->id, 6, '0', STR_PAD_LEFT),
                'rental_days' => $rentalDays,
                'total_price' => $totalPrice,
                'completed_at' => now(),
            ]);
        });

        return $reservation->fresh()->load($this->reservationRelations());
    }

    public function receipt(Request $request, Reservation $reservation)
    {
        abort_unless($reservation->reservationState?->name === 'Zavrsena', 422, 'Račun je dostupan nakon povratka opreme.');

        $reservation->load($this->reservationRelations());

        return Pdf::loadView('receipts.reservation', compact('reservation'))
            ->setPaper('a4')
            ->download("racun-{$reservation->receipt_number}.pdf");
    }

    private function requireAdmin(Request $request): void
    {
        abort_unless($request->user()->role === 'admin', 403, 'Ovu radnju može izvršiti samo administrator.');
    }

    private function changeState(Reservation $reservation, string $expectedState, string $nextState, array $attributes = []): void
    {
        abort_unless($reservation->reservationState?->name === $expectedState, 422, 'Rezervacija nije u odgovarajućem stanju.');
        $state = ReservationState::where('name', $nextState)->firstOrFail();
        $reservation->update([...$attributes, 'reservation_state_id' => $state->id]);
    }

    private function ensureEquipmentIsRentable(iterable $equipment, ?int $ignoredReservationId = null): void
    {
        foreach ($equipment as $item) {
            $isWrittenOff = $item->equipmentState?->name === 'WrittenOff';
            $activeReservations = $item->reservations()->whereHas(
                'reservationState',
                fn ($stateQuery) => $stateQuery->where('name', 'Aktivna')
            );

            if ($ignoredReservationId !== null) {
                $activeReservations->where('reservations.id', '!=', $ignoredReservationId);
            }

            abort_if($isWrittenOff || $activeReservations->exists(), 422, 'Jedan ili više odabranih artikala nisu dostupni za najam.');
        }
    }
}
