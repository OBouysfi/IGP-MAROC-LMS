<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Payroll extends Model
{
    use HasFactory;

    protected $fillable = [
        'professor_id',
        'month',
        'year',
        'hourly_rate',
        'hours_worked',
        'bonus',
        'deductions',
        'gross_salary',
        'net_salary',
        'payment_status',
        'payment_date',
        'payment_reference',
        'payment_method',
        'comment',
    ];

    protected $casts = [
        'hourly_rate' => 'decimal:2',
        'hours_worked' => 'decimal:2',
        'bonus' => 'decimal:2',
        'deductions' => 'decimal:2',
        'gross_salary' => 'decimal:2',
        'net_salary' => 'decimal:2',
        'payment_date' => 'date',
    ];

    public function professor(): BelongsTo
    {
        return $this->belongsTo(Professor::class);
    }

    public function details(): HasMany
    {
        return $this->hasMany(PayrollDetail::class);
    }
}