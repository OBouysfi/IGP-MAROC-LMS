<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('students', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('student_code')->unique();
            
            // Relations OBLIGATOIRES
            $table->foreignId('filiere_id')->nullable()->constrained('filieres')->onDelete('set null');
            $table->foreignId('program_id')->nullable()->constrained('programs')->onDelete('set null');
            
            $table->enum('gender', ['Homme', 'Femme'])->nullable();
            $table->date('birth_date')->nullable();
            $table->string('nationality')->nullable();
            $table->text('address')->nullable();
            $table->date('enrolled_date')->nullable();
            
            // Académique
            $table->string('level')->nullable();
            
            // Administration
            $table->enum('dossier_status', ['Complet', 'Incomplet'])->default('Incomplet');
            $table->json('documents')->nullable();
            $table->text('admin_comments')->nullable();
            
            // Finance
            $table->decimal('inscription_amount', 10, 2)->default(0);
            $table->decimal('monthly_amount', 10, 2)->default(0);
            $table->enum('payment_status', ['À jour', 'En retard', 'Suspendu'])->default('À jour');
            
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('students');
    }
};