<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Participant extends Model
{
    use HasFactory;

    // Esto destraba la seguridad para permitir guardar estos dos datos
    protected $fillable = ['name', 'total_score'];
}