<?php
namespace App\Models;

use Jenssegers\Mongodb\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Log;

class ChangeLog extends Model {

    protected $dates = [ 'created_at', 'updated_at'];

    public function user()
    {
        return $this->belongsTo('App\Models\User');
    }

    public function kids()
    {
        return $this->belongsToMany('App\Models\Kid');
    }

    public function scopeFrom(Builder $query, $from){
        return $query->where('updated_at', '>=', $from)->take(300);
    }

}
