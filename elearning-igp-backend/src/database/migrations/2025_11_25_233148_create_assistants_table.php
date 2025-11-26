<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('assistants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('employee_id')->unique()->nullable();
            $table->string('department')->nullable();
            $table->string('phone')->nullable();
            $table->text('bio')->nullable();
            $table->string('linkedin')->nullable();
            $table->json('notification_settings')->nullable();
            $table->json('preferences')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('assistants');
    }
};