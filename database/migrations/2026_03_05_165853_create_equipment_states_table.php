<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('equipment_states', function (Blueprint $table) {
            $table->id();
            $table->string('name');
        });
        DB::table('equipment_states')->insert([
            ['name' => 'Available' ],
            ['name' => 'WrittenOff'],
            ['name' => 'Damaged'],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('equipment_states');
    }
};
