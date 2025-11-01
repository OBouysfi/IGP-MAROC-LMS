<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Course extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'year_id',
        'name',
        'code',
        'description',
        'credits',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'credits' => 'integer',
    ];

    public function year()
    {
        return $this->belongsTo(Year::class);
    }

    public function program()
    {
        return $this->hasOneThrough(Program::class, Year::class, 'id', 'id', 'year_id', 'program_id');
    }

    public function professors()
    {
        return $this->belongsToMany(User::class, 'course_professor', 'course_id', 'professor_id')
            ->withTimestamps();
    }

    public function students()
    {
        return $this->belongsToMany(User::class, 'enrollments', 'course_id', 'student_id')
            ->withPivot('enrolled_at', 'status')
            ->withTimestamps();
    }

    public function enrollments()
    {
        return $this->hasMany(Enrollment::class);
    }

    public function sessions()
    {
        return $this->hasMany(JitsiSession::class);
    }

    public function activeEnrollments()
    {
        return $this->hasMany(Enrollment::class)->where('status', 'active');
    }

    public function upcomingSessions()
    {
        return $this->hasMany(JitsiSession::class)
            ->where('status', 'scheduled')
            ->where('scheduled_at', '>', now())
            ->orderBy('scheduled_at');
    }
}