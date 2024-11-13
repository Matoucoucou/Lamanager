<?php

namespace Database\Seeders;

use App\Models\Annee;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AnneeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $annee = Annee::factory()->count(6)->create();
    }
}
