<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ConfirmMail extends Notification implements ShouldQueue
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
        $subject = $this->data['lang'] === 'en' 
            ? "Confirmation of your order for {$this->data['when']}"
            : "Confirmation de votre commande du {$this->data['when']}";

        return (new MailMessage)
            ->subject($subject)
            ->view('emails.confirm.html', $this->data);
    }
} 