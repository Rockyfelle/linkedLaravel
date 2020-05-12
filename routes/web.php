<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    $tags = DB::table('tags')->where('user_id', Auth::id())->get();
    return view('tags', ['tags' => $tags]);
})->middleware('auth');

Route::get('/me/tags', function () {
    $tags = DB::table('tags')->where('user_id', Auth::id())->get();
    return view('tags2', ['tags' => $tags]);
})->middleware('auth');

Route::get('/newtag', function () {
    return view('newtag');
})->middleware('auth');

Route::get('/newlink', function () {
    $tags = DB::table('tags')->where('user_id', Auth::id())->get();
    return view('newlink', ['tags' => $tags]);
})->middleware('auth');

Route::get('/{user_id}/friends', function ($user_id) {
    $friends = DB::table('friends')->leftJoin('users', 'friends.user_id_2', '=', 'users.id')->select('user_id_2', 'username')->where('user_id_1', Auth::id())->get();
    return view('friends', ['friends' => $friends]);
})->middleware('auth');

Route::post('/api/newtag', 'ApiController@newTag')->middleware('auth');
Route::post('/api/newlink', 'ApiController@newLink')->middleware('auth');
Route::post('/api/tag/sharelink/makedelete', 'ApiController@tagSharelinkMakeDelete')->middleware('tagWriteAccess');


Route::get('/{userId}/tag/{name}/{id}/{token?}', function ($userId, $name, $id, $token = "") {//Controller needs to make sure id of tag belongs to user or user has permission to it
    $tag = DB::table('tags')->where('id', $id)->first();
    $linkIds = DB::table('taglinks')->select('link_id')->where('tag_id', $id)->get()->pluck('link_id');
    $links = DB::table('links')->whereIn('id', $linkIds)->get();
    return view('tag', ['links' => $links, 'tag' => $tag]);
})->middleware('tagReadAccess');

/*
Route::get('/{userId}/tag/{name}/{id}', function ($userId, $name, $id) {
    if ($userId == "me") {
        Route::get('/{userId}/tag/{name}/{id}', function ($userId, $name, $id) {
            $tag = DB::table('tags')->where('id', $id)->first();
            $linkIds = DB::table('taglinks')->select('link_id')->where('tag_id', $id)->get()->pluck('link_id');
            $links = DB::table('links')->whereIn('id', $linkIds)->get();
            return view('tag', ['links' => $links, 'tag' => $tag]);
        })->middleware('auth');
    }

});*/



Route::get('/me/link/{name}/{id}', function ($name, $id) {
    $link = DB::table('links')->where('id', $id)->first();
    $tagIds = DB::table('taglinks')->select('tag_id')->where('link_id', $id)->get()->pluck('tag_id');
    $tags = DB::table('tags')->whereIn('id', $tagIds)->get();
    return view('link', ['tags' => $tags, 'link' => $link]);
})->middleware('auth');




Auth::routes();

Route::get('/home', 'HomeController@index')->name('home');
