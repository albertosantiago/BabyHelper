<?php
namespace App\Http\Controllers\Frontend;

use Illuminate\Http\Request;
use LaravelLocalization;
use App\Models\User;
use Mail;


class TestController extends Controller
{
    public function __construct()
    {
    }

    public function mail(Request $request)
    {
        if(empty($request->input('tarara'))){
            return view("errors/404");
        }
        $user = User::first();
        return new \App\Mail\ConfirmationCode($user);
    }

}
