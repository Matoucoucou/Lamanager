<?php

namespace App\Http\Controllers;

use App\Models\Enseignement;
use App\Models\Promo;
use Illuminate\Http\JsonResponse;

class EnseignementController extends Controller
{
    public function index($promo_id, $annee_id): JsonResponse
    {
        $query = Enseignement::select('enseignements.id', 'enseignements.nom')
            ->join('promos', 'enseignements.promo_id', '=', 'promos.id')
            ->where('promos.id', $promo_id)
            ->where('promos.annee_id', $annee_id);
        
        $enseignements = $query->get();
        return response()->json($enseignements);
    }
}