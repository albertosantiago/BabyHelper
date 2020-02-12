<?php namespace App\Api;

use Carbon\Carbon;
use Tymon\JWTAuth\Facades\JWTAuth;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use App\Models\User;
use App\Models\UserLog;
use Illuminate\Support\Facades\Log;
use Request;
/**
 * Device Manager
 * @author Alberto Santiago <chucho@wetdog.co>
 */

class UserManager{

    public function __construct()
    {
        $this->currentUser = null;
    }

    public function make($data)
    {
        $user = new User();
        $user->version  = 0;
        $user->loggedBy = $data['loggedBy'];
        $user->email = $data['email'];
        $user->name  = $data['name'];
        $user->name  = $data['name'];
        $user->local_id = $data['local_id'];
        $user->confirmed  = $data['confirmed'];
        $user->registered = $data['registered'];
        $user->last_ip    = app('request')->getClientIp();

        //Solo para usuarios con login de mail.
        if($data['loggedBy']=='email'){
            $user->password = $data['password'];
            $user->confirmation_code = $data['confirmation_code'];
        }
        //Registramos el dispositivo desde donde se crea el usuario.
        $dev  = app('deviceManager')->getCurrentDevice();
        $dev->user_id = $user->id;
        $dev->save();
        return $user;
    }

    public function create($data)
    {
        $user = $this->make($data);
        $user->save();
        $this->_log($user,'register');
        return $user;
    }

    public function getCurrentUser()
    {
        try{
            if ((app()->environment() == 'testing') && array_key_exists('HTTP_AUTHORIZATION',  \Request::server())) {
                if($this->currentUser!==null){
                    $user = $this->currentUser;
                    $this->currentUser = null;
                    return $user;
                }else{
                    $request = app('request');
                    JWTAuth::setRequest($request);
                    return JWTAuth::parseToken()->authenticate();
                }
            }else{
                if($this->currentUser==null){
                    $this->currentUser = JWTAuth::parseToken()->authenticate();
                }
                return $this->currentUser;
            }
        }catch(\Exception $e){
            throw new AccessDeniedHttpException();
        }
    }

    public function updateUserInfo($user, $action='logged')
    {
        $lastIp = app('request')->getClientIp();
        $dev = app('deviceManager')->getCurrentDevice();
        $dev->user_id = $user->id;
        $dev->last_ip = $lastIp;
        $dev->save();
        $user->last_ip = $lastIp;
        $user->save();
        $this->_log($user, $action);
        return true;
    }

    public function setCurrentUser($user)
    {
        $this->currentUser = $user;
    }

    private function _log($user, $action, $extra=null)
    {
        $dev = app('deviceManager')->getCurrentDevice();
        return UserLog::create([
            'action'    => $action,
            'user_id'   => $user->_id,
            'device_id' => $dev->_id,
            'ip'        => app('request')->getClientIp(),
            'extra'     => $extra
        ]);
    }
}
