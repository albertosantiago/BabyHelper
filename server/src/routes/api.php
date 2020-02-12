<?php

$api = app('Dingo\Api\Routing\Router');

$api->version('v1', function ($api)
{
    $api->group(['prefix' => 'devices'], function () use ($api)
    {
        $api->post('new', 'App\Http\Controllers\Api\DeviceController@register');
    });
    $api->group(['prefix' => 'user'], function () use ($api)
    {
        $api->post('store', 'App\Http\Controllers\Api\UserController@store');
        $api->post('confirmation', 'App\Http\Controllers\Api\UserController@confirm');
    });
    $api->post('/auth/login', [
        'as' => 'api.auth.login',
        'uses' => 'App\Http\Controllers\Api\AuthController@login',
    ]);
    $api->post('/auth/google-login', [
        'as' => 'api.auth.google-login',
        'uses' => 'App\Http\Controllers\Api\AuthController@googleLogin',
    ]);
    $api->get('/ressume', [
        'uses' => 'App\Http\Controllers\Api\NotificationController@index',
        'as' => 'api.index'
    ]);

    $api->group([
        'middleware' => 'api.auth',
    ], function ($api)
    {
        $api->get('/', [
            'uses' => 'App\Http\Controllers\Api\APIController@getIndex',
            'as' => 'api.index'
        ]);
        $api->group(['prefix' => 'auth'], function () use ($api)
        {
            $api->get('user', [
                'uses' => 'App\Http\Controllers\Api\AuthController@getUser',
                'as' => 'api.auth.user'
            ]);
            $api->patch('refresh', [
                'uses' => 'App\Http\Controllers\Api\AuthController@patchRefresh',
                'as' => 'api.auth.refresh'
            ]);
            $api->delete('invalidate', [
                'uses' => 'App\Http\Controllers\Api\AuthController@deleteInvalidate',
                'as' => 'api.auth.invalidate'
            ]);
        });
        $api->group(['prefix' => 'user'], function () use ($api)
        {
            $api->post('update', 'App\Http\Controllers\Api\UserController@update');
            $api->get('profile/{profileId}', 'App\Http\Controllers\Api\UserController@getUserProfile');
        });
        $api->group(['prefix' => 'share'], function () use ($api)
        {
            $api->get('/token/{kidId}', 'App\Http\Controllers\Api\KidController@createShareToken');
            $api->get('/kid/{token}', 'App\Http\Controllers\Api\KidController@addKidEditor');
        });
        $api->group(['prefix' => 'kid'], function () use ($api)
        {
            $api->post('store',   'App\Http\Controllers\Api\KidController@store');
            $api->post('/remove', 'App\Http\Controllers\Api\KidController@remove');
            $api->post('/remove-editor', 'App\Http\Controllers\Api\KidController@removeEditor');
            $api->get('/list',    'App\Http\Controllers\Api\KidController@getUserKids');
            $api->get('/editable-list', 'App\Http\Controllers\Api\KidController@getUserEditableKids');
            $api->get('/{kidId}', 'App\Http\Controllers\Api\KidController@getKid');
        });
        $api->group(['prefix' => 'change-log'], function () use ($api)
        {
            $api->get('note/{noteId}/{localKidId}', 'App\Http\Controllers\Api\ChangeLogController@getNote');
            $api->get('kid/', 'App\Http\Controllers\Api\ChangeLogController@getLogs');
            $api->post('update', 'App\Http\Controllers\Api\ChangeLogController@update');
            $api->post('upload-img', 'App\Http\Controllers\Api\ChangeLogController@uploadImg');
            $api->post('upload-video', 'App\Http\Controllers\Api\ChangeLogController@uploadVideo');
        });
    });
});
