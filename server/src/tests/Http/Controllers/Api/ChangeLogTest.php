<?php
namespace Tests\Http\Controllers\Api;

use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tymon\JWTAuth\Facades\JWTAuth;
use Carbon\Carbon;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use App\Models\ChangeLog;

class ChangeLogTest extends ApiTestCase
{
    const URL_GET_LOGS = '/api/change-log/kid';
    const URL_POST_LOGS = '/api/change-log/update';
    const URL_UPLOAD_IMG = '/api/change-log/upload-img';
    const URL_UPLOAD_VIDEO = '/api/change-log/upload-video';

    use DatabaseMigrations;

    public function test_get_logs()
    {
        $kid    = factory(\App\Models\Kid::class)->create();
        $user  = $kid->user;
        $this->setAuthUser($user);

        $params = '?includeUserLogs=true&from=null&kidId='.$kid->local_id;
        $url = self::URL_GET_LOGS.$params;

        $response = $this->authJson('get', $url);
        $now = Carbon::now()->timestamp;
        $response->assertExactJson([
            'data'=>[],
            'meta' => [
                'from' => $now
            ]
        ]);
        $now = Carbon::now()->subMinutes(1)->timestamp;
        $response->assertJsonMissingExact([
            'data'=>[],
            'meta' => [
                'from' => $now
            ]
        ]);
        $response->assertStatus(200);
        $json = $response->json();
        $from = $json['meta']['from'];

        $note = $this->_generateNote($user, $kid);
        $override = [
            'devToken' => $user->device->token,
            'obj'      => $note,
            'local_user_id' => $user->local_id,
            'user_id'   => $user->_id,
            'kid_ids'   => [$kid->_id]
        ];
        $changeLogs = factory(\App\Models\ChangeLog::class, 5)->create($override);
        $includeUserLogs = true;
        $params = '?includeUserLogs='.$includeUserLogs.'&from='.$from.'&kidId='.$kid->local_id;
        $url = self::URL_GET_LOGS.$params;
        $response = $this->authJson('get', $url);
        $json = $response->json();
        $this->assertEquals(sizeOf($json['data']),5);
        //Ahora pidiendo que se omitan los resultados enviados por mi cuenta.
        $includeUserLogs = 'false';
        $params = '?includeUserLogs='.$includeUserLogs.'&from='.$from.'&kidId='.$kid->local_id;
        $url = self::URL_GET_LOGS.$params;
        $response = $this->authJson('get', $url);
        $json = $response->json();
        $this->assertEquals(sizeOf($json['data']), 0);
        /**
        * Vamos a probar a saltarnos los permisos
        * Creamos otro usuario con otro crio e intentamos meternos en donde no nos llaman
        **/
        $newkid = factory(\App\Models\Kid::class)->create();
        $user = $newkid->user;
        $this->setAuthUser($user);
        //Creamos 2 trazas para verificar que no se las descarga y que da 404
        $note = $this->_generateNote($user, $newkid);
        $override = [
            'devToken' => $user->devices_ids[0],
            'obj'      => $note,
            'local_user_id' => $user->local_id,
            'user_id'   => $user->_id,
            'kid_ids'   => [$kid->_id]
        ];
        $changeLogs = factory(\App\Models\ChangeLog::class, 2)->create($override);
        $includeUserLogs = true;
        $params = '?includeUserLogs='.$includeUserLogs.'&from='.$from.'&kidId='.$kid->local_id;
        $url = self::URL_GET_LOGS.$params;
        $response = $this->authJSON('get', $url);
        $json = $response->json();
        $response->assertStatus(404);
        $this->assertEquals($json['message'], "Not Found");
        $this->assertEquals($json['status_code'], 404);
        //Ahora con usuario anónimo
        $this->removeAuthUser();
        $params = '?includeUserLogs='.$includeUserLogs.'&from='.$from.'&kidId='.$kid->local_id;
        $url = self::URL_GET_LOGS.$params;
        $response = $this->authJSON('get', $url);
        $response->assertStatus(403);
    }

    public function test_update_logs()
    {
        $kid    = factory(\App\Models\Kid::class)->create();
        $user  = $kid->user;
        $this->setAuthUser($user);

        $note = $this->_generateNote($user, $kid);
        $note['type'] = 'img';

        $params = [
            'data' => [
                'action' => 'add-note',
                'date'   => '2018-05-11T18:58:35.068Z',
                'local_user_id' => $user->local_id,
                'user_id'       => $user->_id,
                'obj'           => $note
            ]
        ];

        $response = $this->authJson('post', self::URL_POST_LOGS, $params);
        $response->assertStatus(200);
        $json = $response->json();
        $this->assertEquals($json['message'], "Successfully log updated");
        $this->_test_upload_img($note);
    }

