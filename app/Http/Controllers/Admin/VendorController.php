<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\VendorRequest;
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

        $vendors = $query->latest()->paginate(15)->withQueryString();

        return Inertia::render('Admin/Vendors/Index', [
            'vendors' => $vendors,
            'filters' => (object) $request->only(['search', 'category']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Vendors/Create');
    }

    public function store(VendorRequest $request): RedirectResponse
    {
        Vendor::create($request->validated());

        return redirect()->route('admin.vendors.index')
            ->with('success', 'Vendor berhasil ditambahkan.');
    }

    public function edit(Vendor $vendor): Response
    {
        return Inertia::render('Admin/Vendors/Edit', ['vendor' => $vendor]);
    }

    public function update(VendorRequest $request, Vendor $vendor): RedirectResponse
    {
        $vendor->update($request->validated());

        return redirect()->route('admin.vendors.index')
            ->with('success', 'Vendor berhasil diperbarui.');
    }

    public function destroy(Vendor $vendor): RedirectResponse
    {
        $vendor->delete();

        return redirect()->route('admin.vendors.index')
            ->with('success', 'Vendor berhasil dihapus.');
    }
}
