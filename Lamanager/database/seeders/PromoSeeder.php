<?php

namespace Database\Seeders;

use App\Models\Promo;
use Illuminate\Database\Seeder;

class PromoSeeder extends Seeder
{
    public function run(): void
    {
        // Create Annee
        $this->call(AnneeSeeder::class);

        // Création des packs de promos pour chaque année
        for ($annee_id = 1; $annee_id <= 6; $annee_id++) {
            // Création d'un pack de 3 promos pour chaque année
            $promos = [
                [
                    'nom' => 'BUT 1',
                    'nombre_td' => 2,
                    'nombre_tp' => 4,
                    'alternant' => false,
                    'annee_id' => $annee_id,
                ],
                [
                    'nom' => 'BUT 2',
                    'nombre_td' => 2,
                    'nombre_tp' => 4,
                    'alternant' => false,
                    'annee_id' => $annee_id,
                ],
                [
                    'nom' => 'BUT 3',
                    'nombre_td' => 2,
                    'nombre_tp' => 4,
                    'alternant' => true,
                    'annee_id' => $annee_id,
                ]
            ];

            // Création des promos en base de données
            foreach ($promos as $promo) {
                Promo::create($promo);
            }
        }
    }
}