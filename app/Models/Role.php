<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Role extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom',
        'nombre_heure',
    ];

    public function enseignant(): HasMany
    {
        return $this->HasMany(Enseignant::class);
    }

}
