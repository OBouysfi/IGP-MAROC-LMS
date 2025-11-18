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
    });
});