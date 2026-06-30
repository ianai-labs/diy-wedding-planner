<?php

namespace App\Http\Controllers;

use App\Models\Budget;
use App\Models\Task;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $userId = auth()->id();
        $user = auth()->user();

        // Budget
        $totalBudget = $user->total_budget;
        $totalSpent = Budget::where('user_id', $userId)
            ->where('status', 'spent')
            ->sum('amount');
        $totalPlanned = Budget::where('user_id', $userId)
            ->where('status', 'planned')
            ->sum('amount');
        $remaining = $totalBudget - $totalSpent - $totalPlanned;
        $budgetPercent = $totalBudget > 0
            ? round(($totalSpent / $totalBudget) * 100, 1)
            : 0;
        $budgetUsedPercent = $totalBudget > 0
            ? round((($totalSpent + $totalPlanned) / $totalBudget) * 100, 1)
            : 0;

        // Checklist progress
        $totalTasks = Task::where('user_id', $userId)->count();
        $completedTasks = Task::where('user_id', $userId)
            ->where('status', 'completed')
            ->count();
        $pendingTasks = Task::where('user_id', $userId)
            ->where('status', 'pending')
            ->count();
        $progressTasks = Task::where('user_id', $userId)
            ->where('status', 'progress')
            ->count();
        $taskProgress = $totalTasks > 0
            ? round(($completedTasks / $totalTasks) * 100)
            : 0;

        // Countdown
        $daysLeft = $user->wedding_date
            ? (int) now()->startOfDay()->diffInDays($user->wedding_date, false)
            : null;

        // Upcoming tasks (5 closest deadlines)
        $upcomingTasks = Task::where('user_id', $userId)
            ->whereNotNull('deadline')
            ->where('status', '!=', 'completed')
            ->orderBy('deadline')
            ->take(5)
            ->get()
            ->map(function ($task) {
                $task->daysLeft = (int) now()->startOfDay()->diffInDays($task->deadline, false);
                return $task;
            });

        // Chart: budget per category
        $budgetByCategory = Budget::where('user_id', $userId)
            ->where('status', 'spent')
            ->selectRaw('category, SUM(amount) as total')
            ->groupBy('category')
            ->pluck('total', 'category');

        // Chart: task by status
        $taskByStatus = [
            'completed' => $completedTasks,
            'progress' => $progressTasks,
            'pending' => $pendingTasks,
        ];

        return Inertia::render('Dashboard', [
            'totalBudget' => $totalBudget,
            'totalSpent' => $totalSpent,
            'totalPlanned' => $totalPlanned,
            'remaining' => $remaining,
            'budgetPercent' => $budgetPercent,
            'budgetUsedPercent' => $budgetUsedPercent,
            'totalTasks' => $totalTasks,
            'completedTasks' => $completedTasks,
            'pendingTasks' => $pendingTasks,
            'progressTasks' => $progressTasks,
            'taskProgress' => $taskProgress,
            'daysLeft' => $daysLeft,
            'upcomingTasks' => $upcomingTasks,
            'budgetByCategory' => $budgetByCategory,
            'taskByStatus' => $taskByStatus,
        ]);
    }
}
