# CLAUDE.md — My Wedding Planner

Panduan ini digunakan Claude Code saat mengerjakan proyek ini.
Baca file ini sebelum menulis kode apapun.

---

## Proyek

Aplikasi web **My Wedding Planner** — platform terpusat untuk pasangan merencanakan pernikahan secara mandiri. Aplikasi sudah fully functional dengan fitur: Checklist, Budget, Vendor (global catalog), Notes, Chat dengan Admin, Admin Panel, dan REST API.

---

## Tech Stack

```
Environment : Docker / Laravel Sail (PHP 8.5, Node.js, MySQL dalam container)
Backend     : Laravel 13, PHP 8.3+
Database    : MySQL 8.4 (production) / SQLite (development)
Frontend    : Inertia 2 + React 19, JavaScript (.jsx), Tailwind CSS v3, Headless UI
Auth        : Session (Laravel Breeze) + Token (Laravel Sanctum) — coexist
Export      : barryvdh/laravel-dompdf (PDF) + PHP fputcsv (CSV)
Charts      : Chart.js + react-chartjs-2 (via npm)
API         : REST endpoints (routes/api.php) dengan auth:sanctum
```

> **Catatan**: File frontend menggunakan `.jsx` (JavaScript + JSX), bukan TypeScript. `tsconfig.json` sudah dikonfigurasi untuk future migration.

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

---

## Struktur Folder

```
app/
├── Http/
│   ├── Controllers/
│   │   ├── DashboardController.php
│   │   ├── TaskController.php        # CRUD + sub-task + AJAX status
│   │   ├── BudgetController.php      # CRUD + receipt upload + addToTask
│   │   ├── VendorController.php      # Index & Show (global catalog)
│   │   ├── NoteController.php        # CRUD + image upload
│   │   ├── ReportController.php      # Stats & export (PDF + CSV)
│   │   ├── ChatController.php        # User chat messages
│   │   ├── ProfileController.php     # Profile + updateBudget
│   │   ├── AdminController.php       # Admin dashboard & user management
│   │   ├── Admin/VendorController.php # Admin vendor CRUD
│   │   └── Api/
│   │       ├── TaskController.php    # REST API tasks
│   │       └── BudgetController.php  # REST API budgets
│   ├── Requests/
│   │   ├── TaskRequest.php
│   │   ├── BudgetRequest.php
│   │   ├── VendorRequest.php
│   │   ├── NoteRequest.php
│   │   ├── ProfileUpdateRequest.php
│   │   └── LoginRequest.php
│   └── Middleware/
│       ├── AdminMiddleware.php
│       └── HandleInertiaRequests.php
├── Models/
│   ├── User.php
│   ├── Task.php          # + parent_id untuk sub-task (self-referencing)
│   ├── Budget.php
│   ├── Vendor.php        # Global model (tanpa user_id)
│   ├── Note.php
│   └── Message.php       # Chat messages (user_id, message, is_from_admin)
bootstrap/
├── app.php               # Middleware & aplikasi dikonfigurasi di sini
database/
├── migrations/           # 12 file — users, tasks, budgets, vendors, notes, messages, dll.
└── seeders/
    ├── UserSeeder.php    # 1 admin + 20 user demo
    ├── VendorSeeder.php  # 120 vendor (20 per kategori)
    └── DatabaseSeeder.php
resources/
├── js/
│   ├── Pages/            # Halaman Inertia — file .jsx
│   │   ├── Dashboard.jsx
│   │   ├── Tasks/        # Index, Create, Edit, Show
│   │   ├── Budgets/      # Index, Create, Edit, Show
│   │   ├── Vendors/      # Index, Show
│   │   ├── Notes/        # Index, Create, Edit, Show
│   │   ├── Reports/      # Index
│   │   ├── Messages/     # Index (chat user)
│   │   ├── Profile/      # Edit + Partials
│   │   ├── Admin/        # Index, Show, Edit, Manage, Plan, Chats, Vendors/
│   │   └── Auth/         # Login, Register, ForgotPassword, dll.
│   ├── Components/       # React components reusable
│   │   ├── Modal.jsx
│   │   ├── ConfirmDeleteModal.jsx
│   │   ├── Dropdown.jsx
│   │   ├── DangerButton.jsx, PrimaryButton.jsx, SecondaryButton.jsx
│   │   ├── TextInput.jsx, InputError.jsx, InputLabel.jsx, Checkbox.jsx
│   │   ├── NavLink.jsx, ResponsiveNavLink.jsx
│   │   └── ApplicationLogo.jsx
│   ├── Layouts/
│   │   ├── AuthenticatedLayout.tsx
│   │   └── GuestLayout.tsx
│   ├── utils/
│   │   └── format.js           # formatDate(), formatRp()
│   └── app.jsx                 # Inertia app entry point
├── views/                # HANYA untuk Blade PDF export
│   └── reports/
│       ├── pdf-checklist.blade.php
│       └── pdf-users.blade.php
routes/
├── web.php               # Semua route web + admin
├── api.php               # REST API (tasks, budgets) + login
└── auth.php              # Auth routes (Breeze starter kit)
compose.yaml              # Konfigurasi Docker Sail
storage/app/public/
├── receipts/             # bukti pembayaran budget
└── notes/                # gambar inspirasi notes
```

