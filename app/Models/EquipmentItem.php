<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EquipmentItem extends Model
{
    protected $fillable = [
        'equipment_type_id',
        'sport_id',
        'name',
        'gender',
        'serial_number',
        'barcode',
        'size',
        'price',
        'description',
        'brand',
        'notes',
        'imageurl'
    ];

    public function equipmentType(){
        return $this->belongsTo(EquipmentType::class);
    }
    public function equipmentState(){
        return $this->belongsTo(EquipmentState::class, 'equipment_state_id');
    }
    public function gender(){
        return $this->belongsTo(Gender::class);
    }
}
