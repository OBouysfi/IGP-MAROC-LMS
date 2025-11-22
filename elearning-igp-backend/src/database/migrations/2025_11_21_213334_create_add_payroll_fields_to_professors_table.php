<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('professors', function (Blueprint $table) {
            // $table->decimal('hourly_rate', 10, 2)->default(300)->after('department');
            // $table->string('contract_type')->default('CDI')->after('hourly_rate');
            $table->string('bank_info')->nullable()->after('contract_type');
        });
    }

    public function down(): void
    {
        Schema::table('professors', function (Blueprint $table) {
            $table->dropColumn(['bank_info']);
        });
    }
};