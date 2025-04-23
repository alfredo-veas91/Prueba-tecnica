<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PiezaImagen extends Model
{
    protected $fillable = ['pieza_id', 'url'];

    public function pieza()
    {
        return $this->belongsTo(Pieza::class);
    }
}
