<?php

use App\Http\Controllers\Api\Auth\LoginController;
use App\Http\Controllers\Api\Auth\RegisterController;
use App\Http\Controllers\Api\Auth\TwoFactorController;
use App\Http\Controllers\Api\Auth\PasswordResetController;
use App\Http\Controllers\Api\Auth\LogoutController;
use App\Http\Controllers\Api\Auth\MeController;
use App\Http\Controllers\Api\Admin\UserController;
use App\Http\Controllers\Api\Admin\ProfileController;
use App\Http\Controllers\Api\Admin\StudentController;
use App\Http\Controllers\Api\Admin\ProfessorController;
use App\Http\Controllers\Api\Admin\CourseController;
use App\Http\Controllers\Api\Admin\GroupController;
use App\Http\Controllers\Api\Admin\ProgramController;
use App\Http\Controllers\Api\Admin\FiliereController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::prefix('auth')->group(function () {
    Route::post('/register', RegisterController::class);
    Route::post('/login', LoginController::class);
    
    Route::post('/2fa/verify', [TwoFactorController::class, 'verify']);
    Route::post('/2fa/resend', [TwoFactorController::class, 'resend']);
    
    Route::post('/password/forgot', [PasswordResetController::class, 'forgot']);
    Route::post('/password/reset', [PasswordResetController::class, 'reset']);
});

// Protected routes
Route::middleware('auth:sanctum')->prefix('auth')->group(function () {
    Route::post('/logout', LogoutController::class);
    Route::post('/logout-all', [LogoutController::class, 'logoutAll']);
    Route::get('/me', MeController::class);
});

