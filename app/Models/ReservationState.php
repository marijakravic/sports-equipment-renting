<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ReservationState extends Model
{
    protected $fillable = ['name'];

    public function reservations(){
        return $this->hasMany(Reservation::class);
    }
}
