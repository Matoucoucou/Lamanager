<?php

namespace Database\Seeders;

use App\Models\Enseignant;
use Database\Factories\EnseignantFactory;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Eloquent\Factories\Sequence;
use Illuminate\Database\Seeder;

class EnseignantSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create Role
        $this->call(RoleSeeder::class);

        // Create Enseignant
        Enseignant::factory()
            ->count(10)
            ->state(new Sequence(fn()=>
            [
                'role_id'=>rand(1,3),            
            ]))
            ->create();
    }
}
