<?php

namespace App\Http\Controllers\Api\Professor;

use App\Http\Controllers\Controller;
use App\Http\Requests\Professor\CourseResourceRequest;
use App\Http\Resources\Professor\ProfessorCourseResource;
use App\Http\Resources\Professor\CourseResourceResource;
use App\Models\Course;
use App\Models\CourseResource;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;

class CourseController extends Controller
{
    public function index(Request $request): JsonResponse
    {
         \Log::info('User ID: ' . $request->user()->id);
    \Log::info('Professor: ' . ($request->user()->professor ? 'EXISTS' : 'NULL'));
        $professor = $request->user()->professor;

        if (!$professor) {
            return response()->json(['message' => 'Professeur non trouvé'], 404);
        }

        $courses = Course::where('professor_id', $professor->id)
            ->with(['group.students', 'filiere', 'program', 'schedules', 'resources'])
            ->when($request->search, function($query, $search) {
                $query->where(function($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('code', 'like', "%{$search}%")
                      ->orWhereHas('group', fn($q) => $q->where('name', 'like', "%{$search}%"));
                });
            })
            ->get();

        return response()->json([
            'data' => ProfessorCourseResource::collection($courses)
        ]);
    }

    public function show($id): JsonResponse
    {
        $course = Course::with(['group.students', 'filiere', 'program', 'schedules', 'resources'])
            ->findOrFail($id);

        return response()->json([
            'data' => new ProfessorCourseResource($course)
        ]);
    }

    public function uploadResource(CourseResourceRequest $request, $courseId): JsonResponse
    {
        $course = Course::findOrFail($courseId);

        $data = [
            'course_id' => $course->id,
            'name' => $request->name,
            'type' => $request->type,
            'description' => $request->description,
        ];

        if ($request->type === 'link') {
            $data['url'] = $request->url;
        } else {
            $file = $request->file('file');
            $filename = time() . '_' . $file->getClientOriginalName();
            $path = $file->storeAs('course-resources', $filename, 'public');
            
            $data['file_path'] = $path;
            $data['size'] = $file->getSize();
        }

        $resource = CourseResource::create($data);

        return response()->json([
            'message' => 'Ressource ajoutée avec succès',
            'data' => new CourseResourceResource($resource)
        ], 201);
    }

    public function deleteResource($courseId, $resourceId): JsonResponse
    {
        $resource = CourseResource::where('course_id', $courseId)
            ->findOrFail($resourceId);

        if ($resource->file_path) {
            Storage::disk('public')->delete($resource->file_path);
        }

        $resource->delete();

        return response()->json(['message' => 'Ressource supprimée avec succès']);
    }

    public function stats(Request $request): JsonResponse
    {
        $professor = $request->user()->professor;

        if (!$professor) {
            return response()->json(['message' => 'Professeur non trouvé'], 404);
        }

        $courses = Course::where('professor_id', $professor->id)->get();

        $totalCourses = $courses->count();
        $totalStudents = $courses->sum(fn($c) => $c->group?->students_count ?? 0);
        $totalHours = $courses->sum(fn($c) => $c->schedules()->where('date', '<', now())->count() * 2);
        $totalResources = CourseResource::whereIn('course_id', $courses->pluck('id'))->count();

        return response()->json([
            'data' => [
                'total_courses' => $totalCourses,
                'total_students' => $totalStudents,
                'completed_hours' => $totalHours,
                'total_resources' => $totalResources,
            ]
        ]);
    }
}