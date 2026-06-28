<?php

namespace App\Http\Controllers;

use App\Models\Message;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ChatController extends Controller
{
    public function index(): Response
    {
        $messages = Message::where('user_id', auth()->id())
            ->oldest()
            ->get();

        return Inertia::render('Messages/Index', [
            'messages' => $messages,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate(['message' => 'required|string|max:1000']);

        Message::create([
            'user_id'       => auth()->id(),
            'message'       => $request->message,
            'is_from_admin' => false,
        ]);

        return back()->with('success', 'Pesan terkirim.');
    }
}
