<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use App\Models\Kid;
use App\Models\ChangeLog;
use App\Models\User;
use App\Jobs\DelayedDelete;
use LaravelFCM\Message\OptionsBuilder;
use LaravelFCM\Message\PayloadDataBuilder;
use LaravelFCM\Message\PayloadNotificationBuilder;
use Illuminate\Support\Facades\Log;
use FCM;
use File;
use Storage;

class MoveToCloud implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $upload;
    protected $log;

    public function __construct($data)
    {
        $this->upload = $data['upload'];
        $this->log    = $data['log'];
    }

    public function handle()
    {
        $disk = Storage::disk('gcs');
        $path = "img/users";

        $upload = $this->upload;

        $fileName  = $upload->fileName;
        $finalName = $upload->local_uri;
        $subpath = substr($fileName, 0, 2)."/".substr($fileName, 2 , 2);
        $path = $path."/".$subpath;

        if($disk->exists($finalName)){
            $fileName  = rand(0,10000)."_".$fileName;
            $finalName = $path."/".$fileName;
        }

        $localPath = storage_path('app/'.$upload->local_uri);
        $disk->put(
            $finalName, file_get_contents($localPath)
        );

        $publicURL = $disk->url($finalName);
        $upload->local_uri = $finalName;
        $upload->fileName = $fileName;
        $upload->src  = $publicURL;
        $upload->disk = 'gcs';
        $upload->save();

        $obj = $this->log->obj;
        $obj['url_server'] = $upload->src;
        $obj['file_name']  = $upload->fileName;
        $obj['uploaded'] = true;
        $this->log->obj = $obj;
        $this->log->save();
        DelayedDelete::dispatch($localPath)->delay(now()->addMinutes(12));

    }

}
