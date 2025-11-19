<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProgramResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $totalStudents = \DB::table('students')->where('program', $this->name)->count();
        $totalGroups = \DB::table('groups')->where('program', $this->name)->count();

        return [
            'id' => $this->id,
            'name' => $this->name,
            'code' => $this->code,
            'description' => $this->description,
            'duration_years' => $this->duration_years,
            'levels' => $this->levels ?? [],
            'inscription_fee' => $this->inscription_fee,
            'monthly_fee' => $this->monthly_fee,
            'requirements' => $this->requirements ?? [],
            'total_students' => $totalStudents,
            'total_groups' => $totalGroups,
            'is_active' => $this->is_active,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}