# CLAUDE.md — My Wedding Planner

Panduan ini digunakan Claude Code saat mengerjakan proyek ini.
Baca file ini sebelum menulis kode apapun.

---

## Proyek

Aplikasi web **My Wedding Planner** — platform terpusat untuk pasangan merencanakan pernikahan secara mandiri. Scope aktif adalah MVP (lihat `PRD.md`).

---

## Tech Stack

```
Environment : Docker / Laravel Sail (PHP 8.5, Node.js, MySQL dalam container)
Backend     : Laravel 13, PHP 8.3+
Database    : MySQL 8.4 (production) / SQLite (development)
Frontend    : Inertia 2 + React 19, TypeScript, Tailwind CSS v3, shadcn/ui
Auth        : Session (Laravel Breeze) + Token (Laravel Sanctum) — coexist
Export      : barryvdh/laravel-dompdf (PDF) + PHP fputcsv (CSV)
Charts      : Chart.js + react-chartjs-2 (via npm)
API         : REST endpoints (routes/api.php) dengan auth:sanctum
```

---

## Development Environment (Docker / Laravel Sail)

**Semua development berjalan di dalam Docker container.** Tidak perlu install PHP, Composer, Node.js, npm, atau MySQL di host. Hanya butuh **Docker Desktop** (dengan WSL2 integration aktif).

### Prasyarat

- Docker Desktop terinstall & WSL2 integration aktif
- Semua perintah development dijalankan **dari dalam WSL2**

### Perintah Dasar Sail

```bash
# Start containers (background)
./vendor/bin/sail up -d

# Stop containers
./vendor/bin/sail down

# Rebuild containers
./vendor/bin/sail build --no-cache
```

### Alias (opsional — rekomendasi)

Tambahkan di `~/.bashrc`:
```bash
alias sail='[ -f sail ] && bash sail || ./vendor/bin/sail'
```

Dengan alias, cukup `sail artisan migrate`, `sail npm run dev`, dll.

### Menjalankan Dua Service Utama

```bash
# Terminal 1: Docker containers (PHP + MySQL + Redis)
./vendor/bin/sail up -d

# Terminal 2: Vite dev server (Hot Module Replacement)
./vendor/bin/sail npm run dev
```

Aplikasi bisa diakses di **http://localhost**.

### Semua perintah Artisan, Composer, Node.js harus lewat Sail

| Langsung (JANGAN) | Via Sail (BENAR) |
|---|---|
| `php artisan migrate` | `./vendor/bin/sail artisan migrate` |
| `composer require foo` | `./vendor/bin/sail composer require foo` |
| `npm install` | `./vendor/bin/sail npm install` |
| `npm run dev` | `./vendor/bin/sail npm run dev` |
| `php artisan make:model Task -m` | `./vendor/bin/sail artisan make:model Task -m` |

### Startup Pertama Kali (Bootstrap Proyek)

```bash
# Di parent directory, buat project Laravel dengan Sail
curl -s "https://laravel.build/diy-wedding-planner?php=84&with=mysql" | bash

# Masuk direktori
cd diy-wedding-planner

# Jalankan Sail
./vendor/bin/sail up -d

# Install starter kit React
./vendor/bin/sail artisan starter-kit:install react

# Install npm dependencies
./vendor/bin/sail npm install

# Setup database
./vendor/bin/sail artisan migrate --seed
./vendor/bin/sail artisan storage:link

# Jalankan Vite dev server
./vendor/bin/sail npm run dev
```

### VS Code Setup

```bash
code /home/ianurfalah/project/tugas/pemrograman_web/diy-wedding-planner
```

Ekstensi rekomendasi:
- **Laravel** (official)
- **PHP Intelephense** atau **PHP IntelliSense**
- **ES7+ React/Redux/React-Native snippets**
- **Tailwind CSS IntelliSense**
- **TypeScript** (built-in)

### Xdebug (Debugging)

Aktifkan di `.env`:
```
SAIL_XDEBUG_MODE=develop,debug
```

