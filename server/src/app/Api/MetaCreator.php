<?php namespace App\Api;

use Illuminate\Http\Request;
use LaravelLocalization;
use Auth;

class MetaCreator{

    public $tags = [
        'title' => 'BabyHelper - La aplicación que te ayuda a cuidar a tu bebe.',
        'meta'  => [
            'title' => 'cloned:title',
            'referrer' => 'always',
            'description' => 'BabyHelper.info es una plataforma donde podras anotar, organizar y compartir las tareas y fotos de tu bebe y publicarlas en un entorno seguro solo para tu gente',
            'theme-color' => '#34AF02',
            'author' => 'BabyHelper.info',
            'twitter:card' => 'summary',
            'twitter:title' => 'cloned:title',
            'twitter:description' => 'cloned:meta:description',
            'twitter:image' => '',
            'twitter:site' => '@BabyHelper',
            'twitter:creator' => null,
            'twitter:widgets:theme' => "light",
            'twitter:widgets:link-color' => "#55acee",
            'twitter:widgets:border-color' => "#55acee",
            "og:title"       => "cloned:title",
            "og:description" => 'cloned:meta:description',
            "og:type"  =>  "website",
            "og:url"   => "cloned:link:canonical",
            "og:site_name" => "BabyHelper.info",
            "og:image" => "",
            'article:author' => 'cloned:link:author',
            'article:published_time' => '',
            'app:guest' => 'true'
        ],
        'link' => [
            'canonical' => '',
            'search'    => '',
            //'publisher' => 'https://plus.google.com/u/1/100994410512015888933',
            'author' => '',
            'alternate' => ''
        ]
    ];

    public function __construct(Request $request)
    {
        $this->setLink('canonical', $request->fullUrl());
        $this->request = $request;
    }

    public function render()
    {
        try{
            $isGuest = (Auth::user()) ? 'false' : 'true';
        }catch(\Exception $e){
            $isGuest = true;
        }
        $this->setMeta('app:guest', $isGuest);
        $headTags = $this->renderTags();

        if(env('APP_ENV')==='local'){
            $headTags .= "<meta name='env' content='local' />";
        }

        //Añadimos los idiomas.
        $headTags .= '<link rel="alternate" href="'.LaravelLocalization::getLocalizedURL("es").'"'." hreflang='es' />\n";
        $headTags .= '<link rel="alternate" href="'.LaravelLocalization::getLocalizedURL("en").'"'." hreflang='en' />\n";
        $headTags .= '<link rel="alternate" href="'.LaravelLocalization::getLocalizedURL("es").'"'." hreflang='x-default' />\n";

        return $headTags;
    }

    public function set($key, $value)
    {
        $this->tags[$key] = $value;
    }

    public function setMeta($key, $value)
    {
        $this->tags['meta'][$key] = $value;
    }

    public function setLink($key, $value)
    {
        $this->tags['link'][$key] = $value;
    }

    public function getSchemaScript()
    {
        $scriptTPL = '
        <script type="application/ld+json">
            {
                "@context":"http://schema.org",
                "@type":"NewsArticle",
                "image":{
                    "@type":"ImageObject",
                    "width":1920,
                    "height":1080,
                    "url":"https://cdn-images-1.medium.com/max/1920/1*6Ty2XkFATQYFc8FqnTCmuw.jpeg"
                },
                "datePublished":"2016-08-10T13:08:12.050Z",
                "dateModified":"2016-08-10T13:28:39.382Z",
                "headline":"Running Tests on your Laravel Elixir Projects With Karma, Jasmine & Webpack",
                "name":"Running Tests on your Laravel Elixir Projects With Karma, Jasmine & Webpack",
                "keywords":["JavaScript","Laravel","Laravel Elixir","Vue","Testing Javascript"],
                "author":{
                    "@type":"Person",
                    "name":"Dammy Ogunmoye",
                    "url":"https://medium.com/@dammyammy"
                },
                "creator":["Dammy Ogunmoye"],
                "mainEntityOfPage":"https://medium.com/@dammyammy/running-tests-on-your-laravel-elixir-projects-with-karma-jasmine-webpack-4c47dd34f44f"
            }
        </script>';
        return $scriptTPL;
    }

    private function renderTags()
    {
        $stream = "<title>".$this->tags['title']."</title>\n";
        $stream .= $this->renderMetas();
        $stream .= $this->renderLinks();
        return $stream;
    }

    private function renderMetas()
    {
        $stream = '';
        $metas  = $this->tags['meta'];
        foreach($metas as $key => $value){
            if(!empty($value)){
                $segments = explode(":", $value);
                if(sizeof($segments)>1){
                    if($segments[0]=='cloned'){
                        $value = $this->getCloneValue($segments);
                    }
                }
                if(!empty($value)){
                    $stream .= "<meta name='".$key."' property='".$key."' value='".$value."' />\n";
                }
            }
        }
        return $stream;
    }

    private function renderLinks()
    {
        $stream = '';
        $links  = $this->tags['link'];
        foreach($links as $key => $value){
            if(!empty($value)){
                if(is_array($value)){
                    $attrs = '';
                    foreach($value as $subKey => $subValue){
                        $attrs .= $subKey."='".$subValue."' ";
                    }
                    $stream .= "<link rel='".$key."' ".$attrs." />\n";
                }else{
                    $segments = explode(":", $value);
                    if(sizeof($segments)>1){
                        if($segments[0]=='cloned'){
                            $value = $this->getCloneValue($segments);
                        }
                    }
                    if(!empty($value)){
                        $stream .= "<link rel='".$key."' href='".$value."' />\n";
                    }
                }
            }
        }
        return $stream;
    }

    public function getCloneValue($ref)
    {
        $group = $ref[1];
        if(sizeOf($ref)>2){
            $prop = "";
            for($i=2;$i<sizeOf($ref);$i++){
                $prop .= $ref[$i].":";
            }
            $prop = substr($prop,0,-1);
            return $this->tags[$group][$prop];
        }
        return $this->tags[$group];
    }
}
