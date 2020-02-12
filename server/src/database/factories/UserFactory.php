<?php

use Faker\Generator as Faker;
use Carbon\Carbon;

/*
|--------------------------------------------------------------------------
| Model Factories
|--------------------------------------------------------------------------
|
| This directory should contain each of the model factory definitions for
| your application. Factories provide a convenient way to generate new
| model instances for testing / seeding your application's database.
|
*/


$factory->define(App\Models\User::class, function (Faker $faker) {
    return [
        'name'  => $faker->name,
        'email' => $faker->unique()->safeEmail,
        'password' => app('hash')->make('PASSWORD'), // secret
        'remember_token' => str_random(10),
        'registered' => true,
        'confirmed'  => true,
        'local_id'   => str_random(16),
        'confirmation_code' => '122-122',
        'version' => 0
    ];
});

$factory->define(App\Models\Device::class, function (Faker $faker) {
    $user = factory(App\Models\User::class)->create();
    return [
        "type" => "mobile",
        "total_installs" => 0,
        "unique_id" => str_random(16),
        "model" => "Redmi 3S",
        "system_name" => "Android",
        "system_version" => "6.0.1",
        "token" => md5(microtime()),
        "last_ip" => $faker->ipv4,
        "user_id" => $user->_id,
        "kid_ids" => []
    ];
});

$factory->define(App\Models\Kid::class, function (Faker $faker) {

    $dev = factory(App\Models\Device::class)->create();
    $user = $dev->user;

    return [
        "name" => $faker->name,
        "sex" => "female",
        "birthdate" => Carbon::now(),
        "local_id"=> $user->local_id."_".substr(md5(microtime()), 0, 16),
        "local_user_id" => $user->local_id,
        "user_id"=> $user->_id,
        "device_ids" => [$user->device->id],
        "user_ids" => [$user->_id],
        "version" => 0,
        "change_log_ids" => [],
        "editor_user_ids" => []
    ];
});

$factory->define(App\Models\ChangeLog::class, function (Faker $faker) {

    return [
        "action" => "add-note",
        "obj" => [
            "kid_ids" => ["f55d8c00f3953e9_8da8a50cbaa2eed"],
            "type" => "feed",
            "feedType" => "breast",
            "breast" => "right",
            "date" => "2018-05-11T18:58:33.338Z",
            "feedTime" => 10,
            "papName" => null,
            "papId" => null,
            "id" => "f55d8c00f3953e9_ae652b656c25f85",
            "user_id" => "f55d8c00f3953e9",
            "syncronized" => false
        ],
        "date" => "2018-05-11T18:58:33.338Z",
        "local_user_id" => "f55d8c00f3953e9",
        "user_id" => "5af5725f3574cd12b704c1e7",
        "devToken" => "1b40a1d8518936becee5a67831c48b71c77546fa0ff848e97d0e73c11b362a23",
        "kid_ids" => ["5af574a83574cd12b704c1eb"]
    ];
});
