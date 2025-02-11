<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\Annee;

class AnneeControllerTest extends TestCase
{
    use RefreshDatabase;

    public function testIndex()
    {
        // Créer des données de test
        Annee::factory()->create(['annee' => '21/22']);
        Annee::factory()->create(['annee' => '20/21']);

        // Appeler la route index
        $response = $this->getJson('/api/annees');

        // Vérifier la réponse
        $response->assertStatus(200)
                 ->assertJsonStructure([
                     '*' => ['id', 'annee_scolaire', 'annee']
                 ]);
    }

    public function testStore()
    {
        // Données de requête
        $data = ['annee' => '23/24'];

        // Appeler la route store
        $response = $this->postJson('/api/annees', $data);

        // Vérifier la réponse
        $response->assertStatus(201)
                 ->assertJson([
                     'annee' => '23/24',
                     'annee_scolaire' => '2023-2024'
                 ]);

        // Vérifier la base de données
        $this->assertDatabaseHas('annees', ['annee' => '23/24']);
    }


}