<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('courses', function (Blueprint $table) {
            $table->string('program')->nullable()->after('description');
            $table->string('level')->nullable()->after('program');
            $table->string('filiere')->nullable()->after('level');
            $table->foreignId('professor_id')->nullable()->constrained()->onDelete('set null')->after('filiere');
            $table->integer('students_count')->default(0)->after('professor_id');
            $table->integer('max_students')->default(30)->after('students_count');
            $table->integer('hours_total')->default(0)->after('max_students');
            $table->integer('hours_completed')->default(0)->after('hours_total');
            $table->date('start_date')->nullable()->after('hours_completed');
            $table->date('end_date')->nullable()->after('start_date');
            $table->json('schedule')->nullable()->after('end_date');
            $table->enum('status', ['À venir', 'En cours', 'Terminé'])->default('À venir')->after('schedule');
            $table->json('materials')->nullable()->after('status');
            $table->integer('completion_rate')->default(0)->after('materials');
            
            // $table->dropForeign(['year_id']);
            // $table->dropColumn('year_id');
        });
    }

    public function down()
    {
        Schema::table('courses', function (Blueprint $table) {
            $table->dropColumn([
                'program', 'level', 'filiere', 'professor_id',
                'students_count', 'max_students', 'hours_total', 'hours_completed',
                'start_date', 'end_date', 'schedule', 'status', 'materials', 'completion_rate'
            ]);
        });
    }
};