<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Program extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'code',
        'description',
        'duration_years',
        'levels',
        'inscription_fee',
        'monthly_fee',
        'requirements',
        'is_active',
    ];

    protected $casts = [
        'levels' => 'array',
        'requirements' => 'array',
        'inscription_fee' => 'decimal:2',
        'monthly_fee' => 'decimal:2',
        'is_active' => 'boolean',
        'duration_years' => 'integer',
    ];
}