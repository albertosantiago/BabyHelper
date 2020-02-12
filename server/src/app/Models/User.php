<?php
namespace App\Models;
use Illuminate\Notifications\Notifiable;
use Illuminate\Auth\Authenticatable;
use Illuminate\Auth\Passwords\CanResetPassword;
use Illuminate\Foundation\Auth\Access\Authorizable;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Contracts\Auth\Access\Authorizable as AuthorizableContract;
use Illuminate\Contracts\Auth\CanResetPassword as CanResetPasswordContract;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends \Jenssegers\Mongodb\Eloquent\Model implements
    AuthenticatableContract,
    AuthorizableContract,
    CanResetPasswordContract,
    JWTSubject
{
    use Authenticatable, Authorizable, CanResetPassword, Notifiable;

    protected $fillable = [
        'name',
        'email',
    ];

    /**
     * The attributes excluded from the model's JSON form.
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    /**
     * Return a key value array, containing any custom claims to be added to the JWT.
     */
    public function getJWTCustomClaims()
    {
        return [];
    }

    public function device()
    {
        return $this->hasOne('App\Models\Device');
    }

    public function editableKids()
    {
        return $this->belongsToMany('App\Models\Kid')->withTimestamps();
    }

    public function kids()
    {
        return $this->hasMany('App\Models\Kid');
    }

    public function associatedUsers()
    {
        return $this->belongsToMany('App\Models\User',  null, 'associated_user_ids', 'associated_user_ids');
    }

    public function uploads()
    {
        return $this->hasMany('App\Models\Upload');
    }

    public function picture()
    {
        return $this->uploads()->where('type', '=', 'avatar')->first();
    }

}
