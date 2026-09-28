<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EquipmentSize extends Model
{
    protected $table = 'sizes';

    public $timestamps = false;

    protected $fillable = ['size_type_id', 'value'];

    public function sizeType()
    {
        return $this->belongsTo(SizeType::class);
    }
}
