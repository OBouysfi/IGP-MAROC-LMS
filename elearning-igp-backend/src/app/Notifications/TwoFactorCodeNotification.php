<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class TwoFactorCodeNotification extends Notification
{
    use Queueable;

    public function __construct(public string $code) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $notifiable->refresh();
        
        $fullName = trim(($notifiable->first_name ?? '') . ' ' . ($notifiable->last_name ?? ''));
        
        if (empty($fullName)) {
            $fullName = $notifiable->email;
        }
        
        return (new MailMessage)
            ->subject('🔐 Code de vérification - IGP Maroc')
            ->view('emails.two-factor-code', [
                'code' => $this->code,
                'userName' => $fullName
            ]);
    }
}