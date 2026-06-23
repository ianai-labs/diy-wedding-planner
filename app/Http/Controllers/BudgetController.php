<?php

namespace App\Http\Controllers;

use App\Http\Requests\BudgetRequest;
use App\Models\Budget;
use App\Models\Task;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request as HttpRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class BudgetController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Budget::where('user_id', auth()->id());

        if ($request->filled('search')) {
            $query->where('description', 'like', '%' . $request->search . '%');
        }
        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }
        if ($request->filled('month')) {
            $query->whereYear('date', substr($request->month, 0, 4))
                  ->whereMonth('date', substr($request->month, 5, 2));
        }

        $budgets = $query->latest()->paginate(10)->withQueryString();

        $totalSpent = Budget::where('user_id', auth()->id())->where('status', 'spent')->sum('amount');
        $totalPlanned = Budget::where('user_id', auth()->id())->where('status', 'planned')->sum('amount');
        $totalBudget = auth()->user()->total_budget;
        $remaining = $totalBudget - $totalSpent - $totalPlanned;

        return Inertia::render('Budgets/Index', [
            'budgets' => $budgets,
            'totalBudget' => $totalBudget,
            'totalSpent' => $totalSpent,
            'totalPlanned' => $totalPlanned,
            'remaining' => $remaining,
            'filters' => (object) $request->only(['search', 'category', 'month']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Budgets/Create');
    }

    public function store(BudgetRequest $request): RedirectResponse
    {
        $data = $request->validated();
        if ($request->hasFile('receipt')) {
            $data['receipt_path'] = $request->file('receipt')->store('receipts', 'public');
        }
        $data['user_id'] = auth()->id();

        Budget::create($data);

        return redirect()->route('budgets.index')->with('success', 'Budget berhasil ditambahkan.');
    }

    public function show(Budget $budget): Response
    {
        abort_if($budget->user_id !== auth()->id(), 403);
        return Inertia::render('Budgets/Show', ['budget' => $budget]);
    }

    public function edit(Budget $budget): Response
    {
        abort_if($budget->user_id !== auth()->id(), 403);
        return Inertia::render('Budgets/Edit', ['budget' => $budget]);
    }

    public function update(Request $request, Budget $budget): RedirectResponse
    {
        abort_if($budget->user_id !== auth()->id(), 403);

        $validated = $request->validate([
            'description' => 'required|string|max:255',
            'amount'      => 'required|numeric|min:1',
            'date'        => 'required|date',
            'status'      => 'required|in:planned,spent',
        ]);

        $budget->update($validated);

        return redirect()->route('budgets.index')->with('success', 'Budget berhasil diperbarui.');
    }

    public function destroy(Budget $budget): RedirectResponse
    {
        abort_if($budget->user_id !== auth()->id(), 403);
        if ($budget->receipt_path) Storage::disk('public')->delete($budget->receipt_path);
        $budget->delete();

        return redirect()->route('budgets.index')->with('success', 'Budget berhasil dihapus.');
    }

    private function subTaskTemplates(string $category): array
    {
        return match ($category) {
            'venue' => [
                'Kontak sales & janji temu',
                'Survey lokasi & cek fasilitas',
                'Negosiasi harga & paket',
                'Tanda tangan kontrak',
                'Bayar DP / booking fee',
            ],
            'catering' => [
                'Kontak vendor catering',
                'Tasting menu & pilih paket',
                'Tentukan menu final & jumlah porsi',
                'Bayar DP',
                'Konfirmasi jumlah tamu (H-7)',
            ],
            'decoration' => [
                'Kontak dekorator',
                'Meeting konsep & tema',
                'Review mockup / proposal',
                'Tanda tangan kontrak',
                'Bayar DP',
            ],
            'photo_video' => [
                'Kontak fotografer/videografer',
                'Meeting konsep & shot list',
                'Tentukan paket & durasi',
                'Bayar DP',
                'Konfirmasi jadwal & lokasi',
            ],
            'dress' => [
                'Kontak butik / desainer',
                'Fitting pertama & pilih model',
                'Fitting kedua & revisi',
                'Final fitting',
                'Bayar lunas & ambil',
            ],
            'ring' => [
                'Kontak toko / jeweler',
                'Survey model & bahan',
                'Tentukan ukuran & custom',
                'Pesan & bayar DP',
                'Ambil cincin & cek kualitas',
            ],
            default => [
                'Kontak vendor',
                'Dealing & negosiasi',
                'Tanda tangan kontrak',
            ],
        };
    }

    public function addToTask(HttpRequest $request, Budget $budget): RedirectResponse
    {
        abort_if($budget->user_id !== auth()->id(), 403);

        $defaultCategory = match ($budget->category) {
            'venue' => 'H-365', 'decoration' => 'H-90', 'catering' => 'H-90',
            'dress' => 'H-180', 'ring' => 'H-90', 'photo_video' => 'H-180',
            default => 'H-365',
        };

        $validated = $request->validate([
            'title'       => 'required|string|max:200',
            'category'    => 'required|in:H-365,H-180,H-90,H-30,H-7',
            'priority'    => 'required|in:low,medium,high',
            'deadline'    => 'nullable|date',
        ]);

        $task = Task::create([
            'user_id'     => auth()->id(),
            'title'       => $validated['title'],
            'category'    => $validated['category'],
            'priority'    => $validated['priority'],
            'deadline'    => $validated['deadline'] ?? null,
            'status'      => 'pending',
            'description' => 'Dari budget: ' . $budget->description . ' (Rp ' . number_format($budget->amount, 0, ',', '.') . ')',
        ]);

        // Auto-create sub-task templates
        $templates = $this->subTaskTemplates($budget->category);
        foreach ($templates as $tpl) {
            $task->children()->create([
                'user_id'  => auth()->id(),
                'title'    => $tpl,
                'category' => $validated['category'],
                'status'   => 'pending',
                'priority' => 'low',
            ]);
        }

        return redirect()->route('tasks.index')
            ->with('success', "Budget '{$budget->description}' ditambahkan ke checklist + {$task->children()->count()} sub-task.");
    }
}
