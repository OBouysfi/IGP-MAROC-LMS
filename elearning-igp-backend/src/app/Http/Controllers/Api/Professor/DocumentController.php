<?php

namespace App\Http\Controllers\Api\Professor;

use App\Http\Controllers\Controller;
use App\Models\ProfessorDocument;
use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class DocumentController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $professor = $request->user()->professor;

        if (!$professor) {
            return response()->json(['data' => []], 404);
        }

        $query = ProfessorDocument::with(['course'])
            ->where('professor_id', $professor->id);

        if ($request->has('course')) {
            $courseName = $request->course;
            $query->whereHas('course', function ($q) use ($courseName) {
                $q->where('name', $courseName);
            });
        }

        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        if ($request->has('type')) {
            $query->where('file_type', $request->type);
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where('name', 'like', "%{$search}%");
        }

        $documents = $query->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($doc) {
                return [
                    'id' => $doc->id,
                    'name' => $doc->name,
                    'type' => $doc->file_type,
                    'size' => $doc->file_size_formatted,
                    'course' => $doc->course->name,
                    'course_code' => $doc->course->code,
                    'category' => $doc->category,
                    'uploaded_at' => $doc->created_at->format('Y-m-d'),
                    'downloads' => $doc->downloads,
                    'shared_with_students' => $doc->shared_with_students,
                    'file_url' => url('storage/' . $doc->file_path),
                ];
            });

        return response()->json(['data' => $documents]);
    }

    public function store(Request $request): JsonResponse
    {
        $professor = $request->user()->professor;

        if (!$professor) {
            return response()->json(['message' => 'Professor not found'], 404);
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'course_id' => 'required|exists:courses,id',
            'category' => 'required|in:cours,tp,examen,correction,ressource',
            'file' => 'required|file|max:204800', // 200MB max
            'shared_with_students' => 'boolean',
        ]);

        $file = $request->file('file');
        $extension = $file->getClientOriginalExtension();
        
        // Determine file type
        $fileType = $this->getFileType($extension);
        
        // Generate unique filename
        $filename = Str::slug($request->name) . '-' . time() . '.' . $extension;
        
        // Store file
        $path = $file->storeAs('professor-documents', $filename, 'public');

        $document = ProfessorDocument::create([
            'professor_id' => $professor->id,
            'course_id' => $request->course_id,
            'name' => $request->name,
            'file_path' => $path,
            'file_type' => $fileType,
            'file_size' => $file->getSize(),
            'category' => $request->category,
            'shared_with_students' => $request->shared_with_students ?? true,
        ]);

        return response()->json([
            'message' => 'Document uploadé avec succès',
            'data' => $document
        ], 201);
    }

    public function stats(Request $request): JsonResponse
    {
        $professor = $request->user()->professor;

        if (!$professor) {
            return response()->json(['data' => null], 404);
        }

        $documents = ProfessorDocument::where('professor_id', $professor->id)->get();

        $totalSize = $documents->sum('file_size');
        $totalSizeFormatted = $this->formatBytes($totalSize);

        return response()->json([
            'data' => [
                'total_documents' => $documents->count(),
                'total_size' => $totalSizeFormatted,
                'shared_documents' => $documents->where('shared_with_students', true)->count(),
                'total_downloads' => $documents->sum('downloads'),
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
            ->get()
            ->map(function ($course) {
                return [
                    'id' => $course->id,
                    'name' => $course->name,
                    'code' => $course->code,
                ];
            });

        return response()->json(['data' => $courses]);
    }

    public function toggleShare(Request $request, $id): JsonResponse
    {
        $document = ProfessorDocument::findOrFail($id);

        if ($document->professor_id !== $request->user()->professor->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $document->update([
            'shared_with_students' => !$document->shared_with_students
        ]);

        return response()->json([
            'message' => 'Statut de partage modifié',
            'data' => $document
        ]);
    }

    public function download(Request $request, $id)
    {
        $document = ProfessorDocument::findOrFail($id);

        if ($document->professor_id !== $request->user()->professor->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $document->increment('downloads');

        if (!Storage::disk('public')->exists($document->file_path)) {
            \Log::error('File not found: ' . $document->file_path);
            return response()->json(['message' => 'File not found'], 404);
        }

        return Storage::disk('public')->download($document->file_path, $document->name);
    }

    public function destroy(Request $request, $id): JsonResponse
    {
        $document = ProfessorDocument::findOrFail($id);

        if ($document->professor_id !== $request->user()->professor->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Delete file from storage
        Storage::disk('public')->delete($document->file_path);

        $document->delete();

        return response()->json([
            'message' => 'Document supprimé avec succès'
        ]);
    }

    private function getFileType($extension): string
    {
        $types = [
            'pdf' => 'pdf',
            'doc' => 'docx',
            'docx' => 'docx',
            'ppt' => 'pptx',
            'pptx' => 'pptx',
            'xls' => 'xlsx',
            'xlsx' => 'xlsx',
            'mp4' => 'video',
            'avi' => 'video',
            'mov' => 'video',
            'jpg' => 'image',
            'jpeg' => 'image',
            'png' => 'image',
            'gif' => 'image',
            'zip' => 'zip',
            'rar' => 'zip',
        ];

        return $types[strtolower($extension)] ?? 'file';
    }

    private function formatBytes($bytes): string
    {
        if ($bytes >= 1073741824) {
            return number_format($bytes / 1073741824, 2) . ' GB';
        } elseif ($bytes >= 1048576) {
            return number_format($bytes / 1048576, 2) . ' MB';
        } elseif ($bytes >= 1024) {
            return number_format($bytes / 1024, 2) . ' KB';
        } else {
            return $bytes . ' bytes';
        }
    }
}