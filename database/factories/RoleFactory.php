<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Role>
 */
class RoleFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */

    protected $noms=[
        'plein temps',
        'mi-temps',
        'vacataire'
    ];

    protected $nombres_heures=[
        300,
        150,
        80
    ];
    
    public function definition(): array
    {
        
        return [
            'nom' => array_pop($this->noms),
            'nombre_heure' => array_pop($this->nombres_heures)
        ];
    }
}
