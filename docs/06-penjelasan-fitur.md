# Bab 5 — Penjelasan Fitur

Bab ini menjelaskan setiap fitur aplikasi disertai cuplikan kode kunci dan logika bisnis yang mendasarinya.

---

## 5.1 Authentication (Laravel Breeze)

**File inti:** `routes/auth.php`, `app/Http/Controllers/Auth/*`

Aplikasi menggunakan Laravel Breeze *starter kit* dengan stack React + Inertia. Fitur autentikasi mencakup:

- **Register** — Form dengan field tambahan: Nama Lengkap, Email, Nama Pasangan (opsional), Tanggal Pernikahan, Total Budget, Password, Konfirmasi Password
- **Login** — Email + Password + "Remember me" checkbox
- **Forgot Password** — Kirim link reset via email
- **Email Verification** — Verifikasi alamat email sebelum akses dashboard
- **Logout** — Hapus session, redirect ke halaman welcome

Password di-hash menggunakan Bcrypt dengan 12 *rounds* (konfigurasi `config/auth.php`). Seluruh form CSRF ditangani otomatis oleh Inertia.js melalui XSRF token.

---

## 5.2 Dashboard

**Controller:** `DashboardController@index`
**Halaman:** `resources/js/Pages/Dashboard.jsx`

### Data yang Dikalkulasi

```php
$userId = auth()->id();
$user   = auth()->user();

// Budget
$totalBudget  = $user->total_budget;
$totalSpent   = Budget::where('user_id', $userId)->where('status', 'spent')->sum('amount');
$remaining    = $totalBudget - $totalSpent - $totalPlanned;
$budgetPercent = $totalBudget > 0 ? round(($totalSpent / $totalBudget) * 100, 1) : 0;

// Checklist
$totalTasks     = Task::where('user_id', $userId)->count();
$completedTasks = Task::where('user_id', $userId)->where('status', 'completed')->count();
$taskProgress   = $totalTasks > 0 ? round(($completedTasks / $totalTasks) * 100) : 0;

// Countdown
$daysLeft = $user->wedding_date
    ? (int) now()->startOfDay()->diffInDays($user->wedding_date, false)
    : null;

// Upcoming deadlines (5 terdekat)
$upcomingTasks = Task::where('user_id', $userId)
    ->whereNotNull('deadline')
    ->where('status', '!=', 'completed')
    ->orderBy('deadline')
    ->take(5)
    ->get();
```

### Tampilan Frontend

- **Countdown Banner** — Gradient pink-rose menampilkan "X hari lagi", "Hari ini!", atau "Sudah terlaksana" berdasarkan nilai `daysLeft`
- **Ringkasan Budget** — Tiga kartu: Total Budget, Terpakai (merah), Sisa (hijau/merah)
- **Progress Bar Budget** — Indigo, maksimum 100%
- **Pie Chart** — Distribusi budget per kategori menggunakan Chart.js
- **Doughnut Chart** — Status task: completed (hijau) / progress (biru) / pending (kuning)
- **Upcoming Deadlines** — Lima task dengan badge merah jika ≤ 7 hari, kuning jika ≤ 30 hari

---

## 5.3 Checklist / Tasks

**Controller:** `TaskController`
**Route:** `resource('tasks', TaskController::class)` + AJAX endpoint

### Operasi CRUD

| Method | Endpoint | Deskripsi |
|---|---|---|
| GET | `/tasks` | List task + search + filter + pagination |
| GET | `/tasks/create` | Form tambah task |
| POST | `/tasks` | Simpan task baru |
| GET | `/tasks/{id}` | Detail task |
| GET | `/tasks/{id}/edit` | Form edit task |
| PUT/PATCH | `/tasks/{id}` | Update task |
| DELETE | `/tasks/{id}` | Hapus task |

### Sub-tasks

| Method | Endpoint | Deskripsi |
|---|---|---|
| POST | `/tasks/{id}/subtasks` | Tambah sub-task |
| PATCH | `/tasks/{id}/subtasks/{sub}/toggle` | Toggle selesai/belum |
| DELETE | `/tasks/{id}/subtasks/{sub}` | Hapus sub-task |

### Update Status via AJAX

```php
// Backend — TaskController@updateStatus
public function updateStatus(Request $request, Task $task): JsonResponse
{
    abort_if($task->user_id !== auth()->id(), 403);
    $validated = $request->validate(['status' => 'required|in:pending,progress,completed']);
    $task->update(['status' => $validated['status']]);
    return response()->json(['success' => true, 'status' => $task->status]);
}
```

```jsx
// Frontend — Tasks/Index.jsx
const updateStatus = (taskId, newStatus) => {
    router.patch(route('tasks.status', taskId), { status: newStatus }, {
        preserveScroll: true, preserveState: true,
    });
};
```

