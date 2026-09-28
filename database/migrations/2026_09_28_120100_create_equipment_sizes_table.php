<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sizes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('size_type_id')->constrained('size_types')->cascadeOnDelete();
            $table->string('value');
            $table->unique(['size_type_id', 'value']);
        });

        DB::table('size_types')
            ->whereNull('equipment_type_id')
            ->get(['id', 'size_type'])
            ->each(function ($legacySizeType) {
                DB::table('equipment_items')
                    ->where('size_type_id', $legacySizeType->id)
                    ->distinct()
                    ->pluck('equipment_type_id')
                    ->each(function ($equipmentTypeId) use ($legacySizeType) {
                        $sizeTypeId = DB::table('size_types')
                            ->where('equipment_type_id', $equipmentTypeId)
                            ->where('size_type', $legacySizeType->size_type)
                            ->value('id');

                        if (! $sizeTypeId) {
                            $sizeTypeId = DB::table('size_types')->insertGetId([
                                'equipment_type_id' => $equipmentTypeId,
                                'size_type' => $legacySizeType->size_type,
                            ]);
                        }

                        DB::table('equipment_items')
                            ->where('equipment_type_id', $equipmentTypeId)
                            ->where('size_type_id', $legacySizeType->id)
                            ->whereNotNull('size')
                            ->where('size', '!=', '')
                            ->distinct()
                            ->pluck('size')
                            ->each(fn ($value) => DB::table('sizes')->insertOrIgnore([
                                'size_type_id' => $sizeTypeId,
                                'value' => $value,
                            ]));

                        DB::table('equipment_items')
                            ->where('equipment_type_id', $equipmentTypeId)
                            ->where('size_type_id', $legacySizeType->id)
                            ->update(['size_type_id' => $sizeTypeId]);
                    });
            });
    }

    public function down(): void
    {
        Schema::dropIfExists('sizes');
    }
};
