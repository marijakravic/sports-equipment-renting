<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('reservation_states')->insertOrIgnore([
            'name' => 'Zavrsena',
        ]);
    }

    public function down(): void
    {
        DB::table('reservation_states')->where('name', 'Zavrsena')->delete();
    }
};
