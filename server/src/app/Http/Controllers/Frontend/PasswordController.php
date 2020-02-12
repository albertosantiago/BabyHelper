<?php
namespace App\Http\Controllers\Frontend;

use Illuminate\Http\Request;
use LaravelLocalization;
use App\Models\PasswordRecoveryRequest;
use App\Models\User;
use Carbon\Carbon;
use Mail;

class PasswordController extends Controller
{
    public function __construct()
    {
    }

    public function showRecoveryForm(Request $request)
    {
        $hasPreviousRequest = $this->hasPreviousRequest($request->ip());
        $this->configureMetas();
        $hasMessageSuccess = app('session')->has('message-success');

        return view("password/recovery", [
            'previousRequest'   => $hasPreviousRequest,
            'hasMessageSuccess' => $hasMessageSuccess
        ]);
    }

    public function handleRecoveryForm(Request $request)
    {
        $this->validate($request, [
            'email'   => 'required|email',
        ]);

        $user = User::where('email', $request->input('email'))->first();
        if(empty($user)){
            return redirect()->back()->withInput()->withErrors(['Failed' => 'El usuario no existe']);
        }

        $passwordRequest = new PasswordRecoveryRequest();
        $passwordRequest->mail    = $request->input('email');
        $passwordRequest->ip      = $request->ip();
        $passwordRequest->user_id = $user->_id;
        $passwordRequest->token   = md5(microtime().rand(0,10000).":pp");
        $passwordRequest->created_at = Carbon::now();
        $ret = $passwordRequest->save();

        Mail::to($user)
            ->queue(new \App\Mail\RecoveryPassword($passwordRequest));

        if($ret){
            $request->session()->flash('message-success', true );
            return redirect()->back();
        }else{
            return redirect()->back()->withInput()->withErrors(['Failed' => 'Hubo un error procesando el mensaje']);
        }
    }

    public function showChangePasswordForm(Request $request)
    {
        $token = $request->input('token');
        $hasMessageSuccess = app('session')->has('message-success');
        return view("password/change", [
            'token' => $token,
            'hasMessageSuccess' => $hasMessageSuccess
        ]);
    }

    public function handleChangePasswordForm(Request $request)
    {
        $this->validate($request, [
            'password' => ['required', 'min:7;max:15'],
            'password_confirmation' => ['required', 'min:7;max15'],
            'recoveryToken' => ['required', 'min:30;max:150'],
        ]);

        $prr = PasswordRecoveryRequest::where('token', $request->input('recoveryToken'))->first();
        if(empty($prr)){
            return redirect()->back()->withInput()->withErrors(['Failed' => 'La solicitud de cambio de contraseña no existe']);
        }
        $user = $prr->user;
        if(empty($user)){
            return redirect()->back()->withInput()->withErrors(['Failed' => 'El usuario no existe']);
        }

        $password     = $request->input('password');
        $passwordConf = $request->input('password_confirmation');

        if($password!==$passwordConf){
            return redirect()->back()->withInput()->withErrors(['Failed' => 'La contraseña y su confirmación no coinciden']);
        }

        $user->password  = app('hash')->make(trim($request->input('password')));
        $user->confirmed = true;
        $ret = $user->save();

        if($ret){
            $request->session()->flash('message-success', true );
            return redirect()->back();
        }else{
            return redirect()->back()->withInput()->withErrors(['Failed' => 'Hubo un error procesando el mensaje']);
        }
    }

    private function hasPreviousRequest($ip)
    {
        $previousReq = PasswordRecoveryRequest::where(['ip'=>$ip])->orderBy('created_at','DESC')->first();
        if(empty($previousReq)){
            return false;
        }
        $date = $previousReq->created_at;
        $date->addHour();
        if($date->gt(Carbon::now())){
            return true;
        }
        return false;
    }

    private function configureMetas()
    {
        $metaCreator = app('metaCreator');
        $metaCreator->set('title','BabyHelper - Password Recovery Form');
        $metaCreator->setMeta('description',"Recover your babyhelper`s password");
    }

}
