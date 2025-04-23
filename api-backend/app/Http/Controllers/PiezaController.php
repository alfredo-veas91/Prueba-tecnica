<?php

namespace App\Http\Controllers;

use App\Models\Pieza;
use Illuminate\Http\Request;

class PiezaController extends Controller
{
    public function index(Request $request)
    {
        try {
            $query = Pieza::with(['categoria', 'imagenes']); // Carga relaciones necesarias

            // Filtros (mejorados con operador ternario)
            $request->filled('nombre') && $query->where('nombre', 'like', '%'.$request->nombre.'%');
            $request->filled('categoria_id') && $query->where('categoria_id', $request->categoria_id);
            $request->filled('precio') && $query->where('precio', $request->precio);
            $request->filled('precio_min') && $query->where('precio', '>=', $request->precio_min);
            $request->filled('precio_max') && $query->where('precio', '<=', $request->precio_max);

            // Paginación con valores por defecto seguros
            $perPage = min($request->get('per_page', 10), 100); // Límite máximo de 100 items

            return $query->orderByDesc('created_at')->paginate($perPage);

        } catch (\Exception $e) {
            Log::error('Error en PiezaController@index: '.$e->getMessage());
            return response()->json(['error' => 'Error al obtener piezas'], 500);
        }
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'descripcion' => 'required|string',
            'precio' => 'required|numeric|min:0|max:999999.99',
            'categoria_id' => 'required|exists:categorias,id',
        ]);

        try {
            $pieza = Pieza::create($validated);
            return response()->json([
                'message' => 'Pieza creada exitosamente',
                'data' => $pieza->load('categoria')
            ], 201);

        } catch (\Exception $e) {
            Log::error('Error al crear pieza: '.$e->getMessage());
            return response()->json(['error' => 'Error al crear pieza'], 500);
        }
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
