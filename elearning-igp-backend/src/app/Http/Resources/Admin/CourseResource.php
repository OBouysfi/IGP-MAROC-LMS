<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Resources\Json\JsonResource;

class CourseResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'code' => $this->code,
            'description' => $this->description,
            'program' => $this->program,
            'level' => $this->level,
            'filiere' => $this->filiere,
            'professor' => $this->professor ? [
                'id' => $this->professor->id,
                'name' => $this->professor->user->first_name . ' ' . $this->professor->user->last_name,
                'email' => $this->professor->user->email,
            ] : null,
            'students_count' => $this->students_count,
            'max_students' => $this->max_students,
            'hours_total' => $this->hours_total,
            'hours_completed' => $this->hours_completed,
            'start_date' => $this->start_date?->format('Y-m-d'),
            'end_date' => $this->end_date?->format('Y-m-d'),
            'schedule' => $this->schedule ?? [],
            'status' => $this->status,
            'materials' => $this->materials ?? [],
            'completion_rate' => $this->completion_rate,
            'credits' => $this->credits,
            'is_active' => $this->is_active,
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
        ];
    }
}