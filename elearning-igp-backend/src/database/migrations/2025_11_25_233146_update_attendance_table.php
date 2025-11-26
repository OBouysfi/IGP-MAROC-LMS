<?php
// database/migrations/xxxx_update_attendance_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Drop la table attendances si elle existe
        Schema::dropIfExists('attendances');
        
        // Modifier la table attendance existante
        Schema::table('attendance', function (Blueprint $table) {
            // Ajouter la colonne excused si elle n'existe pas
            if (!Schema::hasColumn('attendance', 'excused')) {
                $table->enum('status', ['present', 'absent', 'late', 'excused'])->default('absent')->change();
            }
        });
    }

    public function down(): void
    {
        Schema::table('attendance', function (Blueprint $table) {
            $table->enum('status', ['present', 'absent', 'late'])->default('absent')->change();
        });
    }
};