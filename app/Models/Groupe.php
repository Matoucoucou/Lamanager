<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Groupe extends Model
{
    use HasFactory;

    protected $fillable = [
        'promo_id',
        'nom',
        'type',
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
