# Bab 4 — Implementasi Laravel

## 4.1 Struktur Proyek

Proyek mengikuti konvensi Laravel 13 dengan frontend React + Inertia.js di direktori `resources/js/`. Berikut struktur direktori aplikasi (tidak termasuk `vendor/` dan `node_modules/`):

```
diy-wedding-planner/
├── app/
│   ├── Http/
│   │   ├── Controllers/        ← 20 file controller
│   │   │   ├── Auth/           ← 9 auth controllers (Laravel Breeze)
│   │   │   ├── Admin/          ← Admin\VendorController
│   │   │   └── *.php           ← Dashboard, Task, Budget, dll.
│   │   ├── Middleware/         ← AdminMiddleware, HandleInertiaRequests
│   │   └── Requests/           ← 6 Form Request classes
│   ├── Models/                 ← User, Task, Budget, Vendor, Note, Message
│   └── Providers/              ← AppServiceProvider
├── bootstrap/
│   └── app.php                 ← Konfigurasi middleware & routing
├── config/                     ← 10 file konfigurasi Laravel
├── database/
│   ├── migrations/             ← 11 file migration
│   └── seeders/                ← DatabaseSeeder, UserSeeder, VendorSeeder
├── resources/
│   ├── js/                     ← Frontend React + Inertia
│   │   ├── app.jsx             ← Entry point Inertia
│   │   ├── Pages/              ← 37 halaman (.jsx)
│   │   ├── Components/         ← 12 reusable components
│   │   ├── Layouts/            ← AuthenticatedLayout, GuestLayout
│   │   └── utils/format.js     ← formatRp(), formatDate()
│   └── views/                  ← Blade views (PDF export only)
├── routes/
│   ├── web.php                 ← Semua route aplikasi
│   └── auth.php                ← Route autentikasi (Breeze)
└── public/
    └── index.php               ← Front controller (entry point HTTP)
```

## 4.2 Routing

Aplikasi mendefinisikan **79 route** yang dikelompokkan sebagai berikut:

### Route Publik
```php
Route::get('/', fn() => Inertia::render('Welcome'));
```
Halaman landing dengan informasi fitur dan tombol Login/Register.

### Route Authenticated User
```php
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index']);
});

Route::middleware('auth')->group(function () {
    Route::resource('tasks', TaskController::class);
    Route::resource('budgets', BudgetController::class);
    Route::resource('vendors', VendorController::class)->only(['index', 'show']);
    Route::resource('notes', NoteController::class);
    Route::get('/messages', [ChatController::class, 'index']);
    Route::get('/reports', [ReportController::class, 'index']);
    // ... profile, AJAX endpoints, sub-tasks
});
```

### Route Admin
```php
Route::middleware('admin')->prefix('admin')->group(function () {
    Route::get('/', [AdminController::class, 'index']);
    Route::get('/users/{user}/plan', [AdminController::class, 'plan']);
    Route::get('/users/{user}/manage', [AdminController::class, 'manage']);
    Route::resource('vendors', Admin\VendorController::class);
    // ... export, chat support
});
```

Semua route di bawah middleware `auth` secara otomatis terlindungi. Route admin menggunakan middleware `admin` yang memverifikasi `auth()->user()->role === 'admin'`.

## 4.3 Controller & Pola yang Diterapkan

Setiap controller mengikuti pola resource controller Laravel. Berikut prinsip-prinsip yang diterapkan secara konsisten:

### a. Data Ownership (Keamanan)
Setiap query difilter berdasarkan user yang sedang login:
```php
$query = Task::where('user_id', auth()->id());
// ...
abort_if($task->user_id !== auth()->id(), 403);
```

### b. Form Request untuk Validasi
Validasi tidak dilakukan inline di controller, melainkan melalui dedicated Form Request classes:
```php
class TaskRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'title'    => 'required|string|max:200',
            'category' => 'required|in:H-365,H-180,H-90,H-30,H-7',
            'status'   => 'required|in:pending,progress,completed',
            'priority' => 'required|in:low,medium,high',
            // ...
        ];
    }
}
```

