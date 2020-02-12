<?php
namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Http\JsonResponse;
use Tymon\JWTAuth\Facades\JWTAuth;
use App\Http\Controllers\Api\Controller;
use Tymon\JWTAuth\Exceptions\JWTException;
use Illuminate\Validation\ValidationException;
use Illuminate\Http\Exception\HttpResponseException;
use Illuminate\Support\Facades\Log;
use App\Models\User;
use App\Models\Device;
use App\Models\Upload;
use Illuminate\Support\Facades\Hash;
use App\Transformers\ProfileTransformer;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');
        $user = User::where('email', trim($credentials['email']))->first();
        if($user){
            if (!app('hash')->check(trim($credentials['password']), $user->password)){
                return $this->onUnauthorized();
            }else{
                app('userManager')->updateUserInfo($user);
                $token = JWTAuth::fromUser($user);
                return $this->onAuthorized($token);
            }
        }
        return $this->onUnauthorized();
    }

    public function googleLogin(Request $request)
    {
        $new = false;
        $credentials = $request->only('id','email','id_token');
        //Si el usuario ya fue creado se loga desde nuestra bbdd sin necesidad de conectar con mr google de nuevo.
        $user = User::where('email', trim($credentials['email']))->first();
        if(!empty($user)){
            if($user->id_token === $credentials['id_token']){
                //Si el usuario no se creo desde la app, sino desde la web se le añade la id local que
                //se creo en el sistema.
                if(empty($user->local_id)){
                    $user->local_id = $credentials['id'];
                }
                app('userManager')->updateUserInfo($user);
                $token = JWTAuth::fromUser($user);
                return $this->onAuthorized($token, $new);
            }
        }
        $payload = app('google')->verifyIdToken($credentials['id_token']);
        if($payload){
            $user = User::where('email', trim($payload['email']))->first();
            if(empty($user)){
                $payload['confirmed']  = true;
                $payload['registered'] = true;
                $payload['loggedBy']   = 'google';
                $payload['local_id']   = $credentials['id'];
                $user = app('userManager')->create($payload);
                app('userManager')->setCurrentUser($user);
                app('fileManager')->download($payload['picture'], 'img','avatar');
                $new = true;
            }
            if(empty($user->local_id)){
                $user->local_id = $credentials['id'];
            }
            $user->confirmed = true;
            $user->loggedBy  = 'google';
            $user->id_token  = $credentials['id_token'];
            $user->save();
            app('userManager')->updateUserInfo($user);
            $token = JWTAuth::fromUser($user);
            return $this->onAuthorized($token, $new);
        }
        return $this->onUnauthorized();
    }

    //What response should be returned on invalid credentials.
    protected function onUnauthorized()
    {
        return new JsonResponse([
            'message' => 'invalid_credentials'
        ], Response::HTTP_UNAUTHORIZED);
    }

    //What response should be returned on error while generate JWT.
    protected function onJwtGenerationError()
    {
        return new JsonResponse([
            'message' => 'could_not_create_token'
        ], Response::HTTP_INTERNAL_SERVER_ERROR);
    }

    //What response should be returned on authorized.
    protected function onAuthorized($token, $new=false)
    {
        return new JsonResponse([
            'message' => 'token_generated',
            'data' => [
                'token' => $token,
                'new'   => $new
            ]
        ]);
    }

    //Get the needed authorization credentials from the request.
    protected function getCredentials(Request $request)
    {
        return $request->only('email', 'password');
    }

    //Invalidate a token.
    public function deleteInvalidate()
    {
        $token = JWTAuth::parseToken();
        $token->invalidate();
        return new JsonResponse(['message' => 'token_invalidated']);
    }

    // Refresh a token.
    public function patchRefresh()
    {
        $token = JWTAuth::parseToken();
        $newToken = $token->refresh();
        return new JsonResponse([
            'message' => 'token_refreshed',
            'data' => [
                'token' => $newToken
            ]
        ]);
    }

    //Get authenticated user.
    public function getUser()
    {
        $user = JWTAuth::parseToken()->authenticate();
        return $this->response->item($user, new ProfileTransformer);
    }
}
