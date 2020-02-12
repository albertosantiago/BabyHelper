<?php
namespace App\Transformers;

use League\Fractal\TransformerAbstract;
use App\Models\ChangeLog;
use Illuminate\Support\Facades\Log;

class ChangeLogTransformer extends TransformerAbstract
{
    public function transform(ChangeLog $log)
    {
        return $log->toArray();
    }
}
