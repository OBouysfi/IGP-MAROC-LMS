<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AttendanceResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'date' => $this->date->format('Y-m-d'),
            'course' => $this->course_name,
            'start_time' => $this->start_time->format('H:i'),
            'end_time' => $this->end_time->format('H:i'),
            'type' => $this->type,
            'justification' => $this->justification,
            'justification_file' => $this->justification_file,
            'justified_at' => $this->justified_at?->toISOString(),
            'comment' => $this->comment,
            'student' => $this->when($this->student_id, function() {
                return [
                    'id' => $this->student->id,
                    'name' => $this->student->user->first_name . ' ' . $this->student->user->last_name,
                ];
            }),
            'professor' => $this->when($this->professor_id, function() {
                return [
                    'id' => $this->professor->id,
                    'name' => $this->professor->user->first_name . ' ' . $this->professor->user->last_name,
                ];
            }),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}