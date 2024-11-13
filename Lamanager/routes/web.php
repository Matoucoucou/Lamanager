<?php

use App\Http\Controllers\EnseignementController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AnneeController;
use App\Http\Controllers\PromoController;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Home'); // Assurez-vous que la page Home.jsx existe
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::get('/test', function () {
    return Inertia::render('Test');
})->name('test');

require __DIR__.'/auth.php';

Route::get('/api/annees', [AnneeController::class, 'index'])->name('api.annees');
Route::get('/api/promos/{annee_id}', [PromoController::class, 'index'])->name('api.promos');
Route::get('/api/enseignements/{but_level}/{annee_id}', [EnseignementController::class, 'index']);