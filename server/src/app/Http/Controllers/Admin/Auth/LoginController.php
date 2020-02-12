<?php

namespace App\Http\Controllers\Admin\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\AuthenticatesUsers;
use Illuminate\Http\Request;
use Auth;

class LoginController extends Controller
{
    use AuthenticatesUsers;

    protected $redirectTo = '/adx';
    protected $guard = "admin";

    public function __construct()
    {
        $this->middleware('guest', ['except' => [
                                        'logout',
                                        'getLogout'
                                    ]]);

    }

    public function login(Request $request)
    {
        $this->validateLogin($request);
        if ($lockedOut = $this->hasTooManyLoginAttempts($request)) {
            $this->fireLockoutEvent($request);
            return $this->sendLockoutResponse($request);
        }
        $credentials = $this->credentials($request);
        if ($this->guard()->attempt($credentials, $request->has('remember'))) {
            return $this->sendLoginResponse($request);
        }
        if (! $lockedOut) {
            $this->incrementLoginAttempts($request);
        }
        return $this->sendFailedLoginResponse($request);
    }

    public function getLogin()
    {
        return view('admin.auth.login');
    }

    public function getLogout(Request $request)
    {
        $this->guard()->logout();
        $request->session()->flush();
        $request->session()->regenerate();
        return redirect('/');
    }

    protected function guard()
    {
        return Auth::guard('admin');
    }
}
