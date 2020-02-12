<?php
namespace App\Models;

use Jenssegers\Mongodb\Eloquent\Model;

class Upload extends Model{
    protected $dates = ['created_at'];
    protected $fillable = ['created_at','user_id','kid_id'];
}
