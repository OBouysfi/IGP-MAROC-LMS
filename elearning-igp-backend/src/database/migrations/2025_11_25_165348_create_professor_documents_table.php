<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('professor_documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('professor_id')->constrained('professors')->onDelete('cascade');
            $table->foreignId('course_id')->constrained('courses')->onDelete('cascade');
            $table->string('name');
            $table->string('file_path');
            $table->string('file_type'); // pdf, docx, pptx, xlsx, video, image, zip
            $table->bigInteger('file_size'); // en bytes
            $table->enum('category', ['cours', 'tp', 'examen', 'correction', 'ressource'])->default('cours');
            $table->boolean('shared_with_students')->default(true);
            $table->integer('downloads')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('professor_documents');
    }
};