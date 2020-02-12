<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/
Route::group(['middleware' => 'web'], function () {
    Route::namespace('Frontend')->group(function(){
        //Route::get('/test/mail','TestController@mail');
        Route::post('/shared/{token}/','ShareController@createUser');
        Route::group([
                'prefix' => LaravelLocalization::setLocale(),
                'middleware' => [ 'localeSessionRedirect', 'localizationRedirect', 'localeViewPath' ]
            ], function()
        {
            Route::get(LaravelLocalization::transRoute('routes.pages'), ['as' => 'pages', 'uses' => 'MainController@showPage']);
            Route::get('/shared/success/{token}/','ShareController@success');
            Route::get('/shared/{token}/','ShareController@index');
            Route::get('/','MainController@index');
            Route::get(LaravelLocalization::transRoute('routes.contact'),'ContactController@showContactForm')->name('contact');
            Route::post(LaravelLocalization::transRoute('routes.contact'),'ContactController@handleContactForm');
            //Password recovery
            Route::get('/password/change', 'PasswordController@showChangePasswordForm');
            Route::post('/password/change', 'PasswordController@handleChangePasswordForm');
            Route::get('/password/recovery', 'PasswordController@showRecoveryForm');
            Route::post('/password/recovery', 'PasswordController@handleRecoveryForm');
        });
    });
});