Lalu rebuild: `./vendor/bin/sail build --no-cache && ./vendor/bin/sail up -d`

---

## Struktur Folder

```
app/
├── Http/
│   ├── Controllers/
│   │   ├── DashboardController.php
│   │   ├── TaskController.php
│   │   ├── BudgetController.php
│   │   ├── VendorController.php
│   │   ├── NoteController.php
│   │   └── ReportController.php
│   └── Requests/
│       ├── TaskRequest.php
│       ├── BudgetRequest.php
│       ├── VendorRequest.php
│       └── NoteRequest.php
├── Models/
│   ├── User.php
│   ├── Task.php
│   ├── Budget.php
│   ├── Vendor.php
│   └── Note.php
├── Exports/
│   └── BudgetExport.php
bootstrap/
├── app.php                    # Middleware & aplikasi dikonfigurasi di sini
database/
├── migrations/                # satu file per tabel
└── seeders/
    ├── UserSeeder.php         # seed user demo & admin
    └── DatabaseSeeder.php
resources/
├── js/
│   ├── Pages/                 # Halaman Inertia (satu file per halaman)
│   │   ├── Dashboard.tsx
│   │   ├── Tasks/
│   │   │   ├── Index.tsx
│   │   │   ├── Create.tsx
│   │   │   ├── Edit.tsx
│   │   │   └── Show.tsx
│   │   ├── Budgets/
│   │   ├── Vendors/
│   │   ├── Notes/
│   │   └── Reports/
│   ├── Components/            # React components reusable
│   │   ├── ui/                # shadcn/ui components
│   │   ├── AppSidebar.tsx
│   │   ├── AppHeader.tsx
│   │   └── ...
│   ├── Layouts/
│   │   ├── AuthenticatedLayout.tsx
│   │   └── GuestLayout.tsx
│   ├── types/                 # TypeScript type definitions
│   └── app.tsx                # Inertia app entry point
├── views/                     # HANYA untuk Blade PDF export
│   └── reports/
│       └── pdf-checklist.blade.php
routes/
├── web.php                    # Semua route web
├── auth.php                   # Auth routes (starter kit)
└── console.php                # Console routes
docker-compose.yml             # Konfigurasi Docker Sail
vendor/bin/sail                # Sail shell script
storage/app/public/
├── receipts/                  # bukti pembayaran budget
└── notes/                     # gambar inspirasi notes
```

> **Catatan**: Di Laravel 12, middleware tidak lagi disimpan di `app/Http/Middleware/`.
> Middleware kustom didaftarkan di `bootstrap/app.php`. Auth controllers ditangani
> otomatis oleh Laravel Starter Kit — tidak perlu dibuat manual.

---

## Database

### Enum Values (gunakan persis seperti ini)

```php
// Task
'category' => ['H-365', 'H-180', 'H-90', 'H-30', 'H-7']
'status'   => ['pending', 'progress', 'completed']
'priority' => ['low', 'medium', 'high']

// Budget
'category' => ['venue', 'catering', 'decoration', 'photo_video', 'dress', 'ring', 'others']
'status'   => ['planned', 'spent']

// Vendor
'category' => ['photography', 'decoration', 'catering', 'mua', 'mc', 'venue', 'others']

// User
'role'     => ['user', 'admin']
```

### Relasi

Semua tabel berelasi ke `users` melalui `user_id` (One to Many).
Tidak ada relasi antar tabel selain ke `users`.

---

## Konvensi Kode

### Controllers

- Gunakan **Resource Controller** (`php artisan make:controller --resource`)
- Setiap controller hanya melayani data milik user yang sedang login
- Selalu filter query dengan `->where('user_id', auth()->id())`
- Gunakan **Form Request** untuk validasi, bukan validasi inline di controller
- Return response pakai `Inertia::render()`, bukan `view()`
- Untuk JSON response (AJAX), gunakan `response()->json()`

