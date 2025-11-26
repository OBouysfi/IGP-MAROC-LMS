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
use App\Http\Controllers\Api\Admin\ScheduleController;
use App\Http\Controllers\Api\Admin\ExamController;
use App\Http\Controllers\Api\Admin\AttendanceController;
use App\Http\Controllers\Api\Admin\StudentDocumentController;
use App\Http\Controllers\Api\Admin\PayrollController;
use App\Http\Controllers\Api\Admin\SettingsController;
//----------------------------------------------------//
use App\Http\Controllers\Api\Student\StudentCourseController;
use App\Http\Controllers\Api\Student\StudentGradeController;
use App\Http\Controllers\Api\Student\StudentSessionController;
use App\Http\Controllers\Api\Student\StudentScheduleController;
use App\Http\Controllers\Api\Student\DocumentController;
use App\Http\Controllers\Api\Student\ResourceController;
/** Panel Assistant */
use App\Http\Controllers\Api\Assistant\AttendanceController as AssistantAttendanceController;
use App\Http\Controllers\Api\Assistant\JustificationController as AssistantJustificationController;
use App\Http\Controllers\Api\Assistant\ScheduleController as AssistantScheduleController;
use App\Http\Controllers\Api\Assistant\ReportController as AssistantReportController;
use App\Http\Controllers\Api\Assistant\DelayController as AssistantDelayController;
use App\Http\Controllers\Api\Assistant\SettingsController as AssistantSettingsController;
use App\Http\Controllers\Api\Assistant\DashboardController as AssistantDashboardController;
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
        // Payroll - Paie des Professeurs
        Route::get('payrolls/stats', [PayrollController::class, 'stats']);
        Route::get('payrolls', [PayrollController::class, 'index']);
        Route::post('payrolls/generate', [PayrollController::class, 'generate']);
        Route::put('payrolls/{id}', [PayrollController::class, 'update']);
        Route::post('payrolls/{id}/pay', [PayrollController::class, 'confirmPayment']);
        Route::post('payrolls/pay-multiple', [PayrollController::class, 'confirmMultiplePayments']);
        Route::get('payrolls/history', [PayrollController::class, 'history']);
        Route::get('payrolls/departments', [PayrollController::class, 'getDepartments']);
         // Setting -  General
        Route::prefix('settings')->group(function () {
            // Setting - General
            Route::get('general', [SettingsController::class, 'getGeneral']);
            Route::put('general', [SettingsController::class, 'updateGeneral']);
            Route::post('logo', [SettingsController::class, 'uploadLogo']);
            
            // Setting - Admins & Assistants
            Route::get('admins', [SettingsController::class, 'getAdmins']);
            Route::post('admins', [SettingsController::class, 'createAdmin']);
            Route::put('admins/{id}', [SettingsController::class, 'updateAdmin']);
            Route::delete('admins/{id}', [SettingsController::class, 'deleteAdmin']);
            Route::patch('admins/{id}/toggle', [SettingsController::class, 'toggleAdminStatus']);
            
            // Setting - Roles
            Route::get('roles', [SettingsController::class, 'getRoles']);
            
            // Setting - Security
            Route::get('security', [SettingsController::class, 'getSecurity']);
            Route::put('security', [SettingsController::class, 'updateSecurity']);
             // Sessions & Logs (NOUVEAU)
            Route::get('sessions/stats', [SettingsController::class, 'getSessionsStats']);
            Route::get('sessions', [SettingsController::class, 'getSessions']);
            Route::delete('sessions/all', [SettingsController::class, 'destroyAllSessions']);
            Route::delete('sessions/{id}', [SettingsController::class, 'destroySession']);
            Route::get('login-logs', [SettingsController::class, 'getLoginLogs']);
            Route::get('login-attempts', [SettingsController::class, 'getLoginAttempts']);
            Route::get('locked-users', [SettingsController::class, 'getLockedUsers']);
            Route::post('users/{id}/unlock', [SettingsController::class, 'unlockUser']);
        });
    });
});






 // Professor routes

