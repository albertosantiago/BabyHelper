<?php
namespace App\Http\Controllers\Api;

use Illuminate\Routing\Controller as BaseController;
use Illuminate\Http\JsonResponse;
use Dingo\Api\Routing\Helpers;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;

class Controller extends BaseController
{
    use Helpers;

    public function __construct(Request $request)
    {
        if ((\App::environment() == 'testing') && array_key_exists("HTTP_AUTHORIZATION",  \Request::server())) {
            JWTAuth::setRequest($request);
        }
    }
}
