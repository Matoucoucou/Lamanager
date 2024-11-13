<?php

namespace Database\Factories;

use App\Models\Role;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Enseignant>
 */
class EnseignantFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */

    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;


    public function definition(): array
    {

        $prenom = $this->faker->firstName;
        $nom = $this->faker->lastName;
        $code = strtoupper(substr($prenom, 0, 1) . substr($nom, 0, 2));
        $mail = strtolower($prenom . '.' . $nom . '@example.com');

        return [
            'nom' => $prenom,
            'prenom' => $nom,
            'code' => $code,
            'actif' => true,
            'mot_de_passe' => static::$password ??= Hash::make('password'),
            'mail' => $mail,
            'role_id' => Role::factory(),
        ];

        
    }
}
