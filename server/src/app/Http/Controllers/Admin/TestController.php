<?php
namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;

class TestController extends Controller
{
    public function __construct()
    {
    }

    public function showForms(Request $request)
    {
        return view('testing.index');
    }
}
