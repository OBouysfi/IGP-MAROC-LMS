<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProfessorDocument extends Model
{
    use HasFactory;

    protected $fillable = [
        'professor_id',
        'course_id',
        'name',
        'file_path',
        'file_type',
        'file_size',
        'category',
        'shared_with_students',
        'downloads',
    ];

    protected $casts = [
        'shared_with_students' => 'boolean',
        'file_size' => 'integer',
        'downloads' => 'integer',
    ];

    public function professor()
    {
        return $this->belongsTo(Professor::class);
    }

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function getFileSizeFormattedAttribute()
    {
        $bytes = $this->file_size;
        if ($bytes >= 1073741824) {
            return number_format($bytes / 1073741824, 2) . ' GB';
        } elseif ($bytes >= 1048576) {
            return number_format($bytes / 1048576, 2) . ' MB';
        } elseif ($bytes >= 1024) {
            return number_format($bytes / 1024, 2) . ' KB';
        } else {
            return $bytes . ' bytes';
        }
    }
}