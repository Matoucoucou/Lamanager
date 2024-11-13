<?php

namespace Database\Factories;

use App\Models\Annee;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Promo>
 */
class PromoFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    protected $promo=[
            'BUT 1',
            'BUT 2',
            'BUT 3',
        ];
    protected $nbr_td = [3,2,2];
    protected $nbr_tp = [6,4,4];

    public function definition(): array
    {





        return [
            'nom' => function(array $attributes) {
                $nom = array_pop($this->promo);

                if (empty($this->promo)){
                    $this->promo=[
                        'BUT 1',
                        'BUT 2',
                        'BUT 3',
                    ];
                }
                return $nom;
            },
            'nombre_td' => function(array $attributes) {
                $nombre_td = array_pop($this->nbr_td);

                if (empty($this->nbr_td)){
                    $this->nbr_td=[3,2,2];
                }
                return $nombre_td;
            },
            'nombre_tp' => function(array $attributes) {
                $nombre_tp = array_pop($this->nbr_tp);

                if (empty($this->nbr_tp)){
                    $this->nbr_tp=[6,4,4];
                }
                return $nombre_tp;
            },
            'alternant' => true,
            'annee_id' => Annee::factory(),
        ];
    }
}
