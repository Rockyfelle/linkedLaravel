<?php

namespace App\Http\Controllers;

use DB;
use Auth;
use App\User;
use Illuminate\Http\Request;

class TagController extends Controller
{//TODO: include data regarding the users perms, if they have the write perm

	public function delete(Request $request, $userId, $tagId)
    {
		if (Auth::check()) {

			//Check if user is insisting that the requested tag is owned by them
			if ($userId == "me" || $userId == Auth::id()) {

				//Make sure the requesting user owns the requested tag
				if (DB::table('tags')->where('id', $tagId)->where('user_id', Auth::id())->exists()) {

					//Delete tag and remove all taglink connections to links under it, and remove all links that do not have other tags
					//DB::table('tags')->where('id', $tagId)->delete();
					//DB::table('taglinks')->where('tag_id', $tagId)->delete();
					$links = DB::table('links')->leftJoin('taglinks', 'links.id', '=', 'taglinks.link_id')->whereNull('taglinks.link_id')->select('links.id')->get()->pluck('id');

					return ['links' => $links];
				}
				//User does not own tag, or tag does not exist, deny access
				abort(403);
			}
			//User does not own tag
			abort(403);
		}
		//Not logged in, deny access
		abort(401);
	}

	public function getAllApproved(Request $request, $tagId)
    {//TDOD: find a way to call this function instead of copy-pasting it all over
		$tag = DB::table('tags')->where('id', $tagId)->first();
		$linkIds = DB::table('taglinks')->select('link_id')->where('tag_id', $tagId)->get()->pluck('link_id');
		$links = DB::table('links')->whereIn('id', $linkIds)->get();

		return ['links' => $links, 'tag' => $tag];
	}

	public function getAll(Request $request, $userId, $tagId, $token = "")
    {
		//Check if user is insisting that the requested tag is owned by them
		if ($request->userId == "me" || $request->userId == Auth::id()) {
			//Check if user is logged in
			if (Auth::check()) {

				//Download tag owner data
				$userOfTag = DB::table('tags')->select('user_id')->where('id', $tagId)->first();

				//Check if requested tag is owned by user
				if ($userOfTag->user_id == Auth::id()) {
					$tag = DB::table('tags')->where('id', $tagId)->first();
					$linkIds = DB::table('taglinks')->select('link_id')->where('tag_id', $tagId)->get()->pluck('link_id');
					$links = DB::table('links')->whereIn('id', $linkIds)->get();

					return ['links' => $links, 'tag' => $tag];
				}
				else
					abort(405);
			} 
			else
				abort(405);
		}

		//Download tag access_token and read permissions
		$public = DB::table('tags')->select('perm_read', 'access_token')->where('id', $tagId)->first();

		//Check if tags read permission is set to public
		if ($public->perm_read == "public") {
			$tag = DB::table('tags')->where('id', $tagId)->first();
			$linkIds = DB::table('taglinks')->select('link_id')->where('tag_id', $tagId)->get()->pluck('link_id');
			$links = DB::table('links')->whereIn('id', $linkIds)->get();

			return ['links' => $links, 'tag' => $tag];
		}

		//Check if user has provided an access token
		if (empty($token) != true) {
			//Check if access_token exists
			if ($public->access_token != "") {
				//Check if provided token matches tags access_token
				if ($public->access_token == $token) {
					$tag = DB::table('tags')->where('id', $tagId)->first();
					$linkIds = DB::table('taglinks')->select('link_id')->where('tag_id', $tagId)->get()->pluck('link_id');
					$links = DB::table('links')->whereIn('id', $linkIds)->get();

					return ['links' => $links, 'tag' => $tag];
				}
				else
					abort(405);
			}
			else
				abort(405);
		}

		//error_log($public->perm_read);
		//Check if tags read permission is set to friends
		if ($public->perm_read == "friends") {
			//Download tag owner data
			$userOfTag = DB::table('tags')->select('user_id')->where('id', $tagId)->first();

			//Download possible friendship data
			//$friends = ;

			//Check if user is friends with tag owner
			if (DB::table('friends')->where('user_id_2', $userOfTag->user_id)->where('user_id_1', Auth::id())->exists()) {
				$tag = DB::table('tags')->where('id', $tagId)->first();
				$linkIds = DB::table('taglinks')->select('link_id')->where('tag_id', $tagId)->get()->pluck('link_id');
				$links = DB::table('links')->whereIn('id', $linkIds)->get();

				return ['links' => $links, 'tag' => $tag];
			}
		}

		//Check if tag has a whitelist entry for user
		if (DB::table('whitelist')->where('tag_id', $tagId)->where('user_id', Auth::id())->where('perm_read', '1')->exists()) {
			$tag = DB::table('tags')->where('id', $tagId)->first();
			$linkIds = DB::table('taglinks')->select('link_id')->where('tag_id', $tagId)->get()->pluck('link_id');
			$links = DB::table('links')->whereIn('id', $linkIds)->get();

			return ['links' => $links, 'tag' => $tag];
		}

		//No access route was found, deny access
		abort(405);
	}
}
