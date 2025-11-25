<?php

namespace App\Http\Controllers\Api\Professor;

use App\Http\Controllers\Controller;
use App\Models\JitsiSession;
use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

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

        // Apply filters
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

                // Auto-register all students from the group
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
            'recording_enabled' => $request->recording_enabled ?? true,
            'chat_enabled' => $request->chat_enabled ?? true,
        ]);

        return response()->json([
            'message' => 'Session créée avec succès',
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
                'upcoming' => $sessions->where('status', 'planifiée')->count(),
                'live_now' => $sessions->where('status', 'en_cours')->count(),
                'completed' => $sessions->where('status', 'terminée')->count(),
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
                    'groups' => [$course->group->name ?? 'N/A'],
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

        $session->update(['status' => 'en_cours']);

        return response()->json([
            'message' => 'Session démarrée',
            'data' => $session
        ]);
    }

    public function endSession(Request $request, $id): JsonResponse
    {
        $session = JitsiSession::findOrFail($id);

        if ($session->professor_id !== $request->user()->professor->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $session->update(['status' => 'terminée']);

        return response()->json([
            'message' => 'Session terminée',
            'data' => $session
        ]);
    }
}