<?php

namespace App\Http\Controllers;

use App\Models\Enseignant;
use Illuminate\Http\JsonResponse;

class EnseignantController extends Controller
{
    public function index(): JsonResponse
    {
        // Récupère tous les enseignants avec seulement les colonnes nécessaires
        $enseignants = Enseignant::select('id', 'code', 'nom', 'prenom')->get();

        return response()->json($enseignants);
    }
}