```php
// BENAR — filter user + Inertia response
public function index()
{
    $tasks = Task::where('user_id', auth()->id())
                 ->latest()
                 ->paginate(10);
    return Inertia::render('Tasks/Index', [
        'tasks' => $tasks,
    ]);
}

// SALAH — jangan query tanpa filter user
public function index()
{
    $tasks = Task::paginate(10);
    return Inertia::render('Tasks/Index', ['tasks' => $tasks]);
}
```

### Models

- Definisikan `$fillable` secara eksplisit (jangan gunakan `$guarded = []`)
- Definisikan relasi `belongsTo` / `hasMany` di setiap model
- Gunakan method `casts()` (bukan property `$casts`) — Laravel 11+ convention
- Gunakan native PHP enum atau string cast untuk field enum

```php
// Contoh: Task.php
protected $fillable = [
    'user_id', 'title', 'category', 'description',
    'deadline', 'status', 'priority'
];

protected function casts(): array
{
    return [
        'deadline' => 'date',
    ];
}

public function user(): BelongsTo
{
    return $this->belongsTo(User::class);
}
```

### Migrations

- Satu file migration per tabel
- Gunakan `->nullable()` sesuai PRD, jangan tambah nullable sembarangan
- Gunakan `->default()` untuk field yang punya nilai default

### Frontend — React + Inertia + TypeScript

- Halaman: file `.tsx` di `resources/js/Pages/` — satu file per rute
- Layout: gunakan `AuthenticatedLayout` (sidebar kiri, header atas) atau `GuestLayout` (auth pages)
- Komponen reusable: simpan di `resources/js/Components/`
- shadcn/ui: komponen UI dasar (Button, Input, Card, Modal, Table, dll.) ada di `Components/ui/`
- Gunakan `useForm()` dari `@inertiajs/react` untuk form handling
- Konfirmasi hapus: gunakan Modal (shadcn/ui AlertDialog), bukan `confirm()` browser
- Tabel: gunakan komponen Table dari shadcn/ui, selalu responsif
- TypeScript: definisikan tipe data di `resources/js/types/`

```tsx
// Contoh halaman Tasks/Index.tsx
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/Components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import type { Task } from '@/types';

interface Props {
    tasks: { data: Task[]; links: any[]; /* pagination */ };
}

export default function TasksIndex({ tasks }: Props) {
    const { patch } = useForm();

    return (
        <AuthenticatedLayout>
            <Head title="Checklist" />
            {/* ... table dengan search, filter, pagination */}
        </AuthenticatedLayout>
    );
}
```

### Routing

```php
// web.php — gunakan Route::resource untuk semua CRUD
Route::middleware('auth')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::resource('tasks', TaskController::class);
    Route::resource('budgets', BudgetController::class);
    Route::resource('vendors', VendorController::class);
    Route::resource('notes', NoteController::class);
    Route::get('/reports', [ReportController::class, 'index'])->name('reports.index');
    Route::get('/reports/export-pdf', [ReportController::class, 'exportPdf'])->name('reports.export-pdf');
    Route::get('/reports/export-excel', [ReportController::class, 'exportExcel'])->name('reports.export-excel');

    // AJAX endpoint untuk update status task
    Route::patch('/tasks/{task}/status', [TaskController::class, 'updateStatus'])->name('tasks.status');
});

// Auth routes ditangani otomatis oleh Laravel Starter Kit
require __DIR__.'/auth.php';
```

---

## Fitur Khusus

### AJAX Update Status Task

- Endpoint: `PATCH /tasks/{task}/status`
- Request: `{ status: 'pending' | 'progress' | 'completed' }`
- Response: JSON `{ success: true, status: '...' }`
- Harus verifikasi `task->user_id === auth()->id()` sebelum update
- Di frontend, pakai `router.patch()` dari `@inertiajs/react` atau fetch API

