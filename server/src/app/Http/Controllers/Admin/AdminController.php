<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Admin;
use App\Models\User;
use Exception;
use Carbon\Carbon;
use Cache;

class AdminController extends Controller
{
    public function dashboard()
    {
        $userStats = [
            'last24' => User::where('first_enter_at', '>', Carbon::now()->subHours(24))->count(),
            'today'  => User::where('first_enter_at', '>', Carbon::now()->hour(0)->minute(0)->second(0))->count(),
            'week'   => User::where('first_enter_at', '>', Carbon::now()->startOfWeek())->count(),
        ];

        return view('admin.dashboard', [
            'userStats' => $userStats
        ]);
    }

    public function setup(Request $request){

        $admins = Admin::all();

        if($admins->isNotEmpty()){
            return redirect("/404");
            die;
        }

        $password = $request->password;
        $username = $request->username;
        $mail     = $request->mail;

        return Admin::create([
            'username' => $username,
            'email' => $mail,
            'password' => bcrypt($password),
        ]);
    }
}
