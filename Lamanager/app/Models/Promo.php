<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Promo extends Model
{

    protected $fillable = [
        'annee_id',
        'nom',
        'nombre_td',
        'nombre_tp',
        'alternant',
    ];

    public function annee(): BelongsTo
    {
        return $this->belongsTo(Annee::class, 'annee_id');
    }

    public function enseignements(): HasMany
    {
        return $this->hasMany(Enseignement::class);
    }
}
