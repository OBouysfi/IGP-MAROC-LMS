<?php

namespace App\Http\Controllers\Api\Professor;

use App\Http\Controllers\Controller;
use App\Models\Professor;
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
        $professor = $user->professor;

        if (!$professor) {
            return response()->json(['message' => 'Professor not found'], 404);
        }

        return response()->json([
            'data' => [
                'first_name' => $user->first_name,
                'last_name' => $user->last_name,
                'email' => $user->email,
                'phone' => $professor->phone ?? '',
                'department' => $professor->department ?? '',
                'specialization' => $professor->specialization ?? '',
                'bio' => $professor->bio ?? '',
                'linkedin' => $professor->linkedin ?? '',
                'github' => $professor->github ?? '',
                // Fix ici - utiliser l'URL complète
                'avatar' => $user->avatar ? url('storage/' . $user->avatar) : null,
            ]
        ]);
    }

    public function updateProfile(Request $request): JsonResponse
    {
        $user = $request->user();
        $professor = $user->professor;

        if (!$professor) {
            return response()->json(['message' => 'Professor not found'], 404);
        }

        $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'specialization' => 'nullable|string|max:255',
            'bio' => 'nullable|string|max:1000',
            'linkedin' => 'nullable|url|max:255',
            'github' => 'nullable|url|max:255',
        ]);

        $user->update([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
        ]);

        $professor->update([
            'phone' => $request->phone,
            'specialization' => $request->specialization,
            'bio' => $request->bio,
            'linkedin' => $request->linkedin,
            'github' => $request->github,
        ]);

        return response()->json([
            'message' => 'Profil mis à jour avec succès',
            'data' => $professor
        ]);
    }

    public function uploadAvatar(Request $request): JsonResponse
    {
        $request->validate([
            'avatar' => 'required|image|mimes:jpg,jpeg,png,gif|max:2048',
        ]);

        $user = $request->user();

        // Delete old avatar if exists
        if ($user->avatar) {
            Storage::disk('public')->delete($user->avatar);
        }

        $path = $request->file('avatar')->store('avatars', 'public');

        $user->update(['avatar' => $path]);

        return response()->json([
            'message' => 'Photo de profil mise à jour',
            // Fix ici aussi
            'data' => ['avatar_url' => url('storage/' . $path)]
        ]);
    }

    public function changePassword(Request $request): JsonResponse
    {
        $request->validate([
            'current_password' => 'required',
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
        $professor = $request->user()->professor;

        if (!$professor) {
            return response()->json(['message' => 'Professor not found'], 404);
        }

        $settings = $professor->notification_settings ?? [
            'email_new_student' => true,
            'email_grade_reminder' => true,
            'email_session_reminder' => true,
            'email_document_download' => false,
            'push_new_message' => true,
            'push_session_start' => true,
            'push_grade_deadline' => true,
        ];

        return response()->json(['data' => $settings]);
    }

    public function updateNotifications(Request $request): JsonResponse
    {
        $professor = $request->user()->professor;

        if (!$professor) {
            return response()->json(['message' => 'Professor not found'], 404);
        }

        $professor->update([
            'notification_settings' => $request->all()
        ]);

        return response()->json([
            'message' => 'Préférences de notifications sauvegardées'
        ]);
    }

    public function getPreferences(Request $request): JsonResponse
    {
        $professor = $request->user()->professor;

        if (!$professor) {
            return response()->json(['message' => 'Professor not found'], 404);
        }

        $settings = $professor->preferences ?? [
            'language' => 'fr',
            'timezone' => 'Africa/Casablanca',
            'date_format' => 'DD/MM/YYYY',
            'theme' => 'light',
            'default_session_duration' => 60,
            'auto_share_documents' => true,
        ];

        return response()->json(['data' => $settings]);
    }

    public function updatePreferences(Request $request): JsonResponse
    {
        $professor = $request->user()->professor;

        if (!$professor) {
            return response()->json(['message' => 'Professor not found'], 404);
        }

        $professor->update([
            'preferences' => $request->all()
        ]);

        return response()->json([
            'message' => 'Préférences sauvegardées'
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