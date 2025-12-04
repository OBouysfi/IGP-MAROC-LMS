<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\AttendanceLog;
use App\Models\Professor;
use App\Models\Schedule;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Carbon\Carbon;

class AttendanceManagementController extends Controller
{
    // ✅ GARDE - Stats globales (améliorée)
    public function stats(Request $request): JsonResponse
    {
        $month = $request->get('month', now()->month);
        $year = $request->get('year', now()->year);

        $totalLogs = AttendanceLog::whereYear('date', $year)
            ->whereMonth('date', $month)
            ->count();

        $validated = AttendanceLog::whereYear('date', $year)
            ->whereMonth('date', $month)
            ->where('validated', true)
            ->count();

        $pending = AttendanceLog::whereYear('date', $year)
            ->whereMonth('date', $month)
            ->where('validated', false)
            ->count();

        $absences = AttendanceLog::whereYear('date', $year)
            ->whereMonth('date', $month)
            ->where('status', 'absent')
            ->count();

        $totalHours = AttendanceLog::whereYear('date', $year)
            ->whereMonth('date', $month)
            ->where('validated', true)
            ->sum('hours_worked');

        return response()->json([
            'total_logs' => $totalLogs,
            'validated' => $validated,
            'pending' => $pending,
            'absences' => $absences,
            'total_hours' => round($totalHours, 2),
        ]);
    }

