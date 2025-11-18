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
            $table->string('student_code')->unique(); // Code étudiant unique (ex: STU-00001)
            $table->enum('gender', ['Homme', 'Femme'])->nullable();
            $table->date('birth_date')->nullable();
            $table->string('nationality')->nullable();
            $table->text('address')->nullable();
            $table->date('enrolled_date')->nullable();
            
            // Académique
            $table->string('filiere')->nullable();
            $table->string('program')->nullable(); // Master, Licence
            $table->string('level')->nullable(); // 1ère année, 2ème année, etc.
            $table->string('group')->nullable(); // Groupe classe
            
            // Administration
            $table->enum('dossier_status', ['Complet', 'Incomplet'])->default('Incomplet');
            $table->json('documents')->nullable(); // Liste des documents fournis
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