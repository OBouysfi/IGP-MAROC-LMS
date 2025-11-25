<?php

namespace App\Http\Controllers\Api\Student;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Course;
use App\Models\Schedule;
use App\Models\ExamGrade;
use App\Models\ProfessorDocument;
use App\Models\JitsiSession;
use Carbon\Carbon;

class StudentCourseController extends Controller
{
    public function index(Request $request)
    {
        $student = $request->user()->student;
        
        if (!$student) {
            return response()->json(['message' => 'Student profile not found'], 404);
        }

        $courses = Course::where('group_id', $student->group_id)
            ->with(['professor.user', 'group'])
            ->get()
            ->map(function($course) use ($student) {
                $nextSchedule = Schedule::where('course_id', $course->id)
                    ->where('day_of_week', '>=', now()->dayOfWeek)
                    ->orderBy('day_of_week')
                    ->orderBy('start_time')
                    ->first();

                $grades = ExamGrade::whereHas('exam', function($q) use ($course) {
                    $q->where('course_id', $course->id);
                })->where('student_id', $student->id)->get();

                $average = $grades->count() > 0 ? $grades->avg('grade') : null;

                $resourcesCount = ProfessorDocument::where('course_id', $course->id)
                    ->where('shared_with_students', true)
                    ->count();

                $sessionsCount = JitsiSession::where('course_id', $course->id)
                    ->where('session_date', '>=', now())
                    ->count();

                $nextClass = null;
                if ($nextSchedule) {
                    $nextDay = Carbon::now()->next($nextSchedule->day_of_week);
                    $nextClass = $nextDay->format('Y-m-d') . ' ' . $nextSchedule->start_time;
                }

                return [
                    'id' => $course->id,
                    'name' => $course->name,
                    'code' => $course->code,
                    'professor' => $course->professor->user->name ?? 'N/A',
                    'professor_email' => $course->professor->user->email ?? 'N/A',
                    'description' => $course->description ?? 'Pas de description disponible',
                    'credits' => $course->credits ?? 0,
                    'semester' => $course->semester ?? 'S1',
                    'progress' => $course->hours_total > 0 ? round(($course->hours_completed / $course->hours_total) * 100) : 0,
                    'total_hours' => $course->hours_total ?? 0,
                    'completed_hours' => $course->hours_completed ?? 0,
                    'next_class' => $nextClass,
                    'next_class_room' => $nextSchedule->room ?? 'N/A',
                    'grade_average' => $average ? round($average, 1) : null,
                    'resources_count' => $resourcesCount,
                    'sessions_count' => $sessionsCount,
                    'color' => $this->getCourseColor($course->id),
                ];
            });

        return response()->json($courses);
    }

    public function show($id, Request $request)
    {
        $student = $request->user()->student;
        
        if (!$student) {
            return response()->json(['message' => 'Student profile not found'], 404);
        }

        $course = Course::where('id', $id)
            ->where('group_id', $student->group_id)
            ->with(['professor.user', 'group'])
            ->firstOrFail();

        $nextSchedule = Schedule::where('course_id', $course->id)
            ->where('day_of_week', '>=', now()->dayOfWeek)
            ->orderBy('day_of_week')
            ->orderBy('start_time')
            ->first();

        $grades = ExamGrade::whereHas('exam', function($q) use ($course) {
            $q->where('course_id', $course->id);
        })->where('student_id', $student->id)->get();

        $average = $grades->count() > 0 ? $grades->avg('grade') : null;

        $resourcesCount = ProfessorDocument::where('course_id', $course->id)
            ->where('shared_with_students', true)
            ->count();

        $sessionsCount = JitsiSession::where('course_id', $course->id)
            ->where('session_date', '>=', now())
            ->count();

        $nextClass = null;
        if ($nextSchedule) {
            $nextDay = Carbon::now()->next($nextSchedule->day_of_week);
            $nextClass = $nextDay->format('Y-m-d') . ' ' . $nextSchedule->start_time;
        }

        return response()->json([
            'id' => $course->id,
            'name' => $course->name,
            'code' => $course->code,
            'professor' => $course->professor->user->name ?? 'N/A',
            'professor_email' => $course->professor->user->email ?? 'N/A',
            'description' => $course->description ?? 'Pas de description disponible',
            'credits' => $course->credits ?? 0,
            'semester' => $course->semester ?? 'S1',
            'progress' => $course->hours_total > 0 ? round(($course->hours_completed / $course->hours_total) * 100) : 0,
            'total_hours' => $course->hours_total ?? 0,
            'completed_hours' => $course->hours_completed ?? 0,
            'next_class' => $nextClass,
            'next_class_room' => $nextSchedule->room ?? 'N/A',
            'grade_average' => $average ? round($average, 1) : null,
            'resources_count' => $resourcesCount,
            'sessions_count' => $sessionsCount,
            'color' => $this->getCourseColor($course->id),
        ]);
    }

    public function resources($id, Request $request)
    {
        $student = $request->user()->student;
        
        if (!$student) {
            return response()->json(['message' => 'Student profile not found'], 404);
        }

        $course = Course::where('id', $id)
            ->where('group_id', $student->group_id)
            ->firstOrFail();

        $resources = ProfessorDocument::where('course_id', $course->id)
            ->where('shared_with_students', true)
            ->with('professor.user')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function($doc) {
                return [
                    'id' => $doc->id,
                    'title' => $doc->title,
                    'description' => $doc->description,
                    'file_name' => $doc->file_name,
                    'file_path' => $doc->file_path,
                    'file_size' => $doc->file_size,
                    'file_type' => $doc->file_type,
                    'shared_at' => $doc->created_at->format('Y-m-d H:i:s'),
                    'professor' => $doc->professor->user->name ?? 'N/A',
                ];
            });

        return response()->json($resources);
    }

    private function getCourseColor($courseId)
    {
        $colors = [
            'from-blue-500 to-blue-600',
            'from-green-500 to-green-600',
            'from-purple-500 to-purple-600',
            'from-yellow-500 to-yellow-600',
            'from-orange-500 to-orange-600',
            'from-red-500 to-red-600',
            'from-pink-500 to-pink-600',
            'from-indigo-500 to-indigo-600',
        ];
        
        return $colors[$courseId % count($colors)];
    }
}