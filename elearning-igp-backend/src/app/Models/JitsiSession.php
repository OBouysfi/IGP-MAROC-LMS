<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class JitsiSession extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'course_id',
        'professor_id',
        'room_name',
        'title',
        'description',
        'scheduled_at',
        'started_at',
        'ended_at',
        'duration_minutes',
        'status',
        'is_recorded',
        'recording_url',
    ];

    protected $casts = [
        'scheduled_at' => 'datetime',
        'started_at' => 'datetime',
        'ended_at' => 'datetime',
        'is_recorded' => 'boolean',
        'duration_minutes' => 'integer',
    ];

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function professor()
    {
        return $this->belongsTo(User::class, 'professor_id');
    }

    public function attendance()
    {
        return $this->hasMany(Attendance::class, 'session_id');
    }

    public function presentStudents()
    {
        return $this->belongsToMany(User::class, 'attendance', 'session_id', 'student_id')
            ->wherePivot('status', 'present')
            ->withPivot('joined_at', 'left_at', 'duration_minutes');
    }

    public function isLive()
    {
        return $this->status === 'live';
    }

    public function isScheduled()
    {
        return $this->status === 'scheduled';
    }

    public function isEnded()
    {
        return $this->status === 'ended';
    }

    public function scopeLive($query)
    {
        return $query->where('status', 'live');
    }

    public function scopeUpcoming($query)
    {
        return $query->where('status', 'scheduled')
            ->where('scheduled_at', '>', now())
            ->orderBy('scheduled_at');
    }
}