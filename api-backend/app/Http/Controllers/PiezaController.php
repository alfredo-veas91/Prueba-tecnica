<?php

namespace App\Http\Controllers;

use App\Models\Pieza;
use Illuminate\Http\Request;

class PiezaController extends Controller
{
    public function index(Request $request)
    {
        $query = Pieza::with('categoria');
    
        // Filtro por nombre
        if ($request->filled('nombre')) {
            $query->where('nombre', 'like', '%' . $request->nombre . '%');
        }
    
        // Filtro por categoría
        if ($request->filled('categoria_id')) {
            $query->where('categoria_id', $request->categoria_id);
        }
    
        // Filtro por precio exacto
        if ($request->filled('precio')) {
            $query->where('precio', $request->precio);
        }
    
        // Filtro por rango de precio
        if ($request->filled('precio_min')) {
            $query->where('precio', '>=', $request->precio_min);
        }
    
        if ($request->filled('precio_max')) {
            $query->where('precio', '<=', $request->precio_max);
        }
    
        return $query->paginate(10);
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
