<?php
namespace App\Http\Controllers\Frontend;

use Illuminate\Http\Request;
use App\Models\ShareToken;
use App\Models\Kid;
use App\Models\User;
use App\Models\Upload;
use App\Models\Device;
use File;
use Browser;
use Auth;
use Illuminate\Http\JsonResponse;
use LaravelLocalization;
use Response;
use Illuminate\Support\Facades\Log;

define('GOOGLE_CLIENT_ID', '728380312031-mrgtbhks8ivn670hisnsc61fsldno7rb.apps.googleusercontent.com');

class ShareController extends Controller
{
    public function __construct()
    {
    }

    public function index(Request $request, $token)
    {
        $lang = LaravelLocalization::getCurrentLocale();
        $sharedToken = ShareToken::where('key', $token)->first();
        if(!$sharedToken){
            throw new \Exception("The token does not exists", 400);
        }
        $kidId = $sharedToken->params['kid_id'];
        $kid   = Kid::find($kidId);
        $user  = $sharedToken->user;
        return view('share', [
            'user' => $user,
            'kid'  => $kid,
            'token' => $token,
            'lang'  => $lang
        ]);
    }

    public function success(Request $request, $token)
    {
        $sharedToken = ShareToken::where('key', $token)->first();
        if(!$sharedToken){
            throw new \Exception("The token does not exists", 400);
        }
        $kidId = $sharedToken->params['kid_id'];
        $kid   = Kid::find($kidId);
        $user = Auth::user();

        return view('shared_success', [
            'user' => $user,
            'kid'  => $kid,
        ]);
    }

    public function createUser(Request $request, $token)
    {
        $sharedToken = ShareToken::where('key', $token)->first();
        if(!$sharedToken){
            throw new \Exception("The token does not exists", 400);
        }
        $kidId = $sharedToken->params['kid_id'];
        $kid   = Kid::find($kidId);
        $credentials = $request->only('id_token');

        $client = new \Google_Client(['client_id' => GOOGLE_CLIENT_ID]);  // Specify the CLIENT_ID of the app that accesses the backend
        $payload = $client->verifyIdToken($credentials['id_token']);

        if($payload){
            $user = User::where('email', trim($payload['email']))->first();
            if(empty($user)){
                $dev = $this->_createWebDevice($request);
                $user = new User();
                $user->version = 0;
                $user->email = $payload['email'];
                $user->name  = $payload['name'];
                $user->loggedBy   = 'google';
                $user->last_ip    = $request->getClientIp();
                $user->registered = true;
                $user->confirmed  = true;
                $user->save();
                app('userManager')->setCurrentUser($user);
                app('fileManager')->download($payload['picture'], 'img','avatar');
                $dev->user_id  = $user->id;
                $dev->save();
            }
            $kid->editors()->save($user);
            $kid->user->associatedUsers()->attach($user);
            $user->editableKids()->attach($kid);
            Auth::login($user);
            return new JsonResponse([
                'message' => 'shared_kid_ok'
            ], 200);
        }
        return new JsonResponse([
            'message' => 'invalid_credentials'
        ], 401);
    }

    private function _createWebDevice($request){
        $device = new Device();
        $device->type = "browser";
        $device->unique_id  = hash('md5',microtime().$request->getClientIp().rand(0,100000));
        $device->family  = Browser::deviceFamily();
        $device->model   = Browser::deviceModel();
        $device->browser_family  = Browser::browserFamily();
        $device->browser_name    = Browser::browserName();
        $device->browser_version = Browser::browserVersion();
        $device->browser_version_major = Browser::browserVersionMajor();
        $device->browser_engine  = Browser::browserEngine();
        $device->platform_name   = Browser::platformName();
        $device->platform_family = Browser::platformFamily();
        $device->user_agent = Browser::userAgent();
        $device->token = hash('ripemd256',microtime().$device->unique_id.rand(0,100000));
        $device->last_ip = $request->getClientIp();
        $device->save();
        return $device;
    }

}
