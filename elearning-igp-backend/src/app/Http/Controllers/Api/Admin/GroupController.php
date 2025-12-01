<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\GroupRequest;
use App\Http\Resources\Admin\GroupResource;
use App\Models\Group;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class GroupController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Group::with(['program', 'filiere'])
            ->withCount(['students', 'courses']);

        if ($request->filled('program_id')) {
            $query->where('program_id', $request->program_id);
        }

        if ($request->filled('filiere_id')) {
            $query->where('filiere_id', $request->filiere_id);
        }

        if ($request->filled('level')) {
            $query->where('level', $request->level);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('code', 'like', "%{$search}%");
            });
        }

        $groups = $query->orderBy('name')->get();

        return response()->json([
            'data' => GroupResource::collection($groups),
        ]);
    }

    public function stats(): JsonResponse
    {
        $totalStudents = \DB::table('group_student')->count();
        $totalGroups = Group::count();
        $avgStudents = $totalGroups > 0 ? round($totalStudents / $totalGroups) : 0;

        $stats = [
            'total_groups' => $totalGroups,
            'active_groups' => $totalGroups,
            'avg_students' => $avgStudents,
            'total_students' => $totalStudents,
        ];

        return response()->json($stats);
    }

    public function store(GroupRequest $request): JsonResponse
    {
        $data = $request->validated();
        
        $groupData = [
            'name' => $data['name'],
            'code' => $data['code'],
            'program_id' => $data['program_id'],
            'filiere_id' => $data['filiere_id'],
            'level' => $data['level'],
            'max_students' => $data['max_students'],
            'delegate' => $data['delegate'] ?? null,
            'delegate_email' => $data['delegate_email'] ?? null,
            'schedule' => $data['schedule'] ?? [],
        ];

        $group = Group::create($groupData);

        if (isset($data['student_ids'])) {
            $group->students()->sync($data['student_ids']);
        }

        if (isset($data['course_ids'])) {
            $coursesData = collect($data['course_ids'])->mapWithKeys(fn($id) => [
                $id => ['hours_week' => 0]
            ]);
            $group->courses()->sync($coursesData);
        }

        $group->load(['program', 'filiere', 'students', 'courses']);
        $group->loadCount(['students', 'courses']);

        return response()->json(['data' => new GroupResource($group)], 201);
    }

    public function show($id): JsonResponse
    {
        $group = Group::with(['program', 'filiere', 'students.user', 'courses'])
            ->withCount(['students', 'courses'])
            ->findOrFail($id);

        return response()->json(['data' => new GroupResource($group)]);
    }

    public function update(GroupRequest $request, $id): JsonResponse
    {
        $group = Group::findOrFail($id);
        $data = $request->validated();
        
        $groupData = [
            'name' => $data['name'],
            'code' => $data['code'],
            'program_id' => $data['program_id'],
            'filiere_id' => $data['filiere_id'],
            'level' => $data['level'],
            'max_students' => $data['max_students'],
            'delegate' => $data['delegate'] ?? null,
            'delegate_email' => $data['delegate_email'] ?? null,
            'schedule' => $data['schedule'] ?? [],
        ];

        $group->update($groupData);

        if (isset($data['student_ids'])) {
            $group->students()->sync($data['student_ids']);
        }

        if (isset($data['course_ids'])) {
            $coursesData = collect($data['course_ids'])->mapWithKeys(fn($id) => [
                $id => ['hours_week' => 0]
            ]);
            $group->courses()->sync($coursesData);
        }

        $group->load(['program', 'filiere', 'students', 'courses']);
        $group->loadCount(['students', 'courses']);

        return response()->json(['data' => new GroupResource($group)]);
    }

    public function destroy($id): JsonResponse
    {
        $group = Group::findOrFail($id);
        $group->delete();
        return response()->json(null, 204);
    }
}