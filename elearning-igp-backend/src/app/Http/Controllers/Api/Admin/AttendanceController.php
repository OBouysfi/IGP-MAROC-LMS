<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\AttendanceRequest;
use App\Http\Requests\Admin\JustifyAbsenceRequest;
use App\Http\Resources\Admin\AttendanceResource;
use App\Models\Attendance;
use App\Models\User;
use App\Models\Student;
use App\Models\Professor;
use App\Models\Group;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class AttendanceController extends Controller
{
    public function stats(): JsonResponse
    {
        $today = now()->format('Y-m-d');
        
        // Utiliser Spatie au lieu de where('role', ...)
        $totalStudents = User::role('student')->count();
        
        $absentToday = Attendance::where('attendable_type', User::class)
            ->where('date', $today)
            ->where('type', 'absent')
            ->count();
        
        $lateToday = Attendance::where('attendable_type', User::class)
            ->where('date', $today)
            ->where('type', 'retard')
            ->count();

        $presentToday = $totalStudents - $absentToday;

        $totalAttendances = Attendance::where('attendable_type', User::class)->count();
        $totalAbsences = Attendance::where('attendable_type', User::class)
            ->where('type', 'absent')
            ->count();
        
        $globalAttendanceRate = $totalAttendances > 0 
            ? (($totalAttendances - $totalAbsences) / $totalAttendances) * 100 
            : 100;

        $stats = [
            'total_students' => $totalStudents,
            'present_today' => $presentToday,
            'absent_today' => $absentToday,
            'late_today' => $lateToday,
            'global_attendance_rate' => round($globalAttendanceRate, 1),
        ];

        return response()->json($stats);
    }

    public function studentsAttendance(Request $request): JsonResponse
    {
        // Utiliser Spatie
        $query = User::role('student')->with(['student.group']);

        if ($request->filled('group')) {
            $query->whereHas('student', fn($q) => $q->where('group_id', $request->group));
        }

        if ($request->filled('filiere')) {
            $query->whereHas('student.group', fn($q) => $q->where('filiere_id', $request->filiere));
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
            $attendanceQuery = Attendance::where('attendable_type', User::class)
                ->where('attendable_id', $user->id);

            if ($request->filled('date_from')) {
                $attendanceQuery->where('date', '>=', $request->date_from);
            }
            if ($request->filled('date_to')) {
                $attendanceQuery->where('date', '<=', $request->date_to);
            }

            $absences = $attendanceQuery->get();
            $totalAbsences = $absences->where('type', 'absent')->count();
            $totalRetards = $absences->where('type', 'retard')->count();
            $justifiedAbsences = $absences->where('type', 'justifié')->count();
            
            $totalSessions = 100;
            $attendanceRate = $totalSessions > 0 
                ? (($totalSessions - $totalAbsences) / $totalSessions) * 100 
                : 100;

            return [
                'id' => $user->id,
                'student_name' => $user->first_name . ' ' . $user->last_name,
                'student_email' => $user->email,
                'group' => $user->student?->group?->name ?? '-',
                'filiere' => $user->student?->group?->filiere?->name ?? '-',
                'total_absences' => $totalAbsences,
                'total_retards' => $totalRetards,
                'justified_absences' => $justifiedAbsences,
                'attendance_rate' => round($attendanceRate, 0),
                'absences' => AttendanceResource::collection($absences),
            ];
        });

        return response()->json(['data' => $students]);
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

        $professors = $query->get()->map(function($professor) {
            $absences = Attendance::where('attendable_type', Professor::class)
                ->where('attendable_id', $professor->id)
                ->get();

            $totalAbsences = $absences->where('type', 'absent')->count();
            $totalRetards = $absences->where('type', 'retard')->count();
            $justifiedAbsences = $absences->where('type', 'justifié')->count();
            
            $totalSessions = 100;
            $attendanceRate = $totalSessions > 0 
                ? (($totalSessions - $totalAbsences) / $totalSessions) * 100 
                : 100;

            return [
                'id' => $professor->id,
                'professor_name' => $professor->user->first_name . ' ' . $professor->user->last_name,
                'professor_email' => $professor->user->email,
                'department' => $professor->department,
                'total_absences' => $totalAbsences,
                'total_retards' => $totalRetards,
                'justified_absences' => $justifiedAbsences,
                'attendance_rate' => round($attendanceRate, 0),
                'absences' => AttendanceResource::collection($absences),
            ];
        });

        return response()->json(['data' => $professors]);
    }

    public function store(AttendanceRequest $request): JsonResponse
    {
        $data = $request->validated();
        $attendance = Attendance::create($data);

        return response()->json(['data' => new AttendanceResource($attendance)], 201);
    }

    public function update(AttendanceRequest $request, $id): JsonResponse
    {
        $attendance = Attendance::findOrFail($id);
        $attendance->update($request->validated());

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
        // Utiliser Spatie
        $students = User::role('student')
            ->whereHas('student', fn($q) => $q->where('group_id', $groupId))
            ->get()
            ->map(fn($user) => [
                'id' => $user->id,
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