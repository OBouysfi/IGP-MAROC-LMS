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
                    'message' => 'Student profile not found',
                    'debug' => [
                        'user_id' => $request->user()->id,
                        'user_role' => $request->user()->role
                    ]
                ], 404);
            }

            // Récupérer tous les IDs des groupes de l'étudiant
            $groupIds = $student->groups()->pluck('groups.id')->toArray();
            
            \Log::info('Student Schedule Query', [
                'student_id' => $student->id,
                'group_ids' => $groupIds,
            ]);

            // Si l'étudiant n'a aucun groupe
            if (empty($groupIds)) {
                return response()->json([
                    'message' => 'Student not assigned to any group',
                    'data' => []
                ], 200);
            }

            // Récupérer les emplois du temps
            $schedules = Schedule::whereIn('group_id', $groupIds)
                ->with(['course', 'professor.user', 'group'])
                ->orderByRaw("FIELD(day, 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche')")
                ->orderBy('start_time')
                ->get();

            // Formatter les données
            $formattedSchedules = $schedules->map(function($schedule) {
                // Gérer les différents formats de temps
                $startTime = $schedule->start_time;
                $endTime = $schedule->end_time;
                
                // Si c'est un objet Carbon/DateTime, formater
                if ($startTime instanceof \DateTime) {
                    $startTime = $startTime->format('H:i');
                }
                // Si c'est une string avec date complète "2025-12-02 09:00:00"
                elseif (is_string($startTime) && strlen($startTime) > 8) {
                    $startTime = Carbon::parse($startTime)->format('H:i');
                }
                // Sinon, assurer le format HH:MM
                else {
                    $startTime = substr($startTime, 0, 5);
                }
                
                // Même chose pour end_time
                if ($endTime instanceof \DateTime) {
                    $endTime = $endTime->format('H:i');
                }
                elseif (is_string($endTime) && strlen($endTime) > 8) {
                    $endTime = Carbon::parse($endTime)->format('H:i');
                }
                else {
                    $endTime = substr($endTime, 0, 5);
                }
                
                return [
                    'id' => $schedule->id,
                    'course' => $schedule->course->name ?? 'N/A',
                    'course_code' => $schedule->course->code ?? 'N/A',
                    'professor' => optional($schedule->professor)->user->name ?? 'N/A',
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