Route::middleware(['auth:sanctum'])->prefix('professor')->group(function () {
    // Dashboard
    Route::get('dashboard', [App\Http\Controllers\Api\Professor\DashboardController::class, 'index']);
    // Courses
    Route::get('courses/stats', [App\Http\Controllers\Api\Professor\CourseController::class, 'stats']);
    Route::get('courses', [App\Http\Controllers\Api\Professor\CourseController::class, 'index']);
    Route::get('courses/{id}', [App\Http\Controllers\Api\Professor\CourseController::class, 'show']);
    Route::post('courses/{id}/resources', [App\Http\Controllers\Api\Professor\CourseController::class, 'uploadResource']);
    Route::delete('courses/{courseId}/resources/{resourceId}', [App\Http\Controllers\Api\Professor\CourseController::class, 'deleteResource']);
    // Students
    Route::get('students/stats', [App\Http\Controllers\Api\Professor\StudentController::class, 'stats']);
    Route::get('students/my-courses', [App\Http\Controllers\Api\Professor\StudentController::class, 'myCourses']);
    Route::get('students/my-groups', [App\Http\Controllers\Api\Professor\StudentController::class, 'myGroups']);
    Route::get('students', [App\Http\Controllers\Api\Professor\StudentController::class, 'index']);
     // Grades
    Route::get('grades/stats', [App\Http\Controllers\Api\Professor\GradeController::class, 'stats']);
    Route::get('grades/my-courses', [App\Http\Controllers\Api\Professor\GradeController::class, 'myCourses']);
    Route::get('grades', [App\Http\Controllers\Api\Professor\GradeController::class, 'index']);
    Route::post('grades/{examId}/save', [App\Http\Controllers\Api\Professor\GradeController::class, 'saveGrades']);
    Route::post('grades/{examId}/submit', [App\Http\Controllers\Api\Professor\GradeController::class, 'submitGrades']);
    // Session live
    Route::get('sessions/stats', [App\Http\Controllers\Api\Professor\SessionController::class, 'stats']);
    Route::get('sessions/my-courses', [App\Http\Controllers\Api\Professor\SessionController::class, 'myCourses']);
    Route::get('sessions', [App\Http\Controllers\Api\Professor\SessionController::class, 'index']);
    Route::post('sessions', [App\Http\Controllers\Api\Professor\SessionController::class, 'store']);
    Route::post('sessions/{id}/start', [App\Http\Controllers\Api\Professor\SessionController::class, 'startSession']);
    Route::post('sessions/{id}/end', [App\Http\Controllers\Api\Professor\SessionController::class, 'endSession']);
    // Emploi du Temps
    Route::get('schedule/stats', [App\Http\Controllers\Api\Professor\ScheduleController::class, 'stats']);
    Route::get('schedule', [App\Http\Controllers\Api\Professor\ScheduleController::class, 'index']);
    // Documents
    Route::get('documents/stats', [App\Http\Controllers\Api\Professor\DocumentController::class, 'stats']);
    Route::get('documents/my-courses', [App\Http\Controllers\Api\Professor\DocumentController::class, 'myCourses']);
    Route::get('documents', [App\Http\Controllers\Api\Professor\DocumentController::class, 'index']);
    Route::post('documents', [App\Http\Controllers\Api\Professor\DocumentController::class, 'store']);
    Route::post('documents/{id}/toggle-share', [App\Http\Controllers\Api\Professor\DocumentController::class, 'toggleShare']);
    Route::get('documents/{id}/download', [App\Http\Controllers\Api\Professor\DocumentController::class, 'download']);
    Route::delete('documents/{id}', [App\Http\Controllers\Api\Professor\DocumentController::class, 'destroy']);
    // Settings (NOUVEAU)
    Route::get('settings/profile', [App\Http\Controllers\Api\Professor\SettingsController::class, 'getProfile']);
    Route::put('settings/profile', [App\Http\Controllers\Api\Professor\SettingsController::class, 'updateProfile']);
    Route::post('settings/avatar', [App\Http\Controllers\Api\Professor\SettingsController::class, 'uploadAvatar']);
    Route::post('settings/password', [App\Http\Controllers\Api\Professor\SettingsController::class, 'changePassword']);
    Route::get('settings/notifications', [App\Http\Controllers\Api\Professor\SettingsController::class, 'getNotifications']);
    Route::put('settings/notifications', [App\Http\Controllers\Api\Professor\SettingsController::class, 'updateNotifications']);
    Route::get('settings/preferences', [App\Http\Controllers\Api\Professor\SettingsController::class, 'getPreferences']);
    Route::put('settings/preferences', [App\Http\Controllers\Api\Professor\SettingsController::class, 'updatePreferences']);
    Route::post('settings/2fa/toggle', [App\Http\Controllers\Api\Professor\SettingsController::class, 'toggle2FA']);
});





