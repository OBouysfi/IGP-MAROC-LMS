<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JitsiSession extends Model
{
    use HasFactory;

    protected $fillable = [
        'professor_id',
        'course_id',
        'group_id',
        'title',
        'description',
        'session_date',
        'start_time',
        'duration',
        'status',
        'max_participants',
        'room_url',
        'recording_enabled',
        'chat_enabled',
    ];

    protected $casts = [
        'session_date' => 'date',
        'recording_enabled' => 'boolean',
        'chat_enabled' => 'boolean',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($session) {
            if (!$session->room_url) {
                $session->room_url = 'https://meet.jit.si/IGP-' . strtoupper(uniqid());
            }
        });
    }

    public function professor()
    {
        return $this->belongsTo(Professor::class);
    }

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function group()
    {
        return $this->belongsTo(Group::class);
    }

    public function participants()
    {
        return $this->hasMany(JitsiSessionParticipant::class, 'session_id');
    }
}