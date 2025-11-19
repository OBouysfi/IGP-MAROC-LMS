<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ProgramRequest;
use App\Http\Resources\Admin\ProgramResource;
use App\Models\Program;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ProgramController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Program::query();

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('code', 'like', "%{$search}%");
            });
        }

        $programs = $query->orderBy('name')->get();

        return response()->json([
            'data' => ProgramResource::collection($programs),
        ]);
    }

    public function stats(): JsonResponse
    {
        $totalStudents = \DB::table('students')->count();
        $totalRevenue = \DB::table('students')
            ->join('programs', 'students.program', '=', 'programs.name')
            ->sum(\DB::raw('programs.inscription_fee + (programs.monthly_fee * 10)'));

        $stats = [
            'total_programs' => Program::count(),
            'active_programs' => Program::where('is_active', true)->count(),
            'total_students' => $totalStudents,
            'total_revenue' => $totalRevenue,
        ];

        return response()->json($stats);
    }

    public function store(ProgramRequest $request): JsonResponse
    {
        $program = Program::create($request->validated());
        return response()->json(['data' => new ProgramResource($program)], 201);
    }

    public function show($id): JsonResponse
    {
        $program = Program::findOrFail($id);
        return response()->json(['data' => new ProgramResource($program)]);
    }

    public function update(ProgramRequest $request, $id): JsonResponse
    {
        $program = Program::findOrFail($id);
        $program->update($request->validated());
        return response()->json(['data' => new ProgramResource($program)]);
    }

    public function destroy($id): JsonResponse
    {
        $program = Program::findOrFail($id);
        $program->delete();
        return response()->json(null, 204);
    }
}