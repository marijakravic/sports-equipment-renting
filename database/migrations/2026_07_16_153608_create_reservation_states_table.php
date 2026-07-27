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
        Schema::create('reservation_states', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
        });
        DB::table('reservation_states')->insert([
            ['name' => 'Zatrazena' ],
            ['name' => 'Aktivna'],
            ['name' => 'Otkazana'],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reservation_states');
    }
};
