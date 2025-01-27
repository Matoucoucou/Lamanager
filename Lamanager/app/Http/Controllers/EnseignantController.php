<?php

namespace App\Http\Controllers;

use App\Models\Enseignant;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Illuminate\Support\Facades\Log;

class EnseignantController extends Controller
{
    public function index(): JsonResponse
    {
        $enseignants = Enseignant::all();
        return response()->json($enseignants);
    }

    public function avoirInfo($id): JsonResponse
    {
        $enseignant = Enseignant::where('id', $id)
                                ->select( 'nom', 'prenom','mail','admin')
                                ->first();
    
        return response()->json($enseignant);
    }

    public function listeEnseignant(): JsonResponse
    {
        $enseignants = Enseignant::select('id', 'nom', 'prenom','mail','role_id','actif','admin')->get();

        return response()->json($enseignants);
    }
    public function showCode($id): JsonResponse
    {
        $enseignant = Enseignant::where('id', $id)
                                ->select('code')
                                ->first();
    
        return response()->json($enseignant);
    }

    public function changementMdp(Request $request): JsonResponse
    {
        $request->validate([
            'current_password' => ['required'],
            'password' => ['required', 'confirmed', Password::defaults()],
        ]);

        $enseignant = Enseignant::find($request->user()->id);

        if (!Hash::check($request->current_password, $enseignant->mot_de_passe)) {
            return response()->json(['error' => 'Current password is incorrect'], 400);
        }

        $enseignant->update(['mot_de_passe' => Hash::make($request->password)]);

        return response()->json(['message' => 'Password updated successfully']);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'mail' => 'required|string|email|max:255|unique:enseignants',
            'role_id' => 'required|integer',
            'password' => 'required|string|confirmed',
            'actif' => 'required|boolean',
            'admin' => 'required|boolean',
        ]);

        // Generate unique code
        $code = strtoupper(substr($request->prenom, 0, 1) . substr($request->nom, 0, 2));
        $originalCode = $code;
        $counter = 1;

        while (Enseignant::where('code', $code)->exists()) {
            $code = strtoupper(substr($request->prenom, 0, 1) . substr($request->nom, 0, $counter + 1));
            $counter++;
            if ($counter > strlen($request->nom)) {
                $code = strtoupper(substr($request->nom, 0, 2) . substr($request->prenom, 0, 1));
                break;
            }
        }

        $enseignant = Enseignant::create([
            'nom' => $request->nom,
            'prenom' => $request->prenom,
            'mail' => $request->mail,
            'role_id' => $request->role_id,
            'mot_de_passe' => Hash::make($request->password),
            'actif' => $request->actif,
            'code' => $code,
            'admin' => $request->admin,
        ]);

        return response()->json($enseignant);
    }

    public function update(Request $request, $id): JsonResponse
    {
        $request->validate([
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'mail' => 'required|string|email|max:255|unique:enseignants,mail,' . $id,
            'role_id' => 'required|integer',
            'password' => 'nullable|string|confirmed',
            'actif' => 'required|boolean',
            'admin' => 'required|boolean',
        ]);

        $enseignant = Enseignant::findOrFail($id);
        $enseignant->nom = $request->nom;
        $enseignant->prenom = $request->prenom;
        $enseignant->mail = $request->mail;
        $enseignant->role_id = $request->role_id;
        if ($request->filled('password')) {
            $enseignant->mot_de_passe = Hash::make($request->password);
        }
        $enseignant->actif = $request->actif;
        $enseignant->admin = $request->admin;
        $enseignant->save();

        return response()->json($enseignant);
    }

    public function destroy($id): JsonResponse
    {
        $enseignant = Enseignant::findOrFail($id);
        $enseignant->delete();

        return response()->json(['message' => 'Enseignant supprimé avec succès']);
    }

    public function listeEnseignementParEnseignant($annee_id, $enseignant_id): JsonResponse
    {
        $enseignant = Enseignant::select('enseignements.id','enseignements.nom')
                            ->join('case_tableau', 'case_tableau.enseignant_id', '=', 'enseignants.id')
                            ->join('enseignements', 'case_tableau.enseignement_id', '=', 'enseignements.id')
                            ->join('promos', 'enseignements.promo_id', '=', 'promos.id')
                            ->join('annees', 'promos.annee_id', '=', 'annees.id')
                            ->where('annees.id', $annee_id)
                            ->where('enseignant_id', $enseignant_id)
                            ->distinct()
                            ->get();

        return response()->json($enseignant);
    }
}