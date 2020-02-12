<?php
namespace App\Models;

use Jenssegers\Mongodb\Eloquent\Model;

class Kid extends Model{
    protected $dates = ['created_at', 'updated_at', 'birthdate'];
    protected $fillable = ['created_at','user_id'];

    public function editors()
    {
		return $this->belongsToMany(\App\Models\User::class, null, 'editable_kid_ids', 'editor_user_ids');
    }

    public function user()
    {
        return $this->belongsTo('App\Models\User');
    }

    public function devices()
    {
        return $this->belongsToMany('App\Models\Device')->withTimestamps();
    }

    public function changeLog()
    {
        return $this->belongsToMany('App\Models\ChangeLog');
    }

    public function uploads()
    {
        return $this->hasMany('App\Models\Upload');
    }

    public function picture()
    {
        return $this->uploads()->where('type', '=', 'kid-avatar')->first();
    }

}
