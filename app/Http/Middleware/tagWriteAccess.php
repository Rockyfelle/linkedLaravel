<?php

namespace App\Http\Middleware;

use Closure;

class tagWriteAccess
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
                    abort(403);
            } 
            else
                abort(403);
        }

        //Download tag write permissions
        $public = DB::table('tags')->select('perm_write')->where('id', $request->id)->first();

        //Check if tags write permission is set to friends
        if ($public->perm_write == "friends") {

            //Download tag owner data
            $userOfTag = DB::table('tags')->select('user_id')->where('id', $request->id)->first();

            //Check if user is friends with tag owner
            if (DB::table('friends')->where('user_id_2', $userOfTag)->where('user_id_1', Auth::id())->exists()) {
                return $next($request);
            }
        }

        //Check if tag has a whitelist entry for user
        if (DB::table('whitelist')->where('tag_id', $id)->where('user_id', Auth::id())->where('perm_write', '1')->exists()) {
            return $next($request);
        }

        //No access route was found, deny access
        abort(403);
    }
}
