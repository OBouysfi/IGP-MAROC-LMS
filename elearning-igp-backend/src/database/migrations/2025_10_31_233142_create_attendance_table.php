<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('attendance', function (Blueprint $table) {
            $table->id();
            $table->foreignId('session_id')->constrained('jitsi_sessions')->onDelete('cascade');
            $table->foreignId('student_id')->constrained('users')->onDelete('cascade');
            $table->dateTime('joined_at')->nullable();
            $table->dateTime('left_at')->nullable();
            $table->integer('duration_minutes')->nullable();
            $table->enum('status', ['present', 'absent', 'late'])->default('absent');
            $table->timestamps();
            
            $table->unique(['session_id', 'student_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('attendance');
    }
};