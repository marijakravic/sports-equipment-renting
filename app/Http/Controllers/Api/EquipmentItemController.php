<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\EquipmentItem;
use Illuminate\Http\Request;

class EquipmentItemController extends Controller
{
    public function index()
    {
        return EquipmentItem::with(['equipmentType', 'equipmentState'])->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'equipment_type_id' => 'required|exists:equipment_types,id',
            'equipment_state_id' => 'required|exists:equipment_states,id',
            'age_id' => 'required|exists:ages,id',

            'name' => 'required|string|max:255',
            'serial_number' => 'required|string|unique:equipment_items,serial_number',
            'barcode' => 'required|string',
            'internal_registration_number' => 'required|string',

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

    public function searchAll(Request $request)
    {
        $query = EquipmentItem::with([
            'equipmentType',
            'equipmentState'
        ]);

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
        if ($request->filled('sport')) {

            $query->whereHas('equipmentType', function ($q) use ($request) {
                $q->where('sport_id', $request->sport);
            });
        }
        if ($request->filled('age')) {

            $query->where('age_id', $request->age);

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
            ->whereIn('id', $ids)
            ->get();
    }
}
