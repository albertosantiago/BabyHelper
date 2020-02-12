<?php
namespace App\Transformers;

use League\Fractal\TransformerAbstract;
use App\Models\Kid;
use Illuminate\Support\Facades\Log;

class KidTransformer extends TransformerAbstract
{
    public function transform(Kid $kid)
    {
        $ret = [
            'version' => $kid->version,
            'id'   =>    $kid->local_id,
            'name' =>    $kid->name,
            'sex'  =>    $kid->sex,
            'birthdate' => $kid->birthdate->getTimestamp(),
            'user_id'   => $kid->local_user_id,
            'added'     => date('Y-m-d', strtotime($kid->created_at)),
            'picture'   => null,
            'editors'   => []
        ];

        foreach($kid->editors as $editor){
            $ret['editors'][] = $editor->local_id;
        }

        if(!empty($kid->picture())){
            $ret['picture'] = $kid->picture()->src;
        }

        return $ret;

    }
}
