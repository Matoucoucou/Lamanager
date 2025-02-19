<?php

namespace App\Http\Controllers;

use App\Models\Annee;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
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
public function store(Request $request): JsonResponse
{
    $request->validate([
        'annee' => 'required|regex:/^\d{2}\/\d{2}$/|unique:annees,annee'
    ]);

    $annee = Annee::create([
        'annee' => $request->annee
    ]);

    $debut = '20' . substr($annee->annee, 0, 2);
    $fin = '20' . substr($annee->annee, 3, 2);

    return response()->json([
        'id' => $annee->id,
        'annee_scolaire' => $debut . '-' . $fin,
        'annee' => $annee->annee
    ],201); //Précise le code de statut 201
}
}