<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('professors', function (Blueprint $table) {
            $table->string('phone')->nullable()->after('user_id');
            // $table->string('specialization')->nullable()->after('phone');
            $table->text('bio')->nullable()->after('specialization');
            $table->string('linkedin')->nullable()->after('bio');
            $table->string('github')->nullable()->after('linkedin');
            $table->json('notification_settings')->nullable()->after('github');
            $table->json('preferences')->nullable()->after('notification_settings');
        });
    }

    public function down(): void
    {
        Schema::table('professors', function (Blueprint $table) {
            $table->dropColumn([
                'phone',
                // 'specialization',
                'bio',
                'linkedin',
                'github',
                'notification_settings',
                'preferences'
            ]);
        });
    }
};