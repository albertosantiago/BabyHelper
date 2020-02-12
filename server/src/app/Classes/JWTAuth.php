<?php
namespace App\Classes;

use Tymon\JWTAuth\Facades\JWTAuth as Auth;
use Tymon\JWTAuth\Exceptions\JWTException;
use App\Models\User;
use Request;

class Mock
{
    public function __call($method, $args)
    {
        if (isset($this->$method) === true) {
            $func = $this->$method;
            return $func();
        }
    }
}

class JWTAuth{

    public static function parseToken(){
        $ret = new Mock();
        $ret->authenticate = function(){
            try{
                $user = Auth::parseToken()->authenticate();
            }catch(JWTException $e){
                $userId = Request::input('user_id');
                $user = User::find($userId);
            }
            return $user;
        };
        return $ret;
    }

}
