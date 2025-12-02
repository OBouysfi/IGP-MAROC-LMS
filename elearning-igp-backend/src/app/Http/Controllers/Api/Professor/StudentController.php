<?php

namespace App\Http\Controllers\Api\Professor;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schema;

class StudentController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $professor = $request->user()->professor;

        if (!$professor) {
            return response()->json(['data' => [], 'message' => 'Professor not found'], 404);
        }

        $courses = Course::where('professor_id', $professor->id)->get();
        $courseIds = $courses->pluck('id');
        $groupIds = $courses->pluck('group_id')->filter()->unique();

        $studentsQuery = Student::with(['user', 'groups', 'filiere', 'program']);
        
        if ($groupIds->isNotEmpty()) {
            $studentsQuery->whereHas('groups', function($q) use ($groupIds) {
                $q->whereIn('groups.id', $groupIds);
            });
        }

        $students = $studentsQuery->get();

        $students = $students->map(function ($student) use ($courseIds) {
            $user = $student->user;
            $group = $student->groups->first();
            
            $courses = Course::whereIn('id', $courseIds)
                ->where('group_id', $group?->id)
                ->pluck('name')
                ->toArray();

            $average = 0;
            $gradeHistory = [];
            
            if (Schema::hasTable('exam_grades') && Schema::hasTable('exams')) {
                $grades = DB::table('exam_grades')
                    ->join('exams', 'exam_grades.exam_id', '=', 'exams.id')
                    ->where('exam_grades.student_id', $student->id)
                    ->whereIn('exams.course_id', $courseIds)
                    ->whereNotNull('exam_grades.grade')
                    ->pluck('exam_grades.grade');

                $average = $grades->count() > 0 ? $grades->avg() : 0;

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
            }

            $attendances = DB::table('attendances')
                ->where('student_id', $student->id)
                ->get();

            $totalSessions = $attendances->count();
            $attended = $attendances->where('type', 'present')->count();
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

            return [
                'id' => $student->id,
                'name' => $user->full_name,
                'email' => $user->email,
                'group' => $group?->name ?? 'N/A',
                'filiere' => $student->filiere?->name ?? 'N/A',
                'program' => $student->program?->name ?? 'N/A',
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

        $courses = Course::where('professor_id', $professor->id)->get();
        $courseIds = $courses->pluck('id');
        $groupIds = $courses->pluck('group_id')->filter()->unique();

        $studentsQuery = Student::query();
        
        if ($groupIds->isNotEmpty()) {
            $studentsQuery->whereHas('groups', function($q) use ($groupIds) {
                $q->whereIn('groups.id', $groupIds);
            });
        }

        $students = $studentsQuery->get();

        $totalStudents = $students->count();
        $excellent = 0;
        $good = 0;
        $average = 0;
        $atRisk = 0;

        foreach ($students as $student) {
            $avg = 0;
            
            if (Schema::hasTable('exam_grades') && Schema::hasTable('exams')) {
                $grades = DB::table('exam_grades')
                    ->join('exams', 'exam_grades.exam_id', '=', 'exams.id')
                    ->where('exam_grades.student_id', $student->id)
                    ->whereIn('exams.course_id', $courseIds)
                    ->whereNotNull('exam_grades.grade')
                    ->pluck('exam_grades.grade');

                $avg = $grades->count() > 0 ? $grades->avg() : 0;
            }

            $attendances = DB::table('attendances')
                ->where('student_id', $student->id)
                ->get();

            $totalSessions = $attendances->count();
            $attended = $attendances->where('type', 'present')->count();
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
            ->pluck('name')
            ->unique()
            ->values()
            ->toArray();

        return response()->json(['data' => $courses]);
    }

   public function myGroups(Request $request): JsonResponse
    {
        $professor = $request->user()->professor;

        if (!$professor) {
            return response()->json(['data' => []], 404);
        }

        $groups = Student::with('groups')
            ->get()
            ->pluck('groups')
            ->flatten()
            ->pluck('name')
            ->unique()
            ->values()
            ->toArray();

        return response()->json(['data' => $groups]);
    }
}