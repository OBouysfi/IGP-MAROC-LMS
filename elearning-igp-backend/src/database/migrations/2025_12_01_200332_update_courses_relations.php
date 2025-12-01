<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('courses', function (Blueprint $table) {
            // Supprimer les anciennes colonnes string
            $table->dropColumn(['program', 'level', 'filiere']);
            
            // Ajouter les foreign keys
            $table->foreignId('program_id')->nullable()->after('description')->constrained('programs')->onDelete('set null');
            $table->foreignId('filiere_id')->nullable()->after('program_id')->constrained('filieres')->onDelete('set null');
            $table->string('level')->nullable()->after('filiere_id');
        });
    }

    public function down()
    {
        Schema::table('courses', function (Blueprint $table) {
            $table->dropForeign(['program_id']);
            $table->dropForeign(['filiere_id']);
            $table->dropColumn(['program_id', 'filiere_id']);
            
            $table->string('program')->nullable();
            $table->string('level')->nullable();
            $table->string('filiere')->nullable();
        });
    }
};