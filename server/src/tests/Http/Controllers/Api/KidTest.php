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

class KidTest extends ApiTestCase
{
    const URL_GET    = '/api/kid/';
    const URL_STORE  = '/api/kid/store';
    const URL_REMOVE    = '/api/kid/remove';
    const URL_KID_LIST  = '/api/kid/list';
    const URL_GET_SHARE_TOKEN    = '/api/share/token/';
    const URL_ADD_EDITOR         = '/api/share/kid/';
    const URL_EDITABLE_KID_LIST  = '/api/kid/editable-list';
    const URL_REMOVE_EDITOR  = '/api/kid/remove-editor';

    use DatabaseMigrations;

    public function test_kid_CRUD()
    {
        $mainKid = factory(\App\Models\Kid::class)->make();
        $params = [
            'id' => $mainKid->local_id,
            'name'  => $mainKid->name,
            'birthdate' => "2018-05-11 12:46:48.000",
            'sex' => $mainKid->sex,
        ];
        //Debería dar error de permisos.
        $response = $this->json('post', self::URL_STORE, $params);
        $response->assertStatus(401);
        //Ahora con un usuario logado.
        $mainUser = $mainKid->user;
        $this->setAuthUser($mainUser);
        $response = $this->authJson('post', self::URL_STORE, $params);
        $response->assertStatus(200);
        $json = [
            "data" => [
                "version" => 1,
                "id" => $mainKid->local_id,
                "name" => $mainKid->name,
                "sex" => $mainKid->sex,
                "birthdate" => 1526042808,
                "user_id" => $mainUser->local_id,
                "added"   => Carbon::now()->format('Y-m-d'),
                "picture" => null,
                "editors" => []
            ]
        ];
        $response->assertExactJson($json);
        //Volvemos a lanzar la misma petición, debería actualizar la versión.
        $response = $this->authJson('post', self::URL_STORE, $params);
        $response->assertStatus(200);
        $json = $response->json();
        $this->assertEquals($json['data']['version'], 2);
        //Testeamos el niño guardado
        $this->_test_get_kid($mainKid->local_id, $json);
        //Ahora probamos a coger los datos con un usuario incorrecto
        $newKid = factory(\App\Models\Kid::class)->create();
        $newUser = $newKid->user;
        $this->setAuthUser($newUser);
        $response = $this->authJson('get', self::URL_GET.$mainKid->local_id);
        $response->assertStatus(404);
        //Ahora creamos otro niño con el usuario anterior
        $this->setAuthUser($mainUser);
        $this->_test_get_user_kids($mainUser);
        $this->_test_remove();
    }

    private function _createUserKid($user){
        $override = [
            "local_user_id" => $user->local_id,
            "user_id"=> $user->_id,
            "device_ids" => [$user->device_ids[0]],
            "user_ids" => [$user->_id]
        ];
        $kid = factory(\App\Models\Kid::class)->create($override);
        $user->kids()->save($kid);
    }

    private function _test_get_user_kids($mainUser)
    {
        $this->_createUserKid($mainUser);
        $response = $this->authJson('get', self::URL_KID_LIST);
        $response->assertStatus(200);
        $json = $response->json();
        $this->assertEquals(sizeOf($json['data']),2);
    }

    private function _test_get_kid($localKidId, $expectedJson)
    {
        $response = $this->authJson('get', self::URL_GET.$localKidId);
        $response->assertStatus(200);
        $response->assertExactJson($expectedJson);
    }

    private function _test_remove()
    {
        $response = $this->authJson('get', self::URL_KID_LIST);
        $response->assertStatus(200);
        $json = $response->json();
        $params = [
            'kid_id' => $json['data'][0]['id']
        ];
        $this->authJson('post', self::URL_REMOVE, $params);
        //Comprobamos que hemos eliminado un niño, teniamos 2 de la anterior prueba.
        $response = $this->authJson('get', self::URL_KID_LIST);
        $response->assertStatus(200);
        $json = $response->json();
        $this->assertEquals(sizeOf($json['data']), 1);
        $params = [
            'kid_id' => $json['data'][0]['id']
        ];
        $this->authJson('post', self::URL_REMOVE, $params);
        //Comprobamos que hemos eliminado todos los niños.
        $response = $this->authJson('get', self::URL_KID_LIST);
        $response->assertStatus(200);
        $json = $response->json();
        $this->assertEquals(sizeOf($json['data']), 0);
        //Comprobamos que da error si intentamos eliminar el niño de otro usuario
        $newKid = factory(\App\Models\Kid::class)->create();
        $params = [
            'kid_id' => $newKid->local_id
        ];
        $response = $this->authJson('post', self::URL_REMOVE, $params);
        $response->assertStatus(410);
    }

    public function test_editors()
    {
        $mainKid = factory(\App\Models\Kid::class)->create();
        $mainUser = $mainKid->user;
        $this->setAuthUser($mainUser);

        $token = $this->_test_create_share_token($mainKid);

        $otherKid = factory(\App\Models\Kid::class)->create();
        $otherUser = $otherKid->user;
        $this->setAuthUser($otherUser);
        $this->_test_add_editor($token, $mainKid);
        //Tiene 2, del que es dueño y otro del que es tutor.
        $this->_test_get_user_editable_kids(2);
        //Lo eliminamos como tutor
        $this->setAuthUser($mainUser);
        $this->_test_remove_editor($mainKid, $otherUser);
        //Sigue teniendo el suyo propio
        $this->setAuthUser($otherUser);
        $this->_test_get_user_editable_kids(1);
    }

    private function _test_create_share_token($mainKid)
    {
        $response = $this->authJson('get', self::URL_GET_SHARE_TOKEN.$mainKid->local_id);
        $response->assertStatus(200);
        $json = $response->json();
        $this->assertNotEmpty($json['data']['token']);
        return $json['data']['token'];
    }

    private function _test_add_editor($token, $expectedKid)
    {
        $response = $this->authJson('get', self::URL_ADD_EDITOR.$token);
        $response->assertStatus(200);
        $json = $response->json();
        $this->assertEquals($json['data']['name'], $expectedKid->name);
        $this->assertEquals($json['data']['user_id'], $expectedKid->user->local_id);
        $this->assertEquals($json['data']['editors'][0], $this->authUser->local_id);
        return true;
    }

    private function _test_get_user_editable_kids($expected)
    {
        $response = $this->authJson('get', self::URL_EDITABLE_KID_LIST);
        $response->assertStatus(200);
        $json = $response->json();
        $this->assertEquals(sizeOf($json['data']), $expected);
    }

    private function _test_remove_editor($kid, $editor)
    {
        $params = [
            'obj' => [
                'editor_id' => $editor->local_id,
                'kid_id'    => $kid->local_id
            ]
        ];
        $response = $this->authJson('post', self::URL_REMOVE_EDITOR, $params);
        $response->assertStatus(200);
        $json = $response->json();
        $this->assertEquals($json['message'], 'removed_editor_ok');
    }

    public function test_upload_img()
    {
        Storage::fake('gcs');
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
        $response = $this->authJson('post', self::URL_STORE, $params);
        $response->assertStatus(200);
        $json = $response->json();
        $extension = explode(".", $json['data']['picture']);
        $this->assertEquals($extension[1],'jpg');
    }

}
