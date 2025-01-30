<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Alerte;
use Illuminate\Http\JsonResponse;

class AlerteController extends Controller
{
    public function index($enseignant_id)
    {
        $alertes = Alerte::where('enseignant_id', $enseignant_id)
            ->select('id', 'enseignant_id', 'nom', 'niveau','heure_min','heure_max','couleur')
            ->get();

        return response()->json($alertes);
    }

    public function update(Request $request, $id): JsonResponse
    {
        $alerte = Alerte::find($id);

        $alerte->nom = $request->input('nom');
        $alerte->niveau = $request->input('niveau');
        $alerte->heure_min = $request->input('heure_min');
        $alerte->heure_max = $request->input('heure_max');
        $alerte->couleur = $request->input('couleur');

        $alerte->save();


        return response()->json($alerte);
    }
}