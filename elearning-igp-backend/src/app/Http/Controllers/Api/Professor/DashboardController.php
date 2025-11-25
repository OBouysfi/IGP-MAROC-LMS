<?php

namespace App\Http\Controllers\Api\Professor;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Student;
use App\Models\Exam;
use App\Models\JitsiSession;
use App\Models\Schedule;
use App\Models\Attendance;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $professor = $request->user()->professor;

        if (!$professor) {
            return response()->json(['data' => null], 404);
        }

        $courseIds = Course::where('professor_id', $professor->id)->pluck('id');

        // Stats
        $totalCourses = Course::where('professor_id', $professor->id)->count();
        
        $totalStudents = Student::whereHas('group.courses', function ($q) use ($professor) {
            $q->where('professor_id', $professor->id);
        })->distinct()->count();

        $pendingGrades = Exam::whereIn('course_id', $courseIds)
            ->whereIn('status', ['en_attente', 'en_cours'])
            ->count();

        $upcomingSessionsCount = JitsiSession::where('professor_id', $professor->id)
            ->where('session_date', '>=', Carbon::now())
            ->whereIn('status', ['planifiée'])
            ->count();

        // Hours this month
        $schedules = Schedule::where('professor_id', $professor->id)->get();
        $hoursThisMonth = 0;
        foreach ($schedules as $schedule) {
            $start = Carbon::parse($schedule->start_time);
            $end = Carbon::parse($schedule->end_time);
            $hoursThisMonth += $end->diffInHours($start) * 4; // ~4 weeks per month
        }

        // Average attendance
        $attendances = Attendance::whereHas('schedule', function ($q) use ($professor) {
            $q->where('professor_id', $professor->id);
        })->get();
        
        $averageAttendance = $attendances->count() > 0 
            ? ($attendances->where('status', 'present')->count() / $attendances->count()) * 100 
            : 0;

        // Today's schedule - day column stores the day name
        $today = Carbon::now();
        $dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        $dayNamesFr = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
        $todayDayName = $dayNames[$today->dayOfWeek];
        
        $todaySchedule = Schedule::with(['course', 'group'])
            ->where('professor_id', $professor->id)
            ->where('day', $todayDayName)
            ->orderBy('start_time')
            ->get()
            ->map(function ($schedule) {
                return [
                    'id' => $schedule->id,
                    'course' => $schedule->course->name,
                    'group' => $schedule->group->name,
                    'time' => substr($schedule->start_time, 0, 5) . ' - ' . substr($schedule->end_time, 0, 5),
                    'room' => $schedule->room ?? 'N/A',
                    'type' => $schedule->type ?? 'Cours',
                ];
            });

        // Upcoming sessions
        $upcomingSessions = JitsiSession::with(['course'])
            ->where('professor_id', $professor->id)
            ->where('session_date', '>=', Carbon::now())
            ->whereIn('status', ['planifiée'])
            ->orderBy('session_date')
            ->take(2)
            ->get()
            ->map(function ($session) {
                return [
                    'id' => $session->id,
                    'course' => $session->course->name,
                    'date' => $session->session_date->format('Y-m-d'),
                    'time' => $session->start_time,
                    'topic' => $session->title,
                    'students_registered' => $session->participants()->where('registered', true)->count(),
                ];
            });

        // Pending tasks
        $pendingTasks = [];
        
        $examsToGrade = Exam::with(['course'])
            ->whereIn('course_id', $courseIds)
            ->whereIn('status', ['en_attente', 'en_cours'])
            ->orderBy('date', 'asc')
            ->take(3)
            ->get();

        foreach ($examsToGrade as $exam) {
            $daysUntilDeadline = Carbon::parse($exam->date)->diffInDays(Carbon::now(), false);
            $priority = $daysUntilDeadline <= 2 ? 'high' : ($daysUntilDeadline <= 5 ? 'medium' : 'low');
            
            $pendingTasks[] = [
                'id' => $exam->id,
                'task' => 'Saisir les notes - ' . $exam->course->name,
                'deadline' => $exam->date,
                'priority' => $priority,
            ];
        }

        // Recent activity
        $firstCourse = Course::where('professor_id', $professor->id)->first();
        $recentActivity = [
            [
                'id' => 1,
                'action' => 'Dashboard actif',
                'course' => $firstCourse ? $firstCourse->name : 'N/A',
                'time' => 'Aujourd\'hui',
            ],
        ];

        // My courses
        $myCourses = Course::with(['group'])
            ->where('professor_id', $professor->id)
            ->get()
            ->map(function ($course) {
                $studentsCount = $course->group ? $course->group->students()->count() : 0;
                
                $today = Carbon::now();
                $startOfYear = Carbon::create($today->year, 9, 1);
                $endOfYear = Carbon::create($today->year + 1, 6, 30);
                
                if ($today->lt($startOfYear)) {
                    $startOfYear = $startOfYear->subYear();
                    $endOfYear = $endOfYear->subYear();
                }
                
                $totalDays = $startOfYear->diffInDays($endOfYear);
                $elapsedDays = $startOfYear->diffInDays($today);
                $progress = min(100, max(0, round(($elapsedDays / $totalDays) * 100)));
                
                return [
                    'id' => $course->id,
                    'name' => $course->name,
                    'code' => $course->code,
                    'students' => $studentsCount,
                    'progress' => $progress,
                    'next_class' => Carbon::now()->addDay()->format('Y-m-d'),
                ];
            });

        return response()->json([
            'data' => [
                'stats' => [
                    'total_courses' => $totalCourses,
                    'total_students' => $totalStudents,
                    'pending_grades' => $pendingGrades,
                    'upcoming_sessions' => $upcomingSessionsCount,
                    'hours_this_month' => round($hoursThisMonth, 1),
                    'average_attendance' => round($averageAttendance, 1),
                ],
                'today_schedule' => $todaySchedule,
                'upcoming_sessions' => $upcomingSessions,
                'pending_tasks' => $pendingTasks,
                'recent_activity' => $recentActivity,
                'my_courses' => $myCourses,
            ]
        ]);
    }
}