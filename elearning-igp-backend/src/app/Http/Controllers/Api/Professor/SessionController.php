<?php

namespace App\Http\Controllers\Api\Professor;

use App\Http\Controllers\Controller;
use App\Models\JitsiSession;
use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class SessionController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $professor = $request->user()->professor;

        if (!$professor) {
            return response()->json(['data' => []], 404);
        }

        $query = JitsiSession::with(['course', 'group'])
            ->where('professor_id', $professor->id);

        if ($request->has('course')) {
            $courseName = $request->course;
            $query->whereHas('course', function ($q) use ($courseName) {
                $q->where('name', $courseName);
            });
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $sessions = $query->orderBy('session_date', 'desc')
            ->orderBy('start_time', 'desc')
            ->get()
            ->map(function ($session) {
                $totalStudents = $session->group->students()->count();
                $registeredParticipants = $session->participants()->where('registered', true)->count();
                $joinedParticipants = $session->participants()->where('joined', true)->count();

                if ($registeredParticipants === 0 && $totalStudents > 0) {
                    $students = $session->group->students;
                    foreach ($students as $student) {
                        $session->participants()->firstOrCreate([
                            'student_id' => $student->id,
                        ], [
                            'registered' => true,
                        ]);
                    }
                    $registeredParticipants = $totalStudents;
                }

                return [
                    'id' => $session->id,
                    'title' => $session->title,
                    'course' => $session->course->name,
                    'course_code' => $session->course->code,
                    'group' => $session->group->name,
                    'description' => $session->description,
                    'date' => $session->session_date->format('Y-m-d'),
                    'start_time' => $session->start_time,
                    'duration' => (string)$session->duration,
                    'status' => $session->status,
                    'max_participants' => $session->max_participants,
                    'registered_participants' => $registeredParticipants,
                    'joined_participants' => $joinedParticipants,
                    'room_url' => $session->room_url,
                    'recording_enabled' => $session->recording_enabled,
                    'chat_enabled' => $session->chat_enabled,
                ];
            });

        return response()->json(['data' => $sessions]);
    }

    public function store(Request $request): JsonResponse
    {
        $professor = $request->user()->professor;

        if (!$professor) {
            return response()->json(['message' => 'Professor not found'], 404);
        }

        $request->validate([
            'title' => 'required|string|max:255',
            'course_id' => 'required|exists:courses,id',
            'group_id' => 'required|exists:groups,id',
            'description' => 'nullable|string',
            'session_date' => 'required|date',
            'start_time' => 'required',
            'duration' => 'required|integer|min:15|max:300',
            'max_participants' => 'required|integer|min:1|max:200',
            'recording_enabled' => 'boolean',
            'chat_enabled' => 'boolean',
        ]);

        $roomName = 'igp' . strtolower(Str::random(32)); // â† Tout en minuscules, pas de tiret au dÃ©but


        $session = JitsiSession::create([
            'professor_id' => $professor->id,
            'course_id' => $request->course_id,
            'group_id' => $request->group_id,
            'title' => $request->title,
            'description' => $request->description,
            'session_date' => $request->session_date,
            'start_time' => $request->start_time,
            'duration' => $request->duration,
            'max_participants' => $request->max_participants,
            'room_url' => $roomName,
            'recording_enabled' => $request->recording_enabled ?? true,
            'chat_enabled' => $request->chat_enabled ?? true,
        ]);

        return response()->json([
            'message' => 'Session crÃ©Ã©e avec succÃ¨s',
            'data' => $session
        ], 201);
    }

    public function stats(Request $request): JsonResponse
    {
        $professor = $request->user()->professor;

        if (!$professor) {
            return response()->json(['data' => null], 404);
        }

        $sessions = JitsiSession::where('professor_id', $professor->id)->get();

        $totalParticipants = DB::table('jitsi_session_participants')
            ->join('jitsi_sessions', 'jitsi_session_participants.session_id', '=', 'jitsi_sessions.id')
            ->where('jitsi_sessions.professor_id', $professor->id)
            ->where('jitsi_session_participants.registered', true)
            ->count();

        return response()->json([
            'data' => [
                'total_sessions' => $sessions->count(),
                'upcoming' => $sessions->where('status', 'planifiÃ©e')->count(),
                'live_now' => $sessions->where('status', 'en_cours')->count(),
                'completed' => $sessions->where('status', 'terminÃ©e')->count(),
                'total_participants' => $totalParticipants,
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
            ->with('group')
            ->get()
            ->map(function ($course) {
                return [
                    'id' => $course->id,
                    'name' => $course->name,
                    'code' => $course->code,
                    'groups' => $course->group ? [
                        [
                            'id' => $course->group->id,
                            'name' => $course->group->name
                        ]
                    ] : [],
                ];
            });

        return response()->json(['data' => $courses]);
    }

 public function startSession(Request $request, $id): JsonResponse
{
    $session = JitsiSession::findOrFail($id);

    if ($session->professor_id !== $request->user()->professor->id) {
        return response()->json(['message' => 'Unauthorized'], 403);
    }

    $session->update([
        'status' => 'en_cours',
        'started_at' => now(),
    ]);

    \App\Models\AttendanceLog::create([
        'professor_id' => $session->professor_id,
        'course_id' => $session->course_id,
        'group_id' => $session->group_id,
        'date' => $session->session_date,
        'clock_in' => now()->format('H:i'),
        'hours_scheduled' => $session->duration / 60,
        'type' => 'session_live',
        'location' => 'En ligne',
        'status' => 'present',
        'validated' => true,
        'validated_by' => 1,
        'validated_at' => now(),
    ]);

    $professorName = $request->user()->first_name . ' ' . $request->user()->last_name;
    
    // âœ… Utiliser env() pour le domaine Jitsi
   $jitsiUrl = env('JITSI_MEET_URL', 'http://meet.igp-maroc.com/');
    $joinUrl = "{$jitsiUrl}/{$session->room_url}";

    return response()->json([
        'message' => 'Session dÃ©marrÃ©e',
        'data' => $session,
        'join_url' => $joinUrl
    ]);
}

    public function getJoinUrl(Request $request, $id): JsonResponse
    {
        $session = JitsiSession::findOrFail($id);

        if ($session->professor_id !== $request->user()->professor->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $professorName = $request->user()->first_name . ' ' . $request->user()->last_name;
        
        // âœ… Utiliser env() pour le domaine Jitsi
        $jitsiUrl = env('JITSI_MEET_URL', 'https://meet.igp-maroc.com');
        $joinUrl = "{$jitsiUrl}/{$session->room_url}#config.prejoinPageEnabled=false&userInfo.displayName=\"" . urlencode($professorName) . "\"";

        return response()->json(['join_url' => $joinUrl]);
    }

    public function endSession(Request $request, $id): JsonResponse
    {
        $session = JitsiSession::findOrFail($id);

        if ($session->professor_id !== $request->user()->professor->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $session->update([
            'status' => 'terminÃ©e',
            'ended_at' => now(), // â† Ajoute aussi cette colonne si elle n'existe pas
        ]);

        // âœ… AJOUTER ICI: Mettre Ã  jour log de prÃ©sence
        $log = \App\Models\AttendanceLog::where('professor_id', $session->professor_id)
            ->where('date', $session->session_date)
            ->where('course_id', $session->course_id)
            ->whereNull('clock_out')
            ->latest()
            ->first();

        if ($log) {
            $log->update(['clock_out' => now()->format('H:i')]);
            $log->calculateHours();
            $log->determineStatus();
        }

        return response()->json([
            'message' => 'Session terminÃ©e',
            'data' => $session
        ]);
    }

  public function destroy(Request $request, $id): JsonResponse
    {
        $session = JitsiSession::findOrFail($id);

        if ($session->professor_id !== $request->user()->professor->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $session->participants()->delete();
        $session->delete();

        return response()->json([
            'message' => 'Session supprimée avec succès'
        ]);
    }

}