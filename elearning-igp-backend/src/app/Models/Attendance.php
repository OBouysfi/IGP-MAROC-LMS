<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Attendance extends Model
{
    use HasFactory;

    protected $fillable = [
        'attendable_type',
        'attendable_id',
        'schedule_id',
        'course_name',
        'date',
        'start_time',
        'end_time',
        'type',
        'justification',
        'justification_file',
        'justified_at',
        'comment',
    ];

    protected $casts = [
        'date' => 'date',
        'start_time' => 'datetime:H:i',
        'end_time' => 'datetime:H:i',
        'justified_at' => 'datetime',
    ];

    public function attendable(): MorphTo
    {
        return $this->morphTo();
    }

    public function schedule(): BelongsTo
    {
        return $this->belongsTo(Schedule::class);
    }
}