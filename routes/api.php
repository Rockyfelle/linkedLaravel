<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

////the last possible route will be taken

/*Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});*/

//Logging in
Route::post('register', 'AuthController@register');
Route::post('login', 'AuthController@login');

//Only allow people with proper login token
Route::middleware('auth:api')->group(function() {
	Route::get('tags/{userId}/', 'TagsController@get');
	
	//New style per TODO.txt
	Route::get('link/{linkId}/{tagId}/{userId}', 'LinkController@get');
	Route::delete('link/{linkId}/{tagId}', 'LinkController@delete');
	Route::put('link/{linkId}/{tagId}/{userId}', 'LinkController@update');
	Route::post('link', 'LinkController@new');

	Route::delete('sharelink/{tagId}', 'ShareController@delete');
	Route::post('sharelink', 'ShareController@new');

	//Will only work for logged in users if uncommented
	Route::get('user/{userId}/tag/full/{tagId}/{token?}', 'TagController@getAll');
	Route::get('user/{userId}/tag/simple/{tagId}/', 'TagController@get');
	Route::delete('user/{userId}/tag/{tagId}/{token?}', 'TagController@delete');
	Route::put('user/{userId}/tag/{tagId}', 'TagController@update');
	Route::post('user/{userId}/tag/', 'TagController@new');
	Route::get('user/{userId}/friends', 'FriendsController@get');
	Route::post('user/{userId}/add', 'FriendsController@add');
	Route::post('user/{userId}/request', 'FriendsController@accept');
	Route::delete('user/{userId}/request', 'FriendsController@deny');
	Route::delete('user/{userId}', 'FriendsController@delete');
	Route::get('user/{userId}/details', 'UserController@get');
});

//Allow users and guests
Route::get('user/{userId}/detail', 'UserController@show');

//Will only work for guests if uncommented
//Route::get('user/{userId}/tag/{tagId}/{token?}', 'TagController@getAll');