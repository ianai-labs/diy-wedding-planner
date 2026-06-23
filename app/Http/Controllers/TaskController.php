<?php

namespace App\Http\Controllers;

use App\Http\Requests\TaskRequest;
use App\Models\Task;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TaskController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Task::where('user_id', auth()->id())->whereNull('parent_id');

        if ($request->filled('search')) {
            $query->where('title', 'like', '%' . $request->search . '%');
        }
        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $tasks = $query->with('children')->latest()->paginate(10)->withQueryString();

        return Inertia::render('Tasks/Index', [
            'tasks' => $tasks,
            'filters' => (object) $request->only(['search', 'category', 'status']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Tasks/Create');
    }

    public function store(TaskRequest $request): RedirectResponse
    {
        Task::create([
            'user_id' => auth()->id(),
            ...$request->validated(),
        ]);

        return redirect()->route('tasks.index')
            ->with('success', 'Task berhasil ditambahkan.');
    }

    public function show(Task $task): Response
    {
        abort_if($task->user_id !== auth()->id(), 403);

        return Inertia::render('Tasks/Show', ['task' => $task]);
    }

    public function edit(Task $task): Response
    {
        abort_if($task->user_id !== auth()->id(), 403);

        return Inertia::render('Tasks/Edit', ['task' => $task]);
    }

    public function update(TaskRequest $request, Task $task): RedirectResponse
    {
        abort_if($task->user_id !== auth()->id(), 403);

        $task->update($request->validated());

        return redirect()->route('tasks.index')
            ->with('success', 'Task berhasil diperbarui.');
    }

    public function destroy(Task $task): RedirectResponse
    {
        abort_if($task->user_id !== auth()->id(), 403);

        $task->delete();

        return redirect()->route('tasks.index')
            ->with('success', 'Task berhasil dihapus.');
    }

    public function updateStatus(Request $request, Task $task): JsonResponse
    {
        abort_if($task->user_id !== auth()->id(), 403);

        $validated = $request->validate([
            'status' => 'required|in:pending,progress,completed',
        ]);

        $task->update(['status' => $validated['status']]);

        return response()->json(['success' => true, 'status' => $task->status]);
    }

    public function storeSubTask(Request $request, Task $task): RedirectResponse
    {
        abort_if($task->user_id !== auth()->id(), 403);

        $validated = $request->validate(['title' => 'required|string|max:200']);

        $task->children()->create([
            'user_id'  => auth()->id(),
            'title'    => $validated['title'],
            'category' => $task->category,
            'status'   => 'pending',
            'priority' => 'low',
        ]);

        return back()->with('success', 'Sub-task ditambahkan.');
    }

    public function toggleSubTask(Task $task, Task $subtask): RedirectResponse
    {
        abort_if($subtask->user_id !== auth()->id(), 403);

        $newStatus = $subtask->status === 'completed' ? 'pending' : 'completed';
        $subtask->update(['status' => $newStatus]);

        return back()->with('success', 'Sub-task diperbarui.');
    }

    public function destroySubTask(Task $task, Task $subtask): RedirectResponse
    {
        abort_if($subtask->user_id !== auth()->id(), 403);

        $subtask->delete();

        return back()->with('success', 'Sub-task dihapus.');
    }
}
