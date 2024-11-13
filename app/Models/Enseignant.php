<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Enseignant extends Model
{
    use HasFactory;

    protected $fillable = [
        'role_id',
        'code',
        'actif',
        'mot_de_passe',
        'nom',
        'prenom',
        'mail',
    ];

    public function role(): BelongsTo
    {
        return $this->belongsTo(Role::class, 'role_id');
    }

    public function cases()
    {
        return $this->hasMany(CaseTableau::class);
    }
}
