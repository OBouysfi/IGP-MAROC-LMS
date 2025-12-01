<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('groups', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('code')->unique();
            
            // Relations
            $table->foreignId('program_id')->nullable()->constrained('programs')->onDelete('set null');
            $table->foreignId('filiere_id')->nullable()->constrained('filieres')->onDelete('set null');
            
            $table->string('level');
            $table->integer('max_students')->default(30);
            $table->string('delegate')->nullable();
            $table->string('delegate_email')->nullable();
            $table->json('schedule')->nullable();
            $table->timestamps();
        });

        Schema::create('group_student', function (Blueprint $table) {
            $table->id();
            $table->foreignId('group_id')->constrained()->onDelete('cascade');
            $table->foreignId('student_id')->constrained('students')->onDelete('cascade'); // ✅ students pas users
            $table->timestamps();
        });

        Schema::create('group_course', function (Blueprint $table) {
            $table->id();
            $table->foreignId('group_id')->constrained()->onDelete('cascade');
            $table->foreignId('course_id')->constrained()->onDelete('cascade');
            $table->integer('hours_week')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('group_course');
        Schema::dropIfExists('group_student');
        Schema::dropIfExists('groups');
    }
};