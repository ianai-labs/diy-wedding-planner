<?php

use App\Http\Controllers\Api\TaskController as ApiTaskController;
use App\Http\Controllers\Api\BudgetController as ApiBudgetController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

// Seluruh API route di-prefix 'api.' agar tidak konflik nama dengan web routes
Route::name('api.')->group(function () {

// Login untuk dapat token Sanctum
Route::post('/login', function (Request $request) {
    $credentials = $request->validate([
        'email'    => 'required|email',
        'password' => 'required',
    ]);

    if (Auth::attempt($credentials)) {
        $user = Auth::user();
        $token = $user->createToken('api-token')->plainTextToken;
        return response()->json([
            'token' => $token,
            'user'  => $user,
        ]);
    }

    return response()->json(['message' => 'Email atau password salah.'], 401);
})->name('login');

// Protected API routes (perlu token Sanctum)
Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('tasks', ApiTaskController::class);
    Route::apiResource('budgets', ApiBudgetController::class);
});

}); // tutup Route::name('api.')
