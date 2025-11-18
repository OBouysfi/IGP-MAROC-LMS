<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Resources\Json\JsonResource;

class StudentResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'student_code' => $this->student_code,
            'user' => [
                'id' => $this->user->id,
                'first_name' => $this->user->first_name,
                'last_name' => $this->user->last_name,
                'email' => $this->user->email,
                'phone' => $this->user->phone,
                'is_active' => $this->user->is_active,
            ],
            'gender' => $this->gender,
            'birth_date' => $this->birth_date,
            'nationality' => $this->nationality,
            'address' => $this->address,
            'enrolled_date' => $this->enrolled_date,
            'filiere' => $this->filiere,
            'program' => $this->program,
            'level' => $this->level,
            'group' => $this->group,
            'inscription_amount' => (float) $this->inscription_amount,
            'monthly_amount' => (float) $this->monthly_amount,
            'payment_status' => $this->payment_status ?? 'À jour',
            'dossier_status' => $this->dossier_status ?? 'Incomplet',
            'admin_comments' => $this->admin_comments,
            'documents' => $this->documents ?? [],
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
        ];
    }
}