<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\EquipmentState;
use Illuminate\Http\Request;

class EquipmentStateController extends Controller
{
    public function index(){
        return EquipmentState::all();
    }
}
