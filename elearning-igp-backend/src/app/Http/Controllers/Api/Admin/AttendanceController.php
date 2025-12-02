<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\AttendanceRequest;
use App\Http\Requests\Admin\JustifyAbsenceRequest;
use App\Http\Resources\Admin\AttendanceResource;
use App\Models\Attendance;
use App\Models\User;
use App\Models\Professor;
use App\Models\Group;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class AttendanceController extends Controller
{
    public function stats(): JsonResponse
    {
        $today = now()->format('Y-m-d');
        
        // Total students
        $totalStudents = User::role('student')->count();
        
        // Absences and lates today
        $absentToday = Attendance::where('date', $today)
            ->where('type', 'absent')
            ->distinct('student_id')
            ->count('student_id');
        
        $lateToday = Attendance::where('date', $today)
            ->where('type', 'retard')
            ->distinct('student_id')
            ->count('student_id');

        // Present = total - absent
        $presentToday = $totalStudents - $absentToday;

        // Calculate global attendance rate
        $totalAbsenceRecords = Attendance::where('type', 'absent')->count();
        $totalRecords = Attendance::count();
        
        // Estimate total expected attendances (assuming ~20 sessions per student per month)
        $estimatedTotalSessions = $totalStudents * 20;
        $globalAttendanceRate = $estimatedTotalSessions > 0 
            ? ((($estimatedTotalSessions - $totalAbsenceRecords) / $estimatedTotalSessions) * 100)
            : 100;

        $stats = [
            'total_students' => $totalStudents,
            'present_today' => $presentToday,
            'absent_today' => $absentToday,
            'late_today' => $lateToday,
            'global_attendance_rate' => round(max(0, min(100, $globalAttendanceRate)), 1),
        ];

        return response()->json($stats);
    }

    public function studentsAttendance(Request $request): JsonResponse
    {
        $query = User::role('student')->with(['student.groups.filiere', 'student.filiere']);

        if ($request->filled('group')) {
            $query->whereHas('student.groups', fn($q) => $q->where('groups.id', $request->group));
        }

        if ($request->filled('filiere')) {
            $query->whereHas('student', fn($q) => $q->where('filiere_id', $request->filiere));
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                ->orWhere('last_name', 'like', "%{$search}%")
                ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $students = $query->get()->map(function($user) use ($request) {
            // ✅ CORRECTION ICI: Utilise student->id au lieu de user->id
            $studentId = $user->student?->id;
            
            if (!$studentId) {
                return null; // Skip si pas de student record
            }

            // Get attendance records with date filtering
            $attendanceQuery = Attendance::where('student_id', $studentId);

            if ($request->filled('date_from')) {
                $attendanceQuery->where('date', '>=', $request->date_from);
            }
            if ($request->filled('date_to')) {
                $attendanceQuery->where('date', '<=', $request->date_to);
            }

            $attendances = $attendanceQuery->get();
            
            // Calculate statistics
            $totalAbsences = $attendances->where('type', 'absent')->count();
            $totalRetards = $attendances->where('type', 'retard')->count();
            $justifiedAbsences = $attendances->where('type', 'justifié')->count();
            
            // Estimate total sessions
            $dateFrom = $request->filled('date_from') ? $request->date_from : now()->subDays(30)->format('Y-m-d');
            $dateTo = $request->filled('date_to') ? $request->date_to : now()->format('Y-m-d');
            $daysDiff = \Carbon\Carbon::parse($dateFrom)->diffInDays(\Carbon\Carbon::parse($dateTo)) + 1;
            $estimatedSessions = $daysDiff;
            
            $attendanceRate = $estimatedSessions > 0 
                ? ((($estimatedSessions - $totalAbsences) / $estimatedSessions) * 100) 
                : 100;

            return [
                'id' => $user->id,
                'student_name' => $user->first_name . ' ' . $user->last_name,
                'student_email' => $user->email,
                'group' => $user->student?->groups?->first()?->name ?? '-',
                'filiere' => $user->student?->filiere?->name ?? '-',
                'total_absences' => $totalAbsences,
                'total_retards' => $totalRetards,
                'justified_absences' => $justifiedAbsences,
                'attendance_rate' => round($attendanceRate, 1),
                'absences' => AttendanceResource::collection($attendances),
            ];
        })->filter(); // ✅ Enlève les null

        return response()->json(['data' => $students->values()]);
    }

   public function professorsAttendance(Request $request): JsonResponse
    {
        $query = Professor::with(['user']);

        if ($request->filled('department')) {
            $query->where('department', $request->department);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->whereHas('user', fn($q) => 
                $q->where('first_name', 'like', "%{$search}%")
                ->orWhere('last_name', 'like', "%{$search}%")
            );
        }

        $professors = $query->get()->map(function($professor) use ($request) {
            // Get attendance records for professor
            $attendanceQuery = Attendance::where('professor_id', $professor->id);

            if ($request->filled('date_from')) {
                $attendanceQuery->where('date', '>=', $request->date_from);
            }
            if ($request->filled('date_to')) {
                $attendanceQuery->where('date', '<=', $request->date_to);
            }

            $attendances = $attendanceQuery->get();
            
            // Calculate statistics
            $totalAbsences = $attendances->where('type', 'absent')->count();
            $totalRetards = $attendances->where('type', 'retard')->count();
            $justifiedAbsences = $attendances->where('type', 'justifié')->count();
            
            // Estimate total sessions
            $dateFrom = $request->filled('date_from') ? $request->date_from : now()->subDays(30)->format('Y-m-d');
            $dateTo = $request->filled('date_to') ? $request->date_to : now()->format('Y-m-d');
            $daysDiff = \Carbon\Carbon::parse($dateFrom)->diffInDays(\Carbon\Carbon::parse($dateTo)) + 1;
            $estimatedSessions = $daysDiff;
            
            $attendanceRate = $estimatedSessions > 0 
                ? ((($estimatedSessions - $totalAbsences) / $estimatedSessions) * 100) 
                : 100;

            return [
                'id' => $professor->id,
                'professor_name' => $professor->user->first_name . ' ' . $professor->user->last_name,
                'professor_email' => $professor->user->email,
                'department' => $professor->department,
                'total_absences' => $totalAbsences,
                'total_retards' => $totalRetards,
                'justified_absences' => $justifiedAbsences,
                'attendance_rate' => round($attendanceRate, 1),
                'absences' => AttendanceResource::collection($attendances),
            ];
        });

        return response()->json(['data' => $professors]);
    }

    public function store(AttendanceRequest $request): JsonResponse
    {
        // Temporary debug - remove after fixing
        \Log::info('Attendance Request Data:', $request->all());
        
        $data = $request->validated();
        $attendance = Attendance::create($data);
        $attendance->load('student', 'schedule');

        return response()->json(['data' => new AttendanceResource($attendance)], 201);
    }

    public function storeBulk(Request $request): JsonResponse
    {
        $request->validate([
            'student_ids' => ['required', 'array'],
            'student_ids.*' => ['required', 'integer', 'exists:users,id'],
            'schedule_id' => ['nullable', 'integer', 'exists:schedules,id'],
            'course_name' => ['required', 'string', 'max:255'],
            'date' => ['required', 'date'],
            'start_time' => ['required', 'date_format:H:i'],
            'end_time' => ['required', 'date_format:H:i'],
            'type' => ['required', 'in:absent,retard,justifié'],
            'comment' => ['nullable', 'string'],
        ]);

        $attendances = [];
        foreach ($request->student_ids as $studentId) {
            $attendances[] = Attendance::create([
                'student_id' => $studentId,
                'schedule_id' => $request->schedule_id,
                'course_name' => $request->course_name,
                'date' => $request->date,
                'start_time' => $request->start_time,
                'end_time' => $request->end_time,
                'type' => $request->type,
                'comment' => $request->comment,
            ]);
        }

        return response()->json([
            'message' => count($attendances) . ' attendance records created',
            'data' => AttendanceResource::collection($attendances)
        ], 201);
    }

    public function update(AttendanceRequest $request, $id): JsonResponse
    {
        $attendance = Attendance::findOrFail($id);
        $attendance->update($request->validated());
        $attendance->load('student', 'schedule');

        return response()->json(['data' => new AttendanceResource($attendance)]);
    }

    public function destroy($id): JsonResponse
    {
        $attendance = Attendance::findOrFail($id);
        $attendance->delete();

        return response()->json(null, 204);
    }

    public function justify(JustifyAbsenceRequest $request, $id): JsonResponse
    {
        $attendance = Attendance::findOrFail($id);
        
        $data = [
            'justification' => $request->justification,
            'type' => 'justifié',
            'justified_at' => now(),
        ];

        if ($request->hasFile('justification_file')) {
            $file = $request->file('justification_file');
            $filename = time() . '_' . $file->getClientOriginalName();
            $path = $file->storeAs('justifications', $filename, 'public');
            $data['justification_file'] = $path;
        }

        $attendance->update($data);
        $attendance->load('student', 'schedule');

        return response()->json(['data' => new AttendanceResource($attendance)]);
    }

    public function getGroups(): JsonResponse
    {
        $groups = Group::select('id', 'name', 'code')->orderBy('name')->get();
        return response()->json(['data' => $groups]);
    }

    public function getDepartments(): JsonResponse
    {
        $departments = Professor::distinct()->pluck('department')->filter()->sort()->values();
        return response()->json(['data' => $departments]);
    }

    public function getStudentsByGroup($groupId): JsonResponse
    {
        $students = User::role('student')
            ->with('student') // ✅ Eager load student relationship
            ->whereHas('student.groups', fn($q) => $q->where('groups.id', $groupId))
            ->get()
            ->map(fn($user) => [
                'id' => $user->student->id, // ✅ Return student.id, not user.id
                'user_id' => $user->id,
                'name' => $user->first_name . ' ' . $user->last_name,
                'email' => $user->email,
            ]);
        
        return response()->json(['data' => $students]);
    }

    public function getProfessorsByDepartment($department): JsonResponse
    {
        $professors = Professor::where('department', $department)
            ->with('user:id,first_name,last_name,email')
            ->get()
            ->map(fn($prof) => [
                'id' => $prof->id,
                'name' => $prof->user->first_name . ' ' . $prof->user->last_name,
                'email' => $prof->user->email,
            ]);
        
        return response()->json(['data' => $professors]);
    }
}