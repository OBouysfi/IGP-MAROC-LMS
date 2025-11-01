<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    use HasFactory;

    protected $table = 'attendance';

    protected $fillable = [
        'session_id',
        'student_id',
        'joined_at',
        'left_at',
        'duration_minutes',
        'status',
    ];

    protected $casts = [
        'joined_at' => 'datetime',
        'left_at' => 'datetime',
        'duration_minutes' => 'integer',
    ];

    public function session()
    {
        return $this->belongsTo(JitsiSession::class, 'session_id');
    }

    public function student()
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    public function isPresent()
    {
        return $this->status === 'present';
    }

    public function isAbsent()
    {
        return $this->status === 'absent';
    }

    public function isLate()
    {
        return $this->status === 'late';
    }

    public function scopePresent($query)
    {
        return $query->where('status', 'present');
    }
}