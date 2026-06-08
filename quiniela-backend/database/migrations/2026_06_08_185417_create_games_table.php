<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
public function up(): void
    {
        Schema::create('games', function (Blueprint $table) {
            $table->id();
            $table->integer('quiniela_number'); // Para saber si es la 1, 2, 3 o 4
            $table->string('team_a');
            $table->string('team_b');
            $table->dateTime('start_time'); // Hora exacta del partido (Hora de México)
            $table->string('real_winner')->nullable(); // Nulo hasta que el admin decida
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('games');
    }
};
