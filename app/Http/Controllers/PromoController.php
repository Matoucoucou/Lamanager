<?php

namespace App\Http\Controllers;

use App\Models\Promo;
use Illuminate\Http\JsonResponse;

class PromoController extends Controller
{
    public function index($annee_id): JsonResponse
    {
        $promos = Promo::where('annee_id', $annee_id)
                      ->select('id', 'nom')
                      ->get();
        
        return response()->json($promos);
    }
    public function getPromo($id): JsonResponse
    {
        $promo = Promo::find($id);
        return response()->json($promo);
    }
}
