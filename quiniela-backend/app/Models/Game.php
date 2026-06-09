<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Game extends Model
{
    // Esto es lo que permite que el campo pase a la base de datos
    protected $fillable = [
        'team_a', 
        'team_b', 
        'start_time', 
        'quiniela_number', 
        'status', 
        'real_winner'
    ];
}