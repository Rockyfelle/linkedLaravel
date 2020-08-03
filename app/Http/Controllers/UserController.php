<?php

namespace App\Http\Controllers;

use DB;
use Auth;
use App\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function get(Request $request, $userId)
    {
		$userDetails = DB::table('users')->select('id', 'username', 'tagvisibility')->where('id', $userId)->first();
		if ($userDetails !== null) {

			if (Auth::check()) {

				$friend = DB::table('friends')->select('pending')->where('user_id_1', Auth::id())->where('user_id_2', $userId)->first();
				if ($friend === null) {

					$isFriend = false;
					$friend_2 = DB::table('friends')->select('pending')->where('user_id_1', $userId)->where('user_id_2', Auth::id())->first();
					if ($friend_2 !== null && $friend_2->pending === 1) {

						$pending = "to";
					} else {

						$pending = "none";
					}
				} else {
					if ($friend !== null && $friend->pending === 1) {

						$isFriend = false;
						$pending = "from";
					} else {

						$isFriend = true;
						$pending = "none";
					}
				}
			} else {

				$isFriend = false;
				$pending = "none";
			}

			return ['status' => 'success', 'user' => $userDetails, 'isfriend' => $isFriend, 'pending' => $pending];
		} else {
			
			return ['status' => 'failed', 'code' => 'no-user', 'message' => 'User could not be found.'];
		}
		
		//If
		//User does not own tag
		abort(403);
	}
}