<?php

namespace App\Http\Controllers;

use App\Models\Budget;
use App\Models\Vendor;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class VendorController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Vendor::query();

        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }
        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }

        $sort = $request->get('sort', 'price_asc');
        $direction = $sort === 'price_desc' ? 'desc' : 'asc';
        $vendors = $query->orderBy('price', $direction)->paginate(12)->withQueryString();

        return Inertia::render('Vendors/Index', [
            'vendors' => $vendors,
            'filters' => (object) $request->only(['search', 'category', 'sort']),
        ]);
    }

    public function show(Vendor $vendor): Response
    {
        return Inertia::render('Vendors/Show', ['vendor' => $vendor]);
    }

    public function addToBudget(Request $request, Vendor $vendor): RedirectResponse
    {
        $validated = $request->validate([
            'date'        => 'required|date',
            'description' => 'nullable|string|max:255',
        ]);

        Budget::create([
            'user_id'     => auth()->id(),
            'category'    => $vendor->category,
            'description' => $validated['description'] ?: $vendor->name,
            'amount'      => $vendor->price,
            'date'        => $validated['date'],
            'status'      => 'planned',
        ]);

        return redirect()->route('budgets.index')
            ->with('success', "Vendor {$vendor->name} berhasil ditambahkan ke budget.");
    }
}
