<?php

namespace App\Http\Controllers\Api\Student;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\CourseResource;

class ResourceController extends Controller
{
    public function index(Request $request)
    {
        try {
            $student = $request->user()->student;
            
            if (!$student) {
                return response()->json(['message' => 'Student profile not found'], 404);
            }

            $resources = CourseResource::whereHas('course', function($query) use ($student) {
                $query->where('group_id', $student->group_id);
            })
            ->with(['course.professor.user'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function($resource) {
                $isNew = $resource->created_at->diffInDays(now()) <= 7;
                
                return [
                    'id' => $resource->id,
                    'title' => $resource->name,
                    'description' => $resource->description ?? 'Pas de description disponible',
                    'type' => $this->mapResourceType($resource->type),
                    'course' => $resource->course->name ?? 'N/A',
                    'course_code' => $resource->course->code ?? 'N/A',
                    'professor' => optional($resource->course->professor)->user->name ?? 'N/A',
                    'url' => $resource->url ?? '#',
                    'is_external' => !empty($resource->url),
                    'difficulty' => 'intermédiaire',
                    'duration' => $this->calculateDuration($resource->type),
                    'rating' => 4.5,
                    'views' => rand(50, 200),
                    'added_at' => $resource->created_at->format('Y-m-d'),
                    'tags' => $this->generateTags($resource->course->name ?? ''),
                ];
            });

            return response()->json($resources);
        } catch (\Exception $e) {
            \Log::error('Student resources error: ' . $e->getMessage());
            return response()->json(['message' => 'Error fetching resources', 'error' => $e->getMessage()], 500);
        }
    }

    private function mapResourceType($type)
    {
        $typeMap = [
            'pdf' => 'documentation',
            'video' => 'video',
            'document' => 'article',
            'link' => 'tutorial',
        ];
        
        return $typeMap[$type] ?? 'article';
    }

    private function calculateDuration($type)
    {
        $durations = [
            'pdf' => '20 min',
            'video' => '45 min',
            'document' => '15 min',
            'link' => '30 min',
        ];
        
        return $durations[$type] ?? '-';
    }

    private function generateTags($courseName)
    {
        $tags = [];
        
        if (stripos($courseName, 'react') !== false) {
            $tags = ['React', 'Frontend', 'JavaScript'];
        } elseif (stripos($courseName, 'node') !== false) {
            $tags = ['Node.js', 'Backend', 'API'];
        } elseif (stripos($courseName, 'mongodb') !== false || stripos($courseName, 'nosql') !== false) {
            $tags = ['MongoDB', 'NoSQL', 'Database'];
        } elseif (stripos($courseName, 'javascript') !== false) {
            $tags = ['JavaScript', 'ES6', 'Programming'];
        } elseif (stripos($courseName, 'docker') !== false || stripos($courseName, 'devops') !== false) {
            $tags = ['Docker', 'DevOps', 'CI/CD'];
        } else {
            $tags = ['Programming', 'Development', 'Learning'];
        }
        
        return $tags;
    }
}