<?php

namespace App\Transformers;

use League\Fractal\TransformerAbstract;
use App\Models\Upload;

class UploadTransformer extends TransformerAbstract
{
    public function transform(Upload $upload)
    {
        return [
            'id' => $upload->id,
            'createdAt' => date('Y-m-d H:i', strtotime($upload->created_at))
        ];
    }
}
