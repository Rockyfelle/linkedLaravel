<?php

namespace App\Http\Controllers;

use DB;
use Auth;
use App\User;
use Illuminate\Http\Request;

class LinkController extends Controller //TODO: validate forms max and min chars etc
{
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

			//Add link and taglinks relations
			$linkId = DB::table('links')->insertGetId(
				['user_id' => Auth::id(),
				'name' => $request->name,
				'link' => $request->link]
			);

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
					DB::table('links')->where('id', $linkId)->delete();
					DB::table('taglinks')->where('link_id', $linkId)->delete();
					return ['status' => 'success'];
				}

				//Download write permissions
				$public = DB::table('tags')->select('perm_write')->where('id', $tagId)->first();

				//Check if tags write permission is set to friends
				if ($public->perm_write == "friends") {

					//Check if user is friends with tag owner
					if (DB::table('friends')->where('user_id_2', $userOfTag->user_id)->where('user_id_1', Auth::id())->exists()) {
						DB::table('links')->where('id', $linkId)->delete();
						DB::table('taglinks')->where('link_id', $linkId)->delete();
						return ['status' => 'success'];
					}
				}

				//Check if tag has a whitelist entry for user
				if (DB::table('whitelist')->where('tag_id', $tagId)->where('user_id', Auth::id())->where('perm_write', '1')->exists()) {
					DB::table('links')->where('id', $linkId)->delete();
					DB::table('taglinks')->where('link_id', $linkId)->delete();
					return ['status' => 'success'];
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
