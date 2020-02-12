<?php

namespace App\Http\Middleware;

use Closure;

define("RESPONSE_DEBUG", true);

class ResponseLog
{
    public function handle($request, Closure $next)
    {
        $response = $next($request);
        if(RESPONSE_DEBUG){
            $path = storage_path('logs/response.log');
            $resp = $response->content();
            file_put_contents($path, $resp, FILE_APPEND);
        }
        return $response;
    }
}
