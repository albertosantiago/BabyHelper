<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Foundation\Bus\DispatchesJobs;
use App\Models\User;
use Mail;

class TestMail extends Command
{
    use DispatchesJobs;

    protected $signature = 'command:testMail';

    public function __construct()
    {
        parent::__construct();
    }

    public function handle()
    {
        $user = User::first();

        Mail::to($user)
            ->queue(new \App\Mail\ConfirmationCode($user));
    }

}
