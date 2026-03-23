<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Sport extends Model
{
    protected $fillable = ['name'];

    public function equipmentTypes()
    {
        return $this -> hasMany(EquipmentType::class);
    }
}