---

## Database

### Tabel (6 tabel utama + sessions, cache, jobs, personal_access_tokens)

| Tabel | Key Fields |
|---|---|
| **users** | name, email, password, partner_name, wedding_date, total_budget, role |
| **tasks** | user_id (FK), parent_id (FK→tasks, nullable), title, category, description, deadline, status, priority |
| **budgets** | user_id (FK), category, description, amount, date, status, receipt_path |
| **vendors** | name, category, price, contact, address, notes, rating — **global, tanpa user_id** |
| **notes** | user_id (FK), title, content, image_path |
| **messages** | user_id (FK), message, is_from_admin |

### Enum Values (gunakan persis seperti ini)

```php
// Task
'category' => ['H-365', 'H-180', 'H-90', 'H-30', 'H-7']
'status'   => ['pending', 'progress', 'completed']
'priority' => ['low', 'medium', 'high']

// Budget
'category' => ['venue', 'catering', 'decoration', 'photo_video', 'dress', 'ring', 'others']
'status'   => ['planned', 'spent']

// Vendor (global — tanpa user_id)
'category' => ['photography', 'decoration', 'catering', 'mua', 'mc', 'venue', 'others']

// User
'role'     => ['user', 'admin']
```

### Relasi

- Task, Budget, Note, Message → User (One to Many)
- Task → Task (self-referencing melalui parent_id, untuk sub-task)
- Vendor adalah model global, tidak terikat user

---

## Konvensi Kode

### Controllers

- Gunakan **Resource Controller** (`php artisan make:controller --resource`)
- Setiap controller hanya melayani data milik user yang sedang login
- Selalu filter query dengan `->where('user_id', auth()->id())` (kecuali Vendor yang global)
- Gunakan **Form Request** untuk validasi, bukan validasi inline di controller
- Return response pakai `Inertia::render()`, bukan `view()`
- Untuk JSON response (AJAX), gunakan `response()->json()`
- Ownership check: `abort_if($model->user_id !== auth()->id(), 403)` untuk show/edit/update/destroy

```php
// BENAR — filter user + Inertia response
public function index()
{
    $tasks = Task::where('user_id', auth()->id())
                 ->whereNull('parent_id')  // exclude sub-tasks
                 ->with('children')
                 ->latest()
                 ->paginate(10);
    return Inertia::render('Tasks/Index', [
        'tasks' => $tasks,
    ]);
}

// SALAH — jangan query tanpa filter user (untuk model dengan user_id)
public function index()
{
    $tasks = Task::paginate(10);
    return Inertia::render('Tasks/Index', ['tasks' => $tasks]);
}
```

