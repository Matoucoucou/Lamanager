<?php

namespace App\Http\Controllers;

use App\Models\Promo;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
class PromoController extends Controller
{
    public function index($annee_id): JsonResponse
    {
        $promos = Promo::where('annee_id', $annee_id)

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
        $case = new Promo();
        $case->annee_id = $request->annee_id;
        $case->nom = $request->nom;
        $case->nombre_td = $request->nombre_td;
        $case->nombre_tp = $request->nombre_tp;
        $case->alternant = $request->alternant;
    $case->save();

        return response()->json($case);
    }
    
    public function updatePromos(Request $request): JsonResponse
    {
        $promos = $request->input('promos');
        foreach ($promos as $promoData) {
            $promo = Promo::find($promoData['id']);
            if ($promo) {
                $promo->nom = $promoData['nom'];
                $promo->nombre_td = $promoData['nombre_td'];
                $promo->nombre_tp = $promoData['nombre_tp'];
                $promo->save();
            }
        }
        return response()->json(['message' => 'Promos updated successfully']);
    }
}
