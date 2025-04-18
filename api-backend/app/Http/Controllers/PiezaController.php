<?php

namespace App\Http\Controllers;

use App\Models\Pieza;
use Illuminate\Http\Request;

class PiezaController extends Controller
{
    public function index()
    {
        return Pieza::with('categoria')->paginate(10);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'descripcion' => 'required|string',
            'precio' => 'required|numeric|min:0',
            'categoria_id' => 'required|exists:categorias,id',
        ]);

        $pieza = Pieza::create($validated);

        return response()->json($pieza, 201);
    }

    public function show(Pieza $pieza)
    {
        return $pieza->load('categoria');
    }

    public function update(Request $request, Pieza $pieza)
    {
        $validated = $request->validate([
            'nombre' => 'sometimes|required|string|max:255',
            'descripcion' => 'sometimes|required|string',
            'precio' => 'sometimes|required|numeric|min:0',
            'categoria_id' => 'sometimes|required|exists:categorias,id',
        ]);

        $pieza->update($validated);

        return response()->json($pieza);
    }

    public function destroy(Pieza $pieza)
    {
        $pieza->delete();

        return response()->json(['message' => 'Pieza eliminada correctamente']);
    }
}
