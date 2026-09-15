<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\EquipmentType;
use Illuminate\Http\Request;

class EquipmentTypeController extends Controller
{
    public function index(){
        return EquipmentType::with('sport')->get();
    }

    public function bySport($sportId){
        return EquipmentType::where('sport_id', $sportId)->get();
    }

    public function store(Request $request)
    {
        $this->requireAdmin($request);
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'sport_id' => 'required|exists:sports,id',
        ]);

        return response()->json(EquipmentType::create($validated)->load('sport'), 201);
    }

    public function update(Request $request, EquipmentType $equipmentType)
    {
        $this->requireAdmin($request);
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'sport_id' => 'required|exists:sports,id',
        ]);
        $equipmentType->update($validated);

        return $equipmentType->fresh()->load('sport');
    }

    public function destroy(Request $request, EquipmentType $equipmentType)
    {
        $this->requireAdmin($request);
        abort_if($equipmentType->equipmentItems()->exists(), 422, 'Vrstu opreme nije moguće obrisati dok sadrži stavke opreme.');
        $equipmentType->delete();

        return response()->noContent();
    }

    private function requireAdmin(Request $request): void
    {
        abort_unless($request->user()?->role === 'admin', 403, 'Ovu radnju može izvršiti samo administrator.');
    }
}
