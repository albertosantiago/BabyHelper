<?php
namespace Tests\Http\Controllers\Api;

use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tymon\JWTAuth\Facades\JWTAuth;
use Carbon\Carbon;
use App\Models\Device;
use App\Models\User;
use App\Models\Kid;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class UploadsTest extends ApiTestCase
{
    const URL_KID_STORE  = '/api/kid/store';
    const URL_USER_UPDATE = '/api/user/update';


    public function test_upload_img_for_kid_and_user()
    {
        $path = "img/users";
        Storage::fake("gcs");
        $mainKid = factory(\App\Models\Kid::class)->make();
        $mainUser = $mainKid->user;
        $this->setAuthUser($mainUser);
        $params = [
            'id' => $mainKid->local_id,
            'name'  => $mainKid->name,
            'birthdate' => "2018-05-11 12:46:48.000",
            'sex' => $mainKid->sex,
            'picture' => UploadedFile::fake()->image('avatar.jpg')
        ];
        $response = $this->authJson('post', self::URL_KID_STORE, $params);
        $response->assertStatus(200);
        $json = $response->json();
        $kidAvatar = $json['data']['picture'];
        $extension = explode(".", $json['data']['picture']);
        $this->assertEquals($extension[1],'jpg');

        $newName = "Federico";
        $params = [
            'name'    => $newName,
            'picture' => UploadedFile::fake()->image('avatar.jpg')
        ];
        $response = $this->authJson('post', self::URL_USER_UPDATE, $params);
        $response->assertStatus(200);
        $json = $response->json();
        $this->assertNotEmpty($json['data']['picture']);
        $userAvatar = $json['data']['picture'];
        $this->assertNotEquals($userAvatar, $kidAvatar);
        $files = Storage::disk('gcs')->allFiles($path);
        $this->assertEquals(sizeOf($files),2);
    }


    public function test_upload_user_img_twice()
    {
        $path = "img/users";
        Storage::fake("gcs");

        $mainKid = factory(\App\Models\Kid::class)->make();
        $mainUser = $mainKid->user;
        $this->setAuthUser($mainUser);

        $newName = "Federico";
        $params = [
            'name'    => $newName,
            'picture' => UploadedFile::fake()->image('avatar.jpg')
        ];
        $response = $this->authJson('post', self::URL_USER_UPDATE, $params);
        $response->assertStatus(200);
        $json = $response->json();
        $this->assertNotEmpty($json['data']['picture']);

        $params = [
            'name'    => $newName,
            'picture' => UploadedFile::fake()->image('avatar2.jpg')
        ];
        $response = $this->authJson('post', self::URL_USER_UPDATE, $params);
        $response->assertStatus(200);
        $json = $response->json();
        $this->assertNotEmpty($json['data']['picture']);

        $files = Storage::disk('gcs')->allFiles($path);
        $this->assertEquals(sizeOf($files), 1);
    }

    public function test_upload_kid_img_twice()
    {
        $path = "img/users";
        Storage::fake("gcs");

        $mainKid = factory(\App\Models\Kid::class)->make();
        $mainUser = $mainKid->user;
        $this->setAuthUser($mainUser);
        $params = [
            'id'        => $mainKid->local_id,
            'name'      => $mainKid->name,
            'birthdate' => "2018-05-11 12:46:48.000",
            'sex'       => $mainKid->sex,
            'picture'   => UploadedFile::fake()->image('avatar2.jpg')
        ];
        $response = $this->authJson('post', self::URL_KID_STORE, $params);
        $response->assertStatus(200);
        $json = $response->json();
        $this->assertNotEmpty($json['data']['picture']);

        $params = [
            'id'        => $mainKid->local_id,
            'name'      => "Julia",
            'birthdate' => "2018-05-11 12:46:48.000",
            'sex'       => $mainKid->sex,
            'picture'   => UploadedFile::fake()->image('avatar2.jpg')
        ];

        $response = $this->authJson('post', self::URL_KID_STORE, $params);
        $response->assertStatus(200);
        $json = $response->json();
        $this->assertNotEmpty($json['data']['picture']);
        $this->assertNotEmpty($json['data']['name'], "Julia");
        $this->assertNotEmpty($json['data']['version'], 2);
        $files = Storage::disk('gcs')->allFiles($path);
        $this->assertEquals(sizeOf($files), 1);
    }

}
