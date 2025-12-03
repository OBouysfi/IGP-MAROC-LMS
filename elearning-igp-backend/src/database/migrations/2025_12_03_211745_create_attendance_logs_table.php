<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('attendance_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('professor_id')->constrained()->onDelete('cascade');
            $table->foreignId('course_id')->constrained()->onDelete('cascade');
            $table->foreignId('group_id')->constrained()->onDelete('cascade');
            $table->foreignId('schedule_id')->nullable()->constrained()->onDelete('set null');
            $table->date('date');
            $table->time('clock_in')->nullable();
            $table->time('clock_out')->nullable();
            $table->decimal('hours_worked', 5, 2)->default(0); // Heures réelles
            $table->decimal('hours_scheduled', 5, 2)->default(0); // Heures prévues
            $table->enum('status', ['present', 'absent', 'late', 'early_leave'])->default('present');
            $table->enum('type', ['cours', 'td', 'tp', 'session_live'])->default('cours');
            $table->string('location')->nullable(); // Salle ou "En ligne"
            $table->text('notes')->nullable();
            $table->boolean('validated')->default(false); // Validé par admin
            $table->foreignId('validated_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('validated_at')->nullable();
            $table->timestamps();
            
            $table->index(['professor_id', 'date']);
            $table->index('validated');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('attendance_logs');
    }
};