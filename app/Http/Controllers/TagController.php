<?php

namespace App\Http\Controllers;

use DB;
use Auth;
use App\User;
use Illuminate\Http\Request;

class TagController extends Controller
{//TODO: include data regarding the users perms, if they have the write perm

	public function update(Request $request, $userId, $tagId)
	{
		//Check if user is insisting that the requested tag is owned by them
		if ($userId == "me" || $userId == Auth::id()) {

			//Check if user is logged in
			if (Auth::check()) {

				//Check if tag exists and is owned by user
				if (DB::table('tags')->where('id', $tagId)->where('user_id', Auth::id())->exists()) {

					DB::table('tags')->where('id', $tagId)->update(
						['name' => $request->name,
						'perm_read' => $request->perm_read,
						'perm_write' => $request->perm_write]
					);

					return ['status' => 'success'];
				}
				abort(403);
			} 
			abort(401);
		}
		abort(403);
	}

	public function get(Request $request, $userId, $tagId)
	{
		//Check if user is insisting that the requested tag is owned by them
		if ($userId == "me" || $userId == Auth::id()) {

			//Check if user is logged in
			if (Auth::check()) {

				//Check if tag exists and is owned by user
				if (DB::table('tags')->where('id', $tagId)->where('user_id', Auth::id())->exists()) {

					$tag = DB::table('tags')->select('name', 'perm_read', 'perm_write', 'access_token')->where('id', $tagId)->first();
					$permList = DB::table('whitelist')->select('user_id', 'perm_read', 'perm_write')->where('tag_id', $tagId)->get();

					$readlist = [];
					$writelist = [];

					foreach ($permList as $item) {
						if ($item->perm_read) {
							array_push($readlist, $item->user_id);
						}
						if ($item->perm_write) {
							array_push($writelist, $item->user_id);
						}
					}

					return ['tag' => $tag, 'readlist' => $readlist, 'writelist' => $writelist];
				}
				abort(403);
			} 
			abort(401);
		}
		abort(403);
	}

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

	public function getAllReturn($tagId, $showTags)
    {
		$tag = DB::table('tags')->select('id', 'user_id', 'name', 'perm_read', 'perm_write', 'access_token')->where('id', $tagId)->first();
		$linkIds = DB::table('taglinks')->select('link_id')->where('tag_id', $tagId)->get()->pluck('link_id');
		$links = DB::table('links')->select('id', 'user_id', 'link', 'name')->whereIn('id', $linkIds)->get();
		
		//If users own tag, add an array of every tag under every link and include it in all link objects
		if ($showTags) {
			$linkTags = DB::table('taglinks')->select('link_id', 'tag_id')->whereIn('link_id', $linkIds)->get();
			$tagNames = DB::table('tags')->select('id', 'name')->whereIn('id', $linkTags->pluck('tag_id'))->get()->pluck('name', 'id');

			for ($i = 0; $i < count($linkTags); $i ++) {
				for ($j = 0; $j < count($links); $j ++) {
					if ($links[$j]->id == $linkTags[$i]->link_id) {
						if (property_exists($links[$j], "tagids") === false) $links[$j]->{"tagids"} = [];
						array_push($links[$j]->tagids, $linkTags[$i]->tag_id);
						if (property_exists($links[$j], "tagnames") === false) $links[$j]->{"tagnames"} = [];
						array_push($links[$j]->tagnames, $tagNames[$linkTags[$i]->tag_id]);
						if (property_exists($links[$j], "tags") === false) $links[$j]->{"tags"} = [];
						array_push($links[$j]->tags, ['id' => $linkTags[$i]->tag_id, 'name' => $tagNames[$linkTags[$i]->tag_id]]);
					}
				}
			}
		}

		return ['status' => 'success', 'tag' => $tag, 'links' => $links, 'showTags' => $showTags];
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
					
					//Success
					return $this->getAllReturn($tagId, true);
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
								
			//Success
			return $this->getAllReturn($tagId, false);
		}

		//Check if user has provided an access token
		if (empty($token) != true) {
			//Check if access_token exists
			if ($public->access_token != "") {
				//Check if provided token matches tags access_token
				if ($public->access_token == $token) {
					
					//Success
					return $this->getAllReturn($tagId, false);
				}
				else
					abort(405);
			}
			else
				abort(405);
		}

		//Check if tags read permission is set to friends
		if ($public->perm_read == "friends") {
			//Download tag owner data
			$userOfTag = DB::table('tags')->select('user_id')->where('id', $tagId)->first();

			//Check if user is friends with tag owner
			if (DB::table('friends')->where('user_id_2', $userOfTag->user_id)->where('user_id_1', Auth::id())->exists()) {
				
				//Success
				return $this->getAllReturn($tagId, false);
			}
		}

		//Check if tag has a whitelist entry for user
		if (DB::table('whitelist')->where('tag_id', $tagId)->where('user_id', Auth::id())->where('perm_read', '1')->exists()) {
			
			//Success
			return $this->getAllReturn($tagId, false);
		}

		//No access route was found, deny access
		abort(405);
	}
}
