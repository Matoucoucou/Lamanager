<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Annee>
 */
class AnneeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    protected $annee=[
        '24/25',
        '23/24',
        '22/23',
        '21/22',
        '20/21',
        '19/20',
    ];
    public function definition(): array
    {
        return [
            'annee'=>array_pop($this->annee),
        ];
    }
}
