<?php
// app/Http/Controllers/Api/Assistant/ScheduleController.php

namespace App\Http\Controllers\Api\Assistant;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Schedule;
use App\Models\Group;
use App\Models\Professor;

class ScheduleController extends Controller
{
    public function index(Request $request)
    {
        try {
            $groupId = $request->query('group_id');
            $professorId = $request->query('professor_id');
            
            $query = Schedule::with(['course', 'group', 'professor.user']);
            
            if ($groupId) {
                $query->where('group_id', $groupId);
            }
            
            if ($professorId) {
                $query->where('professor_id', $professorId);
            }
            
            $schedules = $query->orderBy('day')
                ->orderBy('start_time')
                ->get()
                ->map(function($schedule) {
                    $studentsCount = \App\Models\Student::where('group_id', $schedule->group_id)->count();
                    
                    return [
                        'id' => $schedule->id,
                        'course' => $schedule->course->name ?? 'N/A',
                        'course_code' => $schedule->course->code ?? 'N/A',
                        'professor' => optional($schedule->professor)->user->name ?? 'N/A',
                        'group' => $schedule->group->name ?? 'N/A',
                        'type' => $schedule->type,
                        'day' => $schedule->day,
                        'start_time' => substr($schedule->start_time, 0, 5),
                        'end_time' => substr($schedule->end_time, 0, 5),
                        'room' => $schedule->room,
                        'students_count' => $studentsCount,
                    ];
                });
            
            return response()->json($schedules);
        } catch (\Exception $e) {
            \Log::error('Assistant schedules error: ' . $e->getMessage());
            return response()->json(['message' => 'Error fetching schedules', 'error' => $e->getMessage()], 500);
        }
    }
    
    public function getGroups()
    {
        try {
            $groups = Group::select('id', 'name', 'code')->get();
            return response()->json($groups);
        } catch (\Exception $e) {
            \Log::error('Assistant get groups error: ' . $e->getMessage());
            return response()->json(['message' => 'Error fetching groups', 'error' => $e->getMessage()], 500);
        }
    }
    
    public function getProfessors()
    {
        try {
            $professors = Professor::with('user')
                ->get()
                ->map(function($prof) {
                    return [
                        'id' => $prof->id,
                        'name' => optional($prof->user)->name ?? 'N/A',
                    ];
                });
            
            return response()->json($professors);
        } catch (\Exception $e) {
            \Log::error('Assistant get professors error: ' . $e->getMessage());
            return response()->json(['message' => 'Error fetching professors', 'error' => $e->getMessage()], 500);
        }
    }
}