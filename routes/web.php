<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\BudgetController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\NoteController;
use App\Http\Controllers\Admin\VendorController as AdminVendorController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\VendorController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
    ]);
});

Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::patch('/profile/budget', [ProfileController::class, 'updateBudget'])->name('profile.budget');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::resource('tasks', TaskController::class);
    Route::patch('/tasks/{task}/status', [TaskController::class, 'updateStatus'])->name('tasks.status');

    Route::post('/tasks/{task}/subtasks', [TaskController::class, 'storeSubTask'])->name('tasks.subtasks.store');
    Route::patch('/tasks/{task}/subtasks/{subtask}/toggle', [TaskController::class, 'toggleSubTask'])->name('tasks.subtasks.toggle');
    Route::delete('/tasks/{task}/subtasks/{subtask}', [TaskController::class, 'destroySubTask'])->name('tasks.subtasks.destroy');

    Route::resource('budgets', BudgetController::class);
    Route::post('/budgets/{budget}/add-to-task', [BudgetController::class, 'addToTask'])
        ->name('budgets.add-to-task');
    Route::resource('vendors', VendorController::class)->only(['index', 'show']);
    Route::post('/vendors/{vendor}/add-to-budget', [VendorController::class, 'addToBudget'])
        ->name('vendors.add-to-budget');
    Route::resource('notes', NoteController::class);

    Route::get('/messages', [ChatController::class, 'index'])->name('messages.index');
    Route::post('/messages', [ChatController::class, 'store'])->name('messages.store');

    Route::get('/reports', [ReportController::class, 'index'])->name('reports.index');
    Route::get('/reports/export-pdf', [ReportController::class, 'exportPdf'])->name('reports.export-pdf');
    Route::get('/reports/export-csv', [ReportController::class, 'exportExcel'])->name('reports.export-csv');

    // Admin routes
    Route::middleware('admin')->prefix('admin')->name('admin.')->group(function () {
        Route::get('/', [AdminController::class, 'index'])->name('index');
        Route::get('/users/{user}', [AdminController::class, 'show'])->name('users.show');
        Route::get('/users/{user}/plan', [AdminController::class, 'plan'])->name('users.plan');
        Route::get('/users/{user}/manage', [AdminController::class, 'manage'])->name('users.manage');
        Route::post('/users/{user}/messages', [AdminController::class, 'sendMessage'])->name('users.messages.store');
        Route::post('/users/{user}/tasks', [AdminController::class, 'storeTask'])->name('users.tasks.store');
        Route::post('/users/{user}/budgets', [AdminController::class, 'storeBudget'])->name('users.budgets.store');
        Route::post('/users/{user}/notes', [AdminController::class, 'storeNote'])->name('users.notes.store');
        Route::get('/users/{user}/edit', [AdminController::class, 'edit'])->name('users.edit');
        Route::put('/users/{user}', [AdminController::class, 'update'])->name('users.update');
        Route::delete('/users/{user}', [AdminController::class, 'destroy'])->name('users.destroy');
        Route::get('/chats', [AdminController::class, 'chats'])->name('chats');
        Route::get('/chats/{user}/messages', [AdminController::class, 'chatMessages'])->name('chats.messages');
        Route::get('/export-csv', [AdminController::class, 'exportCsv'])->name('export-csv');
        Route::get('/export-pdf', [AdminController::class, 'exportPdf'])->name('export-pdf');

        Route::resource('vendors', AdminVendorController::class)->names('vendors');
    });
});

require __DIR__.'/auth.php';