---

## 5.4 Budget Tracker

**Controller:** `BudgetController`
**Route:** `resource('budgets', BudgetController::class)`

### Fitur Khusus: Konversi Budget → Task

Fitur "Add to Task" memungkinkan user mengkonversi item budget menjadi task checklist. Sistem secara otomatis menghasilkan 3-5 sub-task template yang relevan berdasarkan kategori budget:

| Kategori Budget | Sub-task Template |
|---|---|
| venue | Kontak sales & janji temu, Survey lokasi, Negosiasi harga, TTD kontrak, Bayar DP |
| catering | Kontak vendor, Tasting menu, Tentukan menu final, Bayar DP, Konfirmasi tamu (H-7) |
| decoration | Kontak dekorator, Meeting konsep, Review mockup, TTD kontrak, Bayar DP |
| photo_video | Kontak fotografer, Meeting shot list, Tentukan paket, Bayar DP, Konfirmasi jadwal |
| dress | Kontak butik, Fitting pertama, Fitting revisi, Final fitting, Bayar lunas |
| ring | Kontak jeweler, Survey model, Tentukan ukuran, Pesan & DP, Ambil & cek |
| others | Kontak vendor, Dealing & negosiasi, TTD kontrak |

### Upload Bukti Pembayaran

File receipt divalidasi: `image|mimes:jpg,jpeg,png|max:2048` (max 2MB). Disimpan di `storage/app/public/receipts/`. Saat record dihapus, file receipt otomatis dihapus dari storage.

---

## 5.5 Vendor Catalog

**User Controller:** `VendorController` (read-only: index, show)
**Admin Controller:** `Admin\VendorController` (full CRUD)

Vendor adalah **katalog global** — tidak terikat user tertentu. Admin mengelola katalog melalui panel admin. User dapat:
- Mencari vendor berdasarkan nama, kategori, dan harga
- Mengurutkan berdasarkan harga (ascending/descending)
- Melihat detail vendor (kontak, alamat, rating 1-5)
- Menambahkan vendor ke budget pribadi dengan satu klik

Seeder menyediakan 120 vendor (6 kategori × 20) dengan harga berkisar Rp 500.000 – Rp 55.000.000.

---

## 5.6 Notes

**Controller:** `NoteController`
**Route:** `resource('notes', NoteController::class)`

Catatan ditampilkan dalam *card view* responsif (1/2/3 kolom). Setiap kartu menampilkan gambar (jika ada), judul (link ke detail), konten (3 baris dengan *line-clamp*), dan aksi Edit/Hapus. Upload gambar menggunakan validasi yang sama dengan receipt budget.

---

## 5.7 Chat (User ↔ Admin)

**User Controller:** `ChatController`
**Admin Controller:** `AdminController@chats`, `@chatMessages`, `@sendMessage`

Pesan diurutkan dari terlama ke terbaru (`->oldest()`) sehingga pesan terbaru selalu muncul di bagian bawah. Auto-scroll ke pesan terbaru menggunakan `useRef` + `useEffect` + `scrollIntoView()`.

**Alignment chat:**
- **Sisi User:** Pesan user di kanan (indigo), pesan admin di kiri (abu-abu)
- **Sisi Admin:** Pesan admin di kanan (indigo), pesan user di kiri (abu-abu)

---

## 5.8 Reports

**Controller:** `ReportController`

Halaman reports menampilkan ringkasan dalam 4 kartu statistik (Total Task, Budget Terpakai, Total Vendor, Total Notes). Fitur ekspor menggunakan `barryvdh/laravel-dompdf` dengan Blade view `pdf-checklist.blade.php` — satu-satunya penggunaan Blade template di luar Inertia di proyek ini.

---

## 5.9 Admin Panel

**Controller:** `AdminController`
**Middleware:** `admin`

Panel admin menyediakan:
1. **Dashboard Admin** — Statistik global + tabel user dengan filter dan pagination
2. **Show User** — Detail user + progress bar task dan budget
3. **Plan User** — Monitoring *read-only* dalam 5 tab (Dashboard, Tasks, Budgets, Notes, Chat)
4. **Manage User** — CRUD inline via modal untuk task/budget/notes + chat
5. **Edit User** — Form edit profil user (nama, email, partner, wedding date, budget)
6. **Chats** — Panel chat dengan daftar user di kiri dan percakapan di kanan
7. **Vendor CRUD** — Manajemen katalog vendor global
8. **Export** — CSV dan PDF untuk data user

---

## 5.10 Profile Management

**Controller:** `ProfileController`
**Route:** `/profile`

Fitur standar Laravel Breeze: edit nama & email (dengan verifikasi ulang jika email berubah), ganti password (harus masukkan password saat ini), dan hapus akun (konfirmasi password).
