<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class RecoveryPassword extends Mailable
{
    use Queueable, SerializesModels;

    public $passwordRequest;

    public function __construct($passwordRequest)
    {
        $this->passwordRequest = $passwordRequest;
    }

    public function build()
    {
        return $this->from('no-reply@babyhelper.info')
                    ->view('emails.password_recovery');
    }
}
