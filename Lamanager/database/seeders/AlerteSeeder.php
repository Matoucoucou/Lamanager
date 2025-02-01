<?php

namespace Database\Seeders;

use App\Models\Alerte;
use App\Models\Enseignant;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AlerteSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Enseignant::all()->each(function ($enseignant) {

            Alerte::factory()->create([
                'enseignant_id' => $enseignant->id,
                'nom' => "niveau faible",
                'niveau' => 1,
                'heure_min' => 20,
                'heure_max' => 25,
                'couleur' => "#FFFF00",
            ]);
            Alerte::factory()->create([
                'enseignant_id' => $enseignant->id,
                'nom' => "niveau moyen",
                'niveau' => 2,
                'heure_min' => 26,
                'heure_max' => 35,
                'couleur' => "#FF8000",
            ]);
            Alerte::factory()->create([
                'enseignant_id' => $enseignant->id,
                'nom' => "niveau fort",
                'niveau' => 3,
                'heure_min' => 36,
                'heure_max' => 200,
                'couleur' => "#FF0000",
            ]);
        });
    }
}
