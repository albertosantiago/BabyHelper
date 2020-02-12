<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It is a breeze. Simply tell Lumen the URIs it should respond to
| and give it the Closure to call when that URI is requested.
|
*/

Route::get('/', 'LoginController@getLogin');
//Esta ruta esta para instalar el administrador en la instalación.
Route::get('setup', 'AdminController@setup');
//Rutas de autentificación.
Route::group(['namespace' => 'Auth'], function () {
    Route::get('login', ['as' => 'login', 'uses' => 'LoginController@getLogin']);
    Route::post('login', 'LoginController@login');
    Route::get('logout', 'LoginController@getLogout');
});
Route::group(['middleware' => ['auth:admin']], function () {
    //Rutas de usuario.
    Route::group(['namespace' => 'Auth'], function () {
        Route::get('change-password', 'ResetPasswordController@showChangePasswordForm');
        Route::post('change-password', 'ResetPasswordController@changePassword');
    });
    //Rutas normales.
    Route::get('/', 'AdminController@dashboard');
    Route::group(['prefix' => 'server'], function () {
        Route::get('/', 'ServerController@info');
        Route::get('info', 'ServerController@info');
    });
    Route::group(['prefix' => 'viewer'], function () {
        Route::get('/', 'ViewerController@index');
        Route::post('/del', 'ViewerController@del');
    });
    Route::group(['namespace' => 'System'], function () {
        Route::group(['prefix' => 'system'], function () {
            //Feedbacks
            Route::get('/contact', 'ContactController@index');
            Route::delete('clear', ['as' => 'admin.cms.contact.clear', 'uses' => 'ContactController@delete']);
        });
    });
    Route::group(['namespace' => 'CMS'], function () {
        Route::group(['prefix' => 'cms'], function () {
            //User routes
            Route::get('/users', 'UserController@index');
            Route::get('/kids', 'KidController@index');
        });
    });
});
