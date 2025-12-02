<?php

namespace App\Http\Controllers\Api\Student;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Course;
use App\Models\Schedule;
use App\Models\Grade;
use App\Models\JitsiSession;
use App\Models\ProfessorDocument;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function stats(Request $request)
    {
        try {
            $student = $request->user()->student;
            
            if (!$student) {
                return response()->json(['message' => 'Student profile not found'], 404);
            }

            // ✅ CORRECTION: Utilise groups au lieu de group_id
            $groupIds = $student->groups->pluck('id');

            // Stats
            $totalCourses = Course::whereIn('group_id', $groupIds)->count();
            
            $grades = Grade::where('student_id', $student->id)->get();
            $averageGrade = $grades->count() > 0 ? round($grades->avg('grade'), 1) : 0;
            
            $upcomingSessions = JitsiSession::whereIn('group_id', $groupIds)
                ->where('status', 'planifiée')
                ->where('session_date', '>=', now())
                ->count();
            
            $stats = [
                'total_courses' => $totalCourses,
                'average_grade' => $averageGrade,
                'attendance_rate' => 95,
                'upcoming_sessions' => $upcomingSessions,
                'pending_assignments' => 2,
                'completed_courses' => 4,
            ];

            // Today's Schedule
            $today = Carbon::now()->locale('fr');
            $dayNames = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
            $dayName = $dayNames[$today->dayOfWeek];
            
            $todaySchedule = Schedule::whereIn('group_id', $groupIds)
                ->where('day', $dayName)
                ->with(['course', 'professor.user'])
                ->orderBy('start_time')
                ->get()
                ->map(function($schedule) {
                    return [
                        'id' => $schedule->id,
                        'course' => $schedule->course->name ?? 'N/A',
                        'professor' => $schedule->professor?->user?->first_name . ' ' . $schedule->professor?->user?->last_name ?? 'N/A',
                        'time' => substr($schedule->start_time, 0, 5) . ' - ' . substr($schedule->end_time, 0, 5),
                        'room' => $schedule->room,
                        'type' => ucfirst($schedule->type),
                    ];
                });

            // Upcoming Sessions
            $upcomingSessionsList = JitsiSession::whereIn('group_id', $groupIds)
                ->where('status', 'planifiée')
                ->where('session_date', '>=', now())
                ->with(['course', 'professor.user'])
                ->orderBy('session_date')
                ->orderBy('start_time')
                ->limit(3)
                ->get()
                ->map(function($session) {
                    return [
                        'id' => $session->id,
                        'course' => $session->course->name ?? 'N/A',
                        'topic' => $session->title,
                        'date' => $session->session_date,
                        'time' => substr($session->start_time, 0, 5),
                        'professor' => $session->professor?->user?->first_name . ' ' . $session->professor?->user?->last_name ?? 'N/A',
                    ];
                });

            // Recent Grades
            $recentGrades = Grade::where('student_id', $student->id)
                ->with(['exam.course'])
                ->orderBy('created_at', 'desc')
                ->limit(4)
                ->get()
                ->map(function($gradeRecord) {
                    $exam = $gradeRecord->exam;
                    $status = $gradeRecord->grade >= 16 ? 'excellent' : ($gradeRecord->grade >= 14 ? 'good' : 'average');
                    
                    return [
                        'id' => $gradeRecord->id,
                        'course' => $exam->course->name ?? 'N/A',
                        'exam' => $exam->type ?? 'Examen',
                        'grade' => $gradeRecord->grade,
                        'max' => 20,
                        'date' => $exam->date ?? now()->format('Y-m-d'),
                        'status' => $status,
                    ];
                });

            // My Courses
            $myCourses = Course::whereIn('group_id', $groupIds)
                ->with(['professor.user'])
                ->get()
                ->map(function($course) use ($student) {
                    // ✅ CORRECTION: Utilise start_date au lieu de day_of_week
                    $nextSchedule = Schedule::where('course_id', $course->id)
                        ->where('start_date', '>=', now())
                        ->orderBy('start_date')
                        ->orderBy('start_time')
                        ->first();
                    
                    $nextClass = $nextSchedule 
                        ? $nextSchedule->start_date
                        : now()->addDays(7)->format('Y-m-d');
                    
                    return [
                        'id' => $course->id,
                        'name' => $course->name,
                        'code' => $course->code,
                        'professor' => $course->professor?->user?->first_name . ' ' . $course->professor?->user?->last_name ?? 'N/A',
                        'progress' => $course->hours_total > 0 ? round(($course->hours_completed / $course->hours_total) * 100) : 0,
                        'next_class' => $nextClass,
                    ];
                });

            // Recent Resources
            $recentResources = ProfessorDocument::whereHas('course', function($query) use ($groupIds) {
                $query->whereIn('group_id', $groupIds);
            })
            ->where('shared_with_students', true)
            ->with(['course'])
            ->orderBy('created_at', 'desc')
            ->limit(3)
            ->get()
            ->map(function($doc) {
                return [
                    'id' => $doc->id,
                    'name' => $doc->name,
                    'course' => $doc->course->name ?? 'N/A',
                    'type' => strtoupper($doc->file_type),
                    'date' => $doc->created_at->format('Y-m-d'),
                ];
            });

            return response()->json([
                'stats' => $stats,
                'today_schedule' => $todaySchedule,
                'upcoming_sessions' => $upcomingSessionsList,
                'recent_grades' => $recentGrades,
                'my_courses' => $myCourses,
                'recent_resources' => $recentResources,
                'pending_tasks' => [
                    [
                        'id' => 1,
                        'task' => 'Rendre TP React - Context API',
                        'course' => 'React.js Avancé',
                        'deadline' => now()->addDays(5)->format('Y-m-d'),
                        'priority' => 'high',
                    ],
                    [
                        'id' => 2,
                        'task' => 'Projet Final - Partie 1',
                        'course' => 'Node.js & Express',
                        'deadline' => now()->addDays(10)->format('Y-m-d'),
                        'priority' => 'medium',
                    ],
                ],
            ]);
        } catch (\Exception $e) {
            \Log::error('Student dashboard error: ' . $e->getMessage());
            return response()->json(['message' => 'Error fetching dashboard data', 'error' => $e->getMessage()], 500);
        }
    }
}