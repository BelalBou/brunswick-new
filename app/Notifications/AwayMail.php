<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class AwayMail extends Notification implements ShouldQueue
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
            ? "Supplier on vacation for your order {$this->data['when']}"
            : "Fournisseur en vacance pour votre commande du {$this->data['when']}";

        return (new MailMessage)
            ->subject($subject)
            ->view('emails.away.html', $this->data);
    }
} 