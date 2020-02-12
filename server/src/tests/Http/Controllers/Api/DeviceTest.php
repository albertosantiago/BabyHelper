<?php
namespace Tests\Http\Controllers\Api;

use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tymon\JWTAuth\Facades\JWTAuth;
use Carbon\Carbon;
use App\Models\Device;

class DeviceTest extends ApiTestCase
{
    const URL_REGISTER_DEVICE = '/api/devices/new';

    use DatabaseMigrations;

    public function testRegisterTest()
    {
        $params = [
            'uniqueId'      => '850de171641d211a',
            'model'         => 'Redmi 3s',
            'systemName'    => 'Android',
            'systemVersion' => '6.0.1',
        ];

        $response = $this->json('post', self::URL_REGISTER_DEVICE, $params);
        $json = $response->json();
        $response->assertStatus(200);
        $this->assertEquals(strlen($json['data']['token']), 64);

        $device = Device::first();
        $this->assertEquals($device->total_installs, 1);
        //Ahora debería quedar registrado con 2 instalaciones
        $response = $this->json('post', self::URL_REGISTER_DEVICE, $params);
        $json = $response->json();
        $response->assertStatus(200);
        $device = Device::first();
        $this->assertEquals($device->total_installs, 2);
        $this->assertNotEquals($device->total_installs, 1);
        //Ahora probamos con datos incorrectos
        $params = [
            'model'         => 'Redmi 3s',
            'systemName'    => 'Android',
            'systemVersion' => '6.0.1',
        ];
        $response = $this->json('post', self::URL_REGISTER_DEVICE, $params);
        $json = $response->json();
        $response->assertStatus(422);
        $this->assertNotEmpty($json["errors"]["uniqueId"]);
        $params = [
            'uniqueId'      => '850de171641d211azzz',
            'systemVersion' => '6.0.1.vcvcvc',
        ];
        $response = $this->json('post', self::URL_REGISTER_DEVICE, $params);
        $json = $response->json();
        $response->assertStatus(422);
        $this->assertTrue(empty($json["errors"]["uniqueId"]));
        $this->assertFalse(empty($json["errors"]["model"]));
        $this->assertNotEmpty($json["errors"]["model"]);
        $this->assertNotEmpty($json["errors"]["systemName"]);
    }

}

/**
{
"_id":"5af572a13574cd12b704c1e9",
"type":"mobile",
"total_installs":3,
"unique_id":"850de171641d211a",
"model":"Redmi 3S",
"system_name":"Android",
"system_version":"6.0.1",
"token":"1b40a1d8518936becee5a67831c48b71c77546fa0ff848e97d0e73c11b362a23",
"last_ip":"192.168.0.100",
"updated_at":"2018-05-11T21:15:44.000Z",
"created_at":"2018-05-11T10:38:25.000Z",
"user_ids":["5af5725f3574cd12b704c1e7"],
"kid_ids":["5af574a83574cd12b704c1eb"]
}
**/
