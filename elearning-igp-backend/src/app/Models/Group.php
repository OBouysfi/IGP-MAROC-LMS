<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Group extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'code',
        'program_id',
        'filiere_id',
        'level',
        'max_students',
        'delegate',
        'delegate_email',
        'schedule',
    ];

    protected $casts = [
        'schedule' => 'array',
        'max_students' => 'integer',
    ];

    public function program(): BelongsTo
    {
        return $this->belongsTo(Program::class);
    }

    public function filiere(): BelongsTo
    {
        return $this->belongsTo(Filiere::class);
    }

    public function students(): BelongsToMany
    {
        return $this->belongsToMany(Student::class, 'group_student', 'group_id', 'student_id')
            ->withTimestamps();
    }

    public function courses(): BelongsToMany
    {
        return $this->belongsToMany(Course::class, 'group_course')
            ->withPivot('hours_week')
            ->withTimestamps();
    }
}