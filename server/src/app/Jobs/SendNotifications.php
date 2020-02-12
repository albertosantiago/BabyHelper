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
use LaravelFCM\Message\OptionsBuilder;
use LaravelFCM\Message\PayloadDataBuilder;
use LaravelFCM\Message\PayloadNotificationBuilder;
use Illuminate\Support\Facades\Log;
use FCM;

class SendNotifications implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $data;

    public function __construct($data)
    {
        $this->data = $data;
    }

    public function handle()
    {
        try{
            $message = $this->generateMessage();
            $tokens  = $this->getInvolvedDevices();
            if(sizeOf($tokens)!==0){
                $this->sendNotification($tokens, $message);
            }
            //Para debug
            //$downstreamResponse = $this->sendNotification($tokens, $message);
            //$this->processDownStream($downstreamResponse);
        }catch(\Exception $e){
            Log::info("MESSAGE: ".$e->getMessage());
            Log::info("CODE: ".$e->getCode());
            Log::info("FILE: ".$e->getFile());
            Log::info("LINE: ".$e->getLine());
        }
    }

    protected function generateMessage()
    {
        if($this->data['type'] == 'upload'){
            $owner = $this->data['changeLog']->user;
            $kidString = $this->getInvolvedKids();
            if($this->data['changeLog']->obj['type']==='video'){
                $message = $owner->name." ha subido un video de ".$kidString;
            }else{
                $message = $owner->name." ha subido una imagen de ".$kidString;
            }
            return $message;
        }
        if($this->data['type'] == 'note'){
            $owner = $this->data['changeLog']->user;
            $kidString = $this->getInvolvedKids();
            $message = $owner->name." ha realizado una anotación de ".$kidString;
            return $message;
        }
        if($this->data['type'] == 'new-editor'){
            $newUser = $this->data['user'];
            $kid     = $this->data['kid'];
            $message = $newUser->name." ha sido añadido a la lista de editores de ".$kid->name;
            return $message;
        }
    }

    protected function getInvolvedDevices(){
        $tokens = [];
        if(($this->data['type'] == 'note')||($this->data['type'] == 'upload')){
            $kids = $this->data['changeLog']->kids;
            $users = [];
            foreach($kids as $kid){
                foreach($kid->editors as $user){
                    $users[] = $user;
                }
                $users[] = $kid->user;
            }
            array_unique($users);
            for($i=0;$i<sizeOf($users);$i++){
                if($users[$i]->id===$this->data['changeLog']->user->id){
                    unset($users[$i]);
                }
            }
            $users = array_values($users);
            foreach($users as $user){
                if(!empty($user->device)){
                    $tokens[] = $user->device->fcmToken;
                }
            }
        }
        if($this->data['type'] == 'new-editor'){
            $tokens[] = $this->data['kid']->user->device->fcmToken;
        }
        return $tokens;
    }

    protected function getInvolvedKids(){
        $kids = $this->data['changeLog']->kids;
        if(count($kids)==1){
            return $kids[0]->name;
        }
        if(count($kids)==2){
            return $kids[0]->name." y ".$kids[1]->name;
        }
        $totalKids = count($kids);
        $string = "";
        for($i=0; $i<$totalKids;$i++){
            $string .= $kids[$i]->name;
            if($i<($totalKids-2)){
                $string = $string.", ";
            }
            if($i<($totalKids-1)){
                $string = $string." y ";
            }
        }
        return $string;
    }

    protected function sendNotification($tokens, $body)
    {
        $optionBuilder = new OptionsBuilder();
        $optionBuilder->setTimeToLive(60*20);
        $optionBuilder->setPriority('high');

        $notificationBuilder = new PayloadNotificationBuilder('BabyHelper');
        $notificationBuilder->setBody($body)
        				    ->setSound('default');

        $option = $optionBuilder->build();
        $notification = $notificationBuilder->build();

        return FCM::sendTo($tokens, $option, $notification);
    }

    protected function sendDataMessage($tokens, $data)
    {
        $optionBuilder = new OptionsBuilder();
        $optionBuilder->setTimeToLive(60*20);
        $optionBuilder->setPriority('high');

        $dataBuilder = new PayloadDataBuilder();
        $dataBuilder->addData($data);

        $option = $optionBuilder->build();
        $data = $dataBuilder->build();

        return FCM::sendTo($tokens, $option, null, $data);
    }

    protected function sendComposed($tokens, $body)
    {
        $optionBuilder = new OptionsBuilder();
        $optionBuilder->setTimeToLive(60*20);
        $optionBuilder->setPriority('high');

        $dataBuilder = new PayloadDataBuilder();
        $dataBuilder->addData($data);

        $notificationBuilder = new PayloadNotificationBuilder('BabyHelper');
        $notificationBuilder->setBody($body)
        				    ->setSound('default');

        $option = $optionBuilder->build();
        $data   = $dataBuilder->build();
        $notification = $notificationBuilder->build();

        return FCM::sendTo($tokens, $option, $notification, $data);
    }

    protected function processDownStream($downstreamResponse)
    {
        $ret = $downstreamResponse->numberSuccess();
        Log::info(print_r($ret, true));
        $ret = $downstreamResponse->numberFailure();
        Log::info(print_r($ret, true));
        $ret = $downstreamResponse->numberModification();
        Log::info(print_r($ret, true));
        //return Array - you must remove all this tokens in your database
        $ret = $downstreamResponse->tokensToDelete();
        Log::info(print_r($ret, true));
        //return Array (key : oldToken, value : new token - you must change the token in your database )
        $ret = $downstreamResponse->tokensToModify();
        Log::info(print_r($ret, true));
        //return Array - you should try to resend the message to the tokens in the array
        $ret = $downstreamResponse->tokensToRetry();
        Log::info(print_r($ret, true));
    }

}