    // ✅ NOUVEAU - Liste tous les pointages (pour la table principale)
    public function index(Request $request): JsonResponse
    {
        $query = AttendanceLog::with(['professor.user', 'course', 'group'])
            ->orderBy('date', 'desc')
            ->orderBy('clock_in', 'desc');

        // Filtres
        if ($request->filled('professor_id')) {
            $query->where('professor_id', $request->professor_id);
        }

        if ($request->filled('status')) {
            if ($request->status === 'pending') {
                $query->where('validated', false);
            } elseif ($request->status === 'validated') {
                $query->where('validated', true);
            } elseif ($request->status === 'absent') {
                $query->where('status', 'absent');
            }
        }

        if ($request->filled('date_from')) {
            $query->where('date', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->where('date', '<=', $request->date_to);
        }

        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        $logs = $query->paginate($request->get('per_page', 20));

        return response()->json([
            'data' => $logs->map(function($log) {
                $isRejected = $log->notes && str_starts_with($log->notes, 'REJETÉ');
                return [
                    'id' => $log->id,
                    'professor' => [
                        'id' => $log->professor->id,
                        'name' => $log->professor->user->first_name . ' ' . $log->professor->user->last_name,
                        'email' => $log->professor->user->email,
                    ],
                    'course' => [
                        'id' => $log->course->id ?? null,
                        'name' => $log->course->name ?? 'N/A',
                    ],
                    'group' => [
                        'id' => $log->group->id ?? null,
                        'name' => $log->group->name ?? 'N/A',
                    ],
                    'date' => Carbon::parse($log->date)->format('d/m/Y'),
                    'clock_in' => $log->clock_in ? Carbon::parse($log->clock_in)->format('H:i') : null,
                    'clock_out' => $log->clock_out ? Carbon::parse($log->clock_out)->format('H:i') : null,
                    'hours_worked' => $log->hours_worked,
                    'hours_scheduled' => $log->hours_scheduled,
                    'status' => $log->status,
                    'type' => $log->type,
                    'location' => $log->location,
                    'notes' => $log->notes,
                    'validated' => $log->validated,
                    'rejected' => $isRejected,
                    'validated_by' => $log->validated_by,
                    'validated_at' => $log->validated_at ? Carbon::parse($log->validated_at)->format('d/m/Y H:i') : null,
                ];
            }),
            'meta' => [
                'current_page' => $logs->currentPage(),
                'total' => $logs->total(),
                'per_page' => $logs->perPage(),
                'last_page' => $logs->lastPage(),
            ],
        ]);
    }

    // ✅ GARDE - Pointages d'un professeur spécifique (améliorée)
    public function professorAttendance(Request $request, $id): JsonResponse
    {
        $professor = Professor::with('user')->findOrFail($id);

        $month = $request->get('month', now()->month);
        $year = $request->get('year', now()->year);

        $logs = AttendanceLog::with(['course', 'group'])
            ->where('professor_id', $professor->id)
            ->whereYear('date', $year)
            ->whereMonth('date', $month)
            ->orderBy('date', 'desc')
            ->get()
            ->map(function($log) {
                return [
                    'id' => $log->id,
                    'date' => Carbon::parse($log->date)->format('d/m/Y'),
                    'course' => $log->course->name ?? 'N/A',
                    'group' => $log->group->name ?? 'N/A',
                    'clock_in' => $log->clock_in ? Carbon::parse($log->clock_in)->format('H:i') : null,
                    'clock_out' => $log->clock_out ? Carbon::parse($log->clock_out)->format('H:i') : null,
                    'hours_worked' => $log->hours_worked,
                    'hours_scheduled' => $log->hours_scheduled,
                    'status' => $log->status,
                    'type' => $log->type,
                    'validated' => $log->validated,
                ];
            });

        $totalHours = $logs->sum('hours_worked');
        $validatedHours = $logs->where('validated', true)->sum('hours_worked');
        $pendingHours = $logs->where('validated', false)->sum('hours_worked');

        return response()->json([
            'professor' => [
                'id' => $professor->id,
                'name' => $professor->user->first_name . ' ' . $professor->user->last_name,
                'email' => $professor->user->email,
                'hourly_rate' => $professor->hourly_rate,
            ],
            'stats' => [
                'total_hours' => round($totalHours, 2),
                'validated_hours' => round($validatedHours, 2),
                'pending_hours' => round($pendingHours, 2),
                'total_sessions' => $logs->count(),
                'absences' => $logs->where('status', 'absent')->count(),
            ],
            'logs' => $logs->values(),
        ]);
    }

    // ✅ GARDE - Valider présences
    public function validateAttendance(Request $request): JsonResponse
    {
        $request->validate([
            'log_ids' => 'required|array',
            'log_ids.*' => 'exists:attendance_logs,id',
        ]);

        $updated = AttendanceLog::whereIn('id', $request->log_ids)
            ->update([
                'validated' => true,
                'validated_by' => $request->user()->id,
                'validated_at' => now(),
            ]);

        return response()->json([
            'message' => "{$updated} pointage(s) validé(s) avec succès",
            'count' => $updated,
        ]);
    }

    public function rejectAttendance(Request $request, $id): JsonResponse
    {
        $log = AttendanceLog::findOrFail($id);

        $request->validate([
            'reason' => 'required|string|max:500',
        ]);

        // ✅ Garder status original, juste marquer comme non validé avec raison
        $log->update([
            'validated' => false,
            'notes' => 'REJETÉ - ' . $request->reason, // ✅ Préfixe pour identifier
            'validated_by' => null,
            'validated_at' => null,
        ]);

        return response()->json([
            'message' => 'Pointage rejeté',
            'data' => $log,
        ]);
    }

    // ✅ GARDE - Marquer absent
    public function markAbsent(Request $request): JsonResponse
    {
        $request->validate([
            'professor_id' => 'required|exists:professors,id',
            'schedule_id' => 'required|exists:schedules,id',
            'date' => 'required|date',
            'reason' => 'nullable|string|max:500',
        ]);

        $schedule = Schedule::findOrFail($request->schedule_id);

        $start = Carbon::parse($schedule->start_time);
        $end = Carbon::parse($schedule->end_time);
        $hoursScheduled = $end->diffInMinutes($start) / 60;

        $log = AttendanceLog::create([
            'professor_id' => $request->professor_id,
            'course_id' => $schedule->course_id,
            'group_id' => $schedule->group_id,
            'schedule_id' => $schedule->id,
            'date' => $request->date,
            'clock_in' => null,
            'clock_out' => null,
            'hours_worked' => 0,
            'hours_scheduled' => $hoursScheduled,
            'status' => 'absent',
            'type' => $schedule->type ?? 'cours',
            'location' => $schedule->room,
            'notes' => 'Absence marquée manuellement par admin. Raison: ' . ($request->reason ?? 'Non spécifiée'),
            'validated' => true,
            'validated_by' => $request->user()->id,
            'validated_at' => now(),
        ]);

        return response()->json([
            'message' => 'Absence enregistrée',
            'data' => $log,
        ]);
    }

    // ✅ NOUVEAU - Liste des professeurs pour filtres
    public function getProfessors(): JsonResponse
    {
        $professors = Professor::with('user')
            ->get()
            ->map(fn($prof) => [
                'id' => $prof->id,
                'name' => $prof->user->first_name . ' ' . $prof->user->last_name,
                'email' => $prof->user->email,
            ]);

        return response()->json(['data' => $professors]);
    }
}