// Admin routes
Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/admin/users', [UserController::class, 'index']);
    Route::get('/admin/dashboard/stats', [App\Http\Controllers\Api\Admin\DashboardController::class, 'stats']);
    
    Route::prefix('admin')->group(function () {
        // admin - student
        Route::get('students', [StudentController::class, 'index']);
        Route::get('students/stats', [StudentController::class, 'stats']);
        Route::post('students', [StudentController::class, 'store']);
        Route::get('students/{id}', [StudentController::class, 'show']);
        Route::put('students/{id}', [StudentController::class, 'update']);
        Route::delete('students/{id}', [StudentController::class, 'destroy']);
        Route::post('students/{id}/toggle-active', [StudentController::class, 'toggleActive']);
        // admin - profile
        Route::get('/profile', [ProfileController::class, 'show']);
        Route::put('/profile', [ProfileController::class, 'update']);
        Route::post('/profile/avatar', [ProfileController::class, 'updateAvatar']);
        Route::put('/profile/password', [ProfileController::class, 'updatePassword']);
        Route::post('/profile/2fa/toggle', [ProfileController::class, 'toggle2FA']);
         // Professors
        Route::get('professors', [ProfessorController::class, 'index']);
        Route::get('professors/stats', [ProfessorController::class, 'stats']);
        Route::post('professors', [ProfessorController::class, 'store']);
        Route::get('professors/{id}', [ProfessorController::class, 'show']);
        Route::put('professors/{id}', [ProfessorController::class, 'update']);
        Route::delete('professors/{id}', [ProfessorController::class, 'destroy']);
        Route::post('professors/{id}/toggle-active', [ProfessorController::class, 'toggleActive']);
        // Courses
        Route::get('courses', [CourseController::class, 'index']);
        Route::get('courses/stats', [CourseController::class, 'stats']);
        Route::post('courses', [CourseController::class, 'store']);
        Route::get('courses/{id}', [CourseController::class, 'show']);
        Route::put('courses/{id}', [CourseController::class, 'update']);
        Route::delete('courses/{id}', [CourseController::class, 'destroy']);
        // Groups
        Route::get('groups', [GroupController::class, 'index']);
        Route::get('groups/stats', [GroupController::class, 'stats']);
        Route::post('groups', [GroupController::class, 'store']);
        Route::get('groups/{id}', [GroupController::class, 'show']);
        Route::put('groups/{id}', [GroupController::class, 'update']);
        Route::delete('groups/{id}', [GroupController::class, 'destroy']);
        // Programs
        Route::get('programs', [ProgramController::class, 'index']);
        Route::get('programs/stats', [ProgramController::class, 'stats']);
        Route::post('programs', [ProgramController::class, 'store']);
        Route::get('programs/{id}', [ProgramController::class, 'show']);
        Route::put('programs/{id}', [ProgramController::class, 'update']);
        Route::delete('programs/{id}', [ProgramController::class, 'destroy']);

        // Filieres
        Route::get('filieres', [FiliereController::class, 'index']);
        Route::get('filieres/stats', [FiliereController::class, 'stats']);
        Route::post('filieres', [FiliereController::class, 'store']);
        Route::get('filieres/{id}', [FiliereController::class, 'show']);
        Route::put('filieres/{id}', [FiliereController::class, 'update']);
        Route::delete('filieres/{id}', [FiliereController::class, 'destroy']);
        // Schedules
        Route::get('schedules/stats', [ScheduleController::class, 'stats']);
        Route::get('schedules/groups', [ScheduleController::class, 'getGroups']);
        Route::get('schedules/professors', [ScheduleController::class, 'getProfessors']);
        Route::get('schedules/rooms', [ScheduleController::class, 'getRooms']);
        Route::post('schedules/check-conflicts', [ScheduleController::class, 'checkConflicts']);
        Route::get('schedules', [ScheduleController::class, 'index']);
        Route::post('schedules', [ScheduleController::class, 'store']);
        Route::get('schedules/{id}', [ScheduleController::class, 'show']);
        Route::put('schedules/{id}', [ScheduleController::class, 'update']);
        Route::delete('schedules/{id}', [ScheduleController::class, 'destroy']);
        // Exams
        Route::get('exams/stats', [ExamController::class, 'stats']);
        Route::get('exams/stats-by-filiere', [ExamController::class, 'statsByFiliere']);
        Route::post('exams/{id}/grades', [ExamController::class, 'saveGrades']);
        Route::post('exams/{id}/validate', [ExamController::class, 'validateGrades']);
        Route::get('exams', [ExamController::class, 'index']);
        Route::post('exams', [ExamController::class, 'store']);
        Route::get('exams/{id}', [ExamController::class, 'show']);
        Route::put('exams/{id}', [ExamController::class, 'update']);
        Route::delete('exams/{id}', [ExamController::class, 'destroy']);
        // Attendances
        Route::get('attendances/stats', [AttendanceController::class, 'stats']);
        Route::get('attendances/students', [AttendanceController::class, 'studentsAttendance']);
        Route::get('attendances/professors', [AttendanceController::class, 'professorsAttendance']);
        Route::get('attendances/groups', [AttendanceController::class, 'getGroups']);
        Route::get('attendances/departments', [AttendanceController::class, 'getDepartments']);
        Route::get('attendances/students-by-group/{groupId}', [AttendanceController::class, 'getStudentsByGroup']);
        Route::get('attendances/professors-by-department/{department}', [AttendanceController::class, 'getProfessorsByDepartment']);
        Route::post('attendances', [AttendanceController::class, 'store']);
        Route::put('attendances/{id}', [AttendanceController::class, 'update']);
        Route::delete('attendances/{id}', [AttendanceController::class, 'destroy']);
        Route::post('attendances/{id}/justify', [AttendanceController::class, 'justify']);
        // Student Documents
        Route::get('documents/stats', [StudentDocumentController::class, 'stats']);
        Route::get('documents/dossiers', [StudentDocumentController::class, 'dossiers']);
        Route::get('documents/required', [StudentDocumentController::class, 'getRequiredDocuments']);
        Route::post('documents/upload', [StudentDocumentController::class, 'upload']);
        Route::post('documents/{id}/validate', [StudentDocumentController::class, 'validate']);
        Route::delete('documents/{id}', [StudentDocumentController::class, 'destroy']);
        Route::get('documents/{id}/download', [StudentDocumentController::class, 'download']);
    });
});