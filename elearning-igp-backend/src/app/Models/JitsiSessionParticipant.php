<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JitsiSessionParticipant extends Model
{
    use HasFactory;

    protected $fillable = [
        'session_id',
        'student_id',
        'registered',
        'joined',
        'joined_at',
    ];

    protected $casts = [
        'registered' => 'boolean',
        'joined' => 'boolean',
        'joined_at' => 'datetime',
    ];

    public function session()
    {
        return $this->belongsTo(JitsiSession::class, 'session_id');
    }

    public function student()
    {
        return $this->belongsTo(Student::class);
    }
}