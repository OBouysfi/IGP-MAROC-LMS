<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;

class UserController extends Controller
{
    public function index()
    {
        $users = User::with('roles')->latest()->take(4)->get();
        
        return response()->json([
            'success' => true,
            'data' => $users
        ]);
    }
}