<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Annee extends Model
{
    use HasFactory;

    protected $fillable = [
        'annee',
    ];

    public function promos(): HasMany
    {
        return $this->hasMany(Promo::class, 'annee_id');
    }



}
