<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes;
    use HasRoles {
        hasRole as protected spatieHasRole;
    }
    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'password',
        'phone',
        'avatar',
        'is_active',
        'two_factor_enabled',
        'two_factor_code',
        'two_factor_expires_at',
    ];

    protected $hidden = [
        'password',
        'remember_token',
        'two_factor_code',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'two_factor_expires_at' => 'datetime',
        'is_active' => 'boolean',
        'two_factor_enabled' => 'boolean',
        'password' => 'hashed',
    ];

    protected $appends = ['full_name'];

    public function getFullNameAttribute()
    {
        return "{$this->first_name} {$this->last_name}";
    }

    public function isActive()
    {
        return $this->is_active;
    }

    public function isAdmin()
    {
        return $this->hasRole('admin');
    }

    public function isProfessor()
    {
        return $this->hasRole('professor');
    }

    public function isStudent()
    {
        return $this->hasRole('student');
    }

    // Relations
    public function taughtCourses()
    {
        return $this->belongsToMany(Course::class, 'course_professor', 'professor_id', 'course_id')
            ->withTimestamps();
    }

    public function enrolledCourses()
    {
        return $this->belongsToMany(Course::class, 'enrollments', 'student_id', 'course_id')
            ->withPivot('enrolled_at', 'status')
            ->withTimestamps();
    }

    public function enrollments()
    {
        return $this->hasMany(Enrollment::class, 'student_id');
    }

    public function sessions()
    {
        return $this->hasMany(JitsiSession::class, 'professor_id');
    }

    public function attendance()
    {
        return $this->hasMany(Attendance::class, 'student_id');
    }
}