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
        $request->validate([
            'quiniela_number' => 'required|integer',
            'team_a' => 'required|string',
            'team_b' => 'required|string',
            'start_time' => 'required|date'
        ]);

        $game = Game::create($request->all());

        return response()->json(['success' => true, 'data' => $game]);
    }

    // Eliminar un partido
    public function destroy($id)
    {
        Game::destroy($id);
        return response()->json(['success' => true]);
    }

    // NUEVO: Actualizar el ganador y calcular los puntos de todos automáticamente
    public function updateWinner(Request $request, $id)
    {
        $request->validate([
            'real_winner' => 'required|string'
        ]);

        $game = Game::find($id);
        if (!$game) {
            return response()->json(['success' => false, 'message' => 'Partido no encontrado'], 404);
        }

        // 1. Guardamos al ganador real del partido
        $game->real_winner = $request->real_winner;
        $game->save();

        // 2. Buscamos a TODOS los jugadores inscritos en esta quiniela
        $entries = Entry::where('quiniela_number', $game->quiniela_number)->get();

        foreach ($entries as $entry) {
            // 3. Contamos cuántos de sus pronósticos coinciden con los resultados reales
            $correctGuesses = Prediction::join('games', 'predictions.game_id', '=', 'games.id')
                ->where('predictions.entry_id', $entry->id)
                ->whereColumn('predictions.predicted_winner', 'games.real_winner')
                ->count();

            // 4. Actualizamos el puntaje total del jugador
            $entry->total_score = $correctGuesses;
            $entry->save();
        }

        return response()->json(['success' => true]);
    }
}