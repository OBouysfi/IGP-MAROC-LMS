<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class GroupResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'code' => $this->code,
            'program' => $this->program,
            'level' => $this->level,
            'filiere' => $this->filiere,
            'max_students' => $this->max_students,
            'delegate' => $this->delegate,
            'delegate_email' => $this->delegate_email,
            'schedule' => $this->schedule,
            'students' => $this->whenLoaded('students', function () {
                return $this->students->map(fn($student) => [
                    'id' => $student->id,
                    'name' => $student->name,
                    'email' => $student->email,
                    'is_active' => $student->is_active,
                ]);
            }),
            'courses' => $this->whenLoaded('courses', function () {
                return $this->courses->map(fn($course) => [
                    'id' => $course->id,
                    'name' => $course->name,
                    'professor' => $course->professor?->user->name ?? 'Non assigné',
                    'hours_week' => $course->pivot->hours_week,
                ]);
            }),
            'students_count' => $this->whenCounted('students'),
            'courses_count' => $this->whenCounted('courses'),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}