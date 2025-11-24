<?php

namespace App\Http\Resources\Professor;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProfessorCourseResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $totalSessions = $this->schedules()->count();
        $completedSessions = $this->schedules()->where('date', '<', now())->count();
        
        return [
            'id' => $this->id,
            'name' => $this->name,
            'code' => $this->code,
            'description' => $this->description,
            'group' => $this->group?->name ?? '-',
            'filiere' => $this->filiere?->name ?? '-',
            'program' => $this->program?->name ?? '-',
            'total_students' => $this->group?->students_count ?? 0,
            'total_hours' => $this->hours ?? 0,
            'completed_hours' => $completedSessions * ($this->hours_per_session ?? 2),
            'progress' => $totalSessions > 0 ? round(($completedSessions / $totalSessions) * 100) : 0,
            'schedule' => $this->formatSchedule(),
            'room' => $this->schedules()->latest('date')->first()?->room ?? '-',
            'next_class' => $this->schedules()->where('date', '>=', now())->orderBy('date')->first()?->date ?? null,
            'average_attendance' => $this->calculateAttendanceRate(),
            'resources' => CourseResourceResource::collection($this->whenLoaded('resources')),
        ];
    }

    private function formatSchedule(): string
    {
        $schedules = $this->schedules()
            ->select('day_of_week', 'start_time', 'end_time')
            ->distinct()
            ->get();
        
        if ($schedules->isEmpty()) {
            return '-';
        }

        $days = [
            1 => 'Lundi',
            2 => 'Mardi',
            3 => 'Mercredi',
            4 => 'Jeudi',
            5 => 'Vendredi',
            6 => 'Samedi',
        ];

        $formatted = $schedules->map(function($schedule) use ($days) {
            $day = $days[$schedule->day_of_week] ?? '';
            $time = substr($schedule->start_time, 0, 5) . '-' . substr($schedule->end_time, 0, 5);
            return $day;
        })->unique()->implode(' & ');

        $firstSchedule = $schedules->first();
        $time = substr($firstSchedule->start_time, 0, 5) . '-' . substr($firstSchedule->end_time, 0, 5);
        
        return $formatted . ' ' . $time;
    }

    private function calculateAttendanceRate(): int
    {
        $totalAttendances = $this->attendances()->count();
        
        if ($totalAttendances === 0) {
            return 100;
        }

        $presentCount = $this->attendances()->where('status', 'present')->count();
        
        return round(($presentCount / $totalAttendances) * 100);
    }
}