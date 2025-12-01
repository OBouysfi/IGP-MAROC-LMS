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
            ->join('filieres', 'courses.filiere_id', '=', 'filieres.id')
            ->select('filieres.id', 'filieres.name')
            ->selectRaw('ROUND(AVG(exams.average), 2) as avg_grade')
            ->selectRaw('ROUND(AVG(exams.pass_rate), 2) as avg_pass_rate')
            ->selectRaw('COUNT(DISTINCT exams.id) as total_exams')
            ->whereNotNull('exams.average')
            ->groupBy('filieres.id', 'filieres.name')
            ->get();

        return response()->json(['data' => $filieres]);
    }

    public function store(ExamRequest $request): JsonResponse
    {
        $data = $request->validated();
        
        // Get total students from group
        $group = \App\Models\Group::withCount('students')->find($data['group_id']);
        $data['total_students'] = $group->students_count ?? 0;
        
        // Parse duration to minutes
        $data['duration'] = $request->duration; // Garde le texte "2h00"
        $data['duration_minutes'] = $this->parseDuration($data['duration']); // Stocke aussi les minutes
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
        $data = $request->validated();
        
        // Parse duration to minutes if duration is updated
        if (isset($data['duration'])) {
            $data['duration_minutes'] = $this->parseDuration($data['duration']);
        }
        
        $exam->update($data);
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

    /**
     * Parse duration string to minutes
     * Formats: "2h00", "2h30", "1h", "90min", "120 min"
     */
    private function parseDuration(string $duration): int
    {
        $duration = strtolower(trim($duration));
        
        // Pattern: "2h00", "2h30", "1h"
        if (preg_match('/(\d+)h(\d+)?/', $duration, $matches)) {
            $hours = (int) $matches[1];
            $minutes = isset($matches[2]) ? (int) $matches[2] : 0;
            return ($hours * 60) + $minutes;
        }
        
        // Pattern: "90min", "120 min"
        if (preg_match('/(\d+)\s*min/', $duration, $matches)) {
            return (int) $matches[1];
        }
        
        // Default: 2 hours
        return 120;
    }
}