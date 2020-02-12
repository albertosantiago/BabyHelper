<?php namespace App\Api;

use App\Models\Device;
use Carbon\Carbon;
use Symfony\Component\HttpKernel\Exception\PreconditionFailedHttpException;

/**
 * Device Manager
 * @author Alberto Santiago <chucho@wetdog.co>
 */

class DeviceManager{

    public function __construct()
    {
        $this->dev = null;
    }

    public function getToken()
    {
        $req = app('request');
        $devToken  = ($req->header('Device-Token')) ?
                        $req->header('Device-Token'):
                        $req->input('deviceToken');
        return $devToken;
    }

    public function getCurrentDevice()
    {
        if($this->dev!==null){
            return $this->dev;
        }
        $devToken = app('deviceManager')->getToken();
        $dev =  Device::where('token', $devToken)->first();
        if(empty($dev)){
            throw new PreconditionFailedHttpException();
        }
        $this->dev = $dev;
        return $dev;
    }
}
