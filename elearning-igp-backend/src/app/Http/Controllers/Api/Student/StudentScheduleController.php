<?php

namespace App\Http\Controllers\Api\Student;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Schedule;
use Carbon\Carbon;

class StudentScheduleController extends Controller
{
    public function index(Request $request)
    {
        try {
            $student = $request->user()->student;
            
            if (!$student) {
                return response()->json([
                    'message' => 'Student profile not found'
                ], 404);
            }

            $groupIds = $student->groups()->pluck('groups.id')->toArray();

            if (empty($groupIds)) {
                return response()->json([
                    'message' => 'Student not assigned to any group',
                    'data' => []
                ], 200);
            }

            $schedules = Schedule::whereIn('group_id', $groupIds)
                ->with(['course', 'professor.user', 'group'])
                ->orderByRaw("FIELD(day, 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche')")
                ->orderBy('start_time')
                ->get();

            $formattedSchedules = $schedules->map(function($schedule) {
                $startTime = $schedule->start_time;
                $endTime = $schedule->end_time;
                
                if ($startTime instanceof \DateTime) {
                    $startTime = $startTime->format('H:i');
                } elseif (is_string($startTime) && strlen($startTime) > 8) {
                    $startTime = Carbon::parse($startTime)->format('H:i');
                } else {
                    $startTime = substr($startTime, 0, 5);
                }
                
                if ($endTime instanceof \DateTime) {
                    $endTime = $endTime->format('H:i');
                } elseif (is_string($endTime) && strlen($endTime) > 8) {
                    $endTime = Carbon::parse($endTime)->format('H:i');
                } else {
                    $endTime = substr($endTime, 0, 5);
                }

                // Fix pour le nom du professeur
                $professorName = 'N/A';
                if ($schedule->professor && $schedule->professor->user) {
                    $user = $schedule->professor->user;
                    $professorName = trim($user->first_name . ' ' . $user->last_name);
                }
                
                return [
                    'id' => $schedule->id,
                    'course' => $schedule->course->name ?? 'N/A',
                    'course_code' => $schedule->course->code ?? 'N/A',
                    'professor' => $professorName,
                    'type' => $schedule->type,
                    'day' => $schedule->day,
                    'start_time' => $startTime,
                    'end_time' => $endTime,
                    'room' => $schedule->room,
                    'group' => $schedule->group->name ?? 'N/A',
                ];
            });

            return response()->json($formattedSchedules);
            
        } catch (\Exception $e) {
            \Log::error('Student schedule error', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'message' => 'Error fetching schedule',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}