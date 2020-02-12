<?php
namespace App\Models;

use Jenssegers\Mongodb\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Log;

class UserLog extends Model {

    protected $dates = [ 'created_at', 'updated_at'];
    protected $fillable = [ 'created_at', 'updated_at',
                            'ip', 'action','user_id',
                            'device_id', 'extras'];

    public function user()
    {
        return $this->belongsTo('App\Models\User');
    }

}
