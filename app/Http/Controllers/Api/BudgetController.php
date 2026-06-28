<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Budget;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BudgetController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Budget::where('user_id', auth()->id());

        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }

        if ($request->filled('search')) {
            $query->where('description', 'like', "%{$request->search}%");
        }

        $budgets = $query->latest()->paginate(20);

        return response()->json($budgets);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'category'    => 'required|in:venue,catering,decoration,photo_video,dress,ring,others',
            'description' => 'required|string|max:255',
            'amount'      => 'required|numeric|min:1',
            'date'        => 'required|date',
            'status'      => 'required|in:planned,spent',
        ]);

        $budget = Budget::create([
            'user_id' => auth()->id(),
            ...$validated,
        ]);

        return response()->json($budget, 201);
    }

    public function show(Budget $budget): JsonResponse
    {
        abort_if($budget->user_id !== auth()->id(), 403);
        return response()->json($budget);
    }

    public function update(Request $request, Budget $budget): JsonResponse
    {
        abort_if($budget->user_id !== auth()->id(), 403);

        $validated = $request->validate([
            'category'    => 'sometimes|in:venue,catering,decoration,photo_video,dress,ring,others',
            'description' => 'sometimes|string|max:255',
            'amount'      => 'sometimes|numeric|min:1',
            'date'        => 'sometimes|date',
            'status'      => 'sometimes|in:planned,spent',
        ]);

        $budget->update($validated);
        return response()->json($budget);
    }

    public function destroy(Budget $budget): JsonResponse
    {
        abort_if($budget->user_id !== auth()->id(), 403);
        $budget->delete();
        return response()->json(null, 204);
    }
}
