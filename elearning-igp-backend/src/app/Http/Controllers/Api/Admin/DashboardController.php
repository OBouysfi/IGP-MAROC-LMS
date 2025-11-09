<?php
// app/Http/Controllers/Api/Admin/DashboardController.php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Course;

class DashboardController extends Controller
{
    public function stats()
    {
        $totalStudents = User::whereHas('roles', function($q) {
            $q->where('name', 'student');
        })->count();
        
        $activeStudents = User::whereHas('roles', function($q) {
            $q->where('name', 'student');
        })->where('is_active', true)->count();
        
        $totalProfessors = User::whereHas('roles', function($q) {
            $q->where('name', 'professor');
        })->count();
        
        $totalCourses = Course::count();
        
        return response()->json([
            'success' => true,
            'data' => [
                'total_students' => $totalStudents,
                'active_students' => $activeStudents,
                'total_professors' => $totalProfessors,
                'total_courses' => $totalCourses,
                'completion_rate' => 87,
            ]
        ]);
    }
}