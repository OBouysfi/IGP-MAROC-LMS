<?php

namespace App\Http\Controllers\Api\Student;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ProfessorDocument;

class DocumentController extends Controller
{
    public function index(Request $request)
    {
        try {
            $student = $request->user()->student;
            
            if (!$student) {
                return response()->json(['message' => 'Student profile not found'], 404);
            }

            $documents = ProfessorDocument::whereHas('course', function($query) use ($student) {
                $query->where('group_id', $student->group_id);
            })
            ->where('shared_with_students', true)
            ->with(['course', 'professor.user'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function($doc) {
                $isNew = $doc->created_at->diffInDays(now()) <= 7;
                
                return [
                    'id' => $doc->id,
                    'name' => $doc->name,
                    'type' => $doc->file_type,
                    'size' => $this->formatFileSize($doc->file_size),
                    'course' => $doc->course->name ?? 'N/A',
                    'course_code' => $doc->course->code ?? 'N/A',
                    'professor' => optional($doc->professor)->user->name ?? 'N/A',
                    'category' => $doc->category,
                    'uploaded_at' => $doc->created_at->format('Y-m-d'),
                    'downloads' => $doc->downloads,
                    'is_new' => $isNew,
                    'file_path' => $doc->file_path,
                ];
            });

            return response()->json($documents);
        } catch (\Exception $e) {
            \Log::error('Student documents error: ' . $e->getMessage());
            return response()->json(['message' => 'Error fetching documents', 'error' => $e->getMessage()], 500);
        }
    }

    public function download(Request $request, $id)
    {
        try {
            $student = $request->user()->student;
            
            if (!$student) {
                return response()->json(['message' => 'Student profile not found'], 404);
            }

            $document = ProfessorDocument::whereHas('course', function($query) use ($student) {
                $query->where('group_id', $student->group_id);
            })
            ->where('id', $id)
            ->where('shared_with_students', true)
            ->firstOrFail();

            $document->increment('downloads');

            $filePath = storage_path('app/' . $document->file_path);
            
            if (!file_exists($filePath)) {
                return response()->json(['message' => 'File not found'], 404);
            }

            return response()->download($filePath, $document->name);
        } catch (\Exception $e) {
            \Log::error('Student document download error: ' . $e->getMessage());
            return response()->json(['message' => 'Error downloading document', 'error' => $e->getMessage()], 500);
        }
    }

    private function formatFileSize($bytes)
    {
        if ($bytes >= 1073741824) {
            return number_format($bytes / 1073741824, 2) . ' GB';
        } elseif ($bytes >= 1048576) {
            return number_format($bytes / 1048576, 2) . ' MB';
        } elseif ($bytes >= 1024) {
            return number_format($bytes / 1024, 2) . ' KB';
        } else {
            return $bytes . ' B';
        }
    }
}