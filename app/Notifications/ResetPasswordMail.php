<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ResetPasswordMail extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        private array $data
    ) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject($this->data['lang'] === 'en' ? 'Reset your password' : 'Réinitialisation de votre mot de passe')
            ->view('emails.reset-password.html', $this->data);
    }
} 