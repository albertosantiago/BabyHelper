<?php
namespace App\Http\Controllers\Api;
use Dingo\Api\Exception\StoreResourceFailedException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Device;
use App\Models\Upload;
use App\Transformers\UserTransformer;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Storage;
use Mail;

class UserController extends Controller
{
    const ERROR_MESSAGES = [
        'unique' => ':attribute_not_unique.',
    ];

    public function __construct()
    {
    }

    public function store(Request $request)
    {
        $user = new User();
        $rules = [
            'id' => ['string','max:16'],
            'name' => ['string','max:50'],
            'email' => ['required','unique:users,email', 'email','max:100'],
            'password' => ['required', 'min:7']
        ];
        $payload   = app('request')->only('name', 'password','email','id');
        $payload['email'] = trim($payload['email']);

        $validator = app('validator')->make($payload, $rules, self::ERROR_MESSAGES);
        if ($validator->fails()) {
            throw new StoreResourceFailedException('Could not create new user.', $validator->errors());
        }
        $payload['local_id'] = $payload['id'];
        $payload['password'] = app('hash')->make(trim($request->input('password')));
        $payload['confirmation_code'] = rand(0,1000)."-".rand(0,1000);
        $payload['registered'] = true;
        $payload['confirmed']  = false;
        $payload['loggedBy']   = 'email';
        $user = app('userManager')->create($payload);

        if($request->hasFile('picture')){
            app('userManager')->setCurrentUser($user);
            app('fileManager')->saveUpload('picture','img','avatar');
        }

        Mail::to($user)
            ->queue(new \App\Mail\ConfirmationCode($user));

        return $this->response->item($user, new UserTransformer);
    }

    public function confirm(Request $request)
    {
        $user = app('userManager')->getCurrentUser();
        if($user->confirmation_code!==$request->input('confirmationCode')){
            throw new StoreResourceFailedException('Could not confirmate user.', ['confirmationCode'=>'The sended code does not match']);
        }
        $user->confirmed = true;
        $user->save();
        return new JsonResponse([
            'message' => 'confirmation_ok',
            'data' => [
                'confirmed' => true
            ]
        ]);
    }

    public function update(Request $request)
    {
        $user = app('userManager')->getCurrentUser();
        $rules = [
            'name' => ['string','max:50'],
        ];
        $payload   = app('request')->only('name');
        $validator = app('validator')->make($payload, $rules);

        if ($validator->fails()) {
            throw new StoreResourceFailedException('Could not create new user.', $validator->errors());
        }
        $user->name  = trim($request->input('name'));
        $user->version++;

        app('userManager')->updateUserInfo($user, 'updated');

        if($request->hasFile('picture')){
            if(count($user->picture())){
                 Storage::disk('gcs')->delete($user->picture()->local_uri);
                 $user->picture()->delete();
            }
            app('fileManager')->saveUpload('picture','img','avatar');
        }
        return $this->response->item($user, new UserTransformer);
    }

    public function getUserProfile(Request $request, $userLocalId)
    {
        $user = app('userManager')->getCurrentUser();
        if($user->local_id === $userLocalId){
            return $this->response->item($user, new UserTransformer);
        }
        foreach($user->associatedUsers as $relatedUser){
            if($relatedUser->local_id === $userLocalId){
                return $this->response->item($relatedUser, new UserTransformer);
            }
        }
        throw new NotFoundHttpException;
    }

}
