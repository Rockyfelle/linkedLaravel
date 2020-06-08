<?php

namespace App\Http\Controllers;

use DB;
use Auth;
use App\User;
use Illuminate\Http\Request;

class ShareController extends Controller
{
	public function new(Request $request)
	{
		//Check if user is logged in
		if (Auth::check()) {

			//Make sure the requesting user owns the requested tag
			if (DB::table('tags')->where('id', $request->tagId)->where('user_id', Auth::id())->exists()) {

				//Generate a unique sharelink
				$foundUnique = false;
				for ($i = 0; $i < 100; $i ++) {
					$sharelink = substr(str_shuffle('abcdefghjkmnopqrstuxyzABCDEFGHJKLMNOPQRSTUXYZ'), 1, 8);
					if (DB::table('tags')->where('access_token', $sharelink)->exists() == false) {
						$foundUnique = true;
						break;
					}
				}
				
				//If no unique id has been found, report error to client
				if ($foundUnique === false) 
					return ['status' => 'error', 'message' => "Sharelink ID generation error", 'token' => 'error'];

				//Delete tag sharelink
				DB::table('tags')->where('id', $request->tagId)->update(array('access_token' => $sharelink));

				return ['status' => 'success', 'token' => $sharelink];
			}
			//User does not own tag, or tag does not exist, deny access
			abort(403);
		}
		//Not logged in, deny access
		abort(401);
	}

    public function delete(Request $request, $tagId)
	{
		//Check if user is logged in
		if (Auth::check()) {

			//Make sure the requesting user owns the requested tag
			if (DB::table('tags')->where('id', $tagId)->where('user_id', Auth::id())->exists()) {

				//Create tag sharelink
				DB::table('tags')->where('id', $tagId)->update(array('access_token' => ''));

				return ['status' => 'success'];
			}
			//User does not own tag, or tag does not exist, deny access
			abort(403);
		}
		//Not logged in, deny access
		abort(401);
	}
}
