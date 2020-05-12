<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use DB;
use Illuminate\Support\Str;

class ApiController extends Controller
{
    public function tagSharelinkMakeDelete(Request $request) {
        if ($request->makedelete == 0) {
            //Make a new Sharelink
            DB::table('tags')->where('user_id', Auth::id())->where('id', $request->id)->update([
                'access_token' => Str::random(8),
            ]);
        }
        else {
            //Delete existing Sharelink
            DB::table('tags')->where('user_id', Auth::id())->where('id', $request->id)->update([
                'access_token' => '',
            ]);
        }

        return response()->json(array('msg'=> "Tag Saved."), 200);
    }

    public function newTag(Request $request) {
        DB::table('tags')->insert([
            'user_id' => Auth::id(),
            'name' => $request->name,
            'perm_read' => $request->read,
            'perm_write' => $request->write,
            'access_token' => '',
        ]);

        //return response()->json(array('msg'=> $request->name), 200);
        return response()->json(array('msg'=> "Tag Saved."), 200);
    }

    public function newLink(Request $request) {
        DB::table('links')->insert([
            'user_id' => Auth::id(),
            'link' => $request->link,
            'name' => $request->name,
        ]);
        
        $linkId = DB::getPdo()->lastInsertId();
        for ($i = 0; $i < count($request->tags); $i++) {
            DB::table('taglinks')->insert([
                'user_id' => Auth::id(),
                'tag_id' => $request->tags[$i],
                'link_id' => $linkId,
            ]);
        }

        //return response()->json(array('msg'=> $request->name), 200);
        return response()->json(array('msg'=> "Link Saved."), 200);
     }
}
