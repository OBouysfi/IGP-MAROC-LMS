<?php

namespace App\Http\Controllers\Api\Assistant;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Attendance;
use App\Models\Group;
use Carbon\Carbon;

class DelayController extends Controller
{
    public function index(Request $request)
    {
        try {
            $groupId = $request->query('group_id');
            $date = $request->query('date');
            
            // Filtrer par type = 'retard'
            $query = Attendance::where('type', 'retard')
                ->with(['student.student.group', 'session.course']);
            
            if ($groupId) {
                $query->whereHas('student.student', function($q) use ($groupId) {
                    $q->where('group_id', $groupId);
                });
            }
            
            if ($date) {
                $query->whereDate('date', $date); // Utiliser la colonne 'date' au lieu de 'created_at'
            }
            
            $delays = $query->orderBy('created_at', 'desc')
                ->get()
                ->map(function($attendance) {
                    // Utiliser start_time de la table attendances
                    $scheduledTime = $attendance->start_time;
                    // Utiliser created_at comme heure d'arrivée (ou joined_at si vous avez cette colonne)
                    $arrivalTime = $attendance->created_at;
                    
                    $scheduled = Carbon::parse($scheduledTime);
                    $arrival = Carbon::parse($arrivalTime);
                    $delayMinutes = $scheduled->diffInMinutes($arrival);
                    
                    return [
                        'id' => $attendance->id,
                        'student_name' => optional($attendance->student)->name ?? 'N/A',
                        'student_email' => optional($attendance->student)->email ?? 'N/A',
                        'group' => optional($attendance->student->student)->group->name ?? 'N/A',
                        'course' => $attendance->course_name ?? optional($attendance->session)->course->name ?? 'N/A',
                        'date' => $attendance->date->format('Y-m-d'), // Utiliser la colonne 'date'
                        'scheduled_time' => substr($scheduledTime, 0, 5),
                        'arrival_time' => $arrival->format('H:i'),
                        'delay_minutes' => $delayMinutes,
                        'justified' => $attendance->type === 'justifié', // Vérifier si c'est déjà justifié
                        'reason' => $attendance->justification ?? '',
                    ];
                });
            
            return response()->json($delays);
        } catch (\Exception $e) {
            \Log::error('Assistant delays error: ' . $e->getMessage());
            return response()->json(['message' => 'Error fetching delays', 'error' => $e->getMessage()], 500);
        }
    }
    
    public function justify(Request $request, $id)
    {
        try {
            $request->validate([
                'reason' => 'required|string|max:500',
            ]);
            
            $attendance = Attendance::findOrFail($id);
            
            // Mettre à jour pour marquer comme justifié
            $attendance->update([
                'type' => 'justifié',
                'justification' => $request->input('reason'),
                'justified_at' => now(),
            ]);
            
            return response()->json(['message' => 'Delay justified successfully']);
        } catch (\Exception $e) {
            \Log::error('Assistant justify delay error: ' . $e->getMessage());
            return response()->json(['message' => 'Error justifying delay', 'error' => $e->getMessage()], 500);
        }
    }
    
    public function getGroups()
    {
        try {
            $groups = Group::select('id', 'name', 'code')->get();
            return response()->json($groups);
        } catch (\Exception $e) {
            \Log::error('Assistant get groups error: ' . $e->getMessage());
            return response()->json(['message' => 'Error fetching groups', 'error' => $e->getMessage()], 500);
        }
    }
}