<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Participant;

class ParticipantController extends Controller
{
    // 1. Método para Guardar o Actualizar puntos (Panel de Control)
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'total_score' => 'required|numeric'
        ]);

        // La magia: Si el jugador ya existe, le actualiza los puntos. Si no existe, lo crea.
        $participant = Participant::updateOrCreate(
            ['name' => $request->name],
            ['total_score' => $request->total_score]
        );

        return response()->json([
            'success' => true,
            'message' => 'Guardado exitosamente',
            'data' => $participant
        ]);
    }

    // 2. Método para Buscar (Buscador Público)
    public function show($name)
    {
        $participant = Participant::where('name', $name)->first();

        if (!$participant) {
            return response()->json(['success' => false, 'message' => 'No encontrado'], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $participant
        ]);
    }
}