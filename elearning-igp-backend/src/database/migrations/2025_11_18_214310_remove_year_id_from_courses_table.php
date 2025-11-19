<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('courses', function (Blueprint $table) {
            $table->dropForeign(['year_id']); // Supprimer la contrainte
            $table->dropColumn('year_id');     // Supprimer la colonne
        });
    }

    public function down()
    {
        Schema::table('courses', function (Blueprint $table) {
            $table->foreignId('year_id')->constrained()->onDelete('cascade');
        });
    }
};