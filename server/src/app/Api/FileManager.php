<?php namespace App\Api;

use Carbon\Carbon;
use App\Models\Upload;
use File;
use Storage;
use Illuminate\Support\Facades\Log;

/**
 * Device Manager
 * @author Alberto Santiago <chucho@wetdog.co>
 */

class FileManager{

    public function saveUpload($fileName, $fileType, $type, $diskName='gcs')
    {
        $disk = Storage::disk($diskName);

        $user    = app('userManager')->getCurrentUser();
        $request = app('request');

        $path = "img/users";

        if ($request->hasFile($fileName)) {
            $file     = $request->file($fileName);
            $mimeType = $file->getMimeType();
            $fileSize = $file->getClientSize();

            $fileName = explode('.',$file->getClientOriginalName());
            $extension = $fileName[1];
            $time     = time();

            $fileName = md5($fileName[0].rand(0,100).$time);
            $fileName = substr($user->id, 0, 6).substr($fileName, 0, 8).".".$extension;

            $subpath = substr($fileName, 0, 2)."/".substr($fileName, 2 , 2);
            $path = $path."/".$subpath;
            $fileName  = $type."-".$fileName;
            $finalName = $path."/".$fileName;

            if($disk->exists($finalName)){
                $fileName = md5($fileName.rand(0,100).$time);
                $prepend  = substr(md5(rand(0,10000000).$time),0,4);
                $fileName = $type."-".substr($user->id, 0, 6).$prepend.substr($fileName, 0, 8).".".$extension;
                $finalName = $path."/".$fileName;
            }

            $disk->putFileAs(
                $path, $file, $fileName
            );

            if($diskName == 'local'){
                $publicURL = "app/$finalName";
            }else{
                $publicURL = $disk->url($finalName);
            }

            Log::info("UPLOAD IMG - Public URL");
            Log::info($publicURL);

            $upload = new Upload();
            $upload->user_id   = $user->_id;
            $upload->local_uri = $finalName;
            $upload->type = $type;
            $upload->fileType = $fileType;
            $upload->fileName = $fileName;
            $upload->mimeType = $mimeType;
            $upload->src  = $publicURL;
            $upload->size = $fileSize;
            $upload->disk = $diskName;
            $upload->save();
            return $upload;
        }
        return null;
    }

    public function download($url, $fileType, $type)
    {
        $disk = Storage::disk('gcs');

        $headers= get_headers($url, true);
        $fileSize = $headers['Content-Length'];
        $mimeType = $headers['Content-Type'];

        $user     = app('userManager')->getCurrentUser();
        $fileName = basename($url);

        $path = "img/users";
        $fileName = explode('.', $fileName);
        $extension = $fileName[1];

        if($mimeType==='image/gif'){
            $extension = "gif";
        }
        if($mimeType==='image/png'){
            $extension = "png";
        }
        if($mimeType==='image/jpeg'){
            $extension = "jpg";
        }
        if($mimeType==='image/jpg'){
            $extension = "jpg";
        }

        $fileName = md5($fileName[0].rand(0,100));
        $time     = time();
        $fileName = substr($user->id, 0, 10).substr($fileName, 0, 5).$time.".".$extension;

        $subpath = substr($fileName, 0, 2)."/".substr($fileName, 2 , 2);
        $path = $path."/".$subpath;
        $finalName = $path."/".$fileName;

        if($disk->exists($finalName)){
            $fileName  = rand(0,10000)."_".$fileName;
            $finalName = $path."/".$fileName;
        }

        $disk->put(
            $finalName, file_get_contents($url)
        );

        $publicURL = $disk->url($finalName);

        $upload = new Upload();
        $upload->local_uri = $finalName;
        $upload->user_id   = $user->_id;
        $upload->type      = $type;
        $upload->fileType  = $fileType;
        $upload->mimeType  = $mimeType;
        $upload->src       = $publicURL;
        $upload->size      = $fileSize;
        $upload->save();
        return $upload;
    }
}
