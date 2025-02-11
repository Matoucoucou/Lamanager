<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\EnseignementController;
use App\Http\Controllers\LiaisonGroupeController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\EnseignantController;
use App\Http\Controllers\SemaineController;
use App\Http\Controllers\CaseController;
use App\Http\Controllers\AlerteController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AnneeController;
use App\Http\Controllers\PromoController;
use App\Http\Controllers\GroupeController;
use App\Models\Semaine;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\RoleController;
use Inertia\Inertia;
use App\Models\Promo;
use Illuminate\Http\Request;
use App\Http\Middleware\Authenticate;
use Illuminate\Support\Facades\Auth;

Route::middleware(['auth'])->group(function () {
    Route::get('/', function () {
        if (Auth::user()->admin) {
            return Inertia::render('Home');
        }
        return redirect()->route('versionProf');
    })->name('home');

    Route::get('/tableau', function () {
        if (Auth::user()->admin) {
            return Inertia::render('PageTableau');
        }
        return redirect()->route('versionProf');
    })->name('tableau');

    Route::get('/profil', function () {
        return Inertia::render('PageProfil');
    })->name('profil');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');

    Route::get('/versionProf', function () {
        return Inertia::render('PageVersionProf');
    })->name('versionProf');

    // Routes accessibles uniquement aux administrateurs
    Route::group(['middleware' => 'auth'], function () {
        Route::get('/gestion-utilisateurs', function () {
            if (Auth::user()->admin) {
                return Inertia::render('GestionUtilisateurs');
            }
            return redirect()->route('versionProf');
        })->name('gestion-utilisateurs');

        Route::post('/api/enseignements', [EnseignementController::class, 'store'])->name('api.enseignements.store');
        Route::delete('/api/groupes/{id}', [GroupeController::class, 'destroy'])->name('api.groupes.destroy');
        Route::post('/api/promos/update', [PromoController::class, 'updatePromos'])->name('api.promos.update');
        Route::put('/api/groupes/{id}', [GroupeController::class, 'update'])->name('api.groupes.update');
        Route::post('/api/update-groupes', [GroupeController::class, 'updateGroupes'])->name('api.update-groupes');
        Route::post('/api/groupes', [GroupeController::class, 'stored'])->name('api.groupes.store');
        Route::post('/api/enseignants', [EnseignantController::class, 'store'])->name('api.enseignants.store');
        Route::put('/api/enseignants/{id}', [EnseignantController::class, 'update'])->name('api.enseignants.update');
        Route::delete('/api/enseignants/{id}', [EnseignantController::class, 'destroy'])->name('api.enseignants.destroy');
    });
});

Route::get('/login', function () {
    return Inertia::render('Login');
})->name('login');

require __DIR__.'/auth.php';

    Route::get('/api/enseignants', [EnseignantController::class, 'index'])->name('api.enseignants');
    Route::get('/api/enseignant/{id}', [EnseignantController::class, 'showCode'])->name('api.enseignant.get');
    Route::get('/api/semaines', [SemaineController::class, 'index'])->name('api.semaines');
    Route::get('/api/annees', [AnneeController::class, 'index'])->name('api.annees');
    Route::get('/api/promos/{annee_id}', [PromoController::class, 'index'])->name('api.promos');
    Route::get('/api/session', [AuthController::class, 'index'])->name('api.session');
    Route::get('/api/user/{user_id}', [EnseignantController::class, 'avoirInfo'])->name('api.enseignants.get');
    Route::get('/api/enseignants/liste', [EnseignantController::class, 'listeEnseignant'])->name('api.enseignants.liste');

    Route::get('/api/enseignements/{promo_id}/{annee_id}', [EnseignementController::class, 'index']);
    Route::get('/api/promo/{id}', [PromoController::class, 'getPromo'])->name('api.promo.get');
    Route::get('/api/groupes/{promo_id}', [GroupeController::class, 'index'])->name('api.groupes');
    Route::get('/cases/{enseignement_id}', [CaseController::class, 'index'])->name('api.cases');
    
    Route::get('/api/roles', [RoleController::class, 'index'])->name('api.roles');
    Route::get('/api/cases/recherche/{annee_id}/{enseignement_id}/{enseignant_id}', [CaseController::class, 'listeCasesParEnseignant']);
    Route::get('/api/cases/rechercheComplete/{annee_id}/{enseignant_id}', [CaseController::class, 'listeEnseignement']);
    Route::get('/api/enseignements/{anneeId}',[EnseignementController::class, 'enseignementParAnnee'])->name('api.enseignements');
    Route::put('/api/roles/{id}', [RoleController::class, 'update'])->name('api.roles.update');
    Route::post('/api/roles', [RoleController::class, 'store'])->name('api.roles.store');
    Route::post('/api/annees', [AnneeController::class, 'store'])->name('api.annees.store');
    Route::post('/api/cases', [CaseController::class, 'store'])->name('api.cases.store');
    Route::post('/api/promos', [PromoController::class, 'store'])->name('api.promos.store');
    Route::delete('/api/promos/{id}', [PromoController::class, 'destroy'])->name('api.promos.destroy');

    Route::post('/api/update-promos/{id}', [PromoController::class, 'updateAlternantId'])->name('api.promos.updateAlternantId');

    Route::post('/api/groupes', [GroupeController::class, 'store'])->name('api.groupes.store');
    Route::post('/api/liaison', [LiaisonGroupeController::class, 'store'])->name('api.liaison.store');

    Route::delete('/api/cases', [CaseController::class, 'destroy'])->name('api.cases.destroy');


    Route::post('/api/enseignements', [EnseignementController::class, 'store'])->name('api.enseignements.store');
    Route::delete('/api/groupes/{id}', [GroupeController::class, 'destroy'])->name('api.groupes.destroy');

    Route::post('/api/promos/update', [PromoController::class, 'updatePromos'])->name('api.promos.update');

    Route::get('/api/liaison_groupes/{groupe_td_id}', [LiaisonGroupeController::class, 'getSubGroups']);
    Route::get('/api/liaison_groupes', [LiaisonGroupeController::class, 'index']);
    Route::post('/api/liaison_groupes', [LiaisonGroupeController::class, 'store']);

    Route::put('/api/groupes/{id}', [GroupeController::class, 'update'])->name('api.groupes.update');
    Route::post('/api/update-groupes', [GroupeController::class, 'updateGroupes'])->name('api.update-groupes');

    Route::post('/api/groupes', [GroupeController::class, 'stored'])->name('api.groupes.store');

    Route::post('/api/enseignants', [EnseignantController::class, 'store'])->name('api.enseignants.store');
    Route::get('/api/enseignants/{annee_id}/{id}', [EnseignantController::class, 'listeEnseignementParEnseignant']);
    Route::put('/api/enseignants/{id}', [EnseignantController::class, 'update'])->name('api.enseignants.update');
    Route::delete('/api/enseignants/{id}', [EnseignantController::class, 'destroy'])->name('api.enseignants.destroy');

    Route::get('/api/alertes/{enseignant_id}', [AlerteController::class, 'index'])->name('api.alertes');
    Route::put('/api/alertes/{id}', [AlerteController::class, 'update'])->name('api.alertes.update');
    Route::post('api/groupes', [GroupeController::class, 'store']);


Route::middleware('auth')->group(function () {
    Route::get('/api/session', [AuthenticatedSessionController::class, 'index'])->name('api.session');
    Route::post('password-reset', [EnseignantController::class, 'changementMdp'])->name('password-reset');
});



