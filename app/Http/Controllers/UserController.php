<?php

namespace App\Http\Controllers;

use Auth;
use App\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function show(Request $request, $userId)
    {
        $user = User::find($userId);

        if($user) {
            if (Auth::id() == $userId) {
                return response()->json($user->username, $user->token);
            }
            else
                return response()->json(['message' => 'Not your user!'], 404);
                
        }

        return response()->json(['message' => 'User not found!'], 404);
    }
}