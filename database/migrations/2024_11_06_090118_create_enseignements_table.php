<?php

use App\Models\Promo;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('enseignements', function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            $table->foreignIdFor(Promo::class, 'promo_id')->nullable()->constrained('promos')->onDelete('set null');
            $table->boolean('alternant');
            $table->integer('nombre_heures_cm');
            $table->integer('nombre_heures_td');
            $table->integer('nombre_heures_tp');
            $table->integer('semestre');
            $table->integer('nombre_heures_max');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('enseignements');
    }
};
