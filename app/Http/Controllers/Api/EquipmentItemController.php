<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\EquipmentItem;
use Illuminate\Http\Request;

class EquipmentItemController extends Controller
{
    public function index(){
        return EquipmentItem::with(['equipmentType', 'state'])->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'equipment_type_id' => 'required|exists:equipment_types,id',
            'equipment_state_id' => 'required|exists:equipment_states,id',
            'name' => 'required|string',
            'gender_id' => 'required|exists:genders,id',
            'serial_number' => 'required|unique:equipment_items',
            'barcode' => 'required',
            'size' => 'nullable|string',
            'price' => 'required|numeric',
            'description' => 'nullable|string',
            'brand' => 'nullable|string',
            'notes' => 'nullable|string'
        ]);

        return EquipmentItem::create($validated);
    }
}
