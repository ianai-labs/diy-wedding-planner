<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('partner_name', 100)->nullable()->after('name');
            $table->date('wedding_date')->nullable()->after('password');
            $table->decimal('total_budget', 15, 2)->default(0)->after('wedding_date');
            $table->string('role')->default('user')->after('total_budget');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['partner_name', 'wedding_date', 'total_budget', 'role']);
        });
    }
};
