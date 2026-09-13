<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\SignupRequest;
use App\Models\User;
use http\Env\Response;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class AuthController extends Controller
{
    public function signup(SignupRequest $request){
        $data = $request -> validated();
        /** @var User $user*/
        $user = User::create([
            'name' => $data['name'],
            'surname' => $data['surname'],
            'email' => $data['email'],
            'password' => bcrypt($data['password'])
        ]);

        $token = $user -> createToken('main') -> plainTextToken;
        return response([
            'user' => $user,
            'token' => $token
        ]);
    }

    public function login(LoginRequest $request){
        $credentials = $request -> validated();
        if(!Auth::attempt($credentials)) {
            return response([
                'message' => 'Email ili lozinka nisu ispravni!'
            ], 422);
        }
        /** @var User $user */
        $user = Auth::user();
        $token = $user->createToken('main')->plainTextToken;
        return response(compact('user', 'token'));
    }

    public function logout(Request $request){
        /** @var User $user */
        $user = $request->user();
        $user->currentAccessToken()->delete();
        return response('', 204);
    }

    public function updateProfile(Request $request)
    {
        $user = $request->user();
        $validated = $request->validate([
            'name' => 'required|string|max:55',
            'surname' => 'required|string|max:55',
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
            'phone_number' => ['nullable', 'string', 'max:30', Rule::unique('users', 'phone_number')->ignore($user->id)],
            'current_password' => 'nullable|required_with:password|string',
            'password' => ['nullable', 'confirmed', Password::min(8)->letters()->numbers()],
        ]);

        if (!empty($validated['password']) && !Hash::check($validated['current_password'], $user->password)) {
            return response()->json(['message' => 'Trenutna lozinka nije ispravna.'], 422);
        }

        unset($validated['current_password'], $validated['password_confirmation']);
        if (!empty($request->password)) {
            $validated['password'] = Hash::make($request->password);
        }

        $user->update($validated);

        return $user->fresh();
    }
}
