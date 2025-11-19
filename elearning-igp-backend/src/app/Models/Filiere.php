<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Filiere extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'code',
        'description',
        'program_ids',
        'is_active',
    ];

    protected $casts = [
        'program_ids' => 'array',
        'is_active' => 'boolean',
    ];
}