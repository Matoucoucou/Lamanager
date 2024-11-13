<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Enseignement extends Model
{
    use HasFactory;

    protected $fillable = [
        'promo_id',
        'alternant',
        'nom',
        'nombre_heure_cm',
        'nombre_heure_td',
        'nombre_heure_tp',
        'semestre',
        'nombre_heure_max',
    ];

    public function promo(): BelongsTo
    {
        return $this->belongsTo(Promo::class, 'promo_id');
    }

    public function cases()
    {
        return $this->hasMany(CaseTableau::class);
    }
}
