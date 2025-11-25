// database/migrations/xxxx_add_settings_to_students_table.php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('students', function (Blueprint $table) {
            $table->string('phone')->nullable()->after('student_code');
            $table->date('date_of_birth')->nullable()->after('phone');
            // $table->text('address')->nullable()->after('date_of_birth');
            $table->text('bio')->nullable()->after('address');
            $table->string('linkedin')->nullable()->after('bio');
            $table->string('github')->nullable()->after('linkedin');
            $table->json('notification_settings')->nullable()->after('github');
            $table->json('preferences')->nullable()->after('notification_settings');
        });
    }

    public function down(): void
    {
        Schema::table('students', function (Blueprint $table) {
            $table->dropColumn([
                'phone',
                'date_of_birth',
                // 'address',
                'bio',
                'linkedin',
                'github',
                'notification_settings',
                'preferences'
            ]);
        });
    }
};