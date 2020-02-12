<?php
namespace App\Http\Controllers\Api;
use Dingo\Api\Exception\StoreResourceFailedException;
use Illuminate\Http\Request;
use App\Models\Device;
use App\Transformers\DeviceTransformer;

class DeviceController extends Controller
{
    public function __construct()
    {}

    public function register(Request $request)
    {
        $rules = [
            'uniqueId' => ['required', 'string','max:150'],
            'model'   => ['required', 'max:50'],
            'systemName'    => ['required', 'max:50'],
            'systemVersion' => ['required', 'max:50'],
            'fcmToken' => ['max:250'],
        ];
        $payload   = app('request')->only('uniqueId', 'model', 'systemName','systemVersion');
        $validator = app('validator')->make($payload, $rules);

        if ($validator->fails()) {
            throw new StoreResourceFailedException('Could not register device.', $validator->errors());
        }

        $uniqueId = $request->input('uniqueId');
        $device = Device::where('unique_id',$uniqueId)->first();
        if(empty($device)){
            $device = new Device();
            $device->type = "mobile";
            $device->total_installs = 0;
            $device->unique_id  = $request->input('uniqueId');
            $device->fcmToken   = $request->input('fcmToken');
            $device->model      = $request->input('model');
            $device->system_name     = $request->input('systemName');
            $device->system_version  = $request->input('systemVersion');
            $device->token = hash('ripemd256',microtime().$device->unique_id.rand(0,100000));
        }
        $device->fcmToken = $request->input('fcmToken');
        $device->last_ip  = $request->getClientIp();
        $device->total_installs++;
        $device->touch();
        $device->save();
        return $this->response->item($device, new DeviceTransformer)->addMeta('message','Device registered successfully');
    }

}
