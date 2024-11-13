<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Semaine extends Model
{


    use HasFactory;

    protected $fillable = [
        'numero',
    ];

    public function cases()
    {
        return $this->hasMany(CaseTableau::class);
    }

}
