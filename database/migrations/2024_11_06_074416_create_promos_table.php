<?php

use App\Models\Annee;
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
        Schema::create('promos', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Annee::class, 'annee_id')->nullable()->constrained('annees')->onDelete('set null');
            $table->string('nom');
            $table->integer('nombre_td');
            $table->integer('nombre_tp');
            $table->boolean('alternant');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('promos');
    }
};
