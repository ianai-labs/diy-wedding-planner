<?php

namespace App\Http\Controllers;

use App\Models\Budget;
use App\Models\Note;
use App\Models\Task;
use App\Models\Vendor;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Response;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class ReportController extends Controller
{
    public function index(): InertiaResponse
    {
        $userId = auth()->id();

        return Inertia::render('Reports/Index', [
            'totalTasks'     => Task::where('user_id', $userId)->count(),
            'completedTasks' => Task::where('user_id', $userId)->where('status', 'completed')->count(),
            'pendingTasks'   => Task::where('user_id', $userId)->where('status', 'pending')->count(),
            'totalBudgets'   => Budget::where('user_id', $userId)->count(),
            'totalSpent'     => (int) Budget::where('user_id', $userId)->where('status', 'spent')->sum('amount'),
            'totalVendors'   => Vendor::count(),
            'totalNotes'     => Note::where('user_id', $userId)->count(),
        ]);
    }

    public function exportPdf(): Response
    {
        $userId = auth()->id();
        $tasks = Task::where('user_id', $userId)->orderBy('deadline')->get();

        $pdf = Pdf::loadView('reports.pdf-checklist', [
            'tasks' => $tasks,
            'user'  => auth()->user(),
        ]);

        return $pdf->download('checklist-' . now()->format('Y-m-d') . '.pdf');
    }

    public function exportExcel(): Response
    {
        $userId = auth()->id();
        $budgets = Budget::where('user_id', $userId)->orderBy('date')->get();

        $headers = [
            'Content-Type'        => 'text/csv; charset=UTF-8',
            'Content-Disposition' => 'attachment; filename="budget-' . now()->format('Y-m-d') . '.csv"',
        ];

        $output = fopen('php://temp', 'r+');
        fputcsv($output, ['Deskripsi', 'Kategori', 'Jumlah', 'Tanggal', 'Status']);

        foreach ($budgets as $b) {
            fputcsv($output, [$b->description, $b->category, $b->amount, $b->date, $b->status]);
        }

        rewind($output);
        $csv = stream_get_contents($output);
        fclose($output);

        return response($csv, 200, $headers);
    }
}
