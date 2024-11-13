<?php

namespace Database\Seeders;

use App\Models\Enseignement;
use App\Models\Promo;
use Illuminate\Database\Seeder;

class EnseignementSeeder extends Seeder
{
    public function run(): void
    {
        $this->call(PromoSeeder::class);

        // Pour chaque promo
        Promo::all()->each(function ($promo) {
            // Crée 5 enseignements par promo
            Enseignement::factory()
                ->count(5)
                ->create([
                    'promo_id' => $promo->id,
                    'alternant' => $promo->alternant,
                ]);
        });
    }
}