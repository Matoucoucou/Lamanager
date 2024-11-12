<?php

namespace App\Http\Controllers;

use App\Models\Annee;
use Illuminate\Http\JsonResponse;

class AnneeController extends Controller
{
    public function index(): JsonResponse
{
    $annees = Annee::select('id', 'annee')
                  ->orderBy('annee', 'desc')
                  ->get()
                  ->map(function($annee) {
                      $debut = '20' . substr($annee->annee, 0, 2);
                      $fin = '20' . substr($annee->annee, 3, 2);
                      return [
                          'id' => $annee->id,
                          'annee_scolaire' => $debut . '-' . $fin,
                          'annee' => $annee->annee
                      ];
                  });
    
    return response()->json($annees);
}
}