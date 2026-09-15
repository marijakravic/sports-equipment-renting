<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\EquipmentItem;
use App\Models\Sport;
use Illuminate\Http\Request;

class SportController extends Controller
{
    public function index(){
        return Sport::all();
    }

    public function store(Request $request){
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'imageurl' => 'nullable|file|image|mimes:jpeg,png,jpg'
        ]);

        if ($request->hasFile('imageurl')) {
            $validated['imageurl'] = $request->file('imageurl')->store('sports', 'public');
        }

        return response()->json(Sport::create($validated), 201);
    }

    public function update(Request $request, Sport $sport)
    {
        $this->requireAdmin($request);
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:sports,name,' . $sport->id,
            'imageurl' => 'nullable|file|image|mimes:jpeg,png,jpg',
        ]);

        if ($request->hasFile('imageurl')) {
            $validated['imageurl'] = $request->file('imageurl')->store('sports', 'public');
        } else {
            unset($validated['imageurl']);
        }

        $sport->update($validated);

        return $sport->fresh();
    }

    public function destroy(Request $request, Sport $sport)
    {
        $this->requireAdmin($request);
        abort_if($sport->equipmentTypes()->exists(), 422, 'Sport nije moguće obrisati dok sadrži vrste opreme.');
        $sport->delete();

        return response()->noContent();
    }

    public function getEquipment(Request $request, $sportId)
    {
        $query = EquipmentItem::with([
            'equipmentType',
            'equipmentState'
        ])->withAvailability()
            ->whereHas('equipmentType', function ($q) use ($sportId) {
                $q->where('sport_id', $sportId);
            });

        if ($request->filled('search')) {
            $search = $request->get('search');

            $query->where(function ($q) use ($search) {
                $q->whereLike('name', "%{$search}%")
                    ->orWhereLike('model', "%{$search}%")
                    ->orWhereLike('brand', "%{$search}%")
                    ->orWhereHas('equipmentType', function ($typeQuery) use ($search) {
                        $typeQuery->whereLike('name', "%{$search}%");
                    });
            });
        }

        return $query->get();
    }

    private function requireAdmin(Request $request): void
    {
        abort_unless($request->user()?->role === 'admin', 403, 'Ovu radnju može izvršiti samo administrator.');
    }
}