```php
public function updateStatus(Request $request, Task $task): JsonResponse
{
    abort_if($task->user_id !== auth()->id(), 403);

    $validated = $request->validate([
        'status' => 'required|in:pending,progress,completed',
    ]);

    $task->update(['status' => $validated['status']]);

    return response()->json(['success' => true, 'status' => $task->status]);
}
```

### File Upload

- Simpan dengan `store('public/receipts')` atau `store('public/notes')`
- Hapus file lama saat edit jika file baru diupload: `Storage::delete($old_path)`
- Hapus file saat record dihapus di method `destroy()`
- Validasi: `image|mimes:jpg,jpeg,png|max:2048`
- Akses via: `Storage::url($path)` atau `asset('storage/' . $path)`
- Di frontend React, gunakan `<input type="file">` + `useForm()` Inertia

### Export PDF (Checklist)

- Gunakan `barryvdh/laravel-dompdf`
- View PDF: `resources/views/reports/pdf-checklist.blade.php`
- View PDF tetap pakai Blade — satu-satunya Blade view di proyek ini
- Tidak perlu styling kompleks — tabel bersih cukup

### Export Excel (Budget)

- Gunakan `maatwebsite/excel` dengan class Export
- Buat file di: `app/Exports/BudgetExport.php`

---

## Validasi (Form Requests)

```php
// TaskRequest.php
public function rules(): array
{
    return [
        'title'       => 'required|string|max:200',
        'category'    => 'required|in:H-365,H-180,H-90,H-30,H-7',
        'description' => 'nullable|string',
        'deadline'    => 'nullable|date',
        'status'      => 'required|in:pending,progress,completed',
        'priority'    => 'required|in:low,medium,high',
    ];
}

// BudgetRequest.php
public function rules(): array
{
    return [
        'category'    => 'required|in:venue,catering,decoration,photo_video,dress,ring,others',
        'description' => 'required|string|max:255',
        'amount'      => 'required|numeric|min:1',
        'date'        => 'required|date',
        'status'      => 'required|in:planned,spent',
        'receipt'     => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
    ];
}

// VendorRequest.php
public function rules(): array
{
    return [
        'name'     => 'required|string|max:200',
        'category' => 'required|in:photography,decoration,catering,mua,mc,others',
        'contact'  => 'required|string|max:50',
        'address'  => 'nullable|string',
        'notes'    => 'nullable|string',
        'rating'   => 'nullable|integer|min:1|max:5',
    ];
}

// NoteRequest.php
public function rules(): array
{
    return [
        'title'   => 'required|string|max:200',
        'content' => 'required|string',
        'image'   => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
    ];
}
```

---

## Dashboard — Logika Kalkulasi

```php
// DashboardController.php
$userId = auth()->id();
$user   = auth()->user();

// Budget
$totalBudget  = $user->total_budget;
$totalSpent   = Budget::where('user_id', $userId)->where('status', 'spent')->sum('amount');
$remaining    = $totalBudget - $totalSpent;

// Checklist
$totalTasks     = Task::where('user_id', $userId)->count();
$completedTasks = Task::where('user_id', $userId)->where('status', 'completed')->count();
$progress       = $totalTasks > 0 ? round(($completedTasks / $totalTasks) * 100) : 0;

// Countdown
$daysLeft = now()->diffInDays($user->wedding_date, false);

// Deadline mendekat (5 terdekat)
$upcomingTasks = Task::where('user_id', $userId)
                     ->whereNotNull('deadline')
                     ->where('status', '!=', 'completed')
                     ->orderBy('deadline')
                     ->take(5)
                     ->get();

// Chart data (budget per kategori)
$budgetByCategory = Budget::where('user_id', $userId)
                          ->where('status', 'spent')
                          ->selectRaw('category, SUM(amount) as total')
                          ->groupBy('category')
                          ->pluck('total', 'category');

// Kembalikan ke Inertia
return Inertia::render('Dashboard', [
    'totalBudget'      => $totalBudget,
    'totalSpent'       => $totalSpent,
    'remaining'        => $remaining,
    'totalTasks'       => $totalTasks,
    'completedTasks'   => $completedTasks,
    'progress'         => $progress,
    'daysLeft'         => $daysLeft,
    'upcomingTasks'    => $upcomingTasks,
    'budgetByCategory' => $budgetByCategory,
]);
```

