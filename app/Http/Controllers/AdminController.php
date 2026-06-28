<?php

namespace App\Http\Controllers;

use App\Models\Budget;
use App\Models\Message;
use App\Models\Note;
use App\Models\Task;
use App\Models\User;
use App\Models\Vendor;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class AdminController extends Controller
{
    /**
     * Ambil data lengkap seorang user (tasks, budgets, notes, messages).
     */
    private function getUserData(User $user): array
    {
        $userId = $user->id;

        return [
            'tasks'    => Task::where('user_id', $userId)->latest()->get(),
            'budgets'  => Budget::where('user_id', $userId)->latest()->get(),
            'notes'    => Note::where('user_id', $userId)->latest()->get(),
            'messages' => Message::where('user_id', $userId)->oldest()->get(),
            'totalSpent' => (int) Budget::where('user_id', $userId)
                ->where('status', 'spent')
                ->sum('amount'),
        ];
    }

    /**
     * Kalkulasi progress & persentase dari data user.
     */
    private function calcProgress(User $user, $tasks, int|float $totalSpent): array
    {
        $taskCount     = $tasks->count();
        $completedCount = $tasks->where('status', 'completed')->count();

        return [
            'taskProgress'  => $taskCount > 0
                ? round(($completedCount / $taskCount) * 100)
                : 0,
            'budgetPercent' => $user->total_budget > 0
                ? round(($totalSpent / $user->total_budget) * 100, 1)
                : 0,
            'totalSpent'    => $totalSpent,
        ];
    }

    // =======================================================================
    // Dashboard Admin — daftar user + stats
    // =======================================================================
    public function index(Request $request): InertiaResponse
    {
        $query = User::where('role', '!=', 'admin')
            ->withCount(['tasks', 'budgets', 'notes']);

        if ($request->filled('search')) {
            $s = $request->search;
            $query->where(function ($q) use ($s) {
                $q->where('name', 'like', "%{$s}%")
                  ->orWhere('email', 'like', "%{$s}%");
            });
        }

        if ($request->filled('date_from')) {
            $query->where('wedding_date', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $query->where('wedding_date', '<=', $request->date_to);
        }

        $users = $query->latest()->paginate(10)->withQueryString();

        // Batch query: ambil semua spent & completed per user dalam 1 query aggregat
        $userIds = $users->pluck('id')->toArray();

        $spentMap = Budget::whereIn('user_id', $userIds)
            ->where('status', 'spent')
            ->selectRaw('user_id, SUM(amount) as total')
            ->groupBy('user_id')
            ->pluck('total', 'user_id');

        $completedMap = Task::whereIn('user_id', $userIds)
            ->where('status', 'completed')
            ->selectRaw('user_id, COUNT(*) as total')
            ->groupBy('user_id')
            ->pluck('total', 'user_id');

        $users->getCollection()->transform(function ($user) use ($spentMap, $completedMap) {
            $user->total_spent     = (int) ($spentMap[$user->id] ?? 0);
            $user->completed_tasks = (int) ($completedMap[$user->id] ?? 0);
            $user->days_left       = $user->wedding_date
                ? (int) now()->startOfDay()->diffInDays($user->wedding_date, false)
                : null;
            return $user;
        });

        // Stats & chart — single query per aggregation
        $stats = [
            'totalUsers'   => User::where('role', '!=', 'admin')->count(),
            'totalTasks'   => Task::count(),
            'totalBudgets' => Budget::count(),
            'totalVendors' => Vendor::count(),
            'totalNotes'   => Note::count(),
            'totalSpent'   => (int) Budget::where('status', 'spent')->sum('amount'),
        ];

        return Inertia::render('Admin/Index', [
            'users'            => $users,
            'stats'            => $stats,
            'budgetByCategory' => Budget::where('status', 'spent')
                ->selectRaw('category, SUM(amount) as total')
                ->groupBy('category')
                ->pluck('total', 'category'),
            'taskByStatus' => [
                'pending'   => Task::where('status', 'pending')->count(),
                'progress'  => Task::where('status', 'progress')->count(),
                'completed' => Task::where('status', 'completed')->count(),
            ],
            'filters' => (object) $request->only(['search', 'date_from', 'date_to']),
        ]);
    }

    // =======================================================================
    // Detail user
    // =======================================================================
    public function show(User $user): InertiaResponse
    {
        $data   = $this->getUserData($user);
        $progress = $this->calcProgress($user, $data['tasks'], $data['totalSpent']);

        return Inertia::render('Admin/Show', [
            'targetUser'    => $user->loadCount(['tasks', 'budgets', 'notes']),
            'tasks'         => $data['tasks'],
            'budgets'       => $data['budgets'],
            'vendors'       => Vendor::latest()->get(),
            'notes'         => $data['notes'],
            'totalSpent'    => $progress['totalSpent'],
            'taskProgress'  => $progress['taskProgress'],
            'budgetPercent' => $progress['budgetPercent'],
        ]);
    }

    // =======================================================================
    // Plan user (read-only monitoring)
    // =======================================================================
    public function plan(User $user): InertiaResponse
    {
        $data     = $this->getUserData($user);
        $progress = $this->calcProgress($user, $data['tasks'], $data['totalSpent']);

        return Inertia::render('Admin/Plan', [
            'targetUser'    => $user,
            'tasks'         => $data['tasks'],
            'budgets'       => $data['budgets'],
            'notes'         => $data['notes'],
            'messages'      => $data['messages'],
            'totalSpent'    => $progress['totalSpent'],
            'taskProgress'  => $progress['taskProgress'],
            'budgetPercent' => $progress['budgetPercent'],
        ]);
    }

    // =======================================================================
    // Manage user (CRUD inline via modal)
    // =======================================================================
    public function manage(User $user): InertiaResponse
    {
        $data     = $this->getUserData($user);
        $progress = $this->calcProgress($user, $data['tasks'], $data['totalSpent']);

        return Inertia::render('Admin/Manage', [
            'targetUser'    => $user,
            'tasks'         => $data['tasks'],
            'budgets'       => $data['budgets'],
            'notes'         => $data['notes'],
            'messages'      => $data['messages'],
            'totalSpent'    => $progress['totalSpent'],
            'taskProgress'  => $progress['taskProgress'],
            'budgetPercent' => $progress['budgetPercent'],
        ]);
    }

    // =======================================================================
    // Edit user profile
    // =======================================================================
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

    // =======================================================================
    // CRUD inline untuk data user (via modal di Manage page)
    // =======================================================================
    public function storeTask(Request $request, User $user): RedirectResponse
    {
        $validated = $request->validate([
            'title'    => 'required|string|max:200',
            'category' => 'required|in:H-365,H-180,H-90,H-30,H-7',
            'priority' => 'required|in:low,medium,high',
            'deadline' => 'nullable|date',
            'status'   => 'required|in:pending,progress,completed',
        ]);

        Task::create([
            'user_id'     => $user->id,
            ...$validated,
            'description' => '',
        ]);

        return back()->with('success', 'Task ditambahkan.');
    }

    public function storeBudget(Request $request, User $user): RedirectResponse
    {
        $validated = $request->validate([
            'description' => 'required|string|max:255',
            'category'    => 'required|in:venue,catering,decoration,photo_video,dress,ring,others',
            'amount'      => 'required|numeric|min:1',
            'date'        => 'required|date',
            'status'      => 'required|in:planned,spent',
        ]);

        Budget::create([
            'user_id' => $user->id,
            ...$validated,
        ]);

        return back()->with('success', 'Budget ditambahkan.');
    }

    public function storeNote(Request $request, User $user): RedirectResponse
    {
        $validated = $request->validate([
            'title'   => 'required|string|max:200',
            'content' => 'required|string',
        ]);

        Note::create([
            'user_id' => $user->id,
            ...$validated,
        ]);

        return back()->with('success', 'Catatan ditambahkan.');
    }

    // =======================================================================
    // Chat admin
    // =======================================================================
    public function chats(): InertiaResponse
    {
        // Ambil user yang punya chat + last message via subquery (hindari N+1)
        $userIds = Message::select('user_id')->distinct()->pluck('user_id');

        $lastMsgSub = Message::select('message')
            ->whereColumn('user_id', 'users.id')
            ->latest()
            ->limit(1);

        $usersWithChats = User::whereIn('id', $userIds)
            ->select('*')
            ->selectSub($lastMsgSub, 'last_message_text')
            ->get()
            ->load(['messages' => fn ($q) => $q->latest()->limit(1)])
            ->map(function ($user) {
                $user->last_message = $user->messages->first();
                unset($user->messages);
                return $user;
            });

        return Inertia::render('Admin/Chats', [
            'usersWithChats' => $usersWithChats,
        ]);
    }

    public function chatMessages(User $user): JsonResponse
    {
        return response()->json([
            'messages' => Message::where('user_id', $user->id)->oldest()->get(),
            'user'     => $user,
        ]);
    }

    public function sendMessage(Request $request, User $user): RedirectResponse
    {
        $request->validate(['message' => 'required|string|max:1000']);

        Message::create([
            'user_id'       => $user->id,
            'message'       => $request->message,
            'is_from_admin' => true,
        ]);

        return back()->with('success', 'Pesan terkirim.');
    }

    // =======================================================================
    // Hapus user (admin tidak bisa dihapus)
    // =======================================================================
    public function destroy(User $user): RedirectResponse
    {
        abort_if($user->role === 'admin', 403, 'Admin tidak bisa dihapus.');

        $user->delete();

        return redirect()->route('admin.index')
            ->with('success', 'User beserta semua datanya berhasil dihapus.');
    }

    // =======================================================================
    // Export
    // =======================================================================
    public function exportCsv(): Response
    {
        $users = $this->prepareExportUsers();

        $output = fopen('php://temp', 'r+');
        fputcsv($output, [
            'Nama', 'Email', 'Pasangan', 'Pernikahan', 'H-Hari',
            'Budget', 'Spent', 'Tasks', 'Budgets', 'Notes',
        ]);

        foreach ($users as $u) {
            fputcsv($output, [
                $u->name,
                $u->email,
                $u->partner_name,
                $u->wedding_date,
                $u->days_left,
                $u->total_budget,
                $u->total_spent,
                $u->tasks_count,
                $u->budgets_count,
                $u->notes_count,
            ]);
        }

        rewind($output);
        $csv = stream_get_contents($output);
        fclose($output);

        return response($csv, 200, [
            'Content-Type'        => 'text/csv; charset=UTF-8',
            'Content-Disposition' => 'attachment; filename="users-' . now()->format('Y-m-d') . '.csv"',
        ]);
    }

    public function exportPdf(): Response
    {
        $users = $this->prepareExportUsers();

        $pdf = Pdf::loadView('reports.pdf-users', ['users' => $users]);

        return $pdf->download('users-' . now()->format('Y-m-d') . '.pdf');
    }

    /**
     * Data user untuk export (CSV & PDF).
     */
    private function prepareExportUsers()
    {
        $users = User::where('role', '!=', 'admin')
            ->withCount(['tasks', 'budgets', 'notes'])
            ->get();

        $userIds = $users->pluck('id')->toArray();

        $spentMap = Budget::whereIn('user_id', $userIds)
            ->where('status', 'spent')
            ->selectRaw('user_id, SUM(amount) as total')
            ->groupBy('user_id')
            ->pluck('total', 'user_id');

        return $users->map(function ($u) use ($spentMap) {
            $u->total_spent = (int) ($spentMap[$u->id] ?? 0);
            $u->days_left = $u->wedding_date
                ? (int) now()->startOfDay()->diffInDays($u->wedding_date, false)
                : null;
            return $u;
        });
    }
}
