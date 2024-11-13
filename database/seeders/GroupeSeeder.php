<?php

namespace Database\Seeders;

use App\Models\Groupe;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Eloquent\Factories\Sequence;
use Illuminate\Database\Seeder;

class GroupeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
protected $liste_ind_td = [1,1,1,2,2,3,3,4,4,4,5,5,6,6,7,7,7,8,8,9,9,10,10,10,11,11,12,12,13,13,13,14,14,15,15,16,16,16,17,17,18,18];
protected $liste_ind_tp = [1,1,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,4,4,5,5,5,5,6,6,6,6,7,7,7,7,7,7,8,8,8,8,9,9,9,9,
10,10,10,10,10,10,11,11,11,11,12,12,12,12,13,13,13,13,13,13,14,14,14,14,15,15,15,15,
16,16,16,16,16,16,17,17,17,17,18,18,18,18];
    public function run(): void
    {

        // Create Enseignant
        Groupe::factory()
            ->count(42)
            ->state(new Sequence(fn()=>
            [
                'promo_id'=>array_pop($this->liste_ind_td),
                'type'=>'TD',
            ]))
            ->create();

        Groupe::factory()
            ->count(84)
            ->state(new Sequence(fn()=>
            [
                'promo_id'=>array_pop($this->liste_ind_tp),
                'type'=>'TP',

            ]))
            ->create();
    }
}
