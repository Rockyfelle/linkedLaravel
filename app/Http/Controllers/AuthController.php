<?php

namespace App\Http\Controllers;

use Auth;
use App\User;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    protected function generateAccessToken($user)
    {
        $token = $user->createToken($user->email.'-'.now());

        return $token->accessToken;
    }


    public function register(Request $request)
    {
        $request->validate([
			'username' => 'required|min:3|max:16',
            'name' => 'required|max:32', 
            'email' => 'required|email', 
            'password' => 'required|min:6'
        ]);

        $user = User::create([
			'username' => $request->username,
            'name' => $request->name,
            'email' => $request->email, 
			'password' => bcrypt($request->password),
			'tagvisibility' => 'private',
        ]);

        return response()->json($user);
    }

    public function login(Request $request)
	{
		$request->validate([
			'email' => 'required|email|exists:users,email', 
			'password' => 'required'
		]);

		if( Auth::attempt(['email'=>$request->email, 'password'=>$request->password]) ) {
			$user = Auth::user();

			$token = $user->createToken($user->email.'-'.now());

			return response()->json([
				'status' => 'success',
				'token' => $token->accessToken,
				'username' => $user->username,
				'userid' => $user->id,
			]);
		}
		else {
			return response()->json([
				'status' => 'failed',
				'code' => 'data-unmatched',
				'errormessage' => 'Wrong email or password.',
			]);
		}
	}
}