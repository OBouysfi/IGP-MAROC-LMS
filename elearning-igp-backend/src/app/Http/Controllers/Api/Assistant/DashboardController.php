<?php

namespace App\Http\Controllers\Api\Assistant;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Attendance;
use App\Models\AbsenceJustification;
use App\Models\Student;
use App\Models\Schedule;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function getStats(Request $request)
    {
        try {
            $today = Carbon::today();
            
            $totalStudents = Student::count();
            
            $todayAttendances = Attendance::whereDate('date', $today)->get();
            
            $presentToday = $todayAttendances->where('type', 'present')->count();
            $absentToday = $todayAttendances->where('type', 'absent')->count();
            $lateToday = $todayAttendances->where('type', 'late')->count();
            
            $pendingJustifications = AbsenceJustification::where('status', 'pending')->count();
            
            $monthStart = Carbon::now()->startOfMonth();
            $monthAttendances = Attendance::where('date', '>=', $monthStart)->get();
            
            $justifiedAbsences = $monthAttendances->where('type', 'absent')->whereNotNull('justification')->count();
            $unjustifiedAbsences = $monthAttendances->where('type', 'absent')->whereNull('justification')->count();
            
            $absenceRate = $totalStudents > 0 ? ($absentToday / $totalStudents) * 100 : 0;
            
            return response()->json([
                'success' => true,
                'data' => [
                    'total_students' => $totalStudents,
                    'present_today' => $presentToday,
                    'absent_today' => $absentToday,
                    'late_today' => $lateToday,
                    'pending_justifications' => $pendingJustifications,
                    'absence_rate' => round($absenceRate, 1),
                    'justified_absences' => $justifiedAbsences,
                    'unjustified_absences' => $unjustifiedAbsences,
                ],
            ]);
        } catch (\Exception $e) {
            \Log::error('Assistant dashboard stats error: ' . $e->getMessage());
            return response()->json(['message' => 'Error fetching stats', 'error' => $e->getMessage()], 500);
        }
    }
    
    public function getTodayAbsences(Request $request)
    {
        try {
            $today = Carbon::today();
            
            $absences = Attendance::with(['student.user', 'student.groups', 'schedule.course'])
                ->whereDate('date', $today)
                ->where('type', 'absent')
                ->get()
                ->map(function($attendance) {
                    $schedule = $attendance->schedule;
                    
                    return [
                        'id' => $attendance->id,
                        'student' => $attendance->student->user->first_name . ' ' . $attendance->student->user->last_name,
                        'group' => $attendance->student->groups->first()->name ?? 'N/A',
                        'course' => $attendance->course_name ?? ($schedule ? $schedule->course->name : 'N/A'),
                        'time' => $attendance->start_time->format('H:i') . ' - ' . $attendance->end_time->format('H:i'),
                        'status' => $attendance->justification ? 'justifiée' : 'non_justifiée',
                    ];
                });
            
            return response()->json([
                'success' => true,
                'data' => $absences,
            ]);
        } catch (\Exception $e) {
            \Log::error('Assistant today absences error: ' . $e->getMessage());
            return response()->json(['message' => 'Error fetching today absences', 'error' => $e->getMessage()], 500);
        }
    }
    
    public function getPendingJustifications(Request $request)
    {
        try {
            $justifications = AbsenceJustification::with(['student.user'])
                ->where('status', 'pending')
                ->orderBy('created_at', 'desc')
                ->limit(5)
                ->get()
                ->map(function($justif) {
                    return [
                        'id' => $justif->id,
                        'student' => $justif->student->user->first_name . ' ' . $justif->student->user->last_name,
                        'date' => $justif->absence_date,
                        'reason' => $justif->reason,
                        'document' => $justif->document_name,
                    ];
                });
            
            return response()->json([
                'success' => true,
                'data' => $justifications,
            ]);
        } catch (\Exception $e) {
            \Log::error('Assistant pending justifications error: ' . $e->getMessage());
            return response()->json(['message' => 'Error fetching pending justifications', 'error' => $e->getMessage()], 500);
        }
    }
    
    public function getTopAbsentStudents(Request $request)
    {
        try {
            $monthStart = Carbon::now()->startOfMonth();
            
            $students = Student::with(['user', 'groups'])
                ->get()
                ->map(function($student) use ($monthStart) {
                    $absencesCount = Attendance::where('student_id', $student->id)
                        ->where('type', 'absent')
                        ->where('date', '>=', $monthStart)
                        ->count();
                    
                    return [
                        'id' => $student->id,
                        'name' => $student->user->first_name . ' ' . $student->user->last_name,
                        'group' => $student->groups->first()->name ?? 'N/A',
                        'absences' => $absencesCount,
                        'hours' => $absencesCount * 3,
                        'absences_count' => $absencesCount,
                    ];
                })
                ->filter(function($student) {
                    return $student['absences_count'] > 0;
                })
                ->sortByDesc('absences_count')
                ->take(5)
                ->values();
            
            return response()->json([
                'success' => true,
                'data' => $students,
            ]);
        } catch (\Exception $e) {
            \Log::error('Assistant top absent students error: ' . $e->getMessage());
            return response()->json(['message' => 'Error fetching top absent students', 'error' => $e->getMessage()], 500);
        }
    }
    
    public function getWeeklyStats(Request $request)
    {
        try {
            $weekStart = Carbon::now()->startOfWeek();
            $stats = [];
            
            for ($i = 0; $i < 5; $i++) {
                $day = $weekStart->copy()->addDays($i);
                
                $absences = Attendance::whereDate('date', $day)
                    ->where('type', 'absent')
                    ->count();
                
                $total = Attendance::whereDate('date', $day)->count();
                
                $rate = $total > 0 ? ($absences / $total) * 100 : 0;
                
                $stats[] = [
                    'day' => $day->locale('fr')->isoFormat('ddd'),
                    'absences' => $absences,
                    'rate' => round($rate, 1),
                ];
            }
            
            return response()->json([
                'success' => true,
                'data' => $stats,
            ]);
        } catch (\Exception $e) {
            \Log::error('Assistant weekly stats error: ' . $e->getMessage());
            return response()->json(['message' => 'Error fetching weekly stats', 'error' => $e->getMessage()], 500);
        }
    }
}