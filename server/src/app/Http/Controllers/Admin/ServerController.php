<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ServerController extends Controller
{
    public function index(Request $request)
    {
        return $this->info($request);
    }

    public function info(Request $request)
    {
        return view('admin/server/info');
    }
}
