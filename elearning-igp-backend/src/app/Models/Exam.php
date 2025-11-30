<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Exam extends Model
{
    use HasFactory;

    protected $fillable = [
        'course_id',
        'group_id',
        'professor_id',
        'type',
        'date',
        'time',
        'duration_minutes',
        'room',
        'total_students',
        'graded_students',
        'average',
        'min_grade',
        'max_grade',
        'pass_rate',
        'status',
        'notes',
    ];

    protected $casts = [
        'date' => 'date:Y-m-d',
        'time' => 'datetime:H:i',
        'duration_minutes' => 'integer',
        'total_students' => 'integer',
        'graded_students' => 'integer',
        'average' => 'decimal:2',
        'min_grade' => 'decimal:2',
        'max_grade' => 'decimal:2',
        'pass_rate' => 'decimal:2',
    ];

    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }

    public function group(): BelongsTo
    {
        return $this->belongsTo(Group::class);
    }

    public function professor(): BelongsTo
    {
        return $this->belongsTo(Professor::class);
    }

    public function grades(): HasMany
    {
        return $this->hasMany(Grade::class);
    }

    public function calculateStats(): void
    {
        $grades = $this->grades()->pluck('grade');
        
        if ($grades->count() > 0) {
            $this->graded_students = $grades->count();
            $this->average = $grades->avg();
            $this->min_grade = $grades->min();
            $this->max_grade = $grades->max();
            $this->pass_rate = ($grades->filter(fn($g) => $g >= 10)->count() / $grades->count()) * 100;
            $this->save();
        }
    }
}