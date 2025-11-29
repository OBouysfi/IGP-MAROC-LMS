<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\ForgotPasswordRequest;
use App\Http\Requests\Auth\ResetPasswordRequest;
use App\Models\User;
use App\Notifications\ResetPasswordNotification;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class PasswordResetController extends Controller
{
    public function forgot(ForgotPasswordRequest $request): JsonResponse
    {
        \Log::info('=== PASSWORD RESET REQUEST ===');
        \Log::info('Email: ' . $request->email);
        
        $user = User::where('email', $request->email)->first();
        
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Utilisateur introuvable',
            ], 404);
        }

        // Générer token
        $token = Str::random(60);
        
        // Sauvegarder dans la table password_reset_tokens
        DB::table('password_reset_tokens')->updateOrInsert(
            ['email' => $user->email],
            [
                'token' => Hash::make($token),
                'created_at' => now(),
            ]
        );

        // Envoyer email DIRECTEMENT comme 2FA
        $user->notify(new ResetPasswordNotification($token));

        \Log::info('Password reset email sent successfully');

        return response()->json([
            'success' => true,
            'message' => 'Lien de réinitialisation envoyé à votre email',
        ]);
    }

    public function reset(ResetPasswordRequest $request): JsonResponse
    {
        $user = User::where('email', $request->email)->first();
        
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Utilisateur introuvable',
            ], 404);
        }

        // Vérifier le token
        $tokenData = DB::table('password_reset_tokens')
            ->where('email', $request->email)
            ->first();

        if (!$tokenData || !Hash::check($request->token, $tokenData->token)) {
            return response()->json([
                'success' => false,
                'message' => 'Token invalide',
            ], 400);
        }

        // Vérifier expiration (60 minutes)
        if (now()->diffInMinutes($tokenData->created_at) > 60) {
            return response()->json([
                'success' => false,
                'message' => 'Token expiré',
            ], 400);
        }

        // Mettre à jour le mot de passe
        $user->update([
            'password' => Hash::make($request->password),
        ]);

        // Supprimer le token
        DB::table('password_reset_tokens')->where('email', $request->email)->delete();

        return response()->json([
            'success' => true,
            'message' => 'Mot de passe réinitialisé avec succès',
        ]);
    }
}