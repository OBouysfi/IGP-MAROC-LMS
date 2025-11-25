<?php

namespace App\Http\Controllers\Api\Professor;

use App\Http\Controllers\Controller;
use App\Models\Exam;
use App\Models\ExamGrade;
use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class GradeController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $professor = $request->user()->professor;

        if (!$professor) {
            return response()->json(['data' => []], 404);
        }

        $courseIds = Course::where('professor_id', $professor->id)->pluck('id');

        $exams = Exam::with(['course', 'group'])
            ->whereIn('course_id', $courseIds)
            ->get()
            ->map(function ($exam) {
                $totalStudents = $exam->group->students()->count();
                $gradedStudents = ExamGrade::where('exam_id', $exam->id)
                    ->whereNotNull('grade')
                    ->count();

                $students = $exam->group->students()
                    ->with('user')
                    ->get()
                    ->map(function ($student) use ($exam) {
                        $grade = ExamGrade::where('exam_id', $exam->id)
                            ->where('student_id', $student->id)
                            ->first();

                        return [
                            'id' => $student->id,
                            'student_name' => $student->user->full_name,
                            'student_email' => $student->user->email,
                            'grade' => $grade->grade ?? null,
                            'comment' => $grade->comment ?? '',
                            'status' => $grade && $grade->grade !== null ? 'saved' : 'empty',
                        ];
                    });

                return [
                    'id' => $exam->id,
                    'course' => $exam->course->name,
                    'course_code' => $exam->course->code,
                    'group' => $exam->group->name,
                    'type' => $exam->type,
                    'date' => $exam->exam_date,
                    'max_grade' => 20,
                    'coefficient' => $exam->coefficient ?? 1,
                    'deadline' => $exam->deadline ?? now()->addDays(10)->format('Y-m-d'),
                    'status' => $exam->status,
                    'total_students' => $totalStudents,
                    'graded_students' => $gradedStudents,
                    'students' => $students,
                ];
            });

        // Apply filters
        if ($request->has('course')) {
            $course = $request->course;
            $exams = $exams->filter(function ($exam) use ($course) {
                return $exam['course'] === $course;
            });
        }

        if ($request->has('status')) {
            $status = $request->status;
            $exams = $exams->filter(function ($exam) use ($status) {
                return $exam['status'] === $status;
            });
        }

        return response()->json(['data' => $exams->values()]);
    }

    public function stats(Request $request): JsonResponse
    {
        $professor = $request->user()->professor;

        if (!$professor) {
            return response()->json(['data' => null], 404);
        }

        $courseIds = Course::where('professor_id', $professor->id)->pluck('id');

        $exams = Exam::whereIn('course_id', $courseIds)->get();

        return response()->json([
            'data' => [
                'total_exams' => $exams->count(),
                'pending' => $exams->where('status', 'en_attente')->count(),
                'in_progress' => $exams->where('status', 'en_cours')->count(),
                'completed' => $exams->whereIn('status', ['terminé', 'validé'])->count(),
            ]
        ]);
    }

    public function saveGrades(Request $request, $examId): JsonResponse
    {
        $request->validate([
            'grades' => 'required|array',
            'grades.*.student_id' => 'required|exists:students,id',
            'grades.*.grade' => 'nullable|numeric|min:0|max:20',
            'grades.*.comment' => 'nullable|string|max:500',
        ]);

        DB::beginTransaction();
        try {
            foreach ($request->grades as $gradeData) {
                ExamGrade::updateOrCreate(
                    [
                        'exam_id' => $examId,
                        'student_id' => $gradeData['student_id'],
                    ],
                    [
                        'grade' => $gradeData['grade'],
                        'comment' => $gradeData['comment'] ?? null,
                    ]
                );
            }

            // Update exam status
            $exam = Exam::findOrFail($examId);
            $totalStudents = $exam->group->students()->count();
            $gradedStudents = ExamGrade::where('exam_id', $examId)
                ->whereNotNull('grade')
                ->count();

            if ($gradedStudents > 0 && $gradedStudents < $totalStudents) {
                $exam->update(['status' => 'en_cours']);
            } elseif ($gradedStudents === $totalStudents) {
                $exam->update(['status' => 'terminé']);
            }

            DB::commit();

            return response()->json([
                'message' => 'Notes enregistrées avec succès',
                'data' => [
                    'graded_students' => $gradedStudents,
                    'total_students' => $totalStudents,
                ]
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Erreur lors de l\'enregistrement'], 500);
        }
    }

    public function submitGrades(Request $request, $examId): JsonResponse
    {
        $exam = Exam::findOrFail($examId);
        $totalStudents = $exam->group->students()->count();
        $gradedStudents = ExamGrade::where('exam_id', $examId)
            ->whereNotNull('grade')
            ->count();

        if ($gradedStudents !== $totalStudents) {
            return response()->json([
                'message' => 'Toutes les notes doivent être saisies avant la soumission'
            ], 400);
        }

        $exam->update(['status' => 'validé']);

        return response()->json([
            'message' => 'Notes soumises pour validation avec succès'
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
}