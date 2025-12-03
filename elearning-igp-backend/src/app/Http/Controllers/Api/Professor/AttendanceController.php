<?php

namespace App\Http\Controllers\Api\Professor;

use App\Http\Controllers\Controller;
use App\Models\AttendanceLog;
use Illuminate\Http\Request;
use App\Models\Schedule;
use Illuminate\Http\JsonResponse;
use Carbon\Carbon;

class AttendanceController extends Controller
{
    // Pointer arrivée
  public function clockIn(Request $request): JsonResponse
{
    // ✅ Validation plus souple
    $request->validate([
        'schedule_id' => 'nullable|integer',
        'session_id' => 'nullable|integer',
    ]);

    // ✅ Vérifier si c'est une session live
    if ($request->session_id) {
        $session = \App\Models\JitsiSession::find($request->session_id);
        
        if (!$session) {
            return response()->json(['message' => 'Session introuvable'], 404);
        }

        $professor = $request->user()->professor;

        if ($session->professor_id !== $professor->id) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        // Vérifier si déjà pointé
        $existing = AttendanceLog::where('professor_id', $professor->id)
            ->where('course_id', $session->course_id)
            ->where('date', $session->session_date)
            ->where('type', 'session_live')
            ->first();

        if ($existing) {
            return response()->json([
                'message' => 'Vous avez déjà pointé pour cette session',
                'clock_in' => $existing->clock_in,
            ], 400);
        }

        $log = AttendanceLog::create([
            'professor_id' => $professor->id,
            'course_id' => $session->course_id,
            'group_id' => $session->group_id,
            'date' => $session->session_date,
            'clock_in' => now()->format('H:i'),
            'hours_scheduled' => $session->duration / 60,
            'type' => 'session_live',
            'location' => 'En ligne',
            'status' => 'present',
            'validated' => false,
        ]);

        return response()->json([
            'message' => 'Pointage session live enregistré',
            'data' => $log,
        ]);
    }

    // ✅ Cours présentiel
    if (!$request->schedule_id) {
        return response()->json(['message' => 'schedule_id ou session_id requis'], 400);
    }

    $schedule = Schedule::find($request->schedule_id);
    
    if (!$schedule) {
        return response()->json(['message' => 'Cours introuvable'], 404);
    }

    $schedule->load(['course', 'group']);
    $professor = $request->user()->professor;

    // Vérifier si déjà pointé
    $existing = AttendanceLog::where('professor_id', $professor->id)
        ->where('schedule_id', $schedule->id)
        ->where('date', today())
        ->first();

    if ($existing) {
        return response()->json([
            'message' => 'Vous avez déjà pointé pour ce cours',
            'clock_in' => $existing->clock_in,
        ], 400);
    }

    // ✅ VÉRIFIER FENÊTRE TEMPORELLE (remettre la vérification)
    $scheduledStart = Carbon::parse($schedule->start_time);
    $now = Carbon::now();
    
    $canClockInFrom = $scheduledStart->copy()->subMinutes(30);
    $canClockInUntil = $scheduledStart->copy()->addMinutes(15);

    if ($now->lt($canClockInFrom) || $now->gt($canClockInUntil)) {
        return response()->json([
            'message' => 'Hors créneau de pointage',
            'window' => "Pointage possible entre {$canClockInFrom->format('H:i')} et {$canClockInUntil->format('H:i')}"
        ], 400);
    }

    $start = Carbon::parse($schedule->start_time);
    $end = Carbon::parse($schedule->end_time);
    $hoursScheduled = $end->diffInMinutes($start) / 60;

    $log = AttendanceLog::create([
        'professor_id' => $professor->id,
        'course_id' => $schedule->course_id,
        'group_id' => $schedule->group_id,
        'schedule_id' => $schedule->id,
        'date' => today(),
        'clock_in' => now()->format('H:i'),
        'hours_scheduled' => $hoursScheduled,
        'type' => $schedule->type ?? 'cours',
        'location' => $schedule->room,
        'status' => 'present',
        'validated' => false,
    ]);

    return response()->json([
        'message' => 'Pointage enregistré',
        'data' => $log,
    ]);
}


    // Pointer départ
   public function clockOut(Request $request, $id): JsonResponse
     {
        $log = AttendanceLog::findOrFail($id);
        
        if ($log->professor_id !== $request->user()->professor->id) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        // ✅ DÉJÀ POINTÉ SORTIE = IMPOSSIBLE
        if ($log->clock_out) {
            return response()->json([
                'message' => 'Vous avez déjà pointé la sortie',
                'clock_out' => $log->clock_out,
            ], 400);
        }

        // ✅ SI VALIDÉ PAR ADMIN = IMPOSSIBLE DE MODIFIER
        if ($log->validated) {
            return response()->json([
                'message' => 'Ce pointage a été validé, modification impossible'
            ], 403);
        }

        $log->update(['clock_out' => now()->format('H:i')]);
        $log->calculateHours();
        $log->determineStatus();

        return response()->json([
            'message' => 'Pointage sortie enregistré',
            'data' => $log,
        ]);
    }

    // Historique personnel
    public function myAttendance(Request $request): JsonResponse
{
    $professor = $request->user()->professor;
    
    $logs = AttendanceLog::with(['course', 'group'])
        ->where('professor_id', $professor->id)
        ->whereBetween('date', [
            $request->get('start_date', now()->startOfMonth()),
            $request->get('end_date', now()->endOfMonth()),
        ])
        ->orderBy('date', 'desc')
        ->get()
        ->map(function($log) {
            return [
                'id' => $log->id,
                'date' => Carbon::parse($log->date)->format('d/m/Y'),
                'course' => [
                    'name' => $log->course->name ?? '-',
                    'code' => $log->course->code ?? '-',
                ],
                'group' => [
                    'name' => $log->group->name ?? '-',
                ],
                'clock_in' => $log->clock_in ? Carbon::parse($log->clock_in)->format('H:i') : null, // ✅ FIX
                'clock_out' => $log->clock_out ? Carbon::parse($log->clock_out)->format('H:i') : null, // ✅ FIX
                'hours_worked' => $log->hours_worked,
                'hours_scheduled' => $log->hours_scheduled,
                'status' => $log->status,
                'type' => $log->type,
                'validated' => $log->validated,
                'schedule_id' => $log->schedule_id,
            ];
        });

    $totalHours = $logs->sum('hours_worked');

    return response()->json([
        'data' => $logs,
        'total_hours' => round($totalHours, 2),
    ]);
}
}