<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;

class EnableTwoFactorForAll extends Command
{
    protected $signature = 'security:enable-2fa-all';
    protected $description = 'Activer 2FA pour tous les utilisateurs';

    public function handle()
    {
        $count = User::where('two_factor_enabled', false)->update([
            'two_factor_enabled' => true,
        ]);

        $this->info("2FA activé pour {$count} utilisateurs");
        
        return Command::SUCCESS;
    }
}