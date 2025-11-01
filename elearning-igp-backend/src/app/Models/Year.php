<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Year extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'program_id',
        'name',
        'level',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'level' => 'integer',
    ];

    public function program()
    {
        return $this->belongsTo(Program::class);
    }

    public function courses()
    {
        return $this->hasMany(Course::class);
    }

    public function activeCourses()
    {
        return $this->hasMany(Course::class)->where('is_active', true);
    }
}