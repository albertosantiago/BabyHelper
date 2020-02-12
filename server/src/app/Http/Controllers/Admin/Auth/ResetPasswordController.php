<?php

namespace App\Http\Controllers\Admin\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\ResetsPasswords;
use Illuminate\Http\Request;
use Auth;
use Session;

class ResetPasswordController extends Controller
{
    use ResetsPasswords;

    protected $redirectTo = '/adx';
    protected $guard = "admin";


    public function __construct()
    {
        $this->middleware('guest',['except' => [
                                    'changePassword',
                                    'showChangePasswordForm'
                                ]]);
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

    protected function guard()
    {
        return Auth::guard('admin');
    }
}
