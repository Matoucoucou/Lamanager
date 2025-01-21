<?php

namespace App\Http\Controllers;

use App\Models\Promo;
use App\Models\Enseignement;
use App\Models\CaseTableau;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PromoController extends Controller
{
    public function index($annee_id): JsonResponse
    {
        $promos = Promo::where('annee_id', $annee_id)
                      ->select('id', 'nom','alternant','alternant_id')
                      ->get();

        return response()->json($promos);
    }
    public function getPromo($id): JsonResponse
    {
        $promo = Promo::find($id);
        return response()->json($promo);
    }


    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'annee_id' => 'required|integer',
            'alternant_id' => 'nullable|integer',
            'nom' => 'required|string|max:255',
            'nombre_td' => 'required|integer',
            'nombre_tp' => 'required|integer',
            'alternant' => 'required|boolean',
        ]);

        $promo = new Promo();
        $promo->annee_id = $request->annee_id;
        $promo->alternant_id = $request->alternant_id;
        $promo->nom = $request->nom;
        $promo->nombre_td = $request->nombre_td;
        $promo->nombre_tp = $request->nombre_tp;
        $promo->alternant = $request->alternant;
        $promo->save();

        return response()->json($promo);
    }

    public function updateAlternantId(Request $request,$id): JsonResponse
    {

        $promo = Promo::find($id);
        if($promo) {
            $promo->alternant_id = $request->alternant_id;
            $promo->save();
        }else{
            var_dump($promo);
        }
        return response()->json($promo);
    }

    public function updatePromos(Request $request): JsonResponse
    {
        try {
            $promos = $request->input('promos');
            foreach ($promos as $promoData) {
                $promo = Promo::find($promoData['id']);
                if ($promo) {
                    $promo->update([
                        'nom' => $promoData['nom'],
                        'nombre_td' => $promoData['nombre_td'],
                        'nombre_tp' => $promoData['nombre_tp']
                    ]);
                }
            }
            return response()->json(['message' => 'Promos updated successfully']);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function destroy($id): JsonResponse
    {
        $promo = Promo::find($id);
        if ($promo) {
            // Vérifier s'il existe des cases de prévisionnel pour les enseignements de la promo
            $enseignements = Enseignement::where('promo_id', $promo->id)->get();
            foreach ($enseignements as $enseignement) {
                $casesExist = CaseTableau::where('enseignement_id', $enseignement->id)->exists();
                if ($casesExist) {
                    return response()->json(['error' => 'Impossible de supprimer la promo car des cases de prévisionnel existent.'], 400);
                }
            }

            // Vérifier s'il existe des cases de prévisionnel pour les enseignements de la promo alternante
            if ($promo->alternant_id) {
                $alternantEnseignements = Enseignement::where('promo_id', $promo->alternant_id)->get();
                foreach ($alternantEnseignements as $enseignement) {
                    $alternantCasesExist = CaseTableau::where('enseignement_id', $enseignement->id)->exists();
                    if ($alternantCasesExist) {
                        return response()->json(['error' => 'Impossible de supprimer la promo car des cases de prévisionnel existent pour la promo alternante.'], 400);
                    }
                }
            }

            // Supprimer les enseignements liés à la promo
            Enseignement::where('promo_id', $promo->id)->delete();
            if ($promo->alternant_id) {
                Enseignement::where('promo_id', $promo->alternant_id)->delete();
            }

            // Supprimer la promo et la promo miroir
            $promo->delete();
            if ($promo->alternant_id) {
                $alternantPromo = Promo::find($promo->alternant_id);
                if ($alternantPromo) {
                    $alternantPromo->delete();
                }
            }

            return response()->json(['message' => 'Promo supprimée avec succès']);
        }
        return response()->json(['error' => 'Promo non trouvée'], 404);
    }

    public function checkCasesExist($id): JsonResponse
    {
        $promo = Promo::find($id);
        if ($promo) {
            // Vérifier s'il existe des cases de prévisionnel pour les enseignements de la promo
            $enseignements = Enseignement::where('promo_id', $promo->id)->get();
            foreach ($enseignements as $enseignement) {
                $casesExist = CaseTableau::where('enseignement_id', $enseignement->id)->exists();
                if ($casesExist) {
                    return response()->json(['exists' => true], 200);
                }
            }

            // Vérifier s'il existe des cases de prévisionnel pour les enseignements de la promo alternante
            if ($promo->alternant_id) {
                $alternantEnseignements = Enseignement::where('promo_id', $promo->alternant_id)->get();
                foreach ($alternantEnseignements as $enseignement) {
                    $alternantCasesExist = CaseTableau::where('enseignement_id', $enseignement->id)->exists();
                    if ($alternantCasesExist) {
                        return response()->json(['exists' => true], 200);
                    }
                }
            }

            return response()->json(['exists' => false], 200);
        }
        return response()->json(['error' => 'Promo non trouvée'], 404);
    }
}

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

    public function store(Request $request): JsonResponse
    {
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

    public function destroy($promo_id): JsonResponse
    {
        Enseignement::where('promo_id', $promo_id)->delete();
        return response()->json(['message' => 'Enseignements supprimés avec succès']);
    }

    public function enseignementParAnnee($annee_id)
    {
        $query = Enseignement::select('enseignements.id', 'enseignements.nom', 'annees.annee')
            ->join('promos', 'enseignements.promo_id', '=', 'promos.id')
            ->join('annees', 'promos.annee_id', '=', 'annees.id')
            ->where('annee_id', $annee_id);

        $enseignements = $query->get();
        return response()->json($enseignements);
    }
}
