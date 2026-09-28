<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('size_types', function (Blueprint $table) {
            $table->foreignId('equipment_type_id')
                ->nullable()
                ->after('id')
                ->constrained('equipment_types')
                ->cascadeOnDelete();
            $table->unique(['equipment_type_id', 'size_type']);
        });
    }

    public function down(): void
    {
        Schema::table('size_types', function (Blueprint $table) {
            $table->dropUnique(['equipment_type_id', 'size_type']);
            $table->dropConstrainedForeignId('equipment_type_id');
        });
    }
};
