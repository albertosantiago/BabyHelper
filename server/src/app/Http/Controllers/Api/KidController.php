<?php
namespace App\Http\Controllers\Api;
use Dingo\Api\Exception\StoreResourceFailedException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpKernel\Exception\GoneHttpException;
use Symfony\Component\HttpKernel\Exception\UnauthorizedHttpException;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Kid;
use App\Models\ShareToken;
use App\Models\Device;
use App\Models\Upload;
use App\Transformers\KidTransformer;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use App\Jobs\SendNotifications;
use Carbon\Carbon;
use Storage;

class KidController extends Controller
{
    public function __construct()
    {
    }

    public function store(Request $request)
    {
        $user = app('userManager')->getCurrentUser();
        $id   = app('request')->input('id');
        $kid  = Kid::where('local_id', $id)->where('user_id', $user->id)->first();

        if(empty($kid)){
            $kid = new Kid();
            $kid->version = 0;
        }

        $rules = [
            'name' => ['string','max:50'],
            'birthdate' => ['string','max:50'],
            'sex' => ['string','max:50'],
            'id' => ['string']
        ];

        $payload   = app('request')->only('name', 'birthdate','sex','id');
        $validator = app('validator')->make($payload, $rules);

        if ($validator->fails()) {
            throw new StoreResourceFailedException('Could not create new kid.', $validator->errors());
        }
        $dev = app('deviceManager')->getCurrentDevice();
        $kid->devices()->attach($dev);
        $kid->name = trim($request->input('name'));
        $kid->sex  = trim($request->input('sex'));
        $kid->birthdate = Carbon::parse(trim($request->input('birthdate')));
        $kid->local_id  = trim($request->input('id'));
        $kid->local_user_id = $user->local_id;
        $kid->user_id       = $user->_id;
        $kid->version++;
        $kid->save();

        if($request->hasFile('picture')){
            if(count($kid->picture())){
                 Storage::disk('gcs')->delete($kid->picture()->local_uri);
                 $kid->picture()->delete();
            }
            $upload = app('fileManager')->saveUpload('picture','img','kid-avatar');
            $upload->kid_id  = $kid->id;
            $upload->save();
        }
        $user->kids()->save($kid);
        $user->editableKids()->attach($kid);

        return $this->response->item($kid, new KidTransformer);
    }

    public function getKid(Request $request, $localKidId)
    {
        $user = app('userManager')->getCurrentUser();
        $kids = Kid::where('local_id', $localKidId)->take(10)->get();
        foreach($kids as $kid){
            if($kid->user_id === $user->_id){
                return $this->response->item($kid, new KidTransformer);
            }
            foreach($kid->editors as $editor){
                if($editor->_id === $user->_id){
                    return $this->response->item($kid, new KidTransformer);
                }
            }
        }
        throw new NotFoundHttpException;
    }

    public function getUserKids(Request $request)
    {
        $user = app('userManager')->getCurrentUser();
        $kids = $user->kids->merge($user->editableKids);
        return $this->response->collection($kids, new KidTransformer);
    }

    public function getUserEditableKids(Request $request)
    {
        $user = app('userManager')->getCurrentUser();
        $kids = $user->editableKids;
        return $this->response->collection($kids, new KidTransformer);
    }

    public function remove(Request $request)
    {
        $user = app('userManager')->getCurrentUser();
        $kidId = $request->input('kid_id');
        $kid  = Kid::where('local_id', $kidId)->where('user_id', $this->user->_id)->first();
        if(empty($kid)){
            throw new GoneHttpException("The kid does not exists");
        }
        $kid->delete();
        return new JsonResponse([
            'message' => 'removed_kid_ok',
        ]);
    }

    public function createShareToken(Request $request, $kidId)
    {
        $user = app('userManager')->getCurrentUser();
        $kid  = Kid::where('local_id', $kidId)
                    ->where('user_id','=', $user->_id)
                    ->first();
        if(empty($kid)){
            throw new GoneHttpException("El bebe no existe");
        }
        $token = new ShareToken();
        $token->user_id = $user->id;
        $token->key      = md5(time()."_".rand(0,1000));
        $token->validity = Carbon::now()->addHours(25);
        $token->params   = [
            'kid_id' => $kid->_id
        ];
        $token->save();

        return new JsonResponse([
            'message' => 'token_created_successfully',
            'data' => [
                'token' => $token->key
            ]
        ], 200);
    }

    public function addKidEditor(Request $request, $token)
    {
        $user = app('userManager')->getCurrentUser();
        $token = ShareToken::where('key', $token)->first();
        if(!$token){
            throw new NotFoundHttpException("The token does not exists");
        }

        $now = Carbon::now();
        if($now->lte($token->validity)){
            $kidId = $token->params['kid_id'];
            $kid  = Kid::find($kidId);
            $kid->editors()->save($user);
            $kid->user->associatedUsers()->attach($user);
            $user->editableKids()->attach($kid);
            $kid->save();
            SendNotifications::dispatch([
                'user'=> $user,
                'kid' => $kid,
                'type' => 'new-editor'
            ], 'new-editor')->delay(now()->addSeconds(10));
            return $this->response->item($kid, new KidTransformer);
        }else{
            throw new GoneHttpException("The token is outdated");
        }
    }

    public function removeEditor(Request $request)
    {
        $user = app('userManager')->getCurrentUser();
        $log = $request->input('obj');

        $kidId    = $log['kid_id'];
        $editorId = $log['editor_id'];

        $kid    = Kid::where('local_id', $kidId)->first();
        $editor = User::where('local_id', $editorId)->first();

        if((empty($kid))||(empty($editor))){
            throw new \Exception("The kid does not exists", 400);
        }
        if($editor->_id != $user->_id){
            if($kid->user_id!=$user->_id){
                throw new \Exception("You cannot make that change", 400);
            }
        }
        $kid->editors()->detach($editor->_id);
        //$kid->user->associatedUsers()->detach($editor->_id);
        $editor->editableKids()->detach($kid);
        $kid->save();
        $editor->save();

        return new JsonResponse([
            'message' => 'removed_editor_ok',
        ]);
    }
}
