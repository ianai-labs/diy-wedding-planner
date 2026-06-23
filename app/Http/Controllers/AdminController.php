<?php

namespace App\Http\Controllers;

use App\Models\Budget;
use App\Models\Note;
use App\Models\Task;
use App\Models\User;
use App\Models\Vendor;
use App\Models\Message;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class AdminController extends Controller
{
    public function index(Request $request): InertiaResponse
    {
        $query = User::where('role', '!=', 'admin')
            ->withCount(['tasks', 'budgets', 'notes']);

        // Search
        if ($request->filled('search')) {
            $s = $request->search;
            $query->where(function ($q) use ($s) {
                $q->where('name', 'like', "%{$s}%")
                  ->orWhere('email', 'like', "%{$s}%");
            });
        }

        // Filter by wedding date range
        if ($request->filled('date_from')) {
            $query->where('wedding_date', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $query->where('wedding_date', '<=', $request->date_to);
        }

        $users = $query->latest()->paginate(10)->withQueryString();

        // Hitung countdown & spent per user
        $users->getCollection()->transform(function ($user) {
            $user->total_spent = Budget::where('user_id', $user->id)
                ->where('status', 'spent')->sum('amount');
            $user->completed_tasks = Task::where('user_id', $user->id)
                ->where('status', 'completed')->count();
            $user->days_left = $user->wedding_date
                ? (int) now()->startOfDay()->diffInDays($user->wedding_date, false)
                : null;
            return $user;
        });

        // Global stats
        $stats = [
            'totalUsers'   => User::where('role', '!=', 'admin')->count(),
            'totalTasks'   => Task::count(),
            'totalBudgets' => Budget::count(),
            'totalVendors' => Vendor::count(),
            'totalNotes'   => Note::count(),
            'totalSpent'   => (int) Budget::where('status', 'spent')->sum('amount'),
        ];

        // Chart: budget per category (all users)
        $budgetByCategory = Budget::where('status', 'spent')
            ->selectRaw('category, SUM(amount) as total')
            ->groupBy('category')
            ->pluck('total', 'category');

        // Chart: task status distribution (all users)
        $taskByStatus = [
            'pending'   => Task::where('status', 'pending')->count(),
            'progress'  => Task::where('status', 'progress')->count(),
            'completed' => Task::where('status', 'completed')->count(),
        ];

        return Inertia::render('Admin/Index', [
            'users'           => $users,
            'stats'           => $stats,
            'budgetByCategory'=> $budgetByCategory,
            'taskByStatus'    => $taskByStatus,
            'filters'         => (object) $request->only(['search', 'date_from', 'date_to']),
        ]);
    }

    public function show(User $user): InertiaResponse
    {
        $tasks = Task::where('user_id', $user->id)->latest()->get();
        $budgets = Budget::where('user_id', $user->id)->latest()->get();
        $vendors = Vendor::latest()->get();
        $notes = Note::where('user_id', $user->id)->latest()->get();
        $totalSpent = $budgets->where('status', 'spent')->sum('amount');

        return Inertia::render('Admin/Show', [
            'targetUser'    => $user->loadCount(['tasks', 'budgets', 'notes']),
            'tasks'         => $tasks,
            'budgets'       => $budgets,
            'vendors'       => $vendors,
            'notes'         => $notes,
            'totalSpent'    => $totalSpent,
            'taskProgress'  => $user->tasks_count > 0
                ? round(($tasks->where('status', 'completed')->count() / $user->tasks_count) * 100)
                : 0,
            'budgetPercent' => $user->total_budget > 0
                ? round(($totalSpent / $user->total_budget) * 100, 1)
                : 0,
        ]);
    }

    public function plan(User $user): InertiaResponse
    {
        $userId = $user->id;

        $tasks = Task::where('user_id', $userId)->latest()->get();
        $budgets = Budget::where('user_id', $userId)->latest()->get();
        $notes = Note::where('user_id', $userId)->latest()->get();
        $totalSpent = $budgets->where('status', 'spent')->sum('amount');

        return Inertia::render('Admin/Plan', [
            'targetUser'    => $user,
            'tasks'         => $tasks,
            'budgets'       => $budgets,
            'notes'         => $notes,
            'messages'      => \App\Models\Message::where('user_id', $userId)->latest()->get(),
            'totalSpent'    => $totalSpent,
            'taskProgress'  => $tasks->count() > 0
                ? round(($tasks->where('status', 'completed')->count() / $tasks->count()) * 100)
                : 0,
            'budgetPercent' => $user->total_budget > 0
                ? round(($totalSpent / $user->total_budget) * 100, 1)
                : 0,
        ]);
    }

    public function manage(User $user): InertiaResponse
    {
        $userId = $user->id;

        return Inertia::render('Admin/Manage', [
            'targetUser'    => $user,
            'tasks'         => Task::where('user_id', $userId)->latest()->get(),
            'budgets'       => Budget::where('user_id', $userId)->latest()->get(),
            'notes'         => Note::where('user_id', $userId)->latest()->get(),
            'messages'      => \App\Models\Message::where('user_id', $userId)->latest()->get(),
            'totalSpent'    => (int) Budget::where('user_id', $userId)->where('status', 'spent')->sum('amount'),
            'taskProgress'  => Task::where('user_id', $userId)->count() > 0
                ? round((Task::where('user_id', $userId)->where('status', 'completed')->count() / Task::where('user_id', $userId)->count()) * 100)
                : 0,
            'budgetPercent' => $user->total_budget > 0
                ? round(($totalSpent = (int) Budget::where('user_id', $userId)->where('status', 'spent')->sum('amount')) / $user->total_budget * 100, 1)
                : 0,
        ]);
    }

    public function edit(User $user): InertiaResponse
    {
        return Inertia::render('Admin/Edit', [
            'targetUser' => $user,
        ]);
    }

    public function update(Request $request, User $user): RedirectResponse
    {
        $validated = $request->validate([
            'name'         => 'required|string|max:255',
            'email'        => 'required|email|unique:users,email,' . $user->id,
            'partner_name' => 'nullable|string|max:100',
            'wedding_date' => 'required|date',
            'total_budget' => 'required|numeric|min:0',
        ]);

        $user->update($validated);

        return redirect()->route('admin.users.show', $user)
            ->with('success', 'User berhasil diperbarui.');
    }

    public function storeTask(Request $request, User $user): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:200', 'category' => 'required|in:H-365,H-180,H-90,H-30,H-7',
            'priority' => 'required|in:low,medium,high', 'deadline' => 'nullable|date', 'status' => 'required|in:pending,progress,completed',
        ]);
        Task::create(['user_id' => $user->id, ...$validated, 'description' => '']);
        return back()->with('success', 'Task ditambahkan.');
    }

    public function storeBudget(Request $request, User $user): RedirectResponse
    {
        $validated = $request->validate([
            'description' => 'required|string|max:255', 'category' => 'required|in:venue,catering,decoration,photo_video,dress,ring,others',
            'amount' => 'required|numeric|min:1', 'date' => 'required|date', 'status' => 'required|in:planned,spent',
        ]);
        Budget::create(['user_id' => $user->id, ...$validated]);
        return back()->with('success', 'Budget ditambahkan.');
    }

    public function storeNote(Request $request, User $user): RedirectResponse
    {
        $validated = $request->validate(['title' => 'required|string|max:200', 'content' => 'required|string']);
        Note::create(['user_id' => $user->id, ...$validated]);
        return back()->with('success', 'Catatan ditambahkan.');
    }

    public function chats(): InertiaResponse
    {
        $usersWithChats = User::whereIn('id', Message::select('user_id')->distinct())
            ->get()
            ->map(function ($user) {
                $user->last_message = Message::where('user_id', $user->id)->latest()->first();
                return $user;
            });

        return Inertia::render('Admin/Chats', [
            'usersWithChats' => $usersWithChats,
        ]);
    }

    public function chatMessages(User $user): \Illuminate\Http\JsonResponse
    {
        $messages = Message::where('user_id', $user->id)->latest()->get();
        return response()->json(['messages' => $messages, 'user' => $user]);
    }

    public function sendMessage(Request $request, User $user): RedirectResponse
    {
        $request->validate(['message' => 'required|string|max:1000']);

        \App\Models\Message::create([
            'user_id'       => $user->id,
            'message'       => $request->message,
            'is_from_admin' => true,
        ]);

        return back()->with('success', 'Pesan terkirim.');
    }

    public function destroy(User $user): RedirectResponse
    {
        abort_if($user->role === 'admin', 403, 'Admin tidak bisa dihapus.');

        $user->delete(); // Cascade: tasks, budgets, vendors, notes ikut terhapus

        return redirect()->route('admin.index')
            ->with('success', 'User beserta semua datanya berhasil dihapus.');
    }

    public function exportCsv(): Response
    {
        $users = User::where('role', '!=', 'admin')
            ->withCount(['tasks', 'budgets', 'notes'])
            ->get()
            ->map(function ($u) {
                $u->total_spent = Budget::where('user_id', $u->id)->where('status', 'spent')->sum('amount');
                $u->days_left = $u->wedding_date ? (int) now()->startOfDay()->diffInDays($u->wedding_date, false) : null;
                return $u;
            });

        $headers = [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => 'attachment; filename="users-' . now()->format('Y-m-d') . '.csv"',
        ];

        $output = fopen('php://temp', 'r+');
        fputcsv($output, ['Nama', 'Email', 'Pasangan', 'Pernikahan', 'H-Hari', 'Budget', 'Spent', 'Tasks', 'Budgets', 'Vendors', 'Notes']);

        foreach ($users as $u) {
            fputcsv($output, [
                $u->name, $u->email, $u->partner_name, $u->wedding_date,
                $u->days_left, $u->total_budget, $u->total_spent,
                $u->tasks_count, $u->budgets_count, Vendor::count(), $u->notes_count,
            ]);
        }

        rewind($output);
        $csv = stream_get_contents($output);
        fclose($output);

        return response($csv, 200, $headers);
    }

    public function exportPdf(): Response
    {
        $users = User::where('role', '!=', 'admin')
            ->withCount(['tasks', 'budgets', 'notes'])
            ->get()
            ->map(function ($u) {
                $u->total_spent = Budget::where('user_id', $u->id)->where('status', 'spent')->sum('amount');
                $u->days_left = $u->wedding_date ? (int) now()->startOfDay()->diffInDays($u->wedding_date, false) : null;
                return $u;
            });

        $pdf = Pdf::loadView('reports.pdf-users', ['users' => $users]);

        return $pdf->download('users-' . now()->format('Y-m-d') . '.pdf');
    }
}
