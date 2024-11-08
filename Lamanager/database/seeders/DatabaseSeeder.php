<?php

namespace Database\Seeders;

use App\Models\Enseignant;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();
        $this->call(EnseignantSeeder::class);
        $this->call(SemaineSeeder::class);
        $this->call(EnseignementSeeder::class);
        $this->call(GroupeSeeder::class);

        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);
    }
}
