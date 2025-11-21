<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ExamResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'course' => [
                'id' => $this->course->id,
                'name' => $this->course->name,
                'code' => $this->course->code,
            ],
            'group' => [
                'id' => $this->group->id,
                'name' => $this->group->name,
                'code' => $this->group->code,
            ],
            'professor' => $this->professor ? [
                'id' => $this->professor->id,
                'name' => $this->professor->user->name,
            ] : null,
            'filiere' => $this->course->filiere,
            'program' => $this->course->program,
            'type' => $this->type,
            'date' => $this->date->format('Y-m-d'),
            'time' => $this->time->format('H:i'),
            'duration' => $this->duration_minutes . ' min',
            'room' => $this->room,
            'total_students' => $this->total_students,
            'graded_students' => $this->graded_students,
            'average' => $this->average,
            'min_grade' => $this->min_grade,
            'max_grade' => $this->max_grade,
            'pass_rate' => $this->pass_rate,
            'status' => $this->status,
            'grades' => $this->whenLoaded('grades', function () {
                return $this->grades->map(fn($grade) => [
                    'id' => $grade->id,
                    'student' => $grade->student->name,
                    'student_id' => $grade->student_id,
                    'grade' => $grade->grade,
                    'status' => $grade->status,
                    'comment' => $grade->comment,
                ]);
            }),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}