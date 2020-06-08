<?php

namespace App\Http\Controllers;

use DB;
use Auth;
use App\User;
use Illuminate\Http\Request;

class TagsController extends Controller
{
    public function myTags(Request $request, $userId)
    {
        $tags = DB::table('tags')->where('user_id', Auth::id())->get();

        return response()->json($tags);
    }
}
