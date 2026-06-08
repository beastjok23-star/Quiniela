<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Prediction extends Model
{
    use HasFactory;

    // Campos que permitimos guardar
    protected $fillable = ['entry_id', 'game_id', 'predicted_winner'];

    // Relaciones: Esta predicción pertenece a un Boleto y a un Partido
    public function entry()
    {
        return $this->belongsTo(Entry::class);
    }

    public function game()
    {
        return $this->belongsTo(Game::class);
    }
}