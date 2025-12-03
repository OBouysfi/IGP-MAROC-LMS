<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    protected function schedule(Schedule $schedule): void
    {
        $schedule->command('cache:clear')->dailyAt('03:00');
        $schedule->command('config:clear')->dailyAt('03:00');
        $schedule->command('route:clear')->dailyAt('03:00');
        $schedule->command('view:clear')->dailyAt('03:00');
        // Activer 2FA pour tous chaque lundi à 00h00
        $schedule->command('security:enable-2fa-all')
                ->weekly()
                ->mondays()
                ->at('00:00');
        
        // Déconnecter tous les appareils chaque dimanche à 23h00
        $schedule->command('security:logout-all')
                ->weekly()
                ->sundays()
                ->at('23:00');

        $schedule->command('attendance:mark-absent')
            ->dailyAt('23:00')
            ->timezone('Africa/Casablanca')
            ->appendOutputTo(storage_path('logs/attendance-auto.log'));
    }

    protected function commands(): void
    {
        $this->load(__DIR__.'/Commands');
        require base_path('routes/console.php');
    }
}