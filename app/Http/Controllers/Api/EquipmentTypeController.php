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
}
