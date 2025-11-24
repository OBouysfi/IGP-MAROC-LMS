<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CourseResource extends Model
{
    protected $fillable = [
        'course_id',
        'name',
        'type',
        'file_path',
        'url',
        'description',
        'size',
    ];

    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }
}