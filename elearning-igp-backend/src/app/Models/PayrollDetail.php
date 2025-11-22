<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PayrollDetail extends Model
{
    use HasFactory;

    protected $fillable = [
        'payroll_id',
        'course_id',
        'course_name',
        'group_name',
        'hours',
        'amount',
    ];

    protected $casts = [
        'hours' => 'decimal:2',
        'amount' => 'decimal:2',
    ];

    public function payroll(): BelongsTo
    {
        return $this->belongsTo(Payroll::class);
    }

    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }
}