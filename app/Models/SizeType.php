<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SizeType extends Model
{
    protected $fillable = ['name'];

    public function equipmentItems(){
        return $this -> hasMany(EquipmentItem::class);
    }
}
