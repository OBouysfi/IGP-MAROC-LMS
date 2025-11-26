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
        'filiere',
        'program',
        'level',
        'group',
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

    // Générer le code étudiant automatiquement
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
    
    public function group()
    {
        return $this->belongsTo(Group::class);
    }

    public function attendances()
    {
        return $this->hasMany(Attendance::class, 'student_id');
    }
}