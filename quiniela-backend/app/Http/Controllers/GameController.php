<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Game;
use App\Models\Entry;
use App\Models\Prediction;

class GameController extends Controller
{
    public function index($quiniela_number)
    {
        $games = Game::where('quiniela_number', $quiniela_number)
                        ->orderBy('start_time', 'asc')
                        ->get();

        return response()->json(['success' => true, 'data' => $games]);
    }

    public function store(Request $request)
    {
        // El validador ahora espera exactamente lo que enviaremos desde el front
        $validated = $request->validate([
            'quiniela_number' => 'required|integer',
            'team_a' => 'required|string',
            'team_b' => 'required|string',
            'start_time' => 'required|date'
        ]);

        $game = Game::create($validated);

        return response()->json(['success' => true, 'data' => $game]);
    }

    public function destroy($id)
    {
        Game::destroy($id);
        return response()->json(['success' => true]);
    }

    public function updateWinner(Request $request, $id)
    {
        $request->validate(['real_winner' => 'required|string']);

        $game = Game::find($id);
        if (!$game) return response()->json(['message' => 'No encontrado'], 404);

        $game->real_winner = $request->real_winner;
        $game->save();

        // Recalcular puntajes
        $entries = Entry::where('quiniela_number', $game->quiniela_number)->get();
        foreach ($entries as $entry) {
            $correct = Prediction::join('games', 'predictions.game_id', '=', 'games.id')
                ->where('predictions.entry_id', $entry->id)
                ->whereColumn('predictions.predicted_winner', 'games.real_winner')
                ->count();
            $entry->total_score = $correct;
            $entry->save();
        }

        return response()->json(['success' => true]);
    }
}