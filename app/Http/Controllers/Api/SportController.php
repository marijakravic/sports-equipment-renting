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
        $request->validate([
            'name' => 'required|string|max:255',
            'imageurl' => 'nullable|file|image||mimes:jpeg,png,jpg'
        ]);

        return Sport::create([
            'name' => $request->name
        ]);
    }

    public function equipment($sportId)
    {
        return EquipmentItem::with(['equipmentType', 'equipmentState'])
            ->whereHas('equipmentType', function ($query) use ($sportId) {
                $query->where('sport_id', $sportId);
            })
            ->get();
    }
}
