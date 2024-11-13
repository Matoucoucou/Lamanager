<?php

namespace Database\Seeders;

use App\Models\Semaine;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;


class SemaineSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */

    public function run(): void
    {
        $semaines = [];
        for ($i = 1; $i <= 52; $i++) {
            if ($i < 10) {
                $i = '0' . $i;
            }
            $semaines[] = 'S' . $i;
        }

        foreach ($semaines as $semaine) {
            Semaine::firstOrCreate(['numero' => $semaine]);
        }
    }
}
