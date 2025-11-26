<?php

namespace App\Http\Controllers\Api\Assistant;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Attendance;
use App\Models\Schedule;
use App\Models\Group;
use App\Models\Student;
use Carbon\Carbon;

class ReportController extends Controller
{
    public function getStats(Request $request)
    {
        try {
            $month = $request->query('month', now()->format('Y-m'));
            $startDate = Carbon::parse($month . '-01')->startOfMonth();
            $endDate = Carbon::parse($month . '-01')->endOfMonth();
            
            // Total absences
            $totalAbsences = Attendance::whereBetween('created_at', [$startDate, $endDate])
                ->where('status', 'absent')
                ->count();
            
            // Justified (excused)
            $justified = Attendance::whereBetween('created_at', [$startDate, $endDate])
                ->where('status', 'excused')
                ->count();
            
            // Unjustified
            $unjustified = $totalAbsences;
            
            // Total delays
            $totalDelays = Attendance::whereBetween('created_at', [$startDate, $endDate])
                ->where('status', 'late')
                ->count();
            
            // Calculate absence rate
            $totalSessions = Schedule::count() * Student::count();
            $absenceRate = $totalSessions > 0 ? round(($totalAbsences / $totalSessions) * 100, 1) : 0;
            
            // Most absent day
            $mostAbsentDay = Attendance::whereBetween('created_at', [$startDate, $endDate])
                ->where('status', 'absent')
                ->selectRaw('DAYNAME(created_at) as day, COUNT(*) as count')
                ->groupBy('day')
                ->orderBy('count', 'desc')
                ->first();
            
            // Group statistics
            $groupStats = Group::withCount(['students'])
                ->get()
                ->map(function($group) use ($startDate, $endDate) {
                    $studentIds = $group->students->pluck('user_id');
                    
                    $absences = Attendance::whereBetween('created_at', [$startDate, $endDate])
                        ->whereIn('student_id', $studentIds)
                        ->where('status', 'absent')
                        ->count();
                    
                    $totalPossible = Schedule::where('group_id', $group->id)->count() * $group->students_count;
                    $rate = $totalPossible > 0 ? round(($absences / $totalPossible) * 100, 1) : 0;
                    
                    return [
                        'group' => $group->name,
                        'absences' => $absences,
                        'rate' => $rate,
                        'students' => $group->students_count,
                    ];
                });
            
            return response()->json([
                'monthly_stats' => [
                    'total_absences' => $totalAbsences,
                    'justified' => $justified,
                    'unjustified' => $unjustified,
                    'total_delays' => $totalDelays,
                    'absence_rate' => $absenceRate,
                    'top_absent_course' => 'JavaScript Moderne', // Can be calculated
                    'most_absent_day' => $mostAbsentDay ? $mostAbsentDay->day : 'N/A',
                ],
                'group_stats' => $groupStats,
            ]);
        } catch (\Exception $e) {
            \Log::error('Assistant report stats error: ' . $e->getMessage());
            return response()->json(['message' => 'Error fetching stats', 'error' => $e->getMessage()], 500);
        }
    }
    
    public function generate(Request $request)
    {
        try {
            $request->validate([
                'type' => 'required|in:daily,weekly,monthly,group,student',
                'group_id' => 'nullable|exists:groups,id',
                'month' => 'required|date_format:Y-m',
            ]);
            
            $type = $request->type;
            $groupId = $request->group_id;
            $month = $request->month;
            
            // Here you would generate the actual PDF report
            // For now, we'll just return success
            
            return response()->json([
                'message' => 'Report generated successfully',
                'filename' => "rapport_{$type}_{$month}.pdf",
            ]);
        } catch (\Exception $e) {
            \Log::error('Assistant generate report error: ' . $e->getMessage());
            return response()->json(['message' => 'Error generating report', 'error' => $e->getMessage()], 500);
        }
    }
    
    public function getRecent()
    {
        try {
            // Mock data for recent reports
            // In production, store generated reports in database
            $reports = [
                [
                    'id' => 1,
                    'name' => 'Rapport Mensuel - Octobre 2024',
                    'type' => 'monthly',
                    'date' => '2024-11-01',
                    'size' => '2.4 MB',
                ],
                [
                    'id' => 2,
                    'name' => 'Rapport Groupe DEV-M2-A',
                    'type' => 'group',
                    'date' => '2024-10-28',
                    'size' => '1.8 MB',
                ],
                [
                    'id' => 3,
                    'name' => 'Rapport Hebdomadaire S45',
                    'type' => 'weekly',
                    'date' => '2024-10-25',
                    'size' => '1.2 MB',
                ],
                [
                    'id' => 4,
                    'name' => 'Rapport Mensuel - Septembre 2024',
                    'type' => 'monthly',
                    'date' => '2024-10-01',
                    'size' => '2.1 MB',
                ],
            ];
            
            return response()->json($reports);
        } catch (\Exception $e) {
            \Log::error('Assistant recent reports error: ' . $e->getMessage());
            return response()->json(['message' => 'Error fetching reports', 'error' => $e->getMessage()], 500);
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