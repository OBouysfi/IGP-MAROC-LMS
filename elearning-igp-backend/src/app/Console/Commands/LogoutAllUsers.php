<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class LogoutAllUsers extends Command
{
    protected $signature = 'security:logout-all';
    protected $description = 'Déconnecter tous les utilisateurs';

    public function handle()
    {
        // Supprimer tous les tokens
        DB::table('personal_access_tokens')->delete();
        
        $this->info("Tous les utilisateurs ont été déconnectés");
        
        return Command::SUCCESS;
    }
}