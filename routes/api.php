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
	Route::get('tags/{userId}/', 'TagsController@myTags');
	
	//New style per TODO.txt
	Route::delete('link/{linkId}/{tagId}', 'LinkController@delete');
	Route::post('link', 'LinkController@new');
	Route::delete('sharelink/{tagId}', 'ShareController@delete');
	Route::post('sharelink', 'ShareController@new');

	//Will only work for logged in users if uncommented
	Route::get('user/{userId}/tag/{tagId}/{token?}', 'TagController@getAll');
});

//Allow users and guests
Route::get('user/{userId}/detail', 'UserController@show');

//Will only work for guests if uncommented
//Route::get('user/{userId}/tag/{tagId}/{token?}', 'TagController@getAll');