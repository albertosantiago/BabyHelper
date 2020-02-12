<?php namespace App\Http\Controllers\Frontend;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Foundation\Auth\ThrottlesLogins;
use Illuminate\Foundation\Auth\AuthenticatesAndRegistersUsers;
use App\Models\ContactMessage;
use Session;
use Redirect;
use Input;
use Validator;
use Carbon\Carbon;


class ContactController extends Controller
{
    public function __construct(){}

    public function showContactForm(Request $request)
    {
        $hasPreviousMessage = $this->hasPreviousMessage($request->ip());
        $this->configureContactMetas();
        $hasMessageSuccess = app('session')->has('message-success');

        return view('contact', [
            'previousMessage'   => $hasPreviousMessage,
            'hasMessageSuccess' => $hasMessageSuccess
        ]);
    }

    public function handleContactForm(Request $request)
    {
        $this->validate($request, [
            'name'    => 'required|max:250',
            'message' => 'required|max:500',
            'email'   => 'required|email',
        ]);

        $contactMessage = new ContactMessage();
        $contactMessage->name = $request->input('name');
        $contactMessage->mail       = $request->input('email');
        $contactMessage->message    = $request->input('message');
        $contactMessage->ip         = $request->ip();
        $contactMessage->created_at = Carbon::now();
        $ret = $contactMessage->save();

        if($ret){
            $request->session()->flash('message-success', true );
            return redirect()->back();
        }else{
            return redirect()->back()->withInput()->withErrors(['Failed' => 'There was an error processing the message.']);
        }
    }

    private function hasPreviousMessage($ip)
    {
        $msg = ContactMessage::where(['ip'=>$ip])->orderBy('created_at','DESC')->first();
        if(empty($msg)){
            return false;
        }
        $date = $msg->created_at;
        $date->addHour();
        if($date->gt(Carbon::now())){
            return true;
        }
        return false;
    }

    private function configureContactMetas(){
        $metaCreator = app('metaCreator');
        $metaCreator->set('title','BabyHelper - Contact Form');
        $metaCreator->setMeta('description','Send us a message through our contact form');
    }
}
