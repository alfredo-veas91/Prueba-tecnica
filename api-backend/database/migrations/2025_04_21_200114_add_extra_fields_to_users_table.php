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
        Schema::table('users', function (Blueprint $table) {
            $table->date('fecha_nacimiento')->nullable();
            $table->string('telefono_codigo')->nullable();
            $table->string('telefono_numero')->nullable();
        });
    }


    /**
     * Reverse the migrations.
     */

     public function down()
     {
         Schema::table('users', function (Blueprint $table) {
             $table->dropColumn(['fecha_nacimiento', 'telefono_codigo', 'telefono_numero']);
         });
     }
};
