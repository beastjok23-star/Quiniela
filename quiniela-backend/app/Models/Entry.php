<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Entry extends Model
{
    use HasFactory;

    // Campos que permitimos guardar
    protected $fillable = ['participant_name', 'quiniela_number', 'total_score'];

    // Relación: Un boleto tiene muchas predicciones (los 6 partidos)
    public function predictions()
    {
        return $this->hasMany(Prediction::class);
    }
}