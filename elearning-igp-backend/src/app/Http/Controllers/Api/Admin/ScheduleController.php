<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ScheduleRequest;
use App\Http\Resources\Admin\ScheduleResource;
use App\Models\Schedule;
use App\Models\Group;
use App\Models\Professor;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ScheduleController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Schedule::with(['course', 'group', 'professor.user']);

        if ($request->filled('group_id')) {
            $query->where('group_id', $request->group_id);
        }

        if ($request->filled('professor_id')) {
            $query->where('professor_id', $request->professor_id);
        }

        if ($request->filled('room')) {
            $query->where('room', $request->room);
        }

        if ($request->filled('day')) {
            $query->where('day', $request->day);
        }

        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        $schedules = $query->orderBy('day')
            ->orderBy('start_time')
            ->get();

        return response()->json([
            'data' => ScheduleResource::collection($schedules),
        ]);
    }

    public function stats(): JsonResponse
    {
        $stats = [
            'total_schedules' => Schedule::count(),
            'by_type' => [
                'cours' => Schedule::where('type', 'cours')->count(),
                'td' => Schedule::where('type', 'td')->count(),
                'tp' => Schedule::where('type', 'tp')->count(),
                'examen' => Schedule::where('type', 'examen')->count(),
            ],
            'total_hours_week' => Schedule::selectRaw('SUM(TIMESTAMPDIFF(HOUR, start_time, end_time)) as total')->value('total') ?? 0,
            'rooms_used' => Schedule::distinct('room')->count('room'),
        ];

        return response()->json($stats);
    }

    public function getGroups(): JsonResponse
    {
        $groups = Group::select('id', 'name', 'code')->orderBy('name')->get();
        return response()->json(['data' => $groups]);
    }

    public function getProfessors(): JsonResponse
    {
        $professors = Professor::with('user:id,first_name,last_name')
            ->get()
            ->map(fn($prof) => [
                'id' => $prof->id,
                'name' => $prof->user->first_name . ' ' . $prof->user->last_name,
            ]);
        return response()->json(['data' => $professors]);
    }

    public function getRooms(): JsonResponse
    {
        $rooms = Schedule::distinct()->pluck('room')->sort()->values();
        return response()->json(['data' => $rooms]);
    }

    public function store(ScheduleRequest $request): JsonResponse
    {
        $schedule = Schedule::create($request->validated());
        $schedule->load(['course', 'group', 'professor.user']);

        return response()->json(['data' => new ScheduleResource($schedule)], 201);
    }

    public function show($id): JsonResponse
    {
        $schedule = Schedule::with(['course', 'group', 'professor.user'])->findOrFail($id);
        return response()->json(['data' => new ScheduleResource($schedule)]);
    }

    public function update(ScheduleRequest $request, $id): JsonResponse
    {
        $schedule = Schedule::findOrFail($id);
        $schedule->update($request->validated());
        $schedule->load(['course', 'group', 'professor.user']);

        return response()->json(['data' => new ScheduleResource($schedule)]);
    }

    public function destroy($id): JsonResponse
    {
        $schedule = Schedule::findOrFail($id);
        $schedule->delete();
        return response()->json(null, 204);
    }

    public function checkConflicts(Request $request): JsonResponse
    {
        $conflicts = [];

        // Check professor conflict
        if ($request->professor_id) {
            $professorConflict = Schedule::where('professor_id', $request->professor_id)
                ->where('day', $request->day)
                ->where(function($q) use ($request) {
                    $q->whereBetween('start_time', [$request->start_time, $request->end_time])
                      ->orWhereBetween('end_time', [$request->start_time, $request->end_time])
                      ->orWhere(function($q) use ($request) {
                          $q->where('start_time', '<=', $request->start_time)
                            ->where('end_time', '>=', $request->end_time);
                      });
                })
                ->when($request->schedule_id, fn($q) => $q->where('id', '!=', $request->schedule_id))
                ->with(['course', 'group'])
                ->first();

            if ($professorConflict) {
                $conflicts[] = [
                    'type' => 'professor',
                    'message' => 'Le professeur a déjà un cours à cette heure',
                    'schedule' => new ScheduleResource($professorConflict),
                ];
            }
        }

        // Check room conflict
        $roomConflict = Schedule::where('room', $request->room)
            ->where('day', $request->day)
            ->where(function($q) use ($request) {
                $q->whereBetween('start_time', [$request->start_time, $request->end_time])
                  ->orWhereBetween('end_time', [$request->start_time, $request->end_time])
                  ->orWhere(function($q) use ($request) {
                      $q->where('start_time', '<=', $request->start_time)
                        ->where('end_time', '>=', $request->end_time);
                  });
            })
            ->when($request->schedule_id, fn($q) => $q->where('id', '!=', $request->schedule_id))
            ->with(['course', 'group'])
            ->first();

        if ($roomConflict) {
            $conflicts[] = [
                'type' => 'room',
                'message' => 'La salle est déjà occupée à cette heure',
                'schedule' => new ScheduleResource($roomConflict),
            ];
        }

        // Check group conflict
        $groupConflict = Schedule::where('group_id', $request->group_id)
            ->where('day', $request->day)
            ->where(function($q) use ($request) {
                $q->whereBetween('start_time', [$request->start_time, $request->end_time])
                  ->orWhereBetween('end_time', [$request->start_time, $request->end_time])
                  ->orWhere(function($q) use ($request) {
                      $q->where('start_time', '<=', $request->start_time)
                        ->where('end_time', '>=', $request->end_time);
                  });
            })
            ->when($request->schedule_id, fn($q) => $q->where('id', '!=', $request->schedule_id))
            ->with(['course', 'professor.user'])
            ->first();

        if ($groupConflict) {
            $conflicts[] = [
                'type' => 'group',
                'message' => 'Le groupe a déjà un cours à cette heure',
                'schedule' => new ScheduleResource($groupConflict),
            ];
        }

        return response()->json([
            'has_conflicts' => count($conflicts) > 0,
            'conflicts' => $conflicts,
        ]);
    }
}