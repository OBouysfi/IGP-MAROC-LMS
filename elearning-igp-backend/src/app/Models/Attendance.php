<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    protected $table = 'attendances';
    
    protected $fillable = [
        'student_id',
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

    // ✅ This should reference Student model, not User
    public function student()
    {
        return $this->belongsTo(Student::class, 'student_id');
    }

    public function schedule()
    {
        return $this->belongsTo(\App\Models\Schedule::class);
    }
}