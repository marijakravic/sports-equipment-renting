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
        Schema::table('equipment_items', function (Blueprint $table) {
            $table->dropForeign('equipment_items_gender_id_foreign');
            $table->string('internal_registration_number');
            $table->string('model');
            $table->foreignId('size_type_id')
                ->constrained('size_types')
                ->onDelete('cascade');
            $table->foreignId('age_id')
                ->constrained('ages')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('equipment_items', function (Blueprint $table) {
            //
        });
    }
};
