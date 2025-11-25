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

        // Get schedules - la table schedules a day_of_week au lieu de date
        $schedules = Schedule::with(['course', 'group'])
            ->whereIn('course_id', $courseIds)
            ->get();

        $liveSessions = JitsiSession::with(['course', 'group'])
            ->where('professor_id', $professor->id)
            ->whereBetween('session_date', [$startOfWeek, $endOfWeek])
            ->whereIn('status', ['planifiée', 'en_cours'])
            ->get();

        $events = [];

        $dayNames = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

        // Add regular schedules - utiliser day_of_week
        foreach ($schedules as $schedule) {
            $dayName = $dayNames[$schedule->day_of_week];

            $events[] = [
                'id' => $schedule->id,
                'course' => $schedule->course->name,
                'course_code' => $schedule->course->code,
                'group' => $schedule->group->name ?? 'N/A',
                'type' => $schedule->type ?? 'cours',
                'day' => $dayName,
                'start_time' => $schedule->start_time,
                'end_time' => $schedule->end_time,
                'room' => $schedule->room ?? 'N/A',
                'students_count' => $schedule->group ? $schedule->group->students()->count() : 0,
            ];
        }

        // Add live sessions
        foreach ($liveSessions as $session) {
            $dayName = $dayNames[$session->session_date->dayOfWeek];
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
        $schedules = Schedule::whereIn('course_id', $courseIds)->get();

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
}