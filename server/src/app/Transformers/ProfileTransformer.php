<?php

namespace App\Transformers;

use League\Fractal\TransformerAbstract;
use App\Models\User;

class ProfileTransformer extends TransformerAbstract
{
    public function transform(User $user)
    {
        $ret = [
            'version' => $user->version,
            'name'    => $user->name,
            'email'   => $user->email,
            'picture' => null,
            'added' => date('Y-m-d', strtotime($user->created_at)),
            'confirmed' => $user->confirmed,
            'registered' => $user->registered,
            'associated_users' => [],
            'id' => null
        ];
        if(!empty($user->local_id)){
            $ret['id'] = $user->local_id;
        }
        if(!empty($user->picture())){
            $ret['picture'] = $user->picture()->src;
        }
        $associatedUsers = $user->associatedUsers->toArray();
        if(!empty($associatedUsers)){
            foreach($associatedUsers as $associatedUser){
                $ret['associated_users'][] = $associatedUser['local_id'];
            }
        }
        return $ret;
    }
}
