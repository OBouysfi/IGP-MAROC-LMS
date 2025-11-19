<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Course extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'code',
        'description',
        'program',
        'level',
        'filiere',
        'professor_id',
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
        'credits',
        'is_active',
    ];

    protected $casts = [
        'schedule' => 'array',
        'materials' => 'array',
        'start_date' => 'date',
        'end_date' => 'date',
        'is_active' => 'boolean',
    ];

    public function professor()
    {
        return $this->belongsTo(Professor::class);
    }

    public function students()
    {
        return $this->belongsToMany(Student::class, 'course_student')
                    ->withTimestamps();
    }
}