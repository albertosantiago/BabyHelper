<?php
namespace App\Http\Controllers\Frontend;

use Illuminate\Http\Request;
use LaravelLocalization;

class MainController extends Controller
{
    public function __construct()
    {
    }

    public function index(Request $request)
    {
        return view('home');
    }

    public function showPage(Request $request, $page)
    {
        $langPrefix = LaravelLocalization::getCurrentLocale();
        try{
            return view("pages/$langPrefix/$page");
        }catch(\Exception $e){
            return view("errors/404");
        }
    }

}
