<?php

namespace App\Services;

use App\Models\User;
use App\Notifications\TwoFactorCodeNotification;

class TwoFactorService
{
    public function generateCode(): string
    {
        return str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
    }

    public function sendCode(User $user): void
    {
        $code = $this->generateCode();
        
        $user->update([
            'two_factor_code' => $code,
            'two_factor_expires_at' => now()->addMinutes(10),
        ]);

        $user->notify(new TwoFactorCodeNotification($code));
    }

    public function verifyCode(User $user, string $code): bool
    {
        if (!$user->two_factor_code || $user->two_factor_code !== $code) {
            return false;
        }

        if ($user->two_factor_expires_at < now()) {
            return false;
        }

        return true;
    }

    public function clearCode(User $user): void
    {
        $user->update([
            'two_factor_code' => null,
            'two_factor_expires_at' => null,
        ]);
    }
}