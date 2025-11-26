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
            
            // Total students
            $totalStudents = Student::count();
            
            // Today's attendance stats
            $todayAttendances = Attendance::whereHas('session', function($q) use ($today) {
                $q->whereDate('start_time', $today);
            })->get();
            
            $presentToday = $todayAttendances->where('status', 'present')->count();
            $absentToday = $todayAttendances->where('status', 'absent')->count();
            $lateToday = $todayAttendances->where('status', 'late')->count();
            
            // Pending justifications
            $pendingJustifications = AbsenceJustification::where('status', 'pending')->count();
            
            // Month stats
            $monthStart = Carbon::now()->startOfMonth();
            $monthAttendances = Attendance::whereHas('session', function($q) use ($monthStart) {
                $q->where('start_time', '>=', $monthStart);
            })->get();
            
            $justifiedAbsences = $monthAttendances->where('status', 'excused')->count();
            $unjustifiedAbsences = $monthAttendances->where('status', 'absent')->count();
            
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
            
            $absences = Attendance::with(['student.user', 'student.group', 'session.schedule.course'])
                ->whereHas('session', function($q) use ($today) {
                    $q->whereDate('start_time', $today);
                })
                ->where('status', 'absent')
                ->orWhere('status', 'excused')
                ->get()
                ->map(function($attendance) {
                    $session = $attendance->session;
                    $schedule = $session->schedule ?? null;
                    
                    return [
                        'id' => $attendance->id,
                        'student' => $attendance->student->user->first_name . ' ' . $attendance->student->user->last_name,
                        'group' => $attendance->student->group->name ?? 'N/A',
                        'course' => $schedule ? $schedule->course->name : 'N/A',
                        'time' => $schedule ? Carbon::parse($schedule->start_time)->format('H:i') . ' - ' . Carbon::parse($schedule->end_time)->format('H:i') : 'N/A',
                        'status' => $attendance->status === 'excused' ? 'justifiée' : 'non_justifiée',
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
            
            // Alternative sans withCount
            $students = Student::with(['user', 'group'])
                ->get()
                ->map(function($student) use ($monthStart) {
                    $absencesCount = Attendance::where('student_id', $student->id)
                        ->where('status', 'absent')
                        ->whereHas('session', function($q) use ($monthStart) {
                            $q->where('start_time', '>=', $monthStart);
                        })
                        ->count();
                    
                    return [
                        'id' => $student->id,
                        'name' => $student->user->first_name . ' ' . $student->user->last_name,
                        'group' => $student->group->name ?? 'N/A',
                        'absences' => $absencesCount,
                        'hours' => $absencesCount * 3,
                        'absences_count' => $absencesCount, // Pour le tri
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
                
                $absences = Attendance::whereHas('session', function($q) use ($day) {
                    $q->whereDate('start_time', $day);
                })
                ->where('status', 'absent')
                ->count();
                
                $total = Attendance::whereHas('session', function($q) use ($day) {
                    $q->whereDate('start_time', $day);
                })->count();
                
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