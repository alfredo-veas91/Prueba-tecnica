<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('pieza_imagens', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pieza_id')->constrained()->onDelete('cascade');
            $table->string('url'); // o 'path' si guardarás localmente
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('imagenes');
    }
};
