<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Carbon\Carbon;

class AttendanceLog extends Model
{
    protected $fillable = [
        'professor_id',
        'course_id',
        'group_id',
        'schedule_id',
        'date',
        'clock_in',
        'clock_out',
        'hours_worked',
        'hours_scheduled',
        'status',
        'type',
        'location',
        'notes',
        'validated',
        'validated_by',
        'validated_at',
    ];

    protected $casts = [
        'date' => 'date',
        'clock_in' => 'datetime:H:i',
        'clock_out' => 'datetime:H:i',
        'hours_worked' => 'decimal:2',
        'hours_scheduled' => 'decimal:2',
        'validated' => 'boolean',
        'validated_at' => 'datetime',
    ];

    public function professor(): BelongsTo
    {
        return $this->belongsTo(Professor::class);
    }

    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }

    public function group(): BelongsTo
    {
        return $this->belongsTo(Group::class);
    }

    public function schedule(): BelongsTo
    {
        return $this->belongsTo(Schedule::class);
    }

    public function validator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'validated_by');
    }

    // Calculer heures automatiquement
    public function calculateHours(): void
    {
        if ($this->clock_in && $this->clock_out) {
            $start = Carbon::parse($this->clock_in);
            $end = Carbon::parse($this->clock_out);
            $this->hours_worked = $end->diffInMinutes($start) / 60;
            $this->save();
        }
    }

    // Déterminer le statut
    public function determineStatus(): void
    {
        if (!$this->clock_in) {
            $this->status = 'absent';
        } elseif ($this->hours_scheduled > 0 && $this->hours_worked < $this->hours_scheduled) {
            $this->status = 'early_leave';
        } else {
            $this->status = 'present';
        }
        $this->save();
    }
}