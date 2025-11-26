<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    protected $table = 'attendance';
    
    protected $fillable = [
        'session_id',
        'student_id',
        'joined_at',
        'left_at',
        'duration_minutes',
        'status',
    ];

    public function session()
    {
        return $this->belongsTo(\App\Models\JitsiSession::class, 'session_id');
    }

    public function student()
    {
        return $this->belongsTo(User::class, 'student_id');
    }
}