<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Participant;
use Illuminate\Http\Request;

class PublicController extends Controller
{
    public function getScore($name)
    {
        // Buscamos al participante por coincidencia exacta
        $participant = Participant::where('name', $name)->first();

        // Si no existe, devolvemos un error 404 limpio
        if (!$participant) {
            return response()->json([
                'success' => false,
                'message' => 'Participante no encontrado en la quiniela.'
            ], 404);
        }

        // Regla de negocio: Retornamos ÚNICAMENTE el nombre y los puntos
        return response()->json([
            'success' => true,
            'data' => [
                'name' => $participant->name,
                'total_score' => $participant->total_score
            ]
        ]);
    }
}