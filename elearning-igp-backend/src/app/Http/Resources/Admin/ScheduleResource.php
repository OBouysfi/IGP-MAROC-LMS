<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ScheduleResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'course' => [
                'id' => $this->course->id,
                'name' => $this->course->name,
                'code' => $this->course->code,
            ],
            'group' => [
                'id' => $this->group->id,
                'name' => $this->group->name,
                'code' => $this->group->code,
            ],
            'professor' => $this->professor ? [
                'id' => $this->professor->id,
                'name' => $this->professor->user->name,
            ] : null,
            'room' => $this->room,
            'day' => $this->day,
            'start_time' => $this->start_time->format('H:i'),
            'end_time' => $this->end_time->format('H:i'),
            'type' => $this->type,
            'start_date' => $this->start_date?->format('Y-m-d'),
            'end_date' => $this->end_date?->format('Y-m-d'),
            'is_recurring' => $this->is_recurring,
            'notes' => $this->notes,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}