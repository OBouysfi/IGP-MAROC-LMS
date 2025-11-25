<?php

namespace App\Http\Controllers\Api\Student;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Schedule;

class StudentScheduleController extends Controller
{
    public function index(Request $request)
    {
        try {
            $student = $request->user()->student;
            
            if (!$student) {
                return response()->json(['message' => 'Student profile not found'], 404);
            }

            $schedules = Schedule::where('group_id', $student->group_id)
                ->with(['course', 'professor.user'])
                ->orderByRaw("FIELD(day, 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche')")
                ->orderBy('start_time')
                ->get()
                ->map(function($schedule) {
                    return [
                        'id' => $schedule->id,
                        'course' => $schedule->course->name ?? 'N/A',
                        'course_code' => $schedule->course->code ?? 'N/A',
                        'professor' => optional($schedule->professor)->user->name ?? 'N/A',
                        'type' => $schedule->type,
                        'day' => $schedule->day,
                        'start_time' => substr($schedule->start_time, 0, 5),
                        'end_time' => substr($schedule->end_time, 0, 5),
                        'room' => $schedule->room,
                    ];
                });

            return response()->json($schedules);
        } catch (\Exception $e) {
            \Log::error('Student schedule error: ' . $e->getMessage());
            return response()->json(['message' => 'Error fetching schedule', 'error' => $e->getMessage()], 500);
        }
    }
}