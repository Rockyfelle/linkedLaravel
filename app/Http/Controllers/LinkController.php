<?php

namespace App\Http\Controllers;

use DB;
use Auth;
use App\User;
use Illuminate\Http\Request;

class LinkController extends Controller //TODO: validate forms max and min chars etc
{ 
	//TODO: Make user distinctions, upon self user check owner status of all tags, upon other user check write permission on all tags

	public function getReturn ($linkId)
	{
		$linkInfo = DB::table('links')->select('link', 'name')->where('id', $linkId)->first();
		$tagsInfo = DB::table('taglinks')->select('tag_id')->where('link_id', $linkId)->pluck('tag_id');
		return ['link' => $linkInfo, 'tags' => $tagsInfo];
	}

	public function get (Request $request)
	{
		//Check if relationship exists between specified tag and link under specified user
		if (DB::table('taglinks')->where('tag_id', $request->tagId)->where('link_id', $request->linkId)->where('user_id', $request->userId)->exists()) {

			//Check if user is insisting that the requested tag is owned by them
			if ($request->userId == "me" || $request->userId == Auth::id()) {
				//Check if user is logged in
				if (Auth::check()) {

					//Download tag owner data
					$userOfTag = DB::table('tags')->select('user_id')->where('id', $request->tagId)->first();

					//Check if requested tag is owned by user
					if ($userOfTag->user_id == Auth::id()) {

						//Success
						return $this->getReturn($request->linkId);	
					}
					else
						abort(405);
				}
				else
					abort(405);
			}

			//Download tag access_token and read permissions
			$public = DB::table('tags')->select('perm_read', 'access_token')->where('id', $request->tagId)->first();

			//Check if tags read permission is set to public
			if ($public->perm_read == "public") {

				//Success
				return $this->getReturn($request->linkId);
			}

			//Check if user has provided an access token
			if (empty($token) != true) {
				//Check if access_token exists
				if ($public->access_token != "") {
					//Check if provided token matches tags access_token
					if ($public->access_token == $token) {
						
						//Success
						return $this->getReturn($request->linkId);
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
				$userOfTag = DB::table('tags')->select('user_id')->where('id', $request->tagId)->first();

				//Check if user is friends with tag owner
				if (DB::table('friends')->where('user_id_2', $userOfTag->user_id)->where('user_id_1', Auth::id())->exists()) {
					
					//Success
					return $this->getReturn($request->linkId);
				}
			}

			//Check if tag has a whitelist entry for user
			if (DB::table('whitelist')->where('tag_id', $request->tagId)->where('user_id', Auth::id())->where('perm_read', '1')->exists()) {
				
				//Success
				return $this->getReturn($request->linkId);
			}
		}

		//No access route was found, deny access
		abort(405);
	}

	public function update(Request $request, $linkId)
	{
		//TODO: Download taglinks related to link and make sure the first one is owned by user

		//Check if user is logged in
		if (Auth::check()) {

			//Remove duplicate tags
			$tagArray = array_unique($request->tagArr);

			//Check that user is owner of all requested tags
			foreach ($tagArray as $tag) {
				if (DB::table('tags')->where('id', $tag)->where('user_id', Auth::id())->exists() == false) abort(403);
			}

			//Update link
			DB::table('links')->where('id', $linkId)->update(
				['name' => $request->name,
				'link' => $request->link]
			);

			//Delete old relations between tags and link
			DB::table('taglinks')->where('link_id', $linkId)->delete();

			//Set relations between tags and link
			foreach ($tagArray as $tag) {
				DB::table('taglinks')->insert(
					['user_id' => Auth::id(),
					'tag_id' => $tag,
					'link_id' => $linkId]
				);
			}
			
			return ['status' => 'success'];
		}
		//Not logged in, deny access
		abort(401);
	}

	public function new(Request $request)
	{
		//Check if user is logged in
		if (Auth::check()) {

			//Remove duplicate tags
			$tagArray = array_unique($request->tagArr);

			//Check that user is owner of all requested tags
			foreach ($tagArray as $tag) {
				if (DB::table('tags')->where('id', $tag)->where('user_id', Auth::id())->exists() == false) abort(403);
			}

			//Add
			$linkId = DB::table('links')->insertGetId(
				['user_id' => Auth::id(),
				'name' => $request->name,
				'link' => $request->link]
			);

			//Set relations between tags and link
			foreach ($tagArray as $tag) {
				DB::table('taglinks')->insert(
					['user_id' => Auth::id(),
					'tag_id' => $tag,
					'link_id' => $linkId]
				);
			}
			
			return ['status' => 'success'];
		}
		//Not logged in, deny access
		abort(401);
	}

	public function deleteReturn ($linkId)
	{
		DB::table('links')->where('id', $linkId)->delete();
		DB::table('taglinks')->where('link_id', $linkId)->delete();
		return ['status' => 'success'];
	}

	public function delete(Request $request, $linkId, $tagId)
	{
		//TODO: Inform user that sharing a tag allows anyone with a write permissions to permanently delete tags under, despite
		//their possible existence under other tags the user does not have access to.

		//Check if user is logged in
		if (Auth::check()) {

			//Check if Link ID, Tag ID, and relationship exists
			if (DB::table('taglinks')->where('tag_id', $tagId)->where('link_id', $linkId)->exists()) {

				//Download tag owner data
				$userOfTag = DB::table('tags')->select('user_id')->where('id', $tagId)->first();

				//Check if requested tag is owned by user
				if ($userOfTag->user_id == Auth::id()) {
					
					//Success
					return $this->deleteReturn($linkId);
				}

				//Download write permissions
				$public = DB::table('tags')->select('perm_write')->where('id', $tagId)->first();

				//Check if tags write permission is set to friends
				if ($public->perm_write == "friends") {

					//Check if user is friends with tag owner
					if (DB::table('friends')->where('user_id_2', $userOfTag->user_id)->where('user_id_1', Auth::id())->exists()) {
					
					//Success
					return $this->deleteReturn($linkId);
					}
				}

				//Check if tag has a whitelist entry for user
				if (DB::table('whitelist')->where('tag_id', $tagId)->where('user_id', Auth::id())->where('perm_write', '1')->exists()) {
					
					//Success
					return $this->deleteReturn($linkId);
				}

				//No access route was found, deny access
				abort(403);
			}
			//Link ID, Tag ID, or relationship does not exist, deny access
			abort(403);
		}
		//Not logged in, deny access
		abort(401);
	}
}
