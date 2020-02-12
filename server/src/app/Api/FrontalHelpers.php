<?php namespace App\Api;

use Carbon\Carbon;

class FrontalHelpers{

    public function cdn($resource){
        $cdnURL     = env("CDN_URL",'');
        $appVersion = env("APP_VERSION",'');
        $resource   = $cdnURL.$resource."?v=".$appVersion;
        return $resource;
    }

    public function formatDateForPost($date)
    {
        $diffTime = Carbon::now()->diffInHours($date);
        return "<div class='post-date'>
                <div class='ui timestamp icon-Meta_Time'>
                    <i class='wait icon'></i>
                    <span class='timestamp__date--published'>".$date->toDateTimeString()."</span>
                    <span class='timestamp-separator'>|</span>
                    <span class='timestamp__date--modified'>
                        <strong>Updated</strong>
                        $diffTime
                        hours ago
                    </span>
                </div>
            </div>";
    }

}
