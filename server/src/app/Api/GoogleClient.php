<?php namespace App\Api;

use App\Models\Device;
use Carbon\Carbon;
use Symfony\Component\HttpKernel\Exception\PreconditionFailedHttpException;
use Illuminate\Support\Facades\Log;

define('GOOGLE_CLIENT_ID', '728380312031-mrgtbhks8ivn670hisnsc61fsldno7rb.apps.googleusercontent.com');

class GoogleClient{

    public function verifyIdToken($idToken)
    {
        $client = new \Google_Client(['client_id' => GOOGLE_CLIENT_ID]);
        return $client->verifyIdToken($idToken);
    }
}