### Models

- Gunakan `#[Fillable(...)]` attribute (Laravel 11+ convention), bukan `$fillable` property
- Definisikan relasi `belongsTo` / `hasMany` di setiap model
- Gunakan method `casts()` (bukan property `$casts`) — Laravel 11+ convention

```php
// Contoh: Task.php
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable([
    'user_id', 'parent_id', 'title', 'category', 'description',
    'deadline', 'status', 'priority',
])]
class Task extends Model
{
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

    public function parent(): BelongsTo
    {
        return $this->belongsTo(Task::class, 'parent_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(Task::class, 'parent_id');
    }
}
```

### Migrations

- Satu file migration per tabel
- Gunakan `->nullable()` sesuai PRD, jangan tambah nullable sembarangan
- Gunakan `->default()` untuk field yang punya nilai default
- Foreign keys: `->foreign()->constrained()->cascadeOnDelete()`

### Frontend — React + Inertia (.jsx)

- Halaman: file `.jsx` di `resources/js/Pages/` — satu file per rute
- Layout: gunakan `AuthenticatedLayout` (sidebar kiri, header atas) atau `GuestLayout` (auth pages)
- Komponen reusable: simpan di `resources/js/Components/`
- Gunakan `useForm()` dari `@inertiajs/react` untuk form handling
- **Konfirmasi hapus: gunakan `ConfirmDeleteModal` component, JANGAN pakai `confirm()` browser**
- Gunakan `Modal.jsx` (Headless UI) untuk dialog konfirmasi dan form modal
- Tabel: gunakan `min-w-full` + `divide-y`, wrap dengan `overflow-hidden` untuk responsif
- Fetch API: untuk AJAX endpoint yang return JSON (bukan Inertia), gunakan `fetch()` dengan CSRF token header

```jsx
// Contoh halaman Tasks/Index.jsx
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ConfirmDeleteModal from '@/Components/ConfirmDeleteModal';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function TasksIndex({ tasks }) {
    const [deleteId, setDeleteId] = useState(null);
    const { delete: destroy, processing } = useForm();

    const handleDelete = () => {
        destroy(route('tasks.destroy', deleteId), {
            onSuccess: () => setDeleteId(null),
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Checklist" />
            {/* ... table dengan search, filter, pagination */}

            <ConfirmDeleteModal
                show={deleteId !== null}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDelete}
                processing={processing}
                title="Hapus Task"
                message="Apakah Anda yakin ingin menghapus task ini?"
            />
        </AuthenticatedLayout>
    );
}
```

### Routing

