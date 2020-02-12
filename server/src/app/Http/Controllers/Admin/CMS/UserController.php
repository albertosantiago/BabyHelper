<?php
namespace App\Http\Controllers\Admin\CMS;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Datatables;
use DB;
use Session;

class UserController extends Controller
{
    const PUBLISHER_PAGE = 10;

    public function index()
    {
        $query = User::query();
        $users = $query->orderBy('updated_at')->paginate(self::PUBLISHER_PAGE);

        return view('admin/cms/users', [
            'users' => $users,
        ]);
    }

}
