<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StudentResource extends JsonResource
{
    public function toArray(Request $request): array
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
            'filiere_id' => $this->filiere_id,
            'filiere' => $this->filiere ? [
                'id' => $this->filiere->id,
                'name' => $this->filiere->name,
            ] : null,
            'program_id' => $this->program_id,
            'program' => $this->program ? [
                'id' => $this->program->id,
                'name' => $this->program->name,
            ] : null,
            'level' => $this->level,
            'groups' => $this->whenLoaded('groups', function() {
                return $this->groups->map(fn($g) => [
                    'id' => $g->id,
                    'name' => $g->name,
                ]);
            }),
            'group_ids' => $this->whenLoaded('groups', function() {
                return $this->groups->pluck('id');
            }),
            'dossier_status' => $this->dossier_status,
            'documents' => $this->documents,
            'admin_comments' => $this->admin_comments,
            'inscription_amount' => $this->inscription_amount,
            'monthly_amount' => $this->monthly_amount,
            'payment_status' => $this->payment_status,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}