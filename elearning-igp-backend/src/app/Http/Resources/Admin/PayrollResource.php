<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PayrollResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'professor_id' => $this->professor_id,
            'professor_name' => $this->professor->user->name,
            'professor_email' => $this->professor->user->email,
            'department' => $this->professor->department,
            'contract_type' => $this->professor->contract_type,
            'bank_info' => $this->professor->bank_info,
            'month' => $this->month,
            'year' => $this->year,
            'hourly_rate' => (float) $this->hourly_rate,
            'hours_worked' => (float) $this->hours_worked,
            'bonus' => (float) $this->bonus,
            'deductions' => (float) $this->deductions,
            'gross_salary' => (float) $this->gross_salary,
            'net_salary' => (float) $this->net_salary,
            'payment_status' => $this->payment_status,
            'payment_date' => $this->payment_date?->format('Y-m-d'),
            'payment_reference' => $this->payment_reference,
            'payment_method' => $this->payment_method,
            'comment' => $this->comment,
            'courses_details' => $this->details->map(fn($d) => [
                'course' => $d->course_name,
                'hours' => (float) $d->hours,
                'group' => $d->group_name,
            ]),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}