<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Student extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'user_id',
        'student_code',
        'gender',
        'birth_date',
        'nationality',
        'address',
        'enrolled_date',
        'filiere_id',
        'program_id',
        'level',
        'dossier_status',
        'documents',
        'admin_comments',
        'inscription_amount',
        'monthly_amount',
        'payment_status',
    ];

    protected $casts = [
        'documents' => 'array',
        'birth_date' => 'date',
        'enrolled_date' => 'date',
        'inscription_amount' => 'decimal:2',
        'monthly_amount' => 'decimal:2',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function filiere()
    {
        return $this->belongsTo(Filiere::class);
    }

    public function program()
    {
        return $this->belongsTo(Program::class);
    }

    public function groups()
    {
        return $this->belongsToMany(Group::class, 'group_student');
    }

    // Helper method to get the primary/first group
    public function group()
    {
        return $this->groups()->first();
    }

    // Alternative: Define as an attribute accessor
    public function getGroupAttribute()
    {
        return $this->groups()->first();
    }

    public function attendances()
    {
        return $this->hasMany(Attendance::class, 'student_id');
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($student) {
            if (!$student->student_code) {
                $lastStudent = static::orderBy('id', 'desc')->first();
                $nextId = $lastStudent ? $lastStudent->id + 1 : 1;
                $student->student_code = 'STU-' . str_pad($nextId, 5, '0', STR_PAD_LEFT);
            }
        });
    }
}