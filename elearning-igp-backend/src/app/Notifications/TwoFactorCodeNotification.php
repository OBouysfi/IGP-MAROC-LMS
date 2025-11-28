<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class TwoFactorCodeNotification extends Notification
{
    use Queueable;

    public function __construct(public string $code)
    {
    }

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $notifiable->refresh();
        
        $fullName = trim(($notifiable->first_name ?? '') . ' ' . ($notifiable->last_name ?? ''));
        
        // Fallback si vide
        if (empty($fullName)) {
            $fullName = $notifiable->email;
        }
        
        return (new MailMessage)
            ->subject('Code de vérification - IGP Maroc')
            ->greeting('Bonjour ' . $fullName . ',')
            ->line('Votre code de vérification à deux facteurs est :')
            ->line('**' . $this->code . '**')
            ->line('Ce code expire dans 10 minutes.')
            ->line('Si vous n\'avez pas demandé ce code, ignorez cet email.')
            ->salutation('Cordialement, L\'équipe IGP Maroc');
    }
}