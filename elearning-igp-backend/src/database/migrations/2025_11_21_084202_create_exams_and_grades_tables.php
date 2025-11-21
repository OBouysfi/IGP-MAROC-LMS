<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('exams', function (Blueprint $table) {
            $table->id();
            $table->foreignId('course_id')->constrained()->onDelete('cascade');
            $table->foreignId('group_id')->constrained()->onDelete('cascade');
            $table->foreignId('professor_id')->nullable()->constrained('professors')->onDelete('set null');
            $table->enum('type', ['partiel', 'final', 'rattrapage', 'controle']);
            $table->date('date');
            $table->time('time');
            $table->integer('duration_minutes');
            $table->string('room');
            $table->integer('total_students')->default(0);
            $table->integer('graded_students')->default(0);
            $table->decimal('average', 5, 2)->nullable();
            $table->decimal('min_grade', 5, 2)->nullable();
            $table->decimal('max_grade', 5, 2)->nullable();
            $table->decimal('pass_rate', 5, 2)->nullable();
            $table->enum('status', ['planifié', 'en_cours', 'terminé', 'notes_saisies', 'validé'])->default('planifié');
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        Schema::create('grades', function (Blueprint $table) {
            $table->id();
            $table->foreignId('exam_id')->constrained()->onDelete('cascade');
            $table->foreignId('student_id')->constrained('users')->onDelete('cascade');
            $table->decimal('grade', 5, 2);
            $table->enum('status', ['validé', 'rattrapage', 'absent'])->default('validé');
            $table->text('comment')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('grades');
        Schema::dropIfExists('exams');
    }
};