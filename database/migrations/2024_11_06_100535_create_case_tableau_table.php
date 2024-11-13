<?php

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
        Schema::create('case_tableau', function (Blueprint $table) {
            $table->id();
            $table->foreignId('semaine_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('enseignant_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('enseignement_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('groupe_id')->nullable()->constrained()->onDelete('set null');
            $table->integer('nombre_heure');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('case_tableau');
    }
};
