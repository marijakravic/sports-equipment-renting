<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('reservations', function (Blueprint $table) {
            $table->unsignedInteger('rental_days')->nullable()->after('return_date');
            $table->decimal('total_price', 10, 2)->nullable()->after('rental_days');
            $table->string('payment_status')->default('unpaid')->after('total_price');
            $table->string('payment_method')->nullable()->after('payment_status');
            $table->string('receipt_number')->nullable()->unique()->after('payment_method');
            $table->timestamp('activated_at')->nullable()->after('receipt_number');
            $table->timestamp('completed_at')->nullable()->after('activated_at');
            $table->timestamp('cancelled_at')->nullable()->after('completed_at');
        });

        Schema::table('reserved_equipment', function (Blueprint $table) {
            $table->decimal('daily_price', 10, 2)->nullable()->after('equipment_item_id');
        });
    }

    public function down(): void
    {
        Schema::table('reserved_equipment', function (Blueprint $table) {
            $table->dropColumn('daily_price');
        });

        Schema::table('reservations', function (Blueprint $table) {
            $table->dropColumn([
                'rental_days', 'total_price', 'payment_status', 'payment_method',
                'receipt_number', 'activated_at', 'completed_at', 'cancelled_at',
            ]);
        });
    }
};
