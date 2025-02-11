<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Semaine;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Mockery;

class SemaineControllerTest extends TestCase
{
    use RefreshDatabase;

    public function testIndexWithMock()
    {
        // Créer un mock pour le modèle Semaine
        $mock = Mockery::mock('alias:' . Semaine::class);
        $mock->shouldReceive('select->get')
             ->once()
             ->andReturn(collect([
                 (object) ['id' => 1, 'numero' => 1],
                 (object) ['id' => 2, 'numero' => 2]
             ]));

        // Appeler la route index
        $response = $this->getJson('/api/semaines');

        // Vérifier la réponse
        $response->assertStatus(200)
                 ->assertJson([
                     ['id' => 1, 'numero' => 1],
                     ['id' => 2, 'numero' => 2]
                 ]);
    }
}