---

## Keamanan — Checklist Wajib

- [ ] Setiap query difilter `where('user_id', auth()->id())`
- [ ] Semua route dilindungi middleware `auth`
- [ ] Semua form memiliki `@csrf` (Inertia handle otomatis via XSRF token)
- [ ] File upload divalidasi tipe dan ukuran
- [ ] AJAX endpoint verifikasi ownership sebelum update
- [ ] Tidak ada `dd()`, `var_dump()`, atau `Log::info()` di production code

---

## Seeder

```php
// UserSeeder.php — buat 2 akun demo
User::create([
    'name'         => 'Demo User',
    'email'        => 'user@demo.com',
    'password'     => bcrypt('password'),
    'wedding_date' => '2026-12-25',
    'total_budget' => 150000000,
    'role'         => 'user',
]);

User::create([
    'name'     => 'Admin',
    'email'    => 'admin@demo.com',
    'password' => bcrypt('password'),
    'role'     => 'admin',
]);
```

---

## Out of Scope — Jangan Dibuat

Fitur berikut **tidak** dikerjakan dalam MVP ini:

- API endpoints (`routes/api.php` dibiarkan kosong)
- JWT / Laravel Sanctum
- Admin UI / panel khusus admin
- Email notification
- Template checklist bawaan sistem
- Multi-tenant / shared account pasangan

Jika diminta membuat fitur di atas, tanyakan konfirmasi terlebih dahulu.

---

## Perintah Berguna

```bash
# === Docker / Sail ===

# Start & stop
./vendor/bin/sail up -d                       # Start containers (background)
./vendor/bin/sail down                        # Stop containers
./vendor/bin/sail build --no-cache            # Rebuild containers
./vendor/bin/sail restart                     # Restart containers

# === Setup ===

./vendor/bin/sail composer install            # Install PHP dependencies
cp .env.example .env                          # Copy environment file
./vendor/bin/sail artisan key:generate        # Generate APP_KEY
./vendor/bin/sail npm install                 # Install Node dependencies
./vendor/bin/sail artisan migrate --seed      # Run migration + seeder
./vendor/bin/sail artisan storage:link        # Symlink storage → public

# === Development ===

./vendor/bin/sail npm run dev                 # Vite HMR dev server (terminal terpisah)
./vendor/bin/sail artisan serve               # Alternatif (tidak perlu jika sail up)

# === Artisan commands (via Sail) ===

./vendor/bin/sail artisan make:controller TaskController --resource
./vendor/bin/sail artisan make:model Task -m  # model + migration
./vendor/bin/sail artisan make:request TaskRequest

# === Reset database ===

./vendor/bin/sail artisan migrate:fresh --seed

# === Build production ===

./vendor/bin/sail npm run build               # Build frontend assets
```

> **Catatan**: Jika sudah setup alias `sail`, ganti `./vendor/bin/sail` dengan `sail` saja.

---

## Urutan Pengerjaan yang Disarankan

1. **Project setup** — bootstrap via `curl -s "https://laravel.build/diy-wedding-planner?php=84&with=mysql" | bash`, lalu `sail up -d`, install starter kit React (`sail artisan starter-kit:install react`), `sail npm install`
2. **Migration & Model** (semua 5 tabel)
3. **Layout utama** (`AuthenticatedLayout.tsx` — sidebar kiri, header atas)
4. **Dashboard** (Controller + Page React)
5. **Tasks** (CRUD + update status via fetch/Inertia)
6. **Budget** (CRUD + upload bukti)
7. **Vendor** (CRUD)
8. **Notes** (CRUD + upload gambar)
9. **Reports** (Export PDF dengan Blade view, Export Excel)
10. **Seeder & testing akhir**
