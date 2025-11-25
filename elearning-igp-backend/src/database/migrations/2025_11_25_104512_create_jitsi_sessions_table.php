<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('jitsi_sessions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('professor_id')->constrained('professors')->onDelete('cascade');
            $table->foreignId('course_id')->constrained('courses')->onDelete('cascade');
            $table->foreignId('group_id')->constrained('groups')->onDelete('cascade');
            $table->string('title');
            $table->text('description')->nullable();
            $table->date('session_date');
            $table->time('start_time');
            $table->integer('duration'); // in minutes
            $table->enum('status', ['planifiée', 'en_cours', 'terminée', 'annulée'])->default('planifiée');
            $table->integer('max_participants')->default(50);
            $table->string('room_url')->unique();
            $table->boolean('recording_enabled')->default(true);
            $table->boolean('chat_enabled')->default(true);
            $table->timestamps();
        });

        Schema::create('jitsi_session_participants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('session_id')->constrained('jitsi_sessions')->onDelete('cascade');
            $table->foreignId('student_id')->constrained('students')->onDelete('cascade');
            $table->boolean('registered')->default(true);
            $table->boolean('joined')->default(false);
            $table->timestamp('joined_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('jitsi_session_participants');
        Schema::dropIfExists('jitsi_sessions');
    }
};