<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Http\Requests\Admin\CourseRequest;
use App\Http\Resources\Admin\CourseResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CourseController extends Controller
{
    public function index(Request $request)
    {
        $query = Course::with('professor.user');

        if ($request->program) {
            $query->where('program', $request->program);
        }
        if ($request->filiere) {
            $query->where('filiere', $request->filiere);
        }
        if ($request->status) {
            $query->where('status', $request->status);
        }

        if ($request->search) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('code', 'like', "%{$search}%")
                  ->orWhereHas('professor.user', function($q) use ($search) {
                      $q->where('first_name', 'like', "%{$search}%")
                        ->orWhere('last_name', 'like', "%{$search}%");
                  });
            });
        }

        $courses = $query->latest()->get();

        return response()->json([
            'success' => true,
            'data' => CourseResource::collection($courses)
        ]);
    }

    public function stats()
    {
        $totalCourses = Course::count();
        $activeCourses = Course::where('status', 'En cours')->count();
        $completedCourses = Course::where('status', 'Terminé')->count();
        $totalHours = Course::sum('hours_total');

        return response()->json([
            'success' => true,
            'data' => [
                'total_courses' => $totalCourses,
                'active_courses' => $activeCourses,
                'completed_courses' => $completedCourses,
                'total_hours' => $totalHours,
            ]
        ]);
    }

    public function show($id)
    {
        $course = Course::with('professor.user')->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => new CourseResource($course)
        ]);
    }

    public function store(CourseRequest $request)
    {
        try {
            DB::beginTransaction();

            // ✅ Gérer professor_id vide
            $data = $request->all();
            if (empty($data['professor_id'])) {
                $data['professor_id'] = null;
            }

            $course = Course::create($data);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Cours créé avec succès',
                'data' => new CourseResource($course->load('professor.user'))
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Erreur création cours: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la création du cours',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    public function update(CourseRequest $request, $id)
    {
        try {
            DB::beginTransaction();

            $course = Course::findOrFail($id);
            $course->update($request->all());

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Cours mis à jour avec succès',
                'data' => new CourseResource($course->load('professor.user'))
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la mise à jour du cours',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            DB::beginTransaction();

            $course = Course::findOrFail($id);
            $course->delete();

            DB::commit();
            
            return response()->json([
                'success' => true,
                'message' => 'Cours supprimé avec succès'
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la suppression du cours',
                'error' => $e->getMessage()
            ], 500);
        }
    }
  
}