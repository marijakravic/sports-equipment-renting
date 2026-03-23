<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EquipmentType extends Model
{
    protected $fillable = [
        'sport_id',
        'name'
    ];

    public function sport(){
        return $this->belongsTo(Sport::class);
    }

    public function equipmentItems(){
        return $this->hasMany(EquipmentItem::class);
    }
}
