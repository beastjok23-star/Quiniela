<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\PublicController;

// Endpoint público para el buscador de la quiniela
Route::get('/participant/{name}', [PublicController::class, 'getScore']);