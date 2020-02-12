<?php
namespace Tests\Http\Controllers\Api;

use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tymon\JWTAuth\Facades\JWTAuth;
use Carbon\Carbon;
use App\Models\Device;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class UserTest extends ApiTestCase
{
    const URL_GET    = '/api/user/profile';
    const URL_STORE  = '/api/user/store';
    const URL_UPDATE = '/api/user/update';
    const URL_CONFIRMATION = '/api/user/confirmation';

    use DatabaseMigrations;

    public function testStoreTest()
    {
        Storage::fake('gcs');

        $device = factory(\App\Models\Device::class)->create();
        $user = factory(\App\Models\User::class)->make();

        $headers = [
            'Device-Token' => $device->token,
        ];
        $params = [
            'id' => $user->local_id,
            'name'  => $user->name,
            'email' => $user->email,
            'password' => "Pollas2.1"
        ];
        $response = $this->json('post', self::URL_STORE, $params, $headers );
        $response->assertStatus(200);

        $json = [
            "data" => [
                "version" => 0,
                "id" => $user->local_id,
                "name" => $user->name,
                "email" => $user->email,
                "picture" => null,
                "added" => Carbon::now()->format('Y-m-d'),
                "confirmed" => false,
                "registered" => true
            ]
        ];
        $response->assertExactJson($json);
        $this->_testConfirm();
        $this->_testGetProfile();
        $this->_testUpdate();
    }


    private function _testConfirm()
    {
        $device = factory(\App\Models\Device::class)->create();
        $user = $device->user;        
        $user->confirmed = false;
        $user->save();

        $params = [
            'confirmationCode' => $user->confirmation_code
        ];
        $this->setAuthUser($user);
        $response = $this->authJson('post',self::URL_CONFIRMATION, $params);
        $response->assertStatus(200);
        $json = [
            'message' => 'confirmation_ok',
            'data' => [
                'confirmed' => true
            ]
        ];
        $response->assertExactJson($json);
    }

    public function _testGetProfile()
    {
        $url = self::URL_GET."/".$this->authUser->local_id;
        $response = $this->authJson('get', $url);
        $response->assertStatus(200);
        $json = [
            'data' => [
                "added" => Carbon::now()->format('Y-m-d'),
                "confirmed" => true,
                "email"     => $this->authUser->email,
                "id"        => $this->authUser->local_id,
                "name"      => $this->authUser->name,
                "picture"    => null,
                "registered" => true,
                "version"    => 0
            ]
        ];
        $response->assertExactJson($json);
    }

    public function _testUpdate()
    {
        $newName = "María La Piedra";
        $params = [
            'name'    => $newName,
            'picture' => UploadedFile::fake()->image('avatar.jpg')
        ];
        $response = $this->authJson('post', self::URL_UPDATE, $params);
        $response->assertStatus(200);
        $json = $response->json();
        $this->assertEquals($json['data']['added'],Carbon::now()->format('Y-m-d'));
        $this->assertEquals($json['data']['confirmed'], true);
        $this->assertEquals($json['data']['email'], $this->authUser->email);
        $this->assertEquals($json['data']['id'], $this->authUser->local_id);
        $this->assertEquals($json['data']['name'], $newName);
        $this->assertEquals($json['data']['registered'], true);
        $this->assertEquals($json['data']['version'], 1);
        $this->assertNotEmpty($json['data']['picture']);
    }

}
