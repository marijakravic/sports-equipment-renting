<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Age extends Model
{
    protected $fillable = ['name'];

    public function equipmentItems(){
        return $this -> hasMany(EquipmentItem::class);
    }
}
