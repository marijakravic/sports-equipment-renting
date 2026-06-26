<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EquipmentItem extends Model
{
    protected $fillable = [
        'equipment_type_id',
        'equipment_state_id',
        'name',
        'serial_number',
        'barcode',
        'size',
        'price',
        'description',
        'brand',
        'notes',
        'imageurl',
        'internal_registration_number',
        'model',
        'size_type_id',
        'age_id'
    ];

    public function equipmentType(){
        return $this->belongsTo(EquipmentType::class);
    }
    public function equipmentState(){
        return $this->belongsTo(EquipmentState::class, 'equipment_state_id');
    }
    public function age(){
        return $this->belongsTo(Age::class);
    }

    public function reservedEquipments(){
        return $this->belongsToMany(EquipmentItem::class);
    }
}
