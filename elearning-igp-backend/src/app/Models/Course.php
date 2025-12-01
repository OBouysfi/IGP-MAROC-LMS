<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Course extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'name',
        'description',
        'credits',
        'semester',
        'is_active',
        'professor_id',
        'group_id',
        'program_id',  // ✅ Changé
        'filiere_id',  // ✅ Changé
        'level',
        'students_count',
        'max_students',
        'hours_total',
        'hours_completed',
        'start_date',
        'end_date',
        'schedule',
        'status',
        'materials',
        'completion_rate',
    ];

    protected $casts = [
        'schedule' => 'array',
        'materials' => 'array',
        'is_active' => 'boolean',
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    public function professor(): BelongsTo
    {
        return $this->belongsTo(Professor::class);
    }

    public function group(): BelongsTo
    {
        return $this->belongsTo(Group::class);
    }

    // ✅ Ajoute ces relations
    public function program(): BelongsTo
    {
        return $this->belongsTo(Program::class);
    }

    public function filiere(): BelongsTo
    {
        return $this->belongsTo(Filiere::class);
    }

    public function schedules(): HasMany
    {
        return $this->hasMany(Schedule::class);
    }

    public function resources(): HasMany
    {
        return $this->hasMany(CourseResource::class);
    }

    public function exams(): HasMany
    {
        return $this->hasMany(Exam::class);
    }
}