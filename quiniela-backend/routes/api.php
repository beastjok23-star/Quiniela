<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ParticipantController;
use App\Http\Controllers\GameController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// --- RUTAS PARA ADMINISTRAR LOS PARTIDOS (PANEL ADMIN) ---
Route::get('/games/{quiniela_number}', [GameController::class, 'index']);
Route::post('/games', [GameController::class, 'store']);
Route::delete('/games/{id}', [GameController::class, 'destroy']);
Route::put('/games/{id}/winner', [GameController::class, 'updateWinner']);

// --- RUTAS PÚBLICAS DEL JUGADOR (QUINELAS) ---
// Para guardar el boleto con todas las selecciones y revisar el tiempo
Route::post('/participant', [ParticipantController::class, 'store']);
// Para ver la tabla de posiciones (leaderboard) de cada quiniela
Route::get('/leaderboard/{quiniela_number}', [ParticipantController::class, 'leaderboard']);

// Esta ruta viene por defecto, la dejamos
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});