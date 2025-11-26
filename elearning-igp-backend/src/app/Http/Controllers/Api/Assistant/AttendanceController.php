<?php

namespace App\Http\Controllers\Api\Assistant;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Schedule;
use App\Models\Attendance;
use App\Models\Student;
use Carbon\Carbon;

class AttendanceController extends Controller
{
    public function getSessions(Request $request)
    {
        try {
            $date = $request->query('date', now()->format('Y-m-d'));
            $groupId = $request->query('group_id');
            
            $dayName = Carbon::parse($date)->locale('fr')->translatedFormat('l');
            $dayName = ucfirst($dayName);
            
            $query = Schedule::where('day', $dayName)
                ->with(['course', 'professor.user', 'group']);
            
            if ($groupId) {
                $query->where('group_id', $groupId);
            }
            
            $sessions = $query->orderBy('start_time')->get()->map(function($schedule) use ($date) {
                $students = Student::where('group_id', $schedule->group_id)
                    ->with(['user'])
                    ->get()
                    ->map(function($student) use ($schedule, $date) {
                        // On utilise la table attendance avec session_id = schedule_id temporairement
                        $attendance = Attendance::where('session_id', $schedule->id)
                            ->where('student_id', $student->user_id)
                            ->whereDate('created_at', $date)
                            ->first();
                        
                        return [
                            'id' => $student->user_id,
                            'name' => $student->user->name,
                            'email' => $student->user->email,
                            'group' => $schedule->group->name ?? 'N/A',
                            'status' => $attendance ? $attendance->status : null,
                        ];
                    });
                
                return [
                    'id' => $schedule->id,
                    'course' => $schedule->course->name ?? 'N/A',
                    'course_code' => $schedule->course->code ?? 'N/A',
                    'professor' => optional($schedule->professor)->user->name ?? 'N/A',
                    'group' => $schedule->group->name ?? 'N/A',
                    'date' => $date,
                    'start_time' => substr($schedule->start_time, 0, 5),
                    'end_time' => substr($schedule->end_time, 0, 5),
                    'room' => $schedule->room,
                    'students' => $students,
                ];
            });
            
            return response()->json($sessions);
        } catch (\Exception $e) {
            \Log::error('Assistant attendance sessions error: ' . $e->getMessage());
            return response()->json(['message' => 'Error fetching sessions', 'error' => $e->getMessage()], 500);
        }
    }
    
    public function saveAttendance(Request $request)
    {
        try {
            $request->validate([
                'schedule_id' => 'required|exists:schedules,id',
                'date' => 'required|date',
                'attendance' => 'required|array',
                'attendance.*.student_id' => 'required|exists:users,id',
                'attendance.*.status' => 'required|in:present,absent,late,excused',
            ]);
            
            $scheduleId = $request->schedule_id;
            $date = $request->date;
            $attendanceData = $request->attendance;
            
            foreach ($attendanceData as $record) {
                // Chercher si existe déjà pour cette date
                $existing = Attendance::where('session_id', $scheduleId)
                    ->where('student_id', $record['student_id'])
                    ->whereDate('created_at', $date)
                    ->first();
                
                if ($existing) {
                    $existing->update(['status' => $record['status']]);
                } else {
                    Attendance::create([
                        'session_id' => $scheduleId,
                        'student_id' => $record['student_id'],
                        'status' => $record['status'],
                        'created_at' => $date,
                        'updated_at' => now(),
                    ]);
                }
            }
            
            return response()->json(['message' => 'Attendance saved successfully']);
        } catch (\Exception $e) {
            \Log::error('Assistant save attendance error: ' . $e->getMessage());
            return response()->json(['message' => 'Error saving attendance', 'error' => $e->getMessage()], 500);
        }
    }
    
    public function getGroups()
    {
        try {
            $groups = \App\Models\Group::select('id', 'name', 'code')->get();
            return response()->json($groups);
        } catch (\Exception $e) {
            \Log::error('Assistant get groups error: ' . $e->getMessage());
            return response()->json(['message' => 'Error fetching groups', 'error' => $e->getMessage()], 500);
        }
    }
}