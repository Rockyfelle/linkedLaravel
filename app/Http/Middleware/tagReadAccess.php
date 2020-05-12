<?php

namespace App\Http\Middleware;

use Closure;
use DB;
use Auth;

class tagReadAccess
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        //Check if user is insisting that the requested tag is owned by them
        if ($request->userId == "me" || $request->userId == Auth::id()) {
            //Check if user is logged in
            if (Auth::check()) {

                //Download tag owner data
                $userOfTag = DB::table('tags')->select('user_id')->where('id', $request->id)->first();

                //Check if requested tag is owned by user
                if ($userOfTag->user_id == Auth::id()) {
                    return $next($request);
                }
                else
                    abort(405);
            } 
            else
                abort(405);
        }

        //Download tag access_token and read permissions
        $public = DB::table('tags')->select('perm_read', 'access_token')->where('id', $request->id)->first();

        //Check if tags read permission is set to public
        if ($public->perm_read == "public") {
            return $next($request);
        }

        //Check if user has provided an access token
        if (empty($request->token) != true) {
            //Check if access_token exists
            if ($public->access_token != "") {
                //Check if provided token matches tags access_token
                if ($public->access_token == $request->token) {
                    return $next($request);
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
            $userOfTag = DB::table('tags')->select('user_id')->where('id', $request->id)->first();

            //Download possible friendship data
            //$friends = ;

            //Check if user is friends with tag owner
            if (DB::table('friends')->where('user_id_2', $userOfTag->user_id)->where('user_id_1', Auth::id())->exists()) {
                return $next($request);
            }
        }

        //Check if tag has a whitelist entry for user
        if (DB::table('whitelist')->where('tag_id', $request->id)->where('user_id', Auth::id())->where('perm_read', '1')->exists()) {
            return $next($request);
        }

        //No access route was found, deny access
        abort(405);
    }
}
