<?php

namespace Tests\Http\Controllers\Api;

use Tests\TestCase;
use Tymon\JWTAuth\Facades\JWTAuth;
use App\Models\Device;

abstract class ApiTestCase extends TestCase
{

    public function authJson($method, $url, $data=[], $extraHeaders=[]){
        $headers = $this->_getAuthHeaders();
        return $this->json($method, $url, $data, $headers);
    }

    public function authGet($url, $data=[], $extraHeaders=[]){
        $headers = $this->_getAuthHeaders();
        return $this->get($url, $data, $headers);
    }

    private function _getAuthHeaders(){
        return [
            'HTTP_AUTHORIZATION' => "Bearer ".$this->token,
            'Device-Token' => $this->deviceToken
        ];
    }

    public function setAuthUser($user){
        $this->authUser = $user;
        $this->token    = JWTAuth::fromUser($user);
        $device = $user->device;
        $this->deviceToken = $device->token;
    }

    public function removeAuthUser(){
        $this->authUser = null;
        $this->token    = null;
        $this->deviceToken = null;
    }
}
