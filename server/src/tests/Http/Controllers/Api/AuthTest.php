<?php
namespace Tests\Http\Controllers\Api;

use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tymon\JWTAuth\Facades\JWTAuth;
use Carbon\Carbon;
use App\Models\Device;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\Api\AuthController;


class AuthTest extends ApiTestCase
{
    const URL_LOGIN         = '/api/auth/login';
    const URL_GOOGLE_LOGIN  = '/api/auth/google-login';
    const URL_LOGOUT        = '/api/auth/invalidate';
    const URL_REFRESH_TOKEN = '/api/auth/refresh';
    const URL_GET_USER      = '/api/auth/user';

    use DatabaseMigrations;

    public function testBasicTest()
    {
        $user = factory(\App\Models\Device::class)->create()->user;
        $device = $user->device;

        $headers = [
            'Device-Token' => $device->token,
        ];
        $params = [
            'email' => $user->email,
            'password' => "PASSWORD"
        ];
        $response = $this->json('post', self::URL_LOGIN, $params, $headers );
        $response->assertStatus(200);
        $json = $response->json();
        $this->assertEquals($json['message'], 'token_generated');
        $this->assertEquals($json['data']['new'], false);
        $this->assertEquals(strlen($json['data']['token']), 353);
        $this->token = $json['data']['token'];
        $this->deviceToken = $device->token;
        $headers = [
            'HTTP_AUTHORIZATION' => "Bearer ".$this->token,
            'Device-Token' => $this->deviceToken
        ];
        //Cogemos el usuario logado
        $response = $this->json('get', self::URL_GET_USER, [], $headers );
        $response->assertStatus(200);
        $json = $response->json();
        $this->assertEquals($json['data']['id'], $user->local_id);
        $this->assertEquals($json['data']['email'], $user->email);
        $this->assertEquals($json['data']['confirmed'], true);
        $this->assertEquals($json['data']['registered'], true);
        //Refrescamos el token
        $response = $this->json('patch', self::URL_REFRESH_TOKEN, [], $headers );
        $response->assertStatus(200);
        $json = $response->json();
        $this->assertEquals($json['message'], 'token_refreshed');
        $this->assertEquals(strlen($json['data']['token']), 356);
        $this->token = $json['data']['token'];
        $headers = [
            'HTTP_AUTHORIZATION' => "Bearer ".$this->token,
            'Device-Token' => $this->deviceToken
        ];
        //Eliminamos el token
        $response = $this->json('delete', self::URL_LOGOUT, [], $headers );
        $response->assertStatus(200);
        $json = $response->json();
        $this->assertEquals($json['message'], 'token_invalidated');
        $this->assertTrue(empty($json['data']));
        //Intentamos volver a coger el usuario logado, despues del tiempo de gracia de 2 segundos
        //definido para que las peticiones que estan siendo ejecutadas terminen.
        //Primero lanzamos una con éxito y luego otra que falla.
        sleep(1);
        $response = $this->json('get', self::URL_GET_USER, [], $headers );
        $response->assertStatus(200);
        sleep(1);
        $response = $this->json('get', self::URL_GET_USER, [], $headers );
        $response->assertStatus(500);
        $json = $response->json();
        $this->assertEquals($json['message'], 'The token has been blacklisted');
    }

    public function testGoogleLogin()
    {
        $this->assertTrue(true);
        $user   = factory(\App\Models\User::class)->make();
        $device = factory(\App\Models\Device::class)->create();
        //Mockeamos el servicio de Google
        $mGC = \Mockery::mock(\App\Api\GoogleClient::class);
        $mGC->shouldReceive('verifyIdToken')->once()->andReturn([
            'email' => $user->email,
            'name'  => $user->name,
            'picture' => "http://testing.com/img.jpg"
        ]);
        app()->instance("google", $mGC);
        $mFM = \Mockery::mock(\App\Api\FileManager::class);
        $upload = new \App\Models\Upload();
        $upload->local_uri = 'esto_es_una_prueba.jpg';
        $upload->user_id   = $user->_id;
        $upload->type      = 'avatar';
        $upload->fileType  = 'img';
        $upload->mimeType  = 'image/jpg';
        $upload->src       = '/app/img/user/esto_es_una_prueba.jpg';
        $upload->size      =  1500;
        $upload->save();
        $mFM->shouldReceive('download')->once()->andReturn($upload);
        app()->instance("fileManager", $mFM);
        //Fin mockeo.
        $headers = [
            'Device-Token' => $device->token,
        ];
        $params = [
            'email' => $user->email,
            'id'    => "232dffdf345r3rf",
            'id_token' => '122121212121'
        ];

        $response = $this->json('post', self::URL_GOOGLE_LOGIN, $params, $headers );
        $response->assertStatus(200);
        $json = $response->json();
        $this->assertEquals($json['message'], 'token_generated');
        $this->assertEquals($json['data']['new'], true);
        $this->assertEquals(strlen($json['data']['token']), 363);
    }

}
