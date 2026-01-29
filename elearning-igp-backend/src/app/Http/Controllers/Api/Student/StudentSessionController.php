<?php

namespace App\Http\Controllers\Api\Student;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\JitsiSession;
use App\Models\JitsiSessionParticipant;

class StudentSessionController extends Controller
{
    public function index(Request $request)
    {
        try {
            $student = $request->user()->student;
            
            if (!$student) {
                return response()->json(['message' => 'Student profile not found'], 404);
            }

            $sessions = JitsiSession::where('group_id', $student->group_id)
                ->with(['course', 'professor.user'])
                ->orderBy('session_date', 'desc')
                ->orderBy('start_time', 'desc')
                ->get()
                ->map(function($session) use ($student) {
                    $participant = JitsiSessionParticipant::where('session_id', $session->id)
                        ->where('student_id', $student->id)
                        ->first();
                    
                    $participantsCount = JitsiSessionParticipant::where('session_id', $session->id)
                        ->where('registered', true)
                        ->count();

                    return [
                        'id' => $session->id,
                        'title' => $session->title,
                        'course' => $session->course->name ?? 'N/A',
                        'course_code' => $session->course->code ?? 'N/A',
                        'professor' => $session->professor && $session->professor->user 
                        ? $session->professor->user->first_name . ' ' . $session->professor->user->last_name 
                        : 'N/A',
                        'description' => $session->description ?? '',
                        'date' => $session->session_date,
                        'start_time' => substr($session->start_time, 0, 5),
                        'duration' => (string)$session->duration,
                        'status' => $session->status,
                        'room_url' => $session->room_url,
                        'participants_count' => $participantsCount,
                        'max_participants' => $session->max_participants,
                        'recording_available' => false,
                        'recording_url' => null,
                        'is_registered' => $participant ? $participant->registered : false,
                        'join_url' => env('JITSI_MEET_URL', 'https://meet.igp-maroc.com') . '/' . $session->room_url,
                    ];
                });

            return response()->json($sessions);
        } catch (\Exception $e) {
            \Log::error('Student sessions error: ' . $e->getMessage());
            return response()->json(['message' => 'Error fetching sessions', 'error' => $e->getMessage()], 500);
        }
    }

    public function join(Request $request, $id)
    {
        try {
            $student = $request->user()->student;
            
            if (!$student) {
                return response()->json(['message' => 'Student profile not found'], 404);
            }

            $session = JitsiSession::where('id', $id)
                ->where('group_id', $student->group_id)
                ->firstOrFail();

            $participant = JitsiSessionParticipant::firstOrCreate(
                [
                    'session_id' => $session->id,
                    'student_id' => $student->id,
                ],
                [
                    'registered' => true,
                    'joined' => false,
                ]
            );

            if (!$participant->registered) {
                $participant->update(['registered' => true]);
            }

            $participant->update([
                'joined' => true,
                'joined_at' => now(),
            ]);

            // ✅ AJOUTER ICI : Générer l'URL complète Jitsi
            $studentName = $request->user()->first_name . ' ' . $request->user()->last_name;
            $jitsiUrl = env('JITSI_MEET_URL', 'https://meet.igp-maroc.com');
            $joinUrl = "{$jitsiUrl}/{$session->room_url}#config.prejoinPageEnabled=false&userInfo.displayName=\"" . urlencode($studentName) . "\"";

            return response()->json([
                'message' => 'Joined session successfully',
                'room_url' => $session->room_url,
                'join_url' => $joinUrl,  // ✅ Ajouter cette ligne
            ]);
        } catch (\Exception $e) {
            \Log::error('Student join session error: ' . $e->getMessage());
            return response()->json(['message' => 'Error joining session', 'error' => $e->getMessage()], 500);
        }
    }
}