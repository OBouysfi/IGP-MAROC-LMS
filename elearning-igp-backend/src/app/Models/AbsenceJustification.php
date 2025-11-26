<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AbsenceJustification extends Model
{
    protected $fillable = [
        'student_id',
        'attendance_id',
        'absence_date',
        'absence_course',
        'reason',
        'document_name',
        'document_path',
        'status',
        'reviewed_by',
        'reviewed_at',
        'review_comment',
    ];

    protected $casts = [
        'absence_date' => 'date',
        'reviewed_at' => 'datetime',
    ];

    public function student()
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    public function attendance()
    {
        return $this->belongsTo(Attendance::class);
    }

    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }
}