```php
// web.php
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
    // Profile
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::patch('/profile/budget', [ProfileController::class, 'updateBudget'])->name('profile.budget');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Tasks + Sub-tasks + AJAX status
    Route::resource('tasks', TaskController::class);
    Route::patch('/tasks/{task}/status', [TaskController::class, 'updateStatus'])->name('tasks.status');
    Route::post('/tasks/{task}/subtasks', [TaskController::class, 'storeSubTask'])->name('tasks.subtasks.store');
    Route::patch('/tasks/{task}/subtasks/{subtask}/toggle', [TaskController::class, 'toggleSubTask'])->name('tasks.subtasks.toggle');
    Route::delete('/tasks/{task}/subtasks/{subtask}', [TaskController::class, 'destroySubTask'])->name('tasks.subtasks.destroy');

    // Budgets + Add-to-task
    Route::resource('budgets', BudgetController::class);
    Route::post('/budgets/{budget}/add-to-task', [BudgetController::class, 'addToTask'])
        ->name('budgets.add-to-task');

    // Vendors (global — hanya index & show untuk user)
    Route::resource('vendors', VendorController::class)->only(['index', 'show']);
    Route::post('/vendors/{vendor}/add-to-budget', [VendorController::class, 'addToBudget'])
        ->name('vendors.add-to-budget');

    // Notes
    Route::resource('notes', NoteController::class);

    // Chat (user-administrator)
    Route::get('/messages', [ChatController::class, 'index'])->name('messages.index');
    Route::post('/messages', [ChatController::class, 'store'])->name('messages.store');

    // Reports
    Route::get('/reports', [ReportController::class, 'index'])->name('reports.index');
    Route::get('/reports/export-pdf', [ReportController::class, 'exportPdf'])->name('reports.export-pdf');
    Route::get('/reports/export-csv', [ReportController::class, 'exportExcel'])->name('reports.export-csv');

    // Admin routes
    Route::middleware('admin')->prefix('admin')->name('admin.')->group(function () {
        Route::get('/', [AdminController::class, 'index'])->name('index');
        Route::get('/users/{user}', [AdminController::class, 'show'])->name('users.show');
        Route::get('/users/{user}/plan', [AdminController::class, 'plan'])->name('users.plan');
        Route::get('/users/{user}/manage', [AdminController::class, 'manage'])->name('users.manage');
        Route::get('/users/{user}/edit', [AdminController::class, 'edit'])->name('users.edit');
        Route::put('/users/{user}', [AdminController::class, 'update'])->name('users.update');
        Route::delete('/users/{user}', [AdminController::class, 'destroy'])->name('users.destroy');
        Route::post('/users/{user}/messages', [AdminController::class, 'sendMessage'])->name('users.messages.store');
        Route::post('/users/{user}/tasks', [AdminController::class, 'storeTask'])->name('users.tasks.store');
        Route::post('/users/{user}/budgets', [AdminController::class, 'storeBudget'])->name('users.budgets.store');
        Route::post('/users/{user}/notes', [AdminController::class, 'storeNote'])->name('users.notes.store');
        Route::get('/chats', [AdminController::class, 'chats'])->name('chats');
        Route::get('/chats/{user}/messages', [AdminController::class, 'chatMessages'])->name('chats.messages');
        Route::get('/export-csv', [AdminController::class, 'exportCsv'])->name('export-csv');
        Route::get('/export-pdf', [AdminController::class, 'exportPdf'])->name('export-pdf');
        Route::resource('vendors', AdminVendorController::class)->names('vendors');
    });
});

// API routes (api.php)
Route::post('/login', [Api\AuthController::class, 'login']);
Route::middleware('auth:sanctum')->prefix('api')->name('api.')->group(function () {
    Route::resource('tasks', Api\TaskController::class);
    Route::resource('budgets', Api\BudgetController::class);
});

require __DIR__.'/auth.php';
```

---

## Fitur Khusus

### AJAX Update Status Task + Sub-tasks

- Endpoint: `PATCH /tasks/{task}/status`
- Request: `{ status: 'pending' | 'progress' | 'completed' }`
- Response: JSON `{ success: true, status: '...' }`
- Sub-tasks CRUD: `POST /tasks/{task}/subtasks`, `PATCH /tasks/{task}/subtasks/{subtask}/toggle`, `DELETE /tasks/{task}/subtasks/{subtask}`
- Semua endpoint verifikasi ownership: `abort_if($task->user_id !== auth()->id(), 403)`
- Di frontend, pakai `fetch()` API dengan CSRF token header. Jangan pakai Inertia router untuk endpoint JSON — akan menyebabkan response mismatch.

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

### Sub-Task (parent_id)

- Tasks memiliki field `parent_id` yang mereferensi task induk
- Hanya satu level (tidak ada nested sub-sub-task)
- Saat query index, gunakan `whereNull('parent_id')` untuk hanya mengambil task induk
- Eager load `children` untuk menampilkan sub-task
- Contoh mapping di BudgetController::addToTask() — membuat task dengan sub-task template

### File Upload

