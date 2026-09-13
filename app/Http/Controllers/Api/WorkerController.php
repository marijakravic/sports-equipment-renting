<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class WorkerController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:55',
            'surname' => 'required|string|max:55',
            'email' => 'required|email|max:255|unique:users,email',
            'phone_number' => 'nullable|string|max:30|unique:users,phone_number',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $worker = User::create([
            ...$validated,
            'password' => Hash::make($validated['password']),
            'role' => 'worker',
        ]);

        return response()->json($worker, 201);
    }
}
