<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8', // Mínimo 8 caracteres
            'fecha_nacimiento' => 'nullable|date',
            'telefono_codigo' => 'nullable|string',
            'telefono_numero' => 'nullable|string',
        ]);

        // Hasheo con Bcrypt + Pepper
        $pepper = env('PEPPER_KEY');
        $saltedPassword = $validated['password'] . $pepper;
        $hashedPassword = Hash::make($saltedPassword, [
            'rounds' => 12, // Costo elevado para mayor seguridad
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => $hashedPassword,
            'fecha_nacimiento' => $validated['fecha_nacimiento'] ?? null,
            'telefono_codigo' => $validated['telefono_codigo'] ?? null, 
            'telefono_numero' => $validated['telefono_numero'] ?? null,
        ]);

        $token = Auth::login($user);
        return response()->json([
            'user' => $user,
            'token' => $token,
        ], 201);
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        // Verificación con Pepper
        $user = User::where('email', $credentials['email'])->first();
        $pepper = env('PEPPER_KEY');
        $saltedPassword = $credentials['password'] . $pepper;

        if (!$user || !Hash::check($saltedPassword, $user->password)) {
            return response()->json(['error' => 'Credenciales inválidas'], 401);
        }

        $token = Auth::login($user);
        return response()->json(['token' => $token]);
    }

    // Cerrar sesión (invalida el token)
    public function logout()
    {
        Auth::logout();
        return response()->json(['message' => 'Logout exitoso']);
    }

    // Renovar token (sin requerir login nuevamente)
    public function refresh()
    {
        return response()->json([
            'token' => Auth::refresh(),
            'user' => Auth::user()
        ]);
    }
}