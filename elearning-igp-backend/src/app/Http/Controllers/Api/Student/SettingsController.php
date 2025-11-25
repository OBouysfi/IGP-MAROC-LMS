<?php

namespace App\Http\Controllers\Api\Student;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rules\Password;

class SettingsController extends Controller
{
    public function getProfile(Request $request): JsonResponse
    {
        $user = $request->user();
        $student = $user->student;

        if (!$student) {
            return response()->json(['message' => 'Student not found'], 404);
        }

        return response()->json([
            'data' => [
                'first_name' => $user->first_name,
                'last_name' => $user->last_name,
                'email' => $user->email,
                'phone' => $student->phone ?? '',
                'date_of_birth' => $student->date_of_birth ?? '',
                'address' => $student->address ?? '',
                'student_id' => $student->student_code ?? '',
                'group' => $student->group ? $student->group->name : '',
                'bio' => $student->bio ?? '',
                'linkedin' => $student->linkedin ?? '',
                'github' => $student->github ?? '',
                'avatar' => $user->avatar ? url('storage/' . $user->avatar) : null,
            ]
        ]);
    }

    public function updateProfile(Request $request): JsonResponse
    {
        $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'date_of_birth' => 'nullable|date',
            'address' => 'nullable|string|max:500',
            'bio' => 'nullable|string|max:1000',
            'linkedin' => 'nullable|url|max:255',
            'github' => 'nullable|url|max:255',
        ]);

        $user = $request->user();
        $student = $user->student;

        if (!$student) {
            return response()->json(['message' => 'Student not found'], 404);
        }

        $user->update([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
        ]);

        $student->update([
            'phone' => $request->phone,
            'date_of_birth' => $request->date_of_birth,
            'address' => $request->address,
            'bio' => $request->bio,
            'linkedin' => $request->linkedin,
            'github' => $request->github,
        ]);

        return response()->json([
            'message' => 'Profil mis à jour avec succès',
            'data' => [
                'first_name' => $user->first_name,
                'last_name' => $user->last_name,
                'phone' => $student->phone,
                'date_of_birth' => $student->date_of_birth,
                'address' => $student->address,
                'bio' => $student->bio,
                'linkedin' => $student->linkedin,
                'github' => $student->github,
            ]
        ]);
    }

    public function uploadAvatar(Request $request): JsonResponse
    {
        $request->validate([
            'avatar' => 'required|image|mimes:jpg,jpeg,png,gif|max:2048',
        ]);

        $user = $request->user();

        if ($user->avatar) {
            Storage::disk('public')->delete($user->avatar);
        }

        $path = $request->file('avatar')->store('avatars', 'public');

        $user->update(['avatar' => $path]);

        return response()->json([
            'message' => 'Photo de profil mise à jour',
            'data' => ['avatar_url' => url('storage/' . $path)]
        ]);
    }

    public function changePassword(Request $request): JsonResponse
    {
        $request->validate([
            'current_password' => 'required|string',
            'new_password' => ['required', 'confirmed', Password::min(8)],
        ]);

        $user = $request->user();

        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'message' => 'Le mot de passe actuel est incorrect'
            ], 422);
        }

        $user->update([
            'password' => Hash::make($request->new_password)
        ]);

        return response()->json([
            'message' => 'Mot de passe modifié avec succès'
        ]);
    }

    public function getNotifications(Request $request): JsonResponse
    {
        $student = $request->user()->student;

        if (!$student) {
            return response()->json(['message' => 'Student not found'], 404);
        }

        $settings = $student->notification_settings ?? [
            'email_new_grade' => true,
            'email_new_resource' => true,
            'email_session_reminder' => true,
            'email_deadline_reminder' => true,
            'push_new_grade' => true,
            'push_session_start' => true,
            'push_new_document' => true,
            'push_announcements' => true,
        ];

        return response()->json(['data' => $settings]);
    }

    public function updateNotifications(Request $request): JsonResponse
    {
        $student = $request->user()->student;

        if (!$student) {
            return response()->json(['message' => 'Student not found'], 404);
        }

        $student->update([
            'notification_settings' => $request->all()
        ]);

        return response()->json([
            'message' => 'Préférences de notifications sauvegardées',
            'data' => $student->notification_settings
        ]);
    }

    public function getPreferences(Request $request): JsonResponse
    {
        $student = $request->user()->student;

        if (!$student) {
            return response()->json(['message' => 'Student not found'], 404);
        }

        $preferences = $student->preferences ?? [
            'language' => 'fr',
            'timezone' => 'Africa/Casablanca',
            'date_format' => 'DD/MM/YYYY',
            'theme' => 'light',
            'email_frequency' => 'immediate',
        ];

        return response()->json(['data' => $preferences]);
    }

    public function updatePreferences(Request $request): JsonResponse
    {
        $student = $request->user()->student;

        if (!$student) {
            return response()->json(['message' => 'Student not found'], 404);
        }

        $student->update([
            'preferences' => $request->all()
        ]);

        return response()->json([
            'message' => 'Préférences sauvegardées',
            'data' => $student->preferences
        ]);
    }

    public function toggle2FA(Request $request): JsonResponse
    {
        $user = $request->user();

        $user->update([
            'two_factor_enabled' => !$user->two_factor_enabled
        ]);

        return response()->json([
            'message' => $user->two_factor_enabled 
                ? 'Authentification à deux facteurs activée' 
                : 'Authentification à deux facteurs désactivée',
            'data' => ['two_factor_enabled' => $user->two_factor_enabled]
        ]);
    }
}