<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('attendances', function (Blueprint $table) {
            $table->id();
            $table->morphs('attendable'); // student ou professor
            $table->foreignId('schedule_id')->nullable()->constrained()->onDelete('set null');
            $table->string('course_name');
            $table->date('date');
            $table->time('start_time');
            $table->time('end_time');
            $table->enum('type', ['absent', 'retard', 'justifié'])->default('absent');
            $table->text('justification')->nullable();
            $table->string('justification_file')->nullable();
            $table->timestamp('justified_at')->nullable();
            $table->text('comment')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('attendances');
    }
};