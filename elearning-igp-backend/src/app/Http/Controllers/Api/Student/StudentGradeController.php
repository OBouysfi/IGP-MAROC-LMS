<?php

namespace App\Http\Controllers\Api\Student;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Grade;
use App\Models\Exam;

class StudentGradeController extends Controller
{
    public function index(Request $request)
    {
        try {
            $student = $request->user()->student;
            
            if (!$student) {
                return response()->json(['message' => 'Student profile not found'], 404);
            }

            $grades = Grade::where('student_id', $student->user_id)
                ->with(['exam.course.professor.user', 'exam.group'])
                ->get()
                ->map(function($gradeRecord) {
                    $exam = $gradeRecord->exam;
                    return [
                        'id' => $gradeRecord->id,
                        'course' => $exam->course->name ?? 'N/A',
                        'course_code' => $exam->course->code ?? 'N/A',
                        'exam_type' => $exam->type,
                        'exam_name' => $exam->type ?? 'Examen',
                        'grade' => $gradeRecord->grade,
                        'max_grade' => 20,
                        'coefficient' => $exam->course->credits ?? 1,
                        'date' => $exam->date->format('Y-m-d'),
                        'comment' => $gradeRecord->comment ?? '',
                        'professor' => optional($exam->course->professor)->user->name ?? 'N/A',
                    ];
                });

            return response()->json($grades);
        } catch (\Exception $e) {
            \Log::error('Student grades error: ' . $e->getMessage());
            return response()->json(['message' => 'Error fetching grades', 'error' => $e->getMessage()], 500);
        }
    }

    public function summary(Request $request)
    {
        try {
            $student = $request->user()->student;
            
            if (!$student) {
                return response()->json(['message' => 'Student profile not found'], 404);
            }

            $grades = Grade::where('student_id', $student->user_id)
                ->with(['exam.course'])
                ->get();

            $courseAverages = $grades->groupBy(function($grade) {
                return $grade->exam->course_id;
            })->map(function($courseGrades) {
                $course = $courseGrades->first()->exam->course;
                
                $average = $courseGrades->avg('grade');
                
                return [
                    'course' => $course->name,
                    'course_code' => $course->code,
                    'average' => round($average, 2),
                    'grades_count' => $courseGrades->count(),
                    'coefficient' => $course->credits ?? 0,
                    'semester' => $course->semester ?? 'S1',
                ];
            })->values();

            return response()->json($courseAverages);
        } catch (\Exception $e) {
            \Log::error('Student grades summary error: ' . $e->getMessage());
            return response()->json(['message' => 'Error fetching grades summary', 'error' => $e->getMessage()], 500);
        }
    }
}