<?php

namespace App\Http\Controllers\Api\Assistant;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\AbsenceJustification;
use Illuminate\Support\Facades\Storage;

class JustificationController extends Controller
{
    public function index(Request $request)
    {
        try {
            $status = $request->query('status');
            $groupId = $request->query('group_id');
            
            $query = AbsenceJustification::with(['student.student.group', 'reviewer'])
                ->orderBy('created_at', 'desc');
            
            if ($status) {
                $query->where('status', $status);
            }
            
            if ($groupId) {
                $query->whereHas('student.student', function($q) use ($groupId) {
                    $q->where('group_id', $groupId);
                });
            }
            
            $justifications = $query->get()->map(function($justif) {
                return [
                    'id' => $justif->id,
                    'student_name' => $justif->student->name ?? 'N/A',
                    'student_email' => $justif->student->email ?? 'N/A',
                    'group' => optional($justif->student->student)->group->name ?? 'N/A',
                    'absence_date' => $justif->absence_date->format('Y-m-d'),
                    'absence_course' => $justif->absence_course,
                    'reason' => $justif->reason,
                    'document_name' => $justif->document_name,
                    'document_url' => $justif->document_path,
                    'submitted_at' => $justif->created_at->toISOString(),
                    'status' => $justif->status,
                    'reviewed_by' => optional($justif->reviewer)->name,
                    'reviewed_at' => $justif->reviewed_at ? $justif->reviewed_at->toISOString() : null,
                    'comment' => $justif->review_comment ?? '',
                ];
            });
            
            return response()->json($justifications);
        } catch (\Exception $e) {
            \Log::error('Assistant justifications error: ' . $e->getMessage());
            return response()->json(['message' => 'Error fetching justifications', 'error' => $e->getMessage()], 500);
        }
    }
    
    public function approve(Request $request, $id)
    {
        try {
            $request->validate([
                'comment' => 'nullable|string|max:500',
            ]);
            
            $justification = AbsenceJustification::findOrFail($id);
            
            $justification->update([
                'status' => 'approved',
                'reviewed_by' => $request->user()->id,
                'reviewed_at' => now(),
                'review_comment' => $request->comment,
            ]);
            
            // Update attendance status to 'excused' if attendance exists
            if ($justification->attendance_id) {
                $justification->attendance()->update(['status' => 'excused']);
            }
            
            return response()->json(['message' => 'Justification approved successfully']);
        } catch (\Exception $e) {
            \Log::error('Assistant approve justification error: ' . $e->getMessage());
            return response()->json(['message' => 'Error approving justification', 'error' => $e->getMessage()], 500);
        }
    }
    
    public function reject(Request $request, $id)
    {
        try {
            $request->validate([
                'comment' => 'required|string|max:500',
            ]);
            
            $justification = AbsenceJustification::findOrFail($id);
            
            $justification->update([
                'status' => 'rejected',
                'reviewed_by' => $request->user()->id,
                'reviewed_at' => now(),
                'review_comment' => $request->comment,
            ]);
            
            return response()->json(['message' => 'Justification rejected successfully']);
        } catch (\Exception $e) {
            \Log::error('Assistant reject justification error: ' . $e->getMessage());
            return response()->json(['message' => 'Error rejecting justification', 'error' => $e->getMessage()], 500);
        }
    }
    
    public function download($id)
    {
        try {
            $justification = AbsenceJustification::findOrFail($id);
            
            if (!Storage::exists($justification->document_path)) {
                return response()->json(['message' => 'Document not found'], 404);
            }
            
            return Storage::download($justification->document_path, $justification->document_name);
        } catch (\Exception $e) {
            \Log::error('Assistant download justification error: ' . $e->getMessage());
            return response()->json(['message' => 'Error downloading document', 'error' => $e->getMessage()], 500);
        }
    }
    
    public function getGroups()
    {
        try {
            $groups = \App\Models\Group::select('id', 'name', 'code')->get();
            return response()->json($groups);
        } catch (\Exception $e) {
            \Log::error('Assistant get groups error: ' . $e->getMessage());
            return response()->json(['message' => 'Error fetching groups', 'error' => $e->getMessage()], 500);
        }
    }
}