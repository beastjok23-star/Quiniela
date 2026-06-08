<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Participant;

class ParticipantController extends Controller
{
    // 1. Panel de Control: Ahora crea un registro NUEVO siempre
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'total_score' => 'required|numeric'
        ]);

        // Usamos create() en lugar de updateOrCreate() para permitir múltiples registros
        $participant = Participant::create([
            'name' => $request->name,
            'total_score' => $request->total_score
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Guardado exitosamente',
            'data' => $participant
        ]);
    }

    // 2. Buscador Público: Ahora busca TODOS los que coincidan con el nombre
    public function show($name)
    {
        // get() en lugar de first() trae todos los resultados. 
        // orderBy los ordena del puntaje más alto al más bajo para que se vea mejor.
        $participants = Participant::where('name', $name)
                                   ->orderBy('total_score', 'desc')
                                   ->get();

        // Si la lista está vacía, manda error 404
        if ($participants->isEmpty()) {
            return response()->json(['success' => false, 'message' => 'No encontrado'], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $participants // Devuelve la lista completa
        ]);
    }
}