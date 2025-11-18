<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Professor extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'professor_code',
        'gender',
        'birth_date',
        'nationality',
        'address',
        'hire_date',
        'department',
        'specialization',
        'contract_type',
        'hourly_rate',
        'total_hours_month',
        'qualifications',
        'bio',
    ];

    protected $casts = [
        'qualifications' => 'array',
        'birth_date' => 'date',
        'hire_date' => 'date',
        'hourly_rate' => 'decimal:2',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($professor) {
            if (!$professor->professor_code) {
                $professor->professor_code = 'PROF-' . str_pad(Professor::max('id') + 1, 6, '0', STR_PAD_LEFT);
            }
        });
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}