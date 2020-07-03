<?php

namespace App\Http\Controllers;

use DB;
use Auth;
use App\User;
use Illuminate\Http\Request;

class FriendsController extends Controller
{
	public function get(Request $request, $userId)
    {
		//Check if user is logged in
		if (Auth::check()) {
			
			//Check if user is asking for their own friends
			if ($request->userId == "me" || $request->userId == Auth::id()) {

				$friends = DB::table('friends')->leftJoin('users', 'friends.user_id_2', '=', 'users.id')->select('friends.user_id_2 AS id', 'users.username')->
					where('friends.user_id_1', Auth::id())->where('pending', false)->get();

				$friendsPending = DB::table('friends')->leftJoin('users', 'friends.user_id_1', '=', 'users.id')->select('friends.user_id_1 AS id', 'users.username')->
					where('friends.user_id_2', Auth::id())->where('pending', true)->get();

				return ['status' => 'success', 'friends' => $friends, 'friends_pending' => $friendsPending];
			}
		}
		//Not logged in, deny access
		abort(403);
	}
	
	public function add(Request $request, $userId)
    {
		//Check if user is logged in
		if (Auth::check()) {
			
			//Make sure user isnt asking to add themselves
			if ($request->userId !== "me" && $request->userId !== Auth::id()) {

				//Make sure users are not already friends, and that a request has not already been sent
				$friendStatusOut = DB::table('friends')->select('pending')->where('user_id_1', Auth::id())->where('user_id_2', $userId)->first();
				if ($friendStatusOut === null) {

					//Make sure a request isn't already pending to user
					$friendStatusIn = DB::table('friends')->select('pending')->where('user_id_1', $userId)->where('user_id_2', Auth::id())->first();
					if ($friendStatusIn === null) {

						//Send friend request
						DB::table('friends')->insert([
							'user_id_1' => Auth::id(),
							'user_id_2' => $userId,
							'pending' => true,
						]);

						return ['status' => 'success'];
					}
					else
						return ['status' => 'failed', 'message' => 'You already have a pending request from this user, please accept it'];
				}
				else {
					if ($friendStatusOut->pending === 1) {
						return ['status' => 'failed', 'message' => 'You have already sent a friend request to this user'];
					}
					else
						return ['status' => 'failed', 'message' => 'You are already friends with this user'];
				}
			}
			else
				return ['status' => 'failed', 'message' => 'You cannot add yourself'];
		}
		//Not logged in, deny access
		abort(403);
	}
	
	public function accept(Request $request, $userId)
    {
		//Check if user is logged in
		if (Auth::check()) {
			
			//Make sure a pending request exists
			if (DB::table('friends')->where('user_id_1', $userId)->where('user_id_2', Auth::id())->where('pending', 1)->exists()) {

				//Accept friend request
				DB::table('friends')->where('user_id_1', $userId)->where('user_id_2', Auth::id())->update([
					'pending' => 0,
				]);
				DB::table('friends')->insert([
					'user_id_1' => Auth::id(),
					'user_id_2' => $userId,
					'pending' => 0,
				]);

				return ['status' => 'success'];
			}
			else
				return ['status' => 'failed', 'message' => 'You do not have an incoming friend request from this user'];
		}
		//Not logged in, deny access
		abort(403);
	}
	
	public function deny(Request $request, $userId)
    {
		//Check if user is logged in
		if (Auth::check()) {
			
			//Make sure a pending request exists
			if (DB::table('friends')->where('user_id_1', $userId)->where('user_id_2', Auth::id())->where('pending', 1)->exists() || DB::table('friends')->where('user_id_1',  Auth::id())->where('user_id_2', $userId)->where('pending', 1)->exists()) {

				//Deny friend request
				DB::table('friends')->where('user_id_1', $userId)->where('user_id_2', Auth::id())->delete();
				DB::table('friends')->where('user_id_1', Auth::id())->where('user_id_2', $userId)->delete();

				return ['status' => 'success'];
			}
			else
				return ['status' => 'failed', 'message' => 'You do not have an incoming friend request from this user'];
		}
		//Not logged in, deny access
		abort(403);
	}
	
	public function delete(Request $request, $userId)
    {
		//Check if user is logged in
		if (Auth::check()) {
			
			//Make sure friendship exists
			if (DB::table('friends')->where('user_id_1', $userId)->where('user_id_2', Auth::id())->where('pending', 0)->exists()) {

				//Deny friendship
				DB::table('friends')->where('user_id_1', $userId)->where('user_id_2', Auth::id())->delete();
				DB::table('friends')->where('user_id_1', Auth::id())->where('user_id_2', $userId)->delete();

				return ['status' => 'success'];
			}
			else
				return ['status' => 'failed', 'message' => 'You are not friends with this user'];
		}
		//Not logged in, deny access
		abort(403);
    }
}
