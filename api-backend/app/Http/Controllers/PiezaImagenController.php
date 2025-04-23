<?php

namespace App\Http\Controllers;

use App\Models\Pieza;
use App\Models\PiezaImagen;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class PiezaImagenController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'pieza_id' => 'required|exists:piezas,id',
            'imagen' => 'required|image|mimes:jpg,jpeg,png,gif,webp|max:5120', // 5MB máximo
        ]);

        try {
            // Usar un nombre de archivo único
            $path = $request->file('imagen')->store(
                'piezas/'.date('Y/m'), 
                'public'
            );

            $imagen = PiezaImagen::create([
                'pieza_id' => $validated['pieza_id'],
                'url' => $path,
                'original_name' => $request->file('imagen')->getClientOriginalName(),
                'mime_type' => $request->file('imagen')->getClientMimeType()
            ]);

            return response()->json([
                'message' => 'Imagen subida correctamente',
                'data' => $imagen
            ], 201);

        } catch (\Exception $e) {
            Log::error('Error al subir imagen: '.$e->getMessage());
            return response()->json(['error' => 'Error al subir imagen'], 500);
        }
    }

    public function index($pieza_id)
    {
        try {
            $pieza = Pieza::with('imagenes')->findOrFail($pieza_id);
            return response()->json($pieza->imagenes);

        } catch (\Exception $e) {
            Log::error('Error al obtener imágenes: '.$e->getMessage());
            return response()->json(['error' => 'Pieza no encontrada'], 404);
        }
    }

    public function destroy($id)
    {
        try {
            $imagen = PiezaImagen::findOrFail($id);

            Storage::disk('public')->delete($imagen->url);
            $imagen->delete();

            return response()->json([
                'message' => 'Imagen eliminada',
                'deleted' => true
            ]);

        } catch (\Exception $e) {
            Log::error('Error al eliminar imagen: '.$e->getMessage());
            return response()->json(['error' => 'Error al eliminar imagen'], 500);
        }
    }
}