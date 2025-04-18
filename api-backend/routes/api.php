<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoriaController;
use App\Http\Controllers\PiezaController;


// Rutas públicas (sin autenticación)
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Rutas protegidas (requieren token JWT)
Route::middleware('auth:api')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/refresh', [AuthController::class, 'refresh']); // Renovar token
    Route::get('/user', [AuthController::class, 'me']); // Datos del usuario logueado
    
    // CRUD de categorías 
    Route::apiResource('categorias', CategoriaController::class);
    Route::apiResource('piezas', PiezaController::class);
});