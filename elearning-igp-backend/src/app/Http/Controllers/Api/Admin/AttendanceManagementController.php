<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\AttendanceLog;
use App\Models\Professor;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class AttendanceManagementController extends Controller
{
    // Liste présences par professeur
    public function professorAttendance(Request $request, $professorId): JsonResponse
    {
        $logs = AttendanceLog::with(['course', 'group'])
            ->where('professor_id', $professorId)
            ->whereBetween('date', [
                $request->get('start_date', now()->startOfMonth()),
                $request->get('end_date', now()->endOfMonth()),
            ])
            ->orderBy('date', 'desc')
            ->get();

        $stats = [
            'total_hours_worked' => $logs->sum('hours_worked'),
            'total_hours_scheduled' => $logs->sum('hours_scheduled'),
            'total_sessions' => $logs->count(),
            'validated_sessions' => $logs->where('validated', true)->count(),
            'pending_validation' => $logs->where('validated', false)->count(),
        ];

        return response()->json([
            'data' => $logs,
            'stats' => $stats,
        ]);
    }

    // Valider présences
    public function validateAttendance(Request $request): JsonResponse
    {
        $request->validate([
            'log_ids' => 'required|array',
            'log_ids.*' => 'exists:attendance_logs,id',
        ]);

        AttendanceLog::whereIn('id', $request->log_ids)->update([
            'validated' => true,
            'validated_by' => $request->user()->id,
            'validated_at' => now(),
        ]);

        return response()->json(['message' => 'Présences validées']);
    }

    // Marquer absent
    public function markAbsent(Request $request): JsonResponse
    {
        $request->validate([
            'professor_id' => 'required|exists:professors,id',
            'schedule_id' => 'required|exists:schedules,id',
            'date' => 'required|date',
            'reason' => 'nullable|string',
        ]);

        $schedule = \App\Models\Schedule::findOrFail($request->schedule_id);

        AttendanceLog::create([
            'professor_id' => $request->professor_id,
            'course_id' => $schedule->course_id,
            'group_id' => $schedule->group_id,
            'schedule_id' => $schedule->id,
            'date' => $request->date,
            'clock_in' => null,
            'clock_out' => null,
            'hours_worked' => 0,
            'hours_scheduled' => 2,
            'status' => 'absent',
            'type' => $schedule->type ?? 'cours',
            'location' => $schedule->room,
            'notes' => $request->reason,
            'validated' => true,
            'validated_by' => $request->user()->id,
            'validated_at' => now(),
        ]);

        return response()->json(['message' => 'Absence enregistrée']);
    }

    // Stats globales
    public function stats(Request $request): JsonResponse
    {
        $startDate = $request->get('start_date', now()->startOfMonth());
        $endDate = $request->get('end_date', now()->endOfMonth());

        $total = AttendanceLog::whereBetween('date', [$startDate, $endDate])->count();
        $validated = AttendanceLog::whereBetween('date', [$startDate, $endDate])->where('validated', true)->count();
        $pending = $total - $validated;
        $absences = AttendanceLog::whereBetween('date', [$startDate, $endDate])->where('status', 'absent')->count();

        return response()->json([
            'total_sessions' => $total,
            'validated' => $validated,
            'pending' => $pending,
            'absences' => $absences,
        ]);
    }
}