<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FiliereResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $totalStudents = \DB::table('students')->where('filiere', $this->name)->count();
        $totalCourses = \DB::table('courses')->where('filiere', $this->name)->count();

        $programs = [];
        if ($this->program_ids) {
            $programs = \DB::table('programs')->whereIn('id', $this->program_ids)->pluck('name')->toArray();
        }

        return [
            'id' => $this->id,
            'name' => $this->name,
            'code' => $this->code,
            'description' => $this->description,
            'program_ids' => $this->program_ids ?? [],
            'programs' => $programs,
            'total_students' => $totalStudents,
            'total_courses' => $totalCourses,
            'is_active' => $this->is_active,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}