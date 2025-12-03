<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;

class SettingsController extends Controller
{
    // ==================== GENERAL SETTINGS ====================
    
    public function getGeneral(): JsonResponse
    {
        $settings = Setting::whereIn('key', [
            'school_name', 'school_email', 'school_phone', 'school_address',
            'academic_year', 'website', 'timezone', 'language', 'logo'
        ])->pluck('value', 'key');

        $defaults = [
            'school_name' => 'IGP Maroc',
            'school_email' => 'contact@igp.edu',
            'school_phone' => '+212 5 22 12 34 56',
            'school_address' => '123 Boulevard Mohammed V, Casablanca',
            'academic_year' => '2024-2025',
            'website' => 'https://www.igp.edu',
            'timezone' => 'Africa/Casablanca',
            'language' => 'fr',
            'logo' => null,
        ];

        return response()->json(['data' => array_merge($defaults, $settings->toArray())]);
    }

    public function updateGeneral(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'school_name' => ['required', 'string', 'max:255'],
            'school_email' => ['required', 'email'],
            'school_phone' => ['nullable', 'string', 'max:20'],
            'school_address' => ['nullable', 'string', 'max:500'],
            'academic_year' => ['required', 'string', 'max:20'],
            'website' => ['nullable', 'url'],
            'timezone' => ['required', 'string'],
            'language' => ['required', 'in:fr,ar,en'],
        ]);

        foreach ($validated as $key => $value) {
            Setting::updateOrCreate(['key' => $key], ['value' => $value]);
        }

        return response()->json(['message' => 'Paramètres mis à jour avec succès']);
    }

    public function uploadLogo(Request $request): JsonResponse
    {
        $request->validate([
            'logo' => ['required', 'image', 'mimes:png,jpg,jpeg,svg', 'max:2048'],
        ]);

        $oldLogo = Setting::where('key', 'logo')->first();
        if ($oldLogo && $oldLogo->value) {
            Storage::disk('public')->delete($oldLogo->value);
        }

        $path = $request->file('logo')->store('settings', 'public');
        Setting::updateOrCreate(['key' => 'logo'], ['value' => $path]);

        return response()->json(['data' => ['path' => $path]]);
    }

    // ==================== ADMINISTRATORS & ASSISTANTS ====================

    public function getAdmins(): JsonResponse
    {
        // Utiliser Spatie Permission pour filtrer par rôle
        $admins = User::role(['admin', 'assistant'])
            ->select('id', 'first_name', 'last_name', 'email', 'is_active', 'created_at', 'updated_at')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($user) {
                // Récupérer le premier rôle de l'utilisateur
                $role = $user->roles->first()?->name ?? 'admin';
                
                return [
                    'id' => $user->id,
                    'name' => $user->first_name . ' ' . $user->last_name,
                    'first_name' => $user->first_name,
                    'last_name' => $user->last_name,
                    'email' => $user->email,
                    'role' => $role,
                    'is_active' => $user->is_active,
                    'created_at' => $user->created_at->format('Y-m-d'),
                    'last_login' => $user->updated_at->format('Y-m-d H:i'),
                ];
            });

        return response()->json(['data' => $admins]);
    }

    public function createAdmin(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8'],
            'role' => ['required', 'in:admin,assistant'],
        ]);

        $user = User::create([
            'first_name' => $validated['first_name'],
            'last_name' => $validated['last_name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'is_active' => true,
        ]);

        // Assigner le rôle avec Spatie
        $user->assignRole($validated['role']);

        return response()->json([
            'message' => 'Utilisateur créé avec succès',
            'data' => [
                'id' => $user->id,
                'name' => $user->first_name . ' ' . $user->last_name,
                'email' => $user->email,
                'role' => $validated['role'],
                'is_active' => $user->is_active,
                'created_at' => $user->created_at->format('Y-m-d'),
            ]
        ], 201);
    }

    public function updateAdmin(Request $request, $id): JsonResponse
    {
        $user = User::role(['admin', 'assistant'])->findOrFail($id);

        $validated = $request->validate([
            'first_name' => ['sometimes', 'string', 'max:255'],
            'last_name' => ['sometimes', 'string', 'max:255'],
            'email' => ['sometimes', 'email', 'unique:users,email,' . $id],
            'password' => ['nullable', 'string', 'min:8'],
            'role' => ['sometimes', 'in:admin,assistant'],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        // Gérer le mot de passe
        if (!empty($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }

        // Gérer le rôle séparément
        $newRole = $validated['role'] ?? null;
        unset($validated['role']);

        $user->update($validated);

        // Changer le rôle si nécessaire
        if ($newRole) {
            $user->syncRoles([$newRole]);
        }

        return response()->json([
            'message' => 'Utilisateur mis à jour avec succès',
            'data' => [
                'id' => $user->id,
                'name' => $user->first_name . ' ' . $user->last_name,
                'email' => $user->email,
                'role' => $user->roles->first()?->name,
                'is_active' => $user->is_active,
            ]
        ]);
    }

    public function deleteAdmin($id): JsonResponse
    {
        $user = User::role(['admin', 'assistant'])->findOrFail($id);
        
        // Empêcher la suppression du dernier admin
        if ($user->hasRole('admin') && User::role('admin')->count() <= 1) {
            return response()->json(['message' => 'Impossible de supprimer le dernier administrateur'], 422);
        }

        $user->delete();

        return response()->json(['message' => 'Utilisateur supprimé avec succès']);
    }

    public function toggleAdminStatus($id): JsonResponse
    {
        $user = User::role(['admin', 'assistant'])->findOrFail($id);
        $user->update(['is_active' => !$user->is_active]);

        return response()->json([
            'message' => $user->is_active ? 'Utilisateur activé' : 'Utilisateur désactivé',
            'is_active' => $user->is_active
        ]);
    }

    // ==================== ROLES (LECTURE SEULE) ====================

    public function getRoles(): JsonResponse
    {
        $roles = [
            [
                'id' => 1,
                'name' => 'Admin',
                'slug' => 'admin',
                'description' => 'Accès complet à toutes les fonctionnalités',
                'users_count' => User::role('admin')->count(),
                'color' => 'purple',
            ],
            [
                'id' => 2,
                'name' => 'Assistant',
                'slug' => 'assistant',
                'description' => 'Gestion administrative et support',
                'users_count' => User::role('assistant')->count(),
                'color' => 'blue',
            ],
            [
                'id' => 3,
                'name' => 'Professeur',
                'slug' => 'professor',
                'description' => 'Gestion des cours, notes et présences',
                'users_count' => User::role('professor')->count(),
                'color' => 'green',
            ],
            [
                'id' => 4,
                'name' => 'Étudiant',
                'slug' => 'student',
                'description' => 'Accès aux cours, notes et documents',
                'users_count' => User::role('student')->count(),
                'color' => 'orange',
            ],
        ];

        return response()->json(['data' => $roles]);
    }

    // ==================== SECURITY SETTINGS ====================

    public function getSecurity(): JsonResponse
    {
        $settings = Setting::whereIn('key', [
            'enable_2fa', 'session_timeout', 'max_login_attempts',
            'password_min_length', 'require_uppercase', 'require_numbers', 'require_special'
        ])->pluck('value', 'key');

        $defaults = [
            'enable_2fa' => 'true',
            'session_timeout' => '30',
            'max_login_attempts' => '5',
            'password_min_length' => '8',
            'require_uppercase' => 'true',
            'require_numbers' => 'true',
            'require_special' => 'true',
        ];

        $data = array_merge($defaults, $settings->toArray());

        return response()->json(['data' => [
            'enable_2fa' => $data['enable_2fa'] === 'true',
            'session_timeout' => (int) $data['session_timeout'],
            'max_login_attempts' => (int) $data['max_login_attempts'],
            'password_min_length' => (int) $data['password_min_length'],
            'require_uppercase' => $data['require_uppercase'] === 'true',
            'require_numbers' => $data['require_numbers'] === 'true',
            'require_special' => $data['require_special'] === 'true',
        ]]);
    }

    public function updateSecurity(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'enable_2fa' => ['required', 'boolean'],
            'session_timeout' => ['required', 'integer', 'min:5', 'max:120'],
            'max_login_attempts' => ['required', 'integer', 'min:3', 'max:10'],
            'password_min_length' => ['required', 'integer', 'min:6', 'max:32'],
            'require_uppercase' => ['required', 'boolean'],
            'require_numbers' => ['required', 'boolean'],
            'require_special' => ['required', 'boolean'],
        ]);

        foreach ($validated as $key => $value) {
            Setting::updateOrCreate(
                ['key' => $key], 
                ['value' => is_bool($value) ? ($value ? 'true' : 'false') : (string) $value]
            );
        }

        return response()->json(['message' => 'Paramètres de sécurité mis à jour avec succès']);
    }

    public function enableTwoFactorForAll(): JsonResponse
    {
        $count = User::where('two_factor_enabled', false)->update([
            'two_factor_enabled' => true,
        ]);

        return response()->json([
            'message' => "2FA activé pour {$count} utilisateurs",
            'count' => $count,
        ]);
    }

    public function logoutAllUsers(): JsonResponse
    {
        $currentUser = auth()->user();
        
        // Supprimer tous les tokens SAUF l'utilisateur actuel
        \DB::table('personal_access_tokens')
            ->where('tokenable_id', '!=', $currentUser->id)
            ->delete();

        return response()->json([
            'message' => 'Tous les utilisateurs ont été déconnectés',
        ]);
    }

    // ==================== SESSIONS & SECURITY LOGS ====================

    
    public function getSessionsStats(): JsonResponse
    {
        $activeSessions = DB::table('sessions')->whereNotNull('user_id')->count();
        
        $todayLogins = DB::table('login_logs')
            ->whereDate('created_at', today())
            ->where('status', 'success')
            ->count();
        
        $failedAttempts = DB::table('login_attempts')
            ->where('successful', false)
            ->whereDate('attempted_at', today())
            ->count();
        
        $lockedUsers = User::where('is_locked', true)->count();

        return response()->json([
            'data' => [
                'active_sessions' => $activeSessions,
                'today_logins' => $todayLogins,
                'failed_attempts' => $failedAttempts,
                'locked_users' => $lockedUsers,
            ]
        ]);
    }

    public function getSessions(): JsonResponse
    {
        $sessions = DB::table('sessions')
            ->leftJoin('users', 'sessions.user_id', '=', 'users.id')
            ->select(
                'sessions.id',
                'sessions.user_id',
                'sessions.ip_address',
                'sessions.user_agent',
                'sessions.last_activity',
                'users.first_name',
                'users.last_name',
                'users.email'
            )
            ->whereNotNull('sessions.user_id')
            ->orderBy('sessions.last_activity', 'desc')
            ->get()
            ->map(function ($session) {
                return [
                    'id' => $session->id,
                    'user_id' => $session->user_id,
                    'user_name' => ($session->first_name ?? '') . ' ' . ($session->last_name ?? ''),
                    'user_email' => $session->email ?? '',
                    'ip_address' => $session->ip_address,
                    'device' => $this->parseUserAgent($session->user_agent),
                    'last_activity' => date('Y-m-d H:i:s', $session->last_activity),
                    'is_current' => $session->id === session()->getId(),
                ];
            });

        return response()->json(['data' => $sessions]);
    }

    public function destroySession($sessionId): JsonResponse
    {
        DB::table('sessions')->where('id', $sessionId)->delete();
        
        return response()->json(['message' => 'Session terminée avec succès']);
    }

    public function destroyAllSessions(): JsonResponse
    {
        $currentSessionId = session()->getId();
        
        DB::table('sessions')
            ->where('id', '!=', $currentSessionId)
            ->delete();
        
        return response()->json(['message' => 'Toutes les autres sessions ont été terminées']);
    }

    public function getLoginLogs(): JsonResponse
    {
        $logs = DB::table('login_logs')
            ->leftJoin('users', 'login_logs.user_id', '=', 'users.id')
            ->select(
                'login_logs.*',
                'users.first_name',
                'users.last_name',
                'users.email'
            )
            ->orderBy('login_logs.created_at', 'desc')
            ->limit(100)
            ->get()
            ->map(function ($log) {
                return [
                    'id' => $log->id,
                    'user_name' => ($log->first_name ?? '') . ' ' . ($log->last_name ?? ''),
                    'user_email' => $log->email ?? '',
                    'ip_address' => $log->ip_address,
                    'device' => $this->parseUserAgent($log->user_agent),
                    'status' => $log->status,
                    'reason' => $log->reason,
                    'created_at' => $log->created_at,
                ];
            });

        return response()->json(['data' => $logs]);
    }

    public function getLoginAttempts(): JsonResponse
    {
        $attempts = DB::table('login_attempts')
            ->orderBy('attempted_at', 'desc')
            ->limit(100)
            ->get()
            ->map(function ($attempt) {
                return [
                    'id' => $attempt->id,
                    'email' => $attempt->email,
                    'ip_address' => $attempt->ip_address,
                    'device' => $this->parseUserAgent($attempt->user_agent),
                    'successful' => (bool) $attempt->successful,
                    'attempted_at' => $attempt->attempted_at,
                ];
            });

        return response()->json(['data' => $attempts]);
    }

    public function getLockedUsers(): JsonResponse
    {
        $users = User::where('is_locked', true)
            ->select('id', 'first_name', 'last_name', 'email', 'locked_at', 'locked_reason', 'failed_login_attempts')
            ->get()
            ->map(fn($user) => [
                'id' => $user->id,
                'name' => $user->first_name . ' ' . $user->last_name,
                'email' => $user->email,
                'locked_at' => $user->locked_at,
                'locked_reason' => $user->locked_reason,
                'failed_attempts' => $user->failed_login_attempts,
            ]);

        return response()->json(['data' => $users]);
    }

    public function unlockUser($id): JsonResponse
    {
        $user = User::findOrFail($id);
        $user->update([
            'is_locked' => false,
            'locked_at' => null,
            'locked_reason' => null,
            'failed_login_attempts' => 0,
        ]);

        return response()->json(['message' => 'Utilisateur déverrouillé avec succès']);
    }

    private function parseUserAgent(?string $userAgent): array
    {
        if (!$userAgent) {
            return ['browser' => 'Inconnu', 'os' => 'Inconnu', 'device' => 'Desktop'];
        }

        $browser = 'Autre';
        $os = 'Autre';
        $device = 'Desktop';

        if (str_contains($userAgent, 'Chrome') && !str_contains($userAgent, 'Edge')) $browser = 'Chrome';
        elseif (str_contains($userAgent, 'Firefox')) $browser = 'Firefox';
        elseif (str_contains($userAgent, 'Safari') && !str_contains($userAgent, 'Chrome')) $browser = 'Safari';
        elseif (str_contains($userAgent, 'Edge')) $browser = 'Edge';

        if (str_contains($userAgent, 'Windows')) $os = 'Windows';
        elseif (str_contains($userAgent, 'Mac')) $os = 'MacOS';
        elseif (str_contains($userAgent, 'Linux') && !str_contains($userAgent, 'Android')) $os = 'Linux';
        elseif (str_contains($userAgent, 'Android')) { $os = 'Android'; $device = 'Mobile'; }
        elseif (str_contains($userAgent, 'iPhone') || str_contains($userAgent, 'iPad')) { $os = 'iOS'; $device = 'Mobile'; }

        return ['browser' => $browser, 'os' => $os, 'device' => $device];
    }
}