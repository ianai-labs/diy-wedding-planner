<?php

namespace App\Http\Controllers;

use App\Http\Requests\NoteRequest;
use App\Models\Note;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class NoteController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Note::where('user_id', auth()->id());

        if ($request->filled('search')) {
            $query->where('title', 'like', '%' . $request->search . '%');
        }

        $notes = $query->latest()->paginate(12)->withQueryString();

        return Inertia::render('Notes/Index', [
            'notes' => $notes,
            'filters' => (object) $request->only(['search']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Notes/Create');
    }

    public function store(NoteRequest $request): RedirectResponse
    {
        $data = $request->validated();
        if ($request->hasFile('image')) {
            $data['image_path'] = $request->file('image')->store('notes', 'public');
        }
        $data['user_id'] = auth()->id();

        Note::create($data);

        return redirect()->route('notes.index')->with('success', 'Catatan berhasil ditambahkan.');
    }

    public function show(Note $note): Response
    {
        abort_if($note->user_id !== auth()->id(), 403);
        return Inertia::render('Notes/Show', ['note' => $note]);
    }

    public function edit(Note $note): Response
    {
        abort_if($note->user_id !== auth()->id(), 403);
        return Inertia::render('Notes/Edit', ['note' => $note]);
    }

    public function update(NoteRequest $request, Note $note): RedirectResponse
    {
        abort_if($note->user_id !== auth()->id(), 403);

        $data = $request->validated();
        if ($request->hasFile('image')) {
            if ($note->image_path) Storage::disk('public')->delete($note->image_path);
            $data['image_path'] = $request->file('image')->store('notes', 'public');
        }

        $note->update($data);

        return redirect()->route('notes.index')->with('success', 'Catatan berhasil diperbarui.');
    }

    public function destroy(Note $note): RedirectResponse
    {
        abort_if($note->user_id !== auth()->id(), 403);
        if ($note->image_path) Storage::disk('public')->delete($note->image_path);
        $note->delete();

        return redirect()->route('notes.index')->with('success', 'Catatan berhasil dihapus.');
    }
}