- Simpan dengan `store('public/receipts')` atau `store('public/notes')`
- Hapus file lama saat edit jika file baru diupload: `Storage::delete($old_path)`
- Hapus file saat record dihapus di method `destroy()`
- Validasi: `image|mimes:jpg,jpeg,png|max:2048`
- Akses via: `Storage::url($path)` atau `asset('storage/' . $path)`
- Di frontend React, gunakan `<input type="file">` + `useForm()` Inertia

### Export PDF

- Gunakan `barryvdh/laravel-dompdf`
- View PDF: `resources/views/reports/pdf-checklist.blade.php` dan `pdf-users.blade.php`
- View PDF tetap pakai Blade — satu-satunya Blade views di proyek ini
- Tidak perlu styling kompleks — tabel bersih cukup

### Export CSV

- Gunakan PHP native `fputcsv()` — **bukan maatwebsite/excel**
- Budget export: `ReportController::exportExcel()` (nama method dipertahankan untuk backward compatibility)
- Admin export: `AdminController::exportCsv()` dan `AdminController::exportPdf()`

### Chat (User ↔ Admin)

- Tabel `messages`: `user_id`, `message`, `is_from_admin`
- User mengirim pesan via `ChatController::store()` (is_from_admin = false)
- Admin membalas via `AdminController::sendMessage()` (is_from_admin = true)
- Halaman user: `/messages` (Messages/Index.jsx)
- Halaman admin: `/admin/chats` (Admin/Chats.jsx) dan tab Chat di Manage/Plan

### Vendor Catalog (Global)

- Vendor adalah model global — tidak memiliki `user_id`
- User hanya bisa melihat (index + show) dan "Add to Budget"
- Admin mengelola vendor (CRUD penuh) via `/admin/vendors`
- "Add to Budget": `POST /vendors/{vendor}/add-to-budget` — membuat Budget record untuk user yang login

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

// BudgetRequest.php — gunakan 'sometimes' untuk update
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

// VendorRequest.php — includes 'venue' dan 'price'
public function rules(): array
{
    return [
        'name'     => 'required|string|max:200',
        'category' => 'required|in:photography,decoration,catering,mua,mc,venue,others',
        'price'    => 'required|numeric|min:0',
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

// Budget (konsisten dengan BudgetController)
$totalBudget   = $user->total_budget;
$totalSpent    = Budget::where('user_id', $userId)->where('status', 'spent')->sum('amount');
$totalPlanned  = Budget::where('user_id', $userId)->where('status', 'planned')->sum('amount');
$remaining     = $totalBudget - $totalSpent - $totalPlanned;
$budgetPercent = $totalBudget > 0 ? round(($totalSpent / $totalBudget) * 100, 1) : 0;
$budgetUsedPercent = $totalBudget > 0 ? round((($totalSpent + $totalPlanned) / $totalBudget) * 100, 1) : 0;

// Checklist
$totalTasks     = Task::where('user_id', $userId)->whereNull('parent_id')->count();
$completedTasks = Task::where('user_id', $userId)->whereNull('parent_id')->where('status', 'completed')->count();
$pendingTasks   = Task::where('user_id', $userId)->whereNull('parent_id')->where('status', 'pending')->count();
$progressTasks  = Task::where('user_id', $userId)->whereNull('parent_id')->where('status', 'progress')->count();
$taskProgress   = $totalTasks > 0 ? round(($completedTasks / $totalTasks) * 100) : 0;

// Countdown
$daysLeft = $user->wedding_date
    ? (int) now()->startOfDay()->diffInDays($user->wedding_date, false)
    : null;

// Deadline mendekat (5 terdekat)
$upcomingTasks = Task::where('user_id', $userId)
                     ->whereNotNull('deadline')
                     ->where('status', '!=', 'completed')
                     ->orderBy('deadline')
                     ->take(5)
                     ->get()
                     ->map(function ($task) {
                         $task->daysLeft = (int) now()->startOfDay()->diffInDays($task->deadline, false);
                         return $task;
                     });

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
    'totalPlanned'     => $totalPlanned,
    'remaining'        => $remaining,
    'budgetPercent'    => $budgetPercent,
    'budgetUsedPercent'=> $budgetUsedPercent,
    'totalTasks'       => $totalTasks,
    'completedTasks'   => $completedTasks,
    'pendingTasks'     => $pendingTasks,
    'progressTasks'    => $progressTasks,
    'taskProgress'     => $taskProgress,
    'daysLeft'         => $daysLeft,
    'upcomingTasks'    => $upcomingTasks,
    'budgetByCategory' => $budgetByCategory,
    'taskByStatus'     => ['completed' => $completedTasks, 'progress' => $progressTasks, 'pending' => $pendingTasks],
]);
```

---

## Keamanan — Checklist Wajib

- [ ] Setiap query difilter `where('user_id', auth()->id())` (kecuali Vendor yang global)
- [ ] Semua route dilindungi middleware `auth`
- [ ] Admin routes dilindungi middleware `admin`
- [ ] API routes dilindungi middleware `auth:sanctum`
- [ ] Semua form memiliki `@csrf` (Inertia handle otomatis via XSRF token)
- [ ] File upload divalidasi tipe dan ukuran
- [ ] AJAX endpoint verifikasi ownership sebelum update
- [ ] **JANGAN gunakan `confirm()` browser — gunakan `ConfirmDeleteModal` component**
- [ ] Tidak ada `dd()`, `var_dump()`, atau `Log::info()` di production code

---

## Seeder

```php
// UserSeeder.php — 1 admin + 20 user demo
User::create([
    'name'     => 'Admin',
    'email'    => 'admin@demo.com',
    'password' => Hash::make('password'),
    'role'     => 'admin',
]);

