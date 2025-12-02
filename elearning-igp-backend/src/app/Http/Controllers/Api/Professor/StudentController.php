<?php

namespace App\Http\Controllers\Api\Professor;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class StudentController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $professor = $request->user()->professor;

        if (!$professor) {
            return response()->json(['data' => [], 'message' => 'Professor not found'], 404);
        }

        $courseIds = Course::where('professor_id', $professor->id)->pluck('id');

        $students = Student::with(['user', 'groups.filiere', 'groups.program'])
            ->whereHas('groups', function ($query) use ($courseIds) {
                $query->whereHas('courses', function($q) use ($courseIds) {
                    $q->whereIn('courses.id', $courseIds);
                });
            })
            ->get()
            ->map(function ($student) use ($courseIds) {
                $user = $student->user;
                $group = $student->groups->first();
                
                $courses = Course::whereIn('id', $courseIds)
                    ->where('group_id', $group?->id)
                    ->get(['id', 'name'])
                    ->pluck('name')
                    ->toArray();

                $grades = DB::table('exam_grades')
                    ->join('exams', 'exam_grades.exam_id', '=', 'exams.id')
                    ->where('exam_grades.student_id', $student->id)
                    ->whereIn('exams.course_id', $courseIds)
                    ->whereNotNull('exam_grades.grade')
                    ->pluck('exam_grades.grade');

                $average = $grades->count() > 0 ? $grades->avg() : 0;

                $attendances = DB::table('attendances')
                    ->where('attendances.student_id', $student->id)
                    ->whereIn('course_name', function($query) use ($courseIds) {
                        $query->select('name')->from('courses')->whereIn('id', $courseIds);
                    })
                    ->select('attendances.type')
                    ->get();

                $totalSessions = $attendances->count();
                $attended = $totalSessions - $attendances->whereIn('type', ['absent', 'retard'])->count();
                $absences = $attendances->where('type', 'absent')->count();
                $attendanceRate = $totalSessions > 0 ? round(($attended / $totalSessions) * 100) : 100;

                $status = 'average';
                if ($average >= 16 && $attendanceRate >= 90) {
                    $status = 'excellent';
                } elseif ($average >= 14 && $attendanceRate >= 80) {
                    $status = 'good';
                } elseif ($average < 10 || $attendanceRate < 75) {
                    $status = 'at_risk';
                }

                $gradeHistory = DB::table('exam_grades')
                    ->join('exams', 'exam_grades.exam_id', '=', 'exams.id')
                    ->join('courses', 'exams.course_id', '=', 'courses.id')
                    ->where('exam_grades.student_id', $student->id)
                    ->whereIn('exams.course_id', $courseIds)
                    ->whereNotNull('exam_grades.grade')
                    ->select(
                        'courses.name as course',
                        'exam_grades.grade',
                        'exams.type',
                        'exams.exam_date as date'
                    )
                    ->orderBy('exams.exam_date', 'desc')
                    ->limit(10)
                    ->get()
                    ->toArray();

                return [
                    'id' => $student->id,
                    'name' => $user->full_name,
                    'email' => $user->email,
                    'group' => $group?->name ?? 'N/A',
                    'filiere' => $group?->filiere?->name ?? 'N/A',
                    'program' => $group?->program?->name ?? 'N/A',
                    'photo' => $user->avatar ? asset('storage/' . $user->avatar) : null,
                    'courses' => $courses,
                    'average' => round($average, 2),
                    'attendance' => [
                        'total_sessions' => $totalSessions,
                        'attended' => $attended,
                        'absences' => $absences,
                        'rate' => $attendanceRate,
                    ],
                    'grades' => $gradeHistory,
                    'status' => $status,
                ];
            });

        if ($request->has('search')) {
            $search = strtolower($request->search);
            $students = $students->filter(function ($student) use ($search) {
                return str_contains(strtolower($student['name']), $search) ||
                       str_contains(strtolower($student['email']), $search);
            });
        }

        if ($request->has('course')) {
            $course = $request->course;
            $students = $students->filter(function ($student) use ($course) {
                return in_array($course, $student['courses']);
            });
        }

        if ($request->has('group')) {
            $group = $request->group;
            $students = $students->filter(function ($student) use ($group) {
                return $student['group'] === $group;
            });
        }

        return response()->json([
            'data' => $students->values()
        ]);
    }

    public function stats(Request $request): JsonResponse
    {
        $professor = $request->user()->professor;

        if (!$professor) {
            return response()->json(['data' => null], 404);
        }

        $courseIds = Course::where('professor_id', $professor->id)->pluck('id');

        // ✅ CORRECTION ICI AUSSI
        $students = Student::whereHas('groups', function ($query) use ($courseIds) {
            $query->whereHas('courses', function($q) use ($courseIds) {
                $q->whereIn('courses.id', $courseIds);
            });
        })->get();

        $totalStudents = $students->count();
        $excellent = 0;
        $good = 0;
        $average = 0;
        $atRisk = 0;

        foreach ($students as $student) {
            $grades = DB::table('exam_grades')
                ->join('exams', 'exam_grades.exam_id', '=', 'exams.id')
                ->where('exam_grades.student_id', $student->id)
                ->whereIn('exams.course_id', $courseIds)
                ->whereNotNull('exam_grades.grade')
                ->pluck('exam_grades.grade');

            $avg = $grades->count() > 0 ? $grades->avg() : 0;

            $attendances = DB::table('attendances')
                ->where('attendances.student_id', $student->id)
                ->get();

            $totalSessions = $attendances->count();
            $attended = $totalSessions - $attendances->whereIn('type', ['absent', 'retard'])->count();
            $rate = $totalSessions > 0 ? ($attended / $totalSessions) * 100 : 100;

            if ($avg >= 16 && $rate >= 90) {
                $excellent++;
            } elseif ($avg >= 14 && $rate >= 80) {
                $good++;
            } elseif ($avg < 10 || $rate < 75) {
                $atRisk++;
            } else {
                $average++;
            }
        }

        return response()->json([
            'data' => [
                'total' => $totalStudents,
                'excellent' => $excellent,
                'good' => $good,
                'average' => $average,
                'at_risk' => $atRisk,
            ]
        ]);
    }

    public function myCourses(Request $request): JsonResponse
    {
        $professor = $request->user()->professor;

        if (!$professor) {
            return response()->json(['data' => []], 404);
        }

        $courses = Course::where('professor_id', $professor->id)
            ->select('id', 'name')
            ->get()
            ->pluck('name')
            ->toArray();

        return response()->json(['data' => $courses]);
    }

    public function myGroups(Request $request): JsonResponse
    {
        $professor = $request->user()->professor;

        if (!$professor) {
            return response()->json(['data' => []], 404);
        }

        $groups = Course::where('professor_id', $professor->id)
            ->with('group:id,name')
            ->get()
            ->pluck('group.name')
            ->unique()
            ->values()
            ->toArray();

        return response()->json(['data' => $groups]);
    }
}