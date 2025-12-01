<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StudentDocument extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_id',
        'name',
        'type',
        'status',
        'file_path',
        'uploaded_at',
        'validated_at',
        'comment',
    ];

    protected $casts = [
        'uploaded_at' => 'datetime',
        'validated_at' => 'datetime',
    ];

    // ✅ Doit référencer Student, pas User
    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class, 'student_id');
    }
}