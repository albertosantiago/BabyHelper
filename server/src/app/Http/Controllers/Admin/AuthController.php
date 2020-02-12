<?php

namespace App\Http\Controllers\Admin;

use App\Models\Admin;
use Validator;
use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\ThrottlesLogins;
use Illuminate\Foundation\Auth\AuthenticatesUsers;
use Illuminate\Http\Request;
use Auth;
use Session;

class AuthController extends Controller
{

    use AuthenticatesUsers, ThrottlesLogins;

    protected $redirectTo = '/adx';
    protected $guard = "admin";

    public function __construct()
    {
        $this->middleware($this->guestMiddleware(), ['except' => [
                                                        'logout',
                                                        'getLogout',
                                                        'changePassword',
                                                        'showChangePasswordForm'
                                                    ]]);
    }

    protected function validator(array $data)
    {
        return Validator::make($data, [
            'name' => 'required|max:255',
            'email' => 'required|email|max:255|unique:users',
            'password' => 'required|min:6|confirmed',
        ]);
    }

    protected function create(array $data)
    {
        return Admin::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => bcrypt($data['password']),
        ]);
    }

    protected function changePassword(Request $request)
    {
        $user = Auth::guard("admin")->user();
        if($request->password !== $request->password_confirmation){
            Session::flash('error_message', "Password and confirmation not match.");
            return redirect()->back();
        }
        $user->password = bcrypt($request->password);
        $user->save();
        Session::flash('flash_message', trans("Password successfully changed."));
        return redirect()->back();
    }

    protected function showChangePasswordForm(Request $request)
    {
        return view('admin/users/change_password_form');
    }
}
