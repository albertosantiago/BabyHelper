<?php
namespace App\Http\Controllers\Api;
use Dingo\Api\Exception\StoreResourceFailedException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Illuminate\Http\Request;
use App\Models\ChangeLog;
use App\Models\Kid;
use App\Models\User;
use App\Transformers\ChangeLogTransformer;
use App\Transformers\UploadTransformer;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpKernel\Exception\ConflictHttpException;
use Tymon\JWTAuth\Facades\JWTAuth;
use Carbon\Carbon;
use App\Models\Upload;
use App\Jobs\SendNotifications;
use App\Jobs\MoveToCloud;

class ChangeLogController extends Controller
{

    const MAX_DIRECT_SIZE = 3 * 1024 * 1024;
    const GOOGLE_DISK = 'gcs';
    const LOCAL_DISK  = 'local';

    public function getNote(Request $request, $noteId, $localKidId)
    {
        $user = app('userManager')->getCurrentUser();
        foreach($user->editableKids as $editableKid){
            if($editableKid->local_id===$localKidId){
                $kid = $editableKid;
                break;
            }
        }
        if(empty($kid)){
            return $this->response->errorNotFound();
        }
        $log = $kid->changeLog()->where('obj.id', $noteId)->where('action','add-note')->first();
        if(empty($log)){
            return $this->response->errorNotFound();
        }
        return $this->response->item($log, new ChangeLogTransformer);
    }

    public function getLogs(Request $request)
    {
        $user = app('userManager')->getCurrentUser();

        $localKidId = $request->input('kidId');
        $fromTime   = $request->input('from');
        $devToken  = app('deviceManager')->getToken();
        $includeUserLogs = ($request->input('includeUserLogs')==='false') ? false: true;

        foreach($user->editableKids as $editableKid){
            if($editableKid->local_id===$localKidId){
                $kid = $editableKid;
                break;
            }
        }
        if(empty($kid)){
            return $this->response->errorNotFound();
        }
        $from = Carbon::now();
        $from->month = $from->month-1;
        if((!empty($fromTime))&&($fromTime!=='null')&&($fromTime!=='undefined')){
            $from = Carbon::createFromTimestamp($fromTime);
        }
        if($includeUserLogs){
            $logs = $kid->changeLog()->from($from)->get();
        }else{
            $logs = $kid->changeLog()->from($from)->where(function($q) use($user, $devToken){
                $q->where('user_id','!=', $user->_id)
                  ->orWhere('devToken', '!=', $devToken);
                  return $q;
            })->get();
        }
        $now  = Carbon::now()->timestamp;
        return $this->response->collection($logs, new ChangeLogTransformer)->addMeta('from', $now);
    }

    public function update(Request $request)
    {
        $user = app('userManager')->getCurrentUser();
        $devToken = app('deviceManager')->getToken();

        $log = $request->input('data');
        if($this->_existLog($log, $user)){
            throw new ConflictHttpException("log_already_exists");
        }
        $changeLog = new ChangeLog();
        $changeLog->action = $log['action'];
        $changeLog->obj    = $log['obj'];
        //Por si nos quieren colar datos incorrectos.
        $log['obj']['user_id'] = $user->local_id;

        $changeLog->local_user_id = $user->local_id;
        $changeLog->user_id       = $user->_id;
        $changeLog->devToken      = $devToken;
        $changeLog->save();

        foreach($log['obj']['kid_ids'] as $localKidId){
            foreach($user->editableKids as $kid){
                if($kid->local_id===$localKidId){
                    $changeLog->kids()->attach($kid);
                    SendNotifications::dispatch([
                        'changeLog' => $changeLog,
                        'type'      => 'note'
                    ])->delay(now()->addMinutes(1));
                    break;
                }
            }
        }
        return new JsonResponse(['message' => 'Successfully log updated']);
    }

    public function uploadImg(Request $request)
    {
        return $this->upload($request, 'picture', 'img');
    }

    public function uploadVideo(Request $request)
    {
        return $this->upload($request, 'video', 'video');
    }

    protected function upload($request, $fileName, $fileType)
    {
        $user = app('userManager')->getCurrentUser();
        $noteId = $request->input('note_id');

        $log = ChangeLog::where('user_id', $user->id)->where('obj.id', $noteId)->first();

        if(empty($log)){
            throw new \Exception("The note does not exists", 1);
        }

        $file     = $request->file($fileName);
        $fileSize = $file->getClientSize();
        $diskName = self::GOOGLE_DISK;
        if($fileSize> self::MAX_DIRECT_SIZE){
            $diskName = self::LOCAL_DISK;
        }

        $upload = app('fileManager')->saveUpload($fileName, $fileType, 'note', $diskName);

        if($upload!==null){
            $obj = $log->obj;
            $obj['url_server'] = $upload->src;
            $obj['file_name']  = $upload->fileName;
            $obj['uploaded'] = true;
            $log->obj = $obj;
            $log->save();

            SendNotifications::dispatch([
                'changeLog' => $log,
                'type'      => 'upload'
            ])->delay(now()->addMinutes(1));

            if($fileSize> self::MAX_DIRECT_SIZE){
                MoveToCloud::dispatch([
                    'upload' => $upload,
                    'log'    => $log
                ]);
            }

            return new JsonResponse([
                'message' => 'upload_ok',
                'data' => [
                    'file_name'  => $upload->fileName,
                    'url_server' => $upload->src
                ]
            ]);
        }
        return new JsonResponse([
            'message' => 'upload_ko'
        ]);
    }

    protected function _existLog($log, $user)
    {
        return ChangeLog::where('user_id', $user->_id )
                ->where('obj.id', $log['obj']['id'])
                ->where('action', $log['action'])
                ->count();
    }
}
