<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->boolean('is_locked')->default(false)->after('is_active');
            $table->timestamp('locked_at')->nullable()->after('is_locked');
            $table->string('locked_reason')->nullable()->after('locked_at');
            $table->integer('failed_login_attempts')->default(0)->after('locked_reason');
            $table->timestamp('last_login_at')->nullable()->after('failed_login_attempts');
            $table->string('last_login_ip')->nullable()->after('last_login_at');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'is_locked',
                'locked_at',
                'locked_reason',
                'failed_login_attempts',
                'last_login_at',
                'last_login_ip',
            ]);
        });
    }
};