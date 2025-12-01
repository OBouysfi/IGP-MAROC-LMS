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
            'students_count' => $this->students_count ?? 0,
            'max_students' => $this->max_students ?? 30,
            'hours_total' => $this->hours_total ?? 0,
            'hours_completed' => $this->hours_completed ?? 0,
            'start_date' => $this->start_date,
            'end_date' => $this->end_date,
            'schedule' => $this->schedule ?? [],
            'status' => $this->status,
            'materials' => $this->materials ?? [],
            'completion_rate' => $this->hours_total > 0 
                ? round(($this->hours_completed / $this->hours_total) * 100) 
                : 0,
            'credits' => $this->credits ?? 0,
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
        ];
    }
}