<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\EquipmentItem;
use Illuminate\Http\Request;

class EquipmentItemController extends Controller
{
    private function equipmentRelations(): array
    {
        return ['equipmentType.sport', 'equipmentState', 'age'];
    }

    public function index()
    {
        return EquipmentItem::with($this->equipmentRelations())
            ->withAvailability()
            ->get();
    }

    public function show(EquipmentItem $equipmentItem)
    {
        $equipmentItem->load($this->equipmentRelations())->loadExists([
            'reservations as is_occupied' => fn ($reservationQuery) => $reservationQuery->whereHas(
                'reservationState',
                fn ($stateQuery) => $stateQuery->where('name', 'Aktivna')
            ),
        ]);

        $equipmentItem->setAttribute('reservation_history', $equipmentItem->reservations()
            ->select(['reservations.id', 'reservation_date', 'return_date', 'reservation_state_id'])
            ->with('reservationState:id,name')
            ->orderByDesc('reservation_date')
            ->get());

        return $equipmentItem;
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'equipment_type_id' => 'required|exists:equipment_types,id',
            'equipment_state_id' => 'required|exists:equipment_states,id',
            'age_id' => 'required|exists:ages,id',

            'name' => 'required|string|max:255',
            'serial_number' => 'required|string',
            'barcode' => 'required|string',
            'internal_registration_number' => 'required|string|unique:equipment_items,internal_registration_number',

            'size' => 'nullable|string',
            'price' => 'required|numeric',

            'description' => 'nullable|string',
            'brand' => 'nullable|string',
            'model' => 'nullable|string',
            'size_type_id' => 'required|exists:size_types,id',
            'notes' => 'nullable|string',

            'imageurl' => 'nullable|file|image||mimes:jpeg,png,jpg'
        ]);

        // Handle image upload (optional)
        if ($request->hasFile('imageurl')) {
            $path = $request->file('imageurl')->store('equipment', 'public');
            $validated['imageurl'] = $path;
        }

        return EquipmentItem::create($validated);
    }

    public function update(Request $request, EquipmentItem $equipmentItem)
    {
        abort_unless($request->user()?->role === 'admin', 403, 'Ovu radnju može izvršiti samo administrator.');

        $validated = $request->validate([
            'equipment_type_id' => 'required|exists:equipment_types,id',
            'equipment_state_id' => 'required|exists:equipment_states,id',
            'age_id' => 'required|exists:ages,id',
            'name' => 'required|string|max:255',
            'serial_number' => 'required|string',
            'barcode' => 'required|string',
            'internal_registration_number' => 'required|string|unique:equipment_items,internal_registration_number,' . $equipmentItem->id,
            'size' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'brand' => 'nullable|string',
            'model' => 'nullable|string',
            'size_type_id' => 'required|exists:size_types,id',
            'notes' => 'nullable|string',
            'imageurl' => 'nullable|file|image|mimes:jpeg,png,jpg',
        ]);

        if ($request->hasFile('imageurl')) {
            $validated['imageurl'] = $request->file('imageurl')->store('equipment', 'public');
        } else {
            unset($validated['imageurl']);
        }

        $equipmentItem->update($validated);

        return $equipmentItem->fresh()->load($this->equipmentRelations());
    }

    public function searchAll(Request $request)
    {
        $query = EquipmentItem::with([
            'equipmentType',
            'equipmentState'
        ])->withAvailability();

        if ($request->filled('search')) {
            $search = $request->get('search');

            $query->where(function ($q) use ($search) {
                $q->whereLike('name', "%{$search}%")
                    ->orWhereLike('model', "%{$search}%")
                    ->orWhereLike('brand', "%{$search}%")
                    ->orWhereLike('internal_registration_number', "%{$search}%")
                    ->orWhereLike('barcode', "%{$search}%")
                    ->orWhereHas('equipmentType', function ($typeQuery) use ($search) {
                        $typeQuery->whereLike('name', "%{$search}%");
                    });
            });
        }
        if ($request->filled('sport')) {

            $query->whereHas('equipmentType', function ($q) use ($request) {
                $q->where('sport_id', $request->sport);
            });
        }
        if ($request->filled('age')) {

            $query->where('age_id', $request->age);

        }
        if ($request->filled('state')) {
            $query->whereHas('equipmentState', function ($q) use ($request) {
                if ($request->state === 'Damaged') {
                    $q->whereIn('name', ['Damaged', 'Oštećeno', 'Osteceno']);
                    return;
                }

                $q->where('name', $request->state);
            });
        }
        return $query->get();
    }

    public function basketItems(Request $request)
    {
        $ids = $request->input('ids', []);

        return EquipmentItem::with([
            'equipmentType.sport',
            'equipmentState'
        ])
            ->withAvailability()
            ->whereIn('id', $ids)
            ->get();
    }
}
