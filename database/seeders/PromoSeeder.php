<?php

namespace Database\Seeders;

use App\Models\Promo;
use App\Models\Annee;

use Illuminate\Database\Seeder;
use Illuminate\Database\Eloquent\Factories\Sequence;

class PromoSeeder extends Seeder
{
    protected $liste = [1,1,1,2,2,2,3,3,3,4,4,4,5,5,5,6,6,6];
    public function run(): void
    {
        
        // Create Annee
        $this->call(AnneeSeeder::class);
        // Création des packs de promos pour chaque année
        // Create Promo
        Promo::factory()
        ->count(18)
        ->state(new Sequence(fn()=>
            [
                'annee_id'=> array_pop($this->liste)
            ]))
        
        
        ->create();
        }
}