    private function _test_upload_img($note)
    {
        Storage::fake('gcs');
        $params = [
            'note_id' => $note['id'],
            'video' => UploadedFile::fake()->image('avatar.jpg')
        ];
        $response = $this->authJson('post', self::URL_UPLOAD_VIDEO, $params);
        $response->assertStatus(200);
        $json = $response->json();
        $this->assertEquals($json['message'], "upload_ok");
        $fileName = $json['data']['file_name'];
        $fileCode = explode("-", $fileName);
        $subPath  = substr($fileCode[1],0,2)."/".substr($fileCode[1],2,2);
        $pos = strpos($json['data']['url_server'], "/img/users/$subPath/".$json['data']['file_name']);

        $this->assertThat($pos, $this->logicalAnd(
            $this->isType('int'),
            $this->greaterThan(0),
            $this->lessThan(100)
        ));
    }

    public function test_upload_same_log_twice(){
        $kid    = factory(\App\Models\Kid::class)->create();
        $user  = $kid->user;
        $this->setAuthUser($user);

        $note = $this->_generateNote($user, $kid);
        $note['type'] = 'img';

        $params = [
            'data' => [
                'action' => 'add-note',
                'date'   => '2018-05-11T18:58:35.068Z',
                'local_user_id' => $user->local_id,
                'user_id'       => $user->_id,
                'obj'           => $note
            ]
        ];

        $response = $this->authJson('post', self::URL_POST_LOGS, $params);
        $response->assertStatus(200);
        $json = $response->json();
        $this->assertEquals($json['message'], "Successfully log updated");

        $response = $this->authJson('post', self::URL_POST_LOGS, $params);
        $response->assertStatus(409);
        $json = $response->json();
        $this->assertEquals($json['message'], "log_already_exists");
    }

    public function test_get_logs_from_other_users()
    {
        $kid    = factory(\App\Models\Kid::class)->create();
        $user   = $kid->user;
        $otherUser  = factory(\App\Models\Device::class)->create()->user;
        //Replicamos lo que hacemos en KidController.
        $kid->editors()->save($otherUser);
        $kid->user->associatedUsers()->attach($otherUser);
        $otherUser->editableKids()->attach($kid);
        $kid->save();
        //Creamos unos cuantos logs del usuario principal.
        $this->setAuthUser($user);
        $note = $this->_generateNote($user, $kid);
        $override = [
            'devToken' => $user->devices_ids[0],
            'obj'      => $note,
            'local_user_id' => $user->local_id,
            'user_id'   => $user->_id,
            'kid_ids'   => [$kid->_id]
        ];
        $changeLogs = factory(\App\Models\ChangeLog::class, 5)->create($override);
        //Aqui dormimos un segundo porque sino se solapan.
        sleep(1);
        //Ahora pedimos los logs desde el principio con el otro usuario
        $this->setAuthUser($otherUser);
        $params = '?includeUserLogs=false&from=null&kidId='.$kid->local_id;
        $url = self::URL_GET_LOGS.$params;
        $response = $this->authJson('get', $url);
        $response->assertStatus(200);
        $json = $response->json();
        $this->assertEquals(sizeOf($json['data']),5);
        $this->assertTrue(!empty($json['meta']['from']));
        $fromTimestamp = $json['meta']['from'];
        $from = Carbon::createFromTimestamp($fromTimestamp);
        //Creamos más notas, un par de ellas.
        $changeLogs = factory(\App\Models\ChangeLog::class, 2)->create($override);
        $params = '?includeUserLogs=false&from='.$fromTimestamp.'&kidId='.$kid->local_id;
        $url = self::URL_GET_LOGS.$params;
        $response = $this->authJson('get', $url);
        $response->assertStatus(200);
        $json = $response->json();
        $this->assertEquals(sizeOf($json['data']),2);
        $this->assertTrue(!empty($json['meta']['from']));
    }

    private function _generateNote($user=null, $kid = null){
        $ret = [
            "kid_ids" => ["f55d8c00f3953e9_8da8a50cbaa2eed"],
            "type" => "feed",
            "feedType" => "breast",
            "breast"   => "right",
            "date"     => Carbon::now(),
            "feedTime" => 10,
            "papName"  => null,
            "papId"    => null,
            "id"       => "f55d8c00f3953e9_ae652b656c25f85",
            "user_id"  => "f55d8c00f3953e9",
            "syncronized" => false
        ];
        if($user!=null){
            $ret['user_id'] = $user->local_id;
        }
        if($kid!=null){
            $ret['kid_ids'] = [$kid->local_id];
        }
        return $ret;
    }
}
