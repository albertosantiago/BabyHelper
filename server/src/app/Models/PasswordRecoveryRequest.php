<?php
namespace App\Models;

use Jenssegers\Mongodb\Eloquent\Model as Eloquent;

class PasswordRecoveryRequest extends Eloquent{

    protected $collection = 'password_recovery_requests';
    protected $dates = ['created_at'];

    public function user()
    {
        return $this->belongsTo('App\Models\User');
    }

}
