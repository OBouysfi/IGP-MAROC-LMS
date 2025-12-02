<?php

namespace App\Http\Resources\Professor;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProfessorCourseResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $totalSessions = $this->schedules()->count();
        $completedSessions = $this->schedules()->where('start_date', '<=', now())->count();
        
        return [
            'id' => $this->id,
            'name' => $this->name,
            'code' => $this->code,
            'description' => $this->description,
            'group' => $this->group?->name ?? '-',
            'filiere' => $this->filiere?->name ?? '-',
            'program' => $this->program?->name ?? '-',
            'total_students' => $this->group?->students_count ?? 0,
            'total_hours' => $this->hours_total ?? 0,
            'completed_hours' => $this->hours_completed ?? 0,
            'progress' => $totalSessions > 0 ? round(($completedSessions / $totalSessions) * 100) : 0,
            'schedule' => $this->formatSchedule(),
            'room' => $this->schedules()->orderBy('start_date', 'desc')->first()?->room ?? '-',
            'next_class' => $this->schedules()->where('start_date', '>=', now())->orderBy('start_date')->first()?->start_date ?? null,
            'average_attendance' => $this->calculateAttendanceRate(),
            'resources' => CourseResourceResource::collection($this->whenLoaded('resources')),
        ];
    }

    private function formatSchedule(): string
    {
        $schedules = $this->schedules()
            ->select('day', 'start_time', 'end_time')
            ->distinct()
            ->get();
        
        if ($schedules->isEmpty()) {
            return '-';
        }

        $formatted = $schedules->map(function($schedule) {
            $time = substr($schedule->start_time, 0, 5) . '-' . substr($schedule->end_time, 0, 5);
            return $schedule->day;
        })->unique()->implode(' & ');

        $firstSchedule = $schedules->first();
        $time = substr($firstSchedule->start_time, 0, 5) . '-' . substr($firstSchedule->end_time, 0, 5);
        
        return $formatted . ' ' . $time;
    }

    private function calculateAttendanceRate(): int
    {
        // Compte le nombre total d'étudiants * sessions
        $totalStudents = $this->group?->students_count ?? 0;
        $totalSessions = $this->schedules()->where('start_date', '<=', now())->count();
        
        if ($totalStudents === 0 || $totalSessions === 0) {
            return 100;
        }

        $expectedAttendances = $totalStudents * $totalSessions;
        
        // Compte les absences pour ce cours
        $absences = \App\Models\Attendance::whereHas('student.groups', function($q) {
            $q->where('groups.id', $this->group_id);
        })
        ->where('course_name', $this->name)
        ->where('type', 'absent')
        ->count();
        
        $presentCount = $expectedAttendances - $absences;
        
        return round(($presentCount / $expectedAttendances) * 100);
    }
}