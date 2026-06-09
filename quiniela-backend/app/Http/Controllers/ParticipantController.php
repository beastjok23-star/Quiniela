<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Entry;
use App\Models\Prediction;
use App\Models\Game;
use Carbon\Carbon;

class ParticipantController extends Controller
{
    // 1. Guardar las predicciones del usuario
    public function store(Request $request)
    {
        $request->validate([
            'participant_name' => 'required|string',
            'quiniela_number' => 'required|integer',
            'predictions' => 'required|array' // Recibirá una lista con las 6 elecciones
        ]);

        // REGLA DE NEGOCIO: Validar la hora del primer partido
        // Buscamos cuál es el partido que empieza más temprano en esta quiniela
        $firstGame = Game::where('quiniela_number', $request->quiniela_number)
                         ->orderBy('start_time', 'asc')
                         ->first();

        if ($firstGame) {
            $now = Carbon::now('America/Mexico_City');
            $gameTime = Carbon::parse($firstGame->start_time, 'America/Mexico_City');

            // Si la hora actual ya pasó o es igual a la hora del partido, ¡BLOQUEAMOS!
            if ($now->greaterThanOrEqualTo($gameTime)) {
                return response()->json([
                    'success' => false,
                    'message' => '¡Tiempo agotado! La quiniela ' . $request->quiniela_number . ' ya está cerrada.'
                ], 403);
            }
        }

        // Si llegamos aquí, estamos a tiempo. Creamos el Boleto (Entry)
        $entry = Entry::create([
            'participant_name' => $request->participant_name,
            'quiniela_number' => $request->quiniela_number,
            'total_score' => 0
        ]);

        // Guardamos las 6 selecciones vinculadas a ese boleto
        foreach ($request->predictions as $prediction) {
            Prediction::create([
                'entry_id' => $entry->id,
                'game_id' => $prediction['game_id'],
                'predicted_winner' => $prediction['predicted_winner']
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Predicciones enviadas con éxito',
        ]);
    }

    // 2. Traer la tabla de posiciones (Leaderboard) para una quiniela específica
    public function leaderboard($quiniela_number)
    {
        $entries = Entry::where('quiniela_number', $quiniela_number)
                        ->orderBy('total_score', 'desc')
                        ->get();

        return response()->json([
            'success' => true,
            'data' => $entries
        ]);
    }
}