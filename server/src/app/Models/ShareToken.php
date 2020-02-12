<?php
namespace App\Models;

use Jenssegers\Mongodb\Eloquent\Model;

class ShareToken extends Model
{
    protected $dates = ['created_at','updated_at', 'validity'];

    public function user()
    {
        return $this->belongsTo('App\Models\User');
    }

}
