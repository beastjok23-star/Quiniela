<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Game extends Model
{
    use HasFactory;

    // Campos que permitimos guardar
    protected $fillable = ['team_a', 'team_b', 'start_time', 'quiniela_id', 'status']; // Agrega los tuyos

    // Relación: Un partido tiene muchas predicciones de usuarios
    public function predictions()
    {
        return $this->hasMany(Prediction::class);
    }
}