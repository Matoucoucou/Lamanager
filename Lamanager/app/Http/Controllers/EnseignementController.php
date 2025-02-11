<?php

namespace App\Http\Controllers;

use App\Models\Enseignement;
use App\Models\Promo;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class EnseignementController extends Controller
{
    // EnseignementController.php
    public function index($promo_id, $annee_id): JsonResponse
    {
        $query = Enseignement::select('enseignements.id', 'enseignements.nom', 'enseignements.semestre', 'enseignements.nombre_heures_cm', 'enseignements.nombre_heures_td', 'enseignements.nombre_heures_tp')
            ->join('promos', 'enseignements.promo_id', '=', 'promos.id')
            ->where('promos.id', $promo_id)
            ->where('promos.annee_id', $annee_id);

        $enseignements = $query->get();
        return response()->json($enseignements);
    }

    public function store(Request $request) :JsonResponse{
        $enseignement = new Enseignement();
        $enseignement->nom = $request->nom;
        $enseignement->promo_id = $request->promo_id;
        $enseignement->alternant = $request->alternant;
        $enseignement->nombre_heures_cm = $request->nombre_heures_cm;
        $enseignement->nombre_heures_td = $request->nombre_heures_td;
        $enseignement->nombre_heures_tp = $request->nombre_heures_tp;
        $enseignement->semestre = $request->semestre;
        $enseignement->nombre_heures_projet = $request->nombre_heures_projet;
        $enseignement->save();

        return response()->json($enseignement);

    }

    public function enseignementParAnnee($annee_id)
    {
        $query = Enseignement::select('enseignements.id','enseignements.nom','annees.annee')
            ->join('promos', 'enseignements.promo_id', '=', 'promos.id')
            ->join('annees', 'promos.annee_id', '=', 'annees.id')
            ->where('annee_id', $annee_id);

        $enseignements = $query->get();
        return response()->json($enseignements);
    }
}