### c. Inertia Response
Semua halaman dikembalikan melalui `Inertia::render()`, bukan Blade `view()`:
```php
return Inertia::render('Tasks/Index', [
    'tasks'   => $tasks,
    'filters' => (object) $request->only(['search', 'category', 'status']),
]);
```

### d. AJAX Endpoint untuk Update Status
Khusus untuk update status task yang harus terjadi tanpa reload halaman:
```php
public function updateStatus(Request $request, Task $task): JsonResponse
{
    abort_if($task->user_id !== auth()->id(), 403);
    $validated = $request->validate(['status' => 'required|in:pending,progress,completed']);
    $task->update(['status' => $validated['status']]);
    return response()->json(['success' => true, 'status' => $task->status]);
}
```

## 4.4 Model & Eloquent ORM

Semua model menggunakan PHP 8 attribute `#[Fillable]` untuk mendeklarasikan kolom yang dapat diisi massal, dan method `casts()` untuk type casting:

```php
#[Fillable([
    'user_id', 'parent_id', 'title', 'category',
    'description', 'deadline', 'status', 'priority',
])]
class Task extends Model
{
    protected function casts(): array
    {
        return ['deadline' => 'date'];
    }

    public function user(): BelongsTo { return $this->belongsTo(User::class); }
    public function parent(): BelongsTo { return $this->belongsTo(Task::class, 'parent_id'); }
    public function children(): HasMany { return $this->hasMany(Task::class, 'parent_id'); }
}
```

Relasi self-referencing `parent()` / `children()` pada model Task memungkinkan hierarki task/sub-task dalam satu tabel yang sama — pola yang dikenal sebagai *adjacency list*.

## 4.5 Middleware

### AdminMiddleware
```php
class AdminMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        abort_if(auth()->user()?->role !== 'admin', 403, 'Akses hanya untuk admin.');
        return $next($request);
    }
}
```

Didaftarkan sebagai alias `'admin'` di `bootstrap/app.php`:
```php
$middleware->alias([
    'admin' => \App\Http\Middleware\AdminMiddleware::class,
]);
```

### HandleInertiaRequests
Menyediakan shared props ke seluruh halaman React:
```php
public function share(Request $request): array
{
    return [
        ...parent::share($request),
        'auth'  => ['user' => $request->user()],
        'flash' => [
            'success' => $request->session()->get('success'),
            'error'   => $request->session()->get('error'),
        ],
    ];
}
```

## 4.6 Frontend (React + Inertia.js)

Entry point aplikasi ada di `resources/js/app.jsx`:
```jsx
createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(
        `./Pages/${name}.jsx`,
        import.meta.glob('./Pages/**/*.jsx'),
    ),
    setup({ el, App, props }) {
        createRoot(el).render(<App {...props} />);
    },
});
```

Semua halaman menggunakan `useForm()` dari `@inertiajs/react` untuk form handling. Update status task menggunakan `router.patch()` dengan `preserveState: true` agar UI tidak reload seluruhnya. Grafik dashboard menggunakan Chart.js melalui wrapper `react-chartjs-2`.

## 4.7 Keamanan Aplikasi

| Aspek | Implementasi |
|---|---|
| Password storage | Bcrypt hash (12 rounds) |
| CSRF | Ditangani otomatis oleh Inertia.js via XSRF token |
| XSS | Auto-escape oleh React JSX |
| SQL Injection | Dicegah oleh Eloquent ORM (parameterized queries) |
| Authentication | Session-based via Laravel Breeze |
| Authorization | Middleware `auth` + `admin` + ownership check di setiap controller |
| File upload | Validasi tipe (jpg/jpeg/png) dan ukuran (max 2MB) |
| Data isolation | Setiap query di-scope `where('user_id', auth()->id())` |
