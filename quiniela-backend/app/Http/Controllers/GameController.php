<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Game;
use App\Models\Entry;
use App\Models\Prediction;

class GameController extends Controller
{
    // Traer todos los partidos de una quiniela específica
    public function index($quiniela_number)
    {
        $games = Game::where('quiniela_number', $quiniela_number)
                     ->orderBy('start_time', 'asc')
                     ->get();

        return response()->json(['success' => true, 'data' => $games]);
    }

    // Agregar un nuevo partido
    public function store(Request $request)
    {
        // Validación estricta: espera quiniela_number
        $validated = $request->validate([
            'quiniela_number' => 'required|integer',
            'team_a' => 'required|string',
            'team_b' => 'required|string',
            'start_time' => 'required|date'
        ]);

        $game = Game::create($validated);

        return response()->json(['success' => true, 'data' => $game]);
    }

    // Eliminar un partido
    public function destroy($id)
    {
        Game::destroy($id);
        return response()->json(['success' => true]);
    }

    // Actualizar ganador y recalcular puntos
    public function updateWinner(Request $request, $id)
    {
        $request->validate([
            'real_winner' => 'required|string'
        ]);

        $game = Game::find($id);
        if (!$game) {
            return response()->json(['success' => false, 'message' => 'Partido no encontrado'], 404);
        }

        $game->real_winner = $request->real_winner;
        $game->save();

        // Recalcular puntajes para todos los participantes de esa quiniela
        $entries = Entry::where('quiniela_number', $game->quiniela_number)->get();

        foreach ($entries as $entry) {
            $correctGuesses = Prediction::join('games', 'predictions.game_id', '=', 'games.id')
                ->where('predictions.entry_id', $entry->id)
                ->whereColumn('predictions.predicted_winner', 'games.real_winner')
                ->count();

            $entry->total_score = $correctGuesses;
            $entry->save();
        }

        return response()->json(['success' => true]);
    }
}