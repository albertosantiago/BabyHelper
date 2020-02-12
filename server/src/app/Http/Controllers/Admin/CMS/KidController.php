<?php
namespace App\Http\Controllers\Admin\CMS;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Kid;
use Datatables;
use DB;
use Session;

class KidController extends Controller
{
    const PUBLISHER_PAGE = 10;

    public function index()
    {
        $query = Kid::query();
        $kids  = $query->orderBy('updated_at')->paginate(self::PUBLISHER_PAGE);

        return view('admin/cms/kids', [
            'kids' => $kids,
        ]);
    }

}
