<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Task;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Task::where('user_id', auth()->id())
            ->whereNull('parent_id');

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('search')) {
            $query->where('title', 'like', "%{$request->search}%");
        }

        $tasks = $query->with('children')->latest()->paginate(20);

        return response()->json($tasks);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title'       => 'required|string|max:200',
            'category'    => 'required|in:H-365,H-180,H-90,H-30,H-7',
            'description' => 'nullable|string',
            'deadline'    => 'nullable|date',
            'priority'    => 'required|in:low,medium,high',
        ]);

        $task = Task::create([
            'user_id' => auth()->id(),
            ...$validated,
            'status' => 'pending',
        ]);

        return response()->json($task, 201);
    }

    public function show(Task $task): JsonResponse
    {
        abort_if($task->user_id !== auth()->id(), 403);
        return response()->json($task->load('children'));
    }

    public function update(Request $request, Task $task): JsonResponse
    {
        abort_if($task->user_id !== auth()->id(), 403);

        $validated = $request->validate([
            'title'       => 'sometimes|string|max:200',
            'category'    => 'sometimes|in:H-365,H-180,H-90,H-30,H-7',
            'description' => 'nullable|string',
            'deadline'    => 'nullable|date',
            'status'      => 'sometimes|in:pending,progress,completed',
            'priority'    => 'sometimes|in:low,medium,high',
        ]);

        $task->update($validated);
        return response()->json($task);
    }

    public function destroy(Task $task): JsonResponse
    {
        abort_if($task->user_id !== auth()->id(), 403);
        $task->delete();
        return response()->json(null, 204);
    }
}
