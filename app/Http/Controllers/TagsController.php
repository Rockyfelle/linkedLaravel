<?php

namespace App\Http\Controllers;

use DB;
use Auth;
use App\User;
use Illuminate\Http\Request;

class TagsController extends Controller
{
    public function get(Request $request, $userId)
    {
		//Check if user is logged in
		if (Auth::check()) {
			
			//Check if user is asking for their own tags
			if ($request->userId == "me" || $request->userId == Auth::id()) {

				$tags = DB::table('tags')->select('id', 'user_id', 'name', 'perm_read', 'perm_write', 'access_token')->where('user_id', Auth::id())->get();
				$visibility = DB::table('users')->select('tagvisibility')->where('id', Auth::id())->pluck('tagvisibility');
				return ['status' => 'success', 'visibility' => $visibility[0], 'tags' => $tags];
			}

			//Check if requested user exists
			if (DB::table('users')->where('id', $userId)->exists()) {

				//Check if requested user has their tag visibility set to friends
				if (DB::table('users')->where('id', $userId)->where('tagvisibility', 'friends')->exists()) {

					$tags = DB::table('tags')->select('id', 'user_id', 'name', 'perm_read', 'perm_write', 'access_token')->where('user_id', $userId)->get();
					return ['status' => 'success', 'visibility' => 'friends', 'tags' => $tags];
				}
			}
		}

		//Check if requested user exists
		if (DB::table('users')->where('id', $userId)->exists()) {

			//Check if requested user has their tag visibility set to public
			if (DB::table('users')->where('id', $userId)->where('tagvisibility', 'public')->exists()) {

				$tags = DB::table('tags')->select('id', 'user_id', 'name', 'perm_read', 'perm_write', 'access_token')->where('user_id', $userId)->get();
				return ['status' => 'success', 'visibility' => 'public', 'tags' => $tags];
			}

			//No access route found, report information on user
			$visibility = DB::table('users')->select('tagvisibility')->where('id', Auth::id())->pluck('tagvisibility');
			return ['status' => 'failed', 'code' => 'privacy', 'visibility' => $visibility[0], 'message' => 'The users privacy settings prevents you from seeing their tags.'];
		}

		//User not found, report information
		$visibility = DB::table('users')->select('tagvisibility')->where('id', Auth::id())->pluck('tagvisibility');
		return ['status' => 'failed', 'code' => 'no-user', 'message' => 'User could not be found.'];

        
    }
}