// 20 user: user1@demo.com ... user20@demo.com / password
User::create([
    'name'         => 'Demo User 1',
    'email'        => 'user1@demo.com',
    'password'     => Hash::make('password'),
    'partner_name' => 'Pasangan 1',
    'wedding_date' => '2026-12-25',
    'total_budget' => 150000000,
    'role'         => 'user',
]);

// VendorSeeder.php — 120 vendor (20 per kategori)
```

---

## Fitur Dalam Scope Saat Ini

| Fitur | Status |
|---|---|
| Authentication (Register, Login, Logout) | ✅ |
| Dashboard (Countdown, Budget, Charts) | ✅ |
| Checklist Tasks (CRUD + AJAX status + Sub-tasks) | ✅ |
| Budget Tracker (CRUD + Upload receipt + Export CSV) | ✅ |
| Vendor Catalog (Global, Admin-managed) | ✅ |
| Notes (CRUD + Upload gambar) | ✅ |
| Reports (Export PDF + CSV) | ✅ |
| Chat User ↔ Admin | ✅ |
| Admin Panel (Dashboard, User Management, Chat, Export) | ✅ |
| REST API (Tasks, Budgets — Sanctum auth) | ✅ |
| Sub-tasks (self-referencing parent_id) | ✅ |
| Inline Total Budget Editing (Dashboard) | ✅ |

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

1. **Project setup** — bootstrap via Sail, install starter kit React, setup database
2. **Migration & Model** (7 tabel: users, tasks, budgets, vendors, notes, messages, personal_access_tokens)
3. **Layout utama** (`AuthenticatedLayout.jsx` — sidebar kiri, header atas)
4. **Dashboard** (Controller + Page React)
5. **Tasks** (CRUD + sub-tasks + update status via fetch)
6. **Budget** (CRUD + upload bukti + add-to-task)
7. **Vendor** (Admin CRUD + User catalog view)
8. **Notes** (CRUD + upload gambar)
9. **Chat** (User messages + Admin chat panel)
10. **Admin Panel** (Dashboard, Manage/Plan user, Chat, Export)
11. **Reports** (Export PDF dengan Blade view, Export CSV)
12. **API** (REST endpoints dengan Sanctum)
13. **Seeder & testing akhir**
