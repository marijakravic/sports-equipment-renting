<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Reservation extends Model
{
    protected $fillable=[
        'user_id',
        'reservation_date',
        'return_date',
        'notes'
    ];

    public function user(){
        return $this->belongsTo(User::class);
    }
    public function reservedEquipments(){
        return $this->belongsToMany(Reservation::class);
    }
}
