<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('schedules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('course_id')->constrained()->onDelete('cascade');
            $table->foreignId('group_id')->constrained()->onDelete('cascade');
            $table->foreignId('professor_id')->nullable()->constrained('professors')->onDelete('set null');
            $table->string('room');
            $table->enum('day', ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']);
            $table->time('start_time');
            $table->time('end_time');
            $table->enum('type', ['cours', 'td', 'tp', 'examen'])->default('cours');
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->boolean('is_recurring')->default(true);
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('schedules');
    }
};