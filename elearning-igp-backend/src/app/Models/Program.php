<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Program extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'code',
        'description',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function years()
    {
        return $this->hasMany(Year::class);
    }

    public function courses()
    {
        return $this->hasManyThrough(Course::class, Year::class);
    }

    public function activeYears()
    {
        return $this->hasMany(Year::class)->where('is_active', true);
    }
}