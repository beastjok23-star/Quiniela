<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        // Habilita el estado para las peticiones de la API (Autenticación con Sanctum)
        $middleware->statefulApi([
            'quiniela-lyart-chi.vercel.app', // Tu dominio de Vercel (sin https:// ni /)
            'localhost:3000',               // Para pruebas en local con Next.js
            '127.0.0.1:3000',              // Alternativa local común
        ]);

        // Asegura que las peticiones de la API incluyan el middleware de autenticación por estado si es necesario
        $middleware->api(prepend: [
            \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        // Puedes dejar esto vacío o configurar excepciones personalizadas aquí
    })->create();