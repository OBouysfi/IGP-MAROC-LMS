<?php

namespace App\Http\Controllers\Api\Professor;

use App\Http\Controllers\Controller;
use App\Models\Schedule;
use App\Models\Course;
use App\Models\JitsiSession;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Carbon\Carbon;

class ScheduleController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $professor = $request->user()->professor;

        if (!$professor) {
            return response()->json(['data' => []], 404);
        }

        $courseIds = Course::where('professor_id', $professor->id)->pluck('id');

        $weekOffset = $request->get('week_offset', 0);
        
        $today = Carbon::now();
        $startOfWeek = $today->copy()->startOfWeek()->addWeeks($weekOffset);
        $endOfWeek = $startOfWeek->copy()->endOfWeek();

        // Get schedules
        $schedules = Schedule::with(['course', 'group'])
            ->whereIn('course_id', $courseIds)
            ->whereNotNull('day')
            ->get();

        $liveSessions = JitsiSession::with(['course', 'group'])
            ->where('professor_id', $professor->id)
            ->whereBetween('session_date', [$startOfWeek, $endOfWeek])
            ->whereIn('status', ['planifiée', 'en_cours'])
            ->get();

        $events = [];

        $dayNames = [
            0 => 'Dimanche',
            1 => 'Lundi', 
            2 => 'Mardi', 
            3 => 'Mercredi', 
            4 => 'Jeudi', 
            5 => 'Vendredi', 
            6 => 'Samedi'
        ];

        // Map pour convertir texte → chiffre
        $dayTextToNumber = [
            'Dimanche' => 0,
            'Lundi' => 1,
            'Mardi' => 2,
            'Mercredi' => 3,
            'Jeudi' => 4,
            'Vendredi' => 5,
            'Samedi' => 6,
            // Anglais aussi au cas où
            'Sunday' => 0,
            'Monday' => 1,
            'Tuesday' => 2,
            'Wednesday' => 3,
            'Thursday' => 4,
            'Friday' => 5,
            'Saturday' => 6,
        ];

        // Add regular schedules
        foreach ($schedules as $schedule) {
            $dayValue = $schedule->day;
            
            // Si c'est du texte, le convertir en chiffre
            if (is_string($dayValue) && isset($dayTextToNumber[$dayValue])) {
                $dayIndex = $dayTextToNumber[$dayValue];
                $dayName = $dayValue;
            } 
            // Si c'est déjà un chiffre
            elseif (is_numeric($dayValue) && isset($dayNames[$dayValue])) {
                $dayIndex = (int)$dayValue;
                $dayName = $dayNames[$dayIndex];
            } 
            else {
                \Log::warning("Invalid day format: '{$schedule->day}' for schedule ID: {$schedule->id}");
                continue;
            }

            $events[] = [
                'id' => $schedule->id,
                'course' => $schedule->course->name,
                'course_code' => $schedule->course->code,
                'group' => $schedule->group->name ?? 'N/A',
                'type' => $schedule->type ?? 'cours',
                'day' => $dayName,
                'start_time' => $schedule->start_time->format('H:i'),
                'end_time' => $schedule->end_time->format('H:i'),
                'room' => $schedule->room ?? 'N/A',
                'students_count' => $schedule->group ? $schedule->group->students()->count() : 0,
            ];
        }

        // Add live sessions
        foreach ($liveSessions as $session) {
            $dayOfWeek = $session->session_date->dayOfWeek;
            
            if (!isset($dayNames[$dayOfWeek])) {
                continue;
            }
            
            $dayName = $dayNames[$dayOfWeek];
            $endTime = Carbon::parse($session->start_time)->addMinutes($session->duration)->format('H:i');

            $events[] = [
                'id' => 'live_' . $session->id,
                'course' => $session->course->name,
                'course_code' => $session->course->code,
                'group' => $session->group->name,
                'type' => 'session_live',
                'day' => $dayName,
                'start_time' => $session->start_time,
                'end_time' => $endTime,
                'room' => 'En ligne',
                'students_count' => $session->participants()->where('registered', true)->count(),
            ];
        }

        return response()->json(['data' => $events]);
    }

    public function stats(Request $request): JsonResponse
    {
        $professor = $request->user()->professor;

        if (!$professor) {
            return response()->json(['data' => null], 404);
        }

        $courseIds = Course::where('professor_id', $professor->id)->pluck('id');

        $today = Carbon::now();
        $startOfWeek = $today->copy()->startOfWeek();
        $endOfWeek = $startOfWeek->copy()->endOfWeek();

        // Schedules récurrents
        $schedules = Schedule::whereIn('course_id', $courseIds)
            ->whereNotNull('day')
            ->get();

        $liveSessions = JitsiSession::where('professor_id', $professor->id)
            ->whereBetween('session_date', [$startOfWeek, $endOfWeek])
            ->whereIn('status', ['planifiée', 'en_cours'])
            ->get();

        $totalHours = 0;
        foreach ($schedules as $schedule) {
            $start = Carbon::parse($schedule->start_time);
            $end = Carbon::parse($schedule->end_time);
            $totalHours += $end->diffInHours($start);
        }

        foreach ($liveSessions as $session) {
            $totalHours += $session->duration / 60;
        }

        $totalCourses = Course::where('professor_id', $professor->id)->count();
        
        $totalGroups = Schedule::whereIn('course_id', $courseIds)
            ->whereNotNull('day')
            ->distinct('group_id')
            ->count('group_id');

        return response()->json([
            'data' => [
                'total_hours' => round($totalHours, 1),
                'total_courses' => $totalCourses,
                'total_groups' => $totalGroups,
                'sessions_this_week' => $schedules->count() + $liveSessions->count(),
            ]
        ]);
    }

    public function today(Request $request): JsonResponse
    {
        $professor = $request->user()->professor;
        
        $schedules = Schedule::with(['course', 'group'])
            ->where('professor_id', $professor->id)
            ->where('day', now()->dayOfWeek)
            ->get();
        
        return response()->json(['data' => $schedules]);
    }

}