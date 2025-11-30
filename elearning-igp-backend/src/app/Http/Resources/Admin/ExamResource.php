<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Resources\Json\JsonResource;

class ExamResource extends JsonResource
{
    public function toArray($request): array
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
                'code' => $this->group->code ?? $this->group->name,
            ],
            'professor' => $this->professor ? [
                'id' => $this->professor->id,
                'name' => $this->professor->user->first_name . ' ' . $this->professor->user->last_name,
            ] : null,
            'type' => $this->type,
            'date' => $this->date,
            'time' => $this->time,
            'duration' => $this->duration,
            'room' => $this->room,
            'coefficient' => $this->coefficient,
            'status' => $this->status,
            'total_students' => $this->total_students,
            'graded_students' => $this->graded_students ?? 0,
            'average' => $this->average,
            'min_grade' => $this->min_grade,
            'max_grade' => $this->max_grade,
            'pass_rate' => $this->pass_rate,
            'grades' => $this->whenLoaded('grades', function() {
                return $this->grades->map(function($grade) {
                    return [
                        'id' => $grade->id,
                        'student_id' => $grade->student_id,
                        'student' => $grade->student->first_name . ' ' . $grade->student->last_name,
                        'grade' => $grade->grade,
                        'status' => $grade->status,
                        'comment' => $grade->comment,
                    ];
                });
            }),
        ];
    }
    private function formatDuration(int $minutes): string
    {
        $hours = floor($minutes / 60);
        $mins = $minutes % 60;
        
        if ($mins > 0) {
            return sprintf('%dh%02d', $hours, $mins);
        }
        
        return sprintf('%dh00', $hours);
    }
}