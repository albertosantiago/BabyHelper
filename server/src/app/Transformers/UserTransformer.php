<?php

namespace App\Transformers;

use League\Fractal\TransformerAbstract;
use App\Models\User;

class UserTransformer extends TransformerAbstract
{
    public function transform(User $user)
    {
        $ret = [
            'version' => $user->version,
            'id'      => $user->local_id,
            'name'    => $user->name,
            'email'   => $user->email,
            'picture' => null,
            'added' => date('Y-m-d', strtotime($user->created_at)),
            'confirmed' => $user->confirmed,
            'registered' => $user->registered
        ];
        if(!empty($user->picture())){
            $ret['picture'] = $user->picture()->src;
        }
        return $ret;
    }
}
