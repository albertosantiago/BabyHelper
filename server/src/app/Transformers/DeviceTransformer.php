<?php

namespace App\Transformers;

use League\Fractal\TransformerAbstract;
use App\Models\Device;

class DeviceTransformer extends TransformerAbstract
{
    public function transform(Device $dev)
    {
        return [
            'id' => $dev->id,
            'uniqueId' => $dev->unique_id,
            'model' => $dev->model,
            'systemName' => $dev->system_name,
            'systemVersion' => $dev->system_version,
            'token' => $dev->token,
            'createdAt' => date('Y-m-d H:i', strtotime($dev->created_at))
        ];
    }
}
