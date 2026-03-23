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
        try {
            Schema::create('equipment_items', function (Blueprint $table) {
                $table->id();
                //Foreign key
                $table->foreignId('equipment_type_id')
                      ->constrained('equipment_types')
                      ->onDelete('cascade');
                $table->foreignId('equipment_state_id')
                      ->constrained('equipment_states')
                      ->onDelete('cascade');
                $table->string('name');
                $table->enum('gender', ['male', 'female', 'kids', 'unisex']);
                $table->string('serial_number')->unique();
                $table->string('barcode');
                $table->string('size')->nullable();
                $table->decimal('price', 8, 2);
                $table->text('description')->nullable();
                $table->string('brand')->nullable();
                $table->string('notes')->nullable();
                $table->timestamps();
            });
        }
        catch (Exception $e) {
            $this->down();
            throw $e;
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('equipment_items');
    }
};
