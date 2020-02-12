<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Foundation\Bus\DispatchesJobs;
use App\Jobs\SendNotifications;
use App\Models\ChangeLog;
use App\Models\User;
use App\Models\Kid;

class TestGoogleCloudStore extends Command
{
    use DispatchesJobs;

    protected $signature = 'command:testGoogle';
    protected $description = 'Command description';
    public function __construct()
    {
        parent::__construct();
    }

    public function handle()
    {
        $changeLog = ChangeLog::first();
        $this->dispatch(new SendNotifications([
            'changeLog' => $changeLog,
            'type' => 'note'
        ]));
        $kid = Kid::first();
        $user = User::first();
        $this->dispatch(new SendNotifications([
            'kid'  => $kid,
            'user' => $user,
            'type' => 'new-editor'
        ]));
    }
}
