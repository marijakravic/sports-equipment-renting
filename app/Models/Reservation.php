<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Reservation extends Model
{
    public $timestamps = false;
    protected $casts = [
        'total_price' => 'decimal:2',
        'activated_at' => 'datetime',
        'completed_at' => 'datetime',
        'cancelled_at' => 'datetime',
    ];
    protected $fillable=[
        'user_id',
        'reservation_date',
        'return_date',
        'notes',
        'name',
        'surname',
        'phone',
        'identification_document',
        'reservation_state_id',
        'rental_days',
        'total_price',
        'payment_status',
        'payment_method',
        'receipt_number',
        'activated_at',
        'completed_at',
        'cancelled_at',
    ];

    public function user(){
        return $this->belongsTo(User::class);
    }
//    public function reservedEquipments(){
//        return $this->belongsToMany(Reservation::class);
//    }
    public function reservationState(){
        return $this->belongsTo(ReservationState::class);
    }
    public function reservedEquipments(){
        return $this->belongsToMany(EquipmentItem::class, 'reserved_equipment')->withPivot('daily_price');
    }
}
