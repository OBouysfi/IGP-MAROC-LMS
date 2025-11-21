<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ExamRequest;
use App\Http\Requests\Admin\GradeRequest;
use App\Http\Resources\Admin\ExamResource;
use App\Models\Exam;
use App\Models\Grade;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ExamController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Exam::with(['course', 'group', 'professor.user']);

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('filiere')) {
            $query->whereHas('course', fn($q) => $q->where('filiere', $request->filiere));
        }

        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->whereHas('course', fn($q) => $q->where('name', 'like', "%{$search}%"))
                  ->orWhereHas('professor.user', fn($q) => $q->where('name', 'like', "%{$search}%"))
                  ->orWhereHas('group', fn($q) => $q->where('name', 'like', "%{$search}%"));
            });
        }

        $exams = $query->orderBy('date', 'desc')->get();

        return response()->json([
            'data' => ExamResource::collection($exams),
        ]);
    }

    public function stats(): JsonResponse
    {
        $stats = [
            'total_exams' => Exam::count(),
            'upcoming_exams' => Exam::where('date', '>=', now())->where('status', 'planifié')->count(),
            'pending_grades' => Exam::where('status', 'notes_saisies')->count(),
            'validated_grades' => Exam::where('status', 'validé')->count(),
            'global_average' => Exam::whereNotNull('average')->avg('average'),
            'global_pass_rate' => Exam::whereNotNull('pass_rate')->avg('pass_rate'),
        ];

        return response()->json($stats);
    }

    public function statsByFiliere(): JsonResponse
    {
        $filieres = \DB::table('exams')
            ->join('courses', 'exams.course_id', '=', 'courses.id')
            ->select('courses.filiere')
            ->selectRaw('AVG(exams.average) as avg_grade')
            ->selectRaw('AVG(exams.pass_rate) as avg_pass_rate')
            ->selectRaw('COUNT(DISTINCT exams.id) as total_exams')
            ->groupBy('courses.filiere')
            ->get();

        return response()->json(['data' => $filieres]);
    }

    public function store(ExamRequest $request): JsonResponse
    {
        $data = $request->validated();
        
        // Get total students from group
        $group = \App\Models\Group::withCount('students')->find($data['group_id']);
        $data['total_students'] = $group->students_count;

        $exam = Exam::create($data);
        $exam->load(['course', 'group', 'professor.user']);

        return response()->json(['data' => new ExamResource($exam)], 201);
    }

    public function show($id): JsonResponse
    {
        $exam = Exam::with(['course', 'group', 'professor.user', 'grades.student'])->findOrFail($id);
        return response()->json(['data' => new ExamResource($exam)]);
    }

    public function update(ExamRequest $request, $id): JsonResponse
    {
        $exam = Exam::findOrFail($id);
        $exam->update($request->validated());
        $exam->load(['course', 'group', 'professor.user']);

        return response()->json(['data' => new ExamResource($exam)]);
    }

    public function destroy($id): JsonResponse
    {
        $exam = Exam::findOrFail($id);
        $exam->delete();
        return response()->json(null, 204);
    }

    public function saveGrades(GradeRequest $request, $id): JsonResponse
    {
        $exam = Exam::findOrFail($id);

        foreach ($request->grades as $gradeData) {
            Grade::updateOrCreate(
                [
                    'exam_id' => $exam->id,
                    'student_id' => $gradeData['student_id'],
                ],
                [
                    'grade' => $gradeData['grade'],
                    'status' => $gradeData['status'] ?? 'validé',
                    'comment' => $gradeData['comment'] ?? null,
                ]
            );
        }

        $exam->calculateStats();
        $exam->status = 'notes_saisies';
        $exam->save();

        $exam->load(['course', 'group', 'professor.user', 'grades.student']);

        return response()->json(['data' => new ExamResource($exam)]);
    }

    public function validateGrades($id): JsonResponse
    {
        $exam = Exam::findOrFail($id);
        $exam->status = 'validé';
        $exam->save();

        return response()->json(['data' => new ExamResource($exam)]);
    }
}