// Student routes
Route::middleware(['auth:sanctum'])->prefix('student')->group(function () {
    // Dashboard
    Route::get('dashboard', [App\Http\Controllers\Api\Student\DashboardController::class, 'index']);
    Route::get('/dashboard/stats', [App\Http\Controllers\Api\Student\DashboardController::class, 'stats']);

    // Mes Cours
    Route::get('/courses', [StudentCourseController::class, 'index']);
    Route::get('/courses/{id}', [StudentCourseController::class, 'show']);
    Route::get('/courses/{id}/resources', [StudentCourseController::class, 'resources']);
    // Mes notes
    Route::get('/grades', [StudentGradeController::class, 'index']);
    Route::get('/grades/summary', [StudentGradeController::class, 'summary']);
    // Session live
    Route::get('/sessions', [StudentSessionController::class, 'index']);
    Route::post('/sessions/{id}/join', [StudentSessionController::class, 'join']);
    // Mon Emploi du Temps
    Route::get('/schedule', [StudentScheduleController::class, 'index']);
    // Document
    Route::get('/documents', [DocumentController::class, 'index']);
    Route::get('/documents/{id}/download', [DocumentController::class, 'download']);
    // Ressource
    Route::get('/resources', [ResourceController::class, 'index']);
    // Settings
    Route::get('settings/profile', [App\Http\Controllers\Api\Student\SettingsController::class, 'getProfile']);
    Route::put('settings/profile', [App\Http\Controllers\Api\Student\SettingsController::class, 'updateProfile']);
    Route::post('settings/avatar', [App\Http\Controllers\Api\Student\SettingsController::class, 'uploadAvatar']);
    Route::post('settings/password', [App\Http\Controllers\Api\Student\SettingsController::class, 'changePassword']);
    Route::get('settings/notifications', [App\Http\Controllers\Api\Student\SettingsController::class, 'getNotifications']);
    Route::put('settings/notifications', [App\Http\Controllers\Api\Student\SettingsController::class, 'updateNotifications']);
    Route::get('settings/preferences', [App\Http\Controllers\Api\Student\SettingsController::class, 'getPreferences']);
    Route::put('settings/preferences', [App\Http\Controllers\Api\Student\SettingsController::class, 'updatePreferences']);
    Route::post('settings/2fa/toggle', [App\Http\Controllers\Api\Student\SettingsController::class, 'toggle2FA']);
    
});










// Assistant Panel
Route::middleware(['auth:sanctum'])->prefix('assistant')->group(function () {
    // Gestion des Absences
    Route::get('/attendances/sessions', [AssistantAttendanceController::class, 'getSessions']);
    Route::post('/attendances/save', [AssistantAttendanceController::class, 'saveAttendance']);
    Route::get('/attendances/groups', [AssistantAttendanceController::class, 'getGroups']);
    
    // Justifications
    Route::get('/justifications', [AssistantJustificationController::class, 'index']);
    Route::post('/justifications/{id}/approve', [AssistantJustificationController::class, 'approve']);
    Route::post('/justifications/{id}/reject', [AssistantJustificationController::class, 'reject']);
    Route::get('/justifications/{id}/download', [AssistantJustificationController::class, 'download']);
    Route::get('/justifications/groups', [AssistantJustificationController::class, 'getGroups']);
    
    // Schedules
    Route::get('/schedules', [AssistantScheduleController::class, 'index']);
    Route::get('/schedules/groups', [AssistantScheduleController::class, 'getGroups']);
    Route::get('/schedules/professors', [AssistantScheduleController::class, 'getProfessors']);
    // Reports
    Route::get('/reports/stats', [AssistantReportController::class, 'getStats']);
    Route::post('/reports/generate', [AssistantReportController::class, 'generate']);
    Route::get('/reports/recent', [AssistantReportController::class, 'getRecent']);
    Route::get('/reports/groups', [AssistantReportController::class, 'getGroups']);
     // Delays
    Route::get('/delays', [AssistantDelayController::class, 'index']);
    Route::post('/delays/{id}/justify', [AssistantDelayController::class, 'justify']);
    Route::get('/delays/groups', [AssistantDelayController::class, 'getGroups']);
     // Settings
    Route::get('/settings/profile', [AssistantSettingsController::class, 'getProfile']);
    Route::put('/settings/profile', [AssistantSettingsController::class, 'updateProfile']);
    Route::post('/settings/avatar', [AssistantSettingsController::class, 'uploadAvatar']);
    Route::post('/settings/password', [AssistantSettingsController::class, 'changePassword']);
    Route::get('/settings/notifications', [AssistantSettingsController::class, 'getNotifications']);
    Route::put('/settings/notifications', [AssistantSettingsController::class, 'updateNotifications']);
    // Dashboard
    Route::get('/dashboard/stats', [AssistantDashboardController::class, 'getStats']);
    Route::get('/dashboard/today-absences', [AssistantDashboardController::class, 'getTodayAbsences']);
    Route::get('/dashboard/pending-justifications', [AssistantDashboardController::class, 'getPendingJustifications']);
    Route::get('/dashboard/top-absent-students', [AssistantDashboardController::class, 'getTopAbsentStudents']);
    Route::get('/dashboard/weekly-stats', [AssistantDashboardController::class, 'getWeeklyStats']);
});