<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('professors', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('professor_code')->unique();
            $table->string('gender')->nullable();
            $table->date('birth_date')->nullable();
            $table->string('nationality')->nullable();
            $table->text('address')->nullable();
            $table->date('hire_date')->nullable();
            $table->string('department')->nullable();
            $table->string('specialization')->nullable();
            $table->enum('contract_type', ['CDI', 'CDD', 'Vacataire'])->default('CDI');
            $table->decimal('hourly_rate', 10, 2)->default(0);
            $table->integer('total_hours_month')->default(0);
            $table->json('qualifications')->nullable();
            $table->text('bio')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('professors');
    }
};