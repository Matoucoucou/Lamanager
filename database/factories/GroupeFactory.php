<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Random\RandomException;
use App\Models\Groupe;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Groupe>
 */
class GroupeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */


protected $td_liste = [
    "G1",
    "G2",
    "G3",
    "G4",
    "G5",
    "G6",
    "G7",
];

    protected $tp_liste = [
        "G1A",
        "G1B",
        "G2A",
        "G2B",
        "G3A",
        "G3B",
        "G4A",
        "G4B",
        "G5A",
        "G5B",
        "G6A",
        "G6B",
        "G7A",
        "G7B",
    ];
    /**
     * @throws RandomException
     */
    public function definition(): array
    {

        return [
            'nom' => function(array $attributes) {
                $type = $attributes['type'];
                if ($type=="TD"){
                    $td = array_pop($this->td_liste);


                    if (empty($this->td_liste)){
                        $this->td_liste=["G1", "G2", "G3", "G4", "G5", "G6", "G7"];
                    }
                    return $td;
                }
                if ($type=="TP"){
                    $td = array_pop($this->tp_liste);
                    if (empty($this->tp_liste)){
                        $this->tp_liste=["G1A", "G1B", "G2A", "G2B", "G3A", "G3B", "G4A", "G4B", "G5A", "G5B", "G6A", "G6B", "G7A", "G7B"];
                    }
                    return $td;
                }
                return 0;
            }

        ];
    }
}
