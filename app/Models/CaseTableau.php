<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CaseTableau extends Model
{
    protected $fillable = [
        'semaine_id',
        'enseignant_id',
        'enseignement_id',
        'groupe_id',
        'nombre_heure',
    ];

    public function groupe(): BelongsTo
    {
        return $this->belongsTo(Groupe::class, 'groupe_id');
    }

    public function enseignant(): BelongsTo
    {
        return $this->belongsTo(Enseignant::class, 'enseignant_id');
    }

    public function enseignement(): BelongsTo
    {
        return $this->belongsTo(Enseignement::class, 'enseignement_id');
    }

    public function semaine(): BelongsTo
    {
        return $this->belongsTo(Semaine::class, 'semaine_id');
    }
}
