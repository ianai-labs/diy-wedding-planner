<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Checklist - {{ $user->name }}</title>
    <style>
        body { font-family: sans-serif; font-size: 12px; }
        h1 { text-align: center; margin-bottom: 5px; }
        .sub { text-align: center; color: #666; margin-bottom: 20px; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f3f4f6; }
        .pending { color: #d97706; }
        .progress { color: #2563eb; }
        .completed { color: #059669; }
    </style>
</head>
<body>
    <h1>Checklist Pernikahan</h1>
    <div class="sub">{{ $user->name }}@if($user->partner_name) &amp; {{ $user->partner_name }}@endif | Tanggal: {{ $user->wedding_date?->format('d M Y') }} | Budget: Rp {{ number_format($user->total_budget, 0, ',', '.') }}</div>
    <table>
        <thead><tr><th>#</th><th>Task</th><th>Kategori</th><th>Deadline</th><th>Prioritas</th><th>Status</th></tr></thead>
        <tbody>
            @forelse ($tasks as $i => $task)
                <tr>
                    <td>{{ $i + 1 }}</td>
                    <td>{{ $task->title }}</td>
                    <td>{{ $task->category }}</td>
                    <td>{{ $task->deadline?->format('d M Y') }}</td>
                    <td>{{ $task->priority }}</td>
                    <td class="{{ $task->status }}">{{ $task->status }}</td>
                </tr>
            @empty
                <tr><td colspan="6" style="text-align:center;color:#999;">Belum ada task.</td></tr>
            @endforelse
        </tbody>
    </table>
</body>
</html>
