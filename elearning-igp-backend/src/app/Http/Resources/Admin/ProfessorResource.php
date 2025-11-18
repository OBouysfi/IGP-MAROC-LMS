<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Resources\Json\JsonResource;

class ProfessorResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'professor_code' => $this->professor_code,
            'user' => [
                'id' => $this->user->id,
                'first_name' => $this->user->first_name,
                'last_name' => $this->user->last_name,
                'email' => $this->user->email,
                'phone' => $this->user->phone,
                'is_active' => $this->user->is_active,
            ],
            'gender' => $this->gender,
            'birth_date' => $this->birth_date?->format('Y-m-d'),
            'nationality' => $this->nationality,
            'address' => $this->address,
            'hire_date' => $this->hire_date?->format('Y-m-d'),
            'department' => $this->department,
            'specialization' => $this->specialization,
            'contract_type' => $this->contract_type,
            'hourly_rate' => (float) $this->hourly_rate,
            'total_hours_month' => $this->total_hours_month,
            'qualifications' => $this->qualifications ?? [],
            'bio' => $this->bio,
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
        ];
    }
}