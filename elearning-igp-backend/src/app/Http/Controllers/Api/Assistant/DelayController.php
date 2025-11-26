<?php

namespace App\Http\Controllers\Api\Assistant;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Attendance;
use App\Models\Group;

class DelayController extends Controller
{
    public function index(Request $request)
    {
        try {
            $groupId = $request->query('group_id');
            $date = $request->query('date');
            
            $query = Attendance::where('status', 'late')
                ->with(['student.student.group', 'session.course']);
            
            if ($groupId) {
                $query->whereHas('student.student', function($q) use ($groupId) {
                    $q->where('group_id', $groupId);
                });
            }
            
            if ($date) {
                $query->whereDate('created_at', $date);
            }
            
            $delays = $query->orderBy('created_at', 'desc')
                ->get()
                ->map(function($attendance) {
                    $scheduledTime = optional($attendance->session)->start_time ?? '09:00:00';
                    $arrivalTime = $attendance->joined_at ?? $attendance->created_at;
                    
                    $scheduled = \Carbon\Carbon::parse($scheduledTime);
                    $arrival = \Carbon\Carbon::parse($arrivalTime);
                    $delayMinutes = $scheduled->diffInMinutes($arrival);
                    
                    return [
                        'id' => $attendance->id,
                        'student_name' => optional($attendance->student)->name ?? 'N/A',
                        'student_email' => optional($attendance->student)->email ?? 'N/A',
                        'group' => optional($attendance->student->student)->group->name ?? 'N/A',
                        'course' => optional($attendance->session)->course->name ?? 'N/A',
                        'date' => $attendance->created_at->format('Y-m-d'),
                        'scheduled_time' => substr($scheduledTime, 0, 5),
                        'arrival_time' => $arrivalTime->format('H:i'),
                        'delay_minutes' => $delayMinutes,
                        'justified' => $attendance->status === 'excused',
                        'reason' => '',
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
                'reason' => 'nullable|string|max:500',
            ]);
            
            $attendance = Attendance::findOrFail($id);
            
            $attendance->update([
                'status' => 'excused',
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