<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Api\DeviceManager;
use App\Api\FileManager;
use App\Api\UserManager;
use App\Api\GoogleClient;
use App\Api\MetaCreator;
use App\Api\BladeHelpers;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        //
    }

    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        $this->registerServicesForWeb();
        $this->registerServicesForAdmin();
    }

    public function registerServicesForWeb()
    {
        $this->app->singleton('deviceManager', function ($app){
            return new DeviceManager();
        });
        $this->app->singleton('fileManager', function ($app){
            return new FileManager();
        });
        $this->app->singleton('userManager', function ($app){
            return new UserManager();
        });
        $this->app->singleton('google', function ($app){
            return new GoogleClient();
        });
        //Metacreator -> Servicio para renderizar las metaetiquetas sociales.
        $this->app->singleton('metaCreator', function ($app){
            return new MetaCreator(app('request'));
        });
    }

    public function registerServicesForAdmin()
    {
        $this->app->singleton('App\Api\BladeHelpers', function ($app){
            return new BladeHelpers();
        });
    }

}
