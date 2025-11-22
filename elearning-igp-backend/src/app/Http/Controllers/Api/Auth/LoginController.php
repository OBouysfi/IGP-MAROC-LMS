<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\User;
use App\Models\LoginAttempt;
use App\Models\LoginLog;
use App\Notifications\TwoFactorCodeNotification;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;

class LoginController extends Controller
{
    public function __invoke(LoginRequest $request): JsonResponse
    {
        $user = User::where('email', $request->email)->first();

        LoginAttempt::create([
            'email' => $request->email,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'successful' => false,
            'attempted_at' => now(),
        ]);

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Email ou mot de passe incorrect',
            ], 401);
        }

        if (!$user->is_active) {
            return response()->json([
                'message' => 'Votre compte est désactivé',
            ], 403);
        }

        if ($user->is_locked) {
            return response()->json([
                'message' => 'Votre compte est verrouillé',
            ], 403);
        }

        // Récupérer le rôle de l'utilisateur
        $role = $user->getRoleNames()->first();

        // Vérifier si le rôle sélectionné correspond au rôle de l'utilisateur
        if ($request->has('role') && $request->role !== $role) {
            return response()->json([
                'message' => 'Accès refusé. Veuillez sélectionner votre espace correct.',
            ], 403);
        }

        // ========== VÉRIFIER SI 2FA EST ACTIVÉ ==========
        if ($user->two_factor_enabled) {
            // 2FA activé → Envoyer le code
            $code = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
            
            $user->update([
                'two_factor_code' => $code,
                'two_factor_expires_at' => now()->addMinutes(10),
            ]);

            $user->notify(new TwoFactorCodeNotification($code));

            LoginLog::create([
                'user_id' => $user->id,
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'status' => '2fa_sent',
            ]);

            return response()->json([
                'message' => 'Code de vérification envoyé',
                'email' => $user->email,
                'requires_2fa' => true,
                'user' => [
                    'id' => $user->id,
                    'first_name' => $user->first_name,
                    'last_name' => $user->last_name,
                    'email' => $user->email,
                    'role' => $role,
                ],
            ]);
        }

        // ========== 2FA DÉSACTIVÉ → Connexion directe ==========
        LoginAttempt::where('email', $request->email)
            ->latest('attempted_at')
            ->first()
            ?->update(['successful' => true]);

        LoginLog::create([
            'user_id' => $user->id,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'status' => 'success',
        ]);

        $user->update([
            'last_login_at' => now(),
            'last_login_ip' => $request->ip(),
            'failed_login_attempts' => 0,
        ]);

        // Créer le token directement
        $token = $user->createToken('auth-token', ['*'], now()->addHours(1))->plainTextToken;

        return response()->json([
            'message' => 'Connexion réussie',
            'requires_2fa' => false,
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'first_name' => $user->first_name,
                'last_name' => $user->last_name,
                'email' => $user->email,
                'role' => $role,
            ],
        ]);
    }
}