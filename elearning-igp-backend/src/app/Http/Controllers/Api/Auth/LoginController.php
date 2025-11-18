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

        // Log attempt
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

        // Generate 2FA code
        $code = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
        
        $user->update([
            'two_factor_code' => $code,
            'two_factor_expires_at' => now()->addMinutes(10),
        ]);

        // Send email
        $user->notify(new TwoFactorCodeNotification($code));

        // Log
        LoginLog::create([
            'user_id' => $user->id,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'status' => '2fa_sent',
        ]);

        // Récupérer le rôle de l'utilisateur
        $role = $user->getRoleNames()->first();

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
}