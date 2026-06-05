<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ParticipantController;

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

// --- RUTA CLAVE PARA ARREGLAR TU ERROR ---
// Esta línea le dice a Laravel cómo manejar el envío de datos desde tu formulario.
Route::post('/participant', [ParticipantController::class, 'store']);
// ----------------------------------------

// Esta es la ruta pública que usa tu buscador
Route::get('/participant/{name}', [ParticipantController::class, 'show']);

// Esta ruta viene por defecto, la dejamos
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});