<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\EquipmentItem;
use Illuminate\Http\Request;

class EquipmentItemController extends Controller
{
    public function index(){
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
}
