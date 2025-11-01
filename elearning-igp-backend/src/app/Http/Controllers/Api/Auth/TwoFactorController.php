<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\VerifyTwoFactorRequest;
use App\Http\Requests\Auth\ResendTwoFactorRequest;
use App\Models\User;
use App\Models\LoginLog;
use App\Notifications\TwoFactorCodeNotification;
use Illuminate\Http\JsonResponse;

class TwoFactorController extends Controller
{
    public function verify(VerifyTwoFactorRequest $request): JsonResponse
    {
        $user = User::where('email', $request->email)->first();

        if (!$user->two_factor_code || $user->two_factor_code !== $request->code) {
            LoginLog::create([
                'user_id' => $user->id,
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'status' => 'failed',
                'reason' => '2FA code invalid',
            ]);

            return response()->json([
                'message' => 'Code invalide',
            ], 401);
        }

        if ($user->two_factor_expires_at < now()) {
            return response()->json([
                'message' => 'Code expiré',
            ], 401);
        }

        // Clear 2FA
        $user->update([
            'two_factor_code' => null,
            'two_factor_expires_at' => null,
            'last_login_at' => now(),
            'last_login_ip' => $request->ip(),
            'failed_login_attempts' => 0,
        ]);

        // Create token
        $token = $user->createToken('auth_token', ['*'], now()->addMinutes(60))->plainTextToken;

        // Log success
        LoginLog::create([
            'user_id' => $user->id,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'status' => 'success',
        ]);

        return response()->json([
            'message' => 'Connexion réussie',
            'token' => $token,
            'user' => $user->load('roles', 'permissions'),
        ]);
    }

    public function resend(ResendTwoFactorRequest $request): JsonResponse
    {
        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'message' => 'Utilisateur introuvable',
            ], 404);
        }

        $code = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
        
        $user->update([
            'two_factor_code' => $code,
            'two_factor_expires_at' => now()->addMinutes(10),
        ]);

        $user->notify(new TwoFactorCodeNotification($code));

        return response()->json([
            'message' => 'Nouveau code envoyé',
        ]);
    }
}