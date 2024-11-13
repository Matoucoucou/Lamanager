<?php

namespace Database\Factories;

use App\Models\Enseignement;
use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Promo;
use Random\RandomException;

class EnseignementFactory extends Factory
{
    /**
     * @throws RandomException
     */
    public function definition(): array
    {
        // Détermine les numéros R possibles selon le nom de la promo
        $but_level = function($promo_nom) {
            return match($promo_nom) {
                'BUT 1' => [1, 2],    // BUT1 -> R1 ou R2
                'BUT 2' => [3, 4],    // BUT2 -> R3 ou R4
                'BUT 3' => [5, 6],    // BUT3 -> R5 ou R6
                default => [1, 2],    // Par défaut BUT1
            };
        };
        $ind_random = random_int(0, 1);
        $nombre_heures_cm = rand(10, 30);
        $nombre_heures_td = rand(20, 40);
        $nombre_heures_tp = rand(20, 40);

        return [

            'nom' => function (array $attributes) use ($but_level, $ind_random) {
                $promo = Promo::find($attributes['promo_id']);
                $r_numbers = $but_level($promo->nom);
                $semestre =  $r_numbers[$ind_random];
                return 'R' . $semestre . '.' . str_pad(rand(1, 15), 2, '0', STR_PAD_LEFT);
            },


            'alternant' => function (array $attributes) {
                $promo = Promo::find($attributes['promo_id']);
                return $promo->nom === 'BUT 3';
            },
            'nombre_heures_cm' => $nombre_heures_cm,
            'nombre_heures_td' => $nombre_heures_td,
            'nombre_heures_tp' => $nombre_heures_tp,
            'semestre' => function (array $attributes) use ($but_level, $ind_random) {
                $promo = Promo::find($attributes['promo_id']);
                $r_numbers = $but_level($promo->nom);
                $semestre =  $r_numbers[$ind_random];
                return (($semestre + 1) % 2) + 1;
            },
            'nombre_heures_max' => $nombre_heures_cm + $nombre_heures_td + $nombre_heures_tp,
        ];
    }
}
