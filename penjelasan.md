# Penjelasan Proyek — My Wedding Planner

## Arsitektur: MVC (Model-View-Controller)

```
Browser → Router (routes/web.php) → Controller → Model (database) → Controller → View (React/Inertia) → Browser
```

| Layer | Fungsi | Lokasi |
|-------|--------|--------|
| **Model** | Mengambil & menyimpan data ke database | `app/Models/` |
| **View** | Tampilan antarmuka pengguna | `resources/js/Pages/` (React) |
| **Controller** | Logika bisnis, menghubungkan Model & View | `app/Http/Controllers/` |
| **Router** | Mengarahkan URL ke Controller yang tepat | `routes/web.php` |

---

## Struktur Folder

```
diy-wedding-planner/
│
├── app/                          # Kode backend (PHP)
│   ├── Http/
│   │   ├── Controllers/          # Controller — logika bisnis tiap halaman
│   │   │   ├── Admin/            # Controller khusus admin
│   │   │   │   └── VendorController.php  # Admin CRUD vendor
│   │   │   ├── Auth/             # Controller login/register (dari Breeze)
│   │   │   ├── AdminController.php      # Dashboard admin + kelola user
│   │   │   ├── BudgetController.php     # CRUD budget tracker
│   │   │   ├── ChatController.php       # Chat user dengan admin
│   │   │   ├── DashboardController.php  # Dashboard user (countdown, chart)
│   │   │   ├── NoteController.php       # CRUD catatan
│   │   │   ├── ReportController.php     # Laporan + export PDF
│   │   │   ├── TaskController.php       # CRUD checklist + sub-task
│   │   │   └── VendorController.php     # Katalog vendor (user view-only)
│   │   ├── Middleware/           # Filter request sebelum masuk controller
│   │   │   ├── AdminMiddleware.php      # Hanya role 'admin' yang bisa akses /admin/*
│   │   │   └── HandleInertiaRequests.php # Share data ke semua halaman React
│   │   └── Requests/            # Form Validation rules
│   │       ├── BudgetRequest.php
│   │       ├── NoteRequest.php
│   │       ├── TaskRequest.php
│   │       └── VendorRequest.php
│   ├── Models/                   # Model — representasi tabel database
│   │   ├── Budget.php           # Tabel budgets
│   │   ├── Message.php          # Tabel messages (chat)
│   │   ├── Note.php             # Tabel notes
│   │   ├── Task.php             # Tabel tasks (checklist + sub-task)
│   │   ├── User.php             # Tabel users
│   │   └── Vendor.php           # Tabel vendors (katalog global)
│   └── Exports/                  # Export Excel (tidak aktif — diganti CSV)
│
├── bootstrap/
│   └── app.php                   # Konfigurasi aplikasi & middleware
│
├── config/                       # Konfigurasi Laravel (database, app, dll)
│
├── database/
│   ├── migrations/               # Skema database — buat/ubah tabel
│   │   ├── 0001_01_01_000000_create_users_table.php
│   │   ├── 2026_06_23_110349_add_wedding_fields_to_users_table.php
│   │   ├── 2026_06_23_110351_create_tasks_table.php
│   │   ├── 2026_06_23_110353_create_budgets_table.php
│   │   ├── 2026_06_23_110355_create_vendors_table.php
│   │   ├── 2026_06_23_110356_create_notes_table.php
│   │   ├── 2026_06_23_115839_modify_vendors_table.php  # Hapus user_id, tambah price
│   │   ├── 2026_06_23_124124_create_messages_table.php # Chat
│   │   └── 2026_06_23_130629_add_parent_id_to_tasks_table.php # Sub-task
│   └── seeders/                  # Data dummy untuk development
│       ├── DatabaseSeeder.php    # Register semua seeder
│       ├── UserSeeder.php        # 1 admin + 20 user demo
│       └── VendorSeeder.php      # 140 vendor (20 per kategori)
│
├── resources/
│   ├── js/                       # Frontend React + Inertia
│   │   ├── Pages/                # Halaman — satu file = satu route
│   │   │   ├── Admin/           # Halaman admin
│   │   │   │   ├── Index.jsx    # Dashboard admin — tabel user
│   │   │   │   ├── Show.jsx     # Detail user
│   │   │   │   ├── Edit.jsx     # Edit user
│   │   │   │   ├── Plan.jsx     # Kelola plan (dashboard + tabs)
│   │   │   │   ├── Manage.jsx   # Kelola penuh (CRUD + chat)
│   │   │   │   ├── Chats.jsx    # Chat support — semua user
│   │   │   │   └── Vendors/     # CRUD vendor katalog
│   │   │   ├── Auth/            # Login, Register, Forgot Password
│   │   │   ├── Budgets/         # Budget Tracker
│   │   │   │   ├── Index.jsx    # List budget + statistik
│   │   │   │   ├── Create.jsx   # Tambah budget
│   │   │   │   ├── Edit.jsx     # Edit budget
│   │   │   │   └── Show.jsx     # Detail budget
│   │   │   ├── Messages/
│   │   │   │   └── Index.jsx    # Chat user dengan admin
│   │   │   ├── Notes/           # Catatan (card view)
│   │   │   ├── Reports/
│   │   │   │   └── Index.jsx    # Laporan + export PDF
│   │   │   ├── Tasks/           # Checklist
│   │   │   │   ├── Index.jsx    # List task + sub-task expand
│   │   │   │   ├── Create.jsx   # Tambah task
│   │   │   │   ├── Edit.jsx     # Edit task
│   │   │   │   └── Show.jsx     # Detail task
│   │   │   ├── Vendors/         # Vendor List (user)
│   │   │   │   ├── Index.jsx    # Card view vendor + sort/filter
│   │   │   │   └── Show.jsx     # Detail vendor + Add to Budget modal
│   │   │   ├── Dashboard.jsx    # Dashboard user — chart, countdown
│   │   │   └── Welcome.jsx      # Landing page
│   │   ├── Components/          # Komponen reusable (dari Breeze)
│   │   ├── Layouts/
│   │   │   ├── AuthenticatedLayout.jsx  # Layout dengan sidebar
│   │   │   └── GuestLayout.jsx          # Layout untuk halaman auth
│   │   ├── utils/
│   │   │   └── format.js        # Helper: formatDate(), formatRp()
│   │   └── app.jsx              # Entry point Inertia + React
│   ├── views/                   # Blade views (HANYA untuk PDF)
│   │   ├── app.blade.php        # Root template HTML
│   │   └── reports/
│   │       ├── pdf-checklist.blade.php
│   │       └── pdf-users.blade.php
│   └── css/
│
├── routes/
│   ├── web.php                   # Semua route web (UTAMA)
│   └── auth.php                  # Route login/register (dari Breeze)
│
├── storage/                      # File upload, log, cache
│   └── app/public/
│       ├── receipts/             # Bukti pembayaran budget
│       └── notes/                # Gambar inspirasi notes
│
├── vendor/                       # Library PHP (Composer)
├── node_modules/                 # Library JS (npm)
├── .env                          # Konfigurasi environment
├── compose.yaml                  # Docker Compose (Sail)
├── package.json                  # Dependencies npm
├── tsconfig.json                 # Konfigurasi TypeScript
├── vite.config.js                # Konfigurasi Vite bundler
├── PRD.md                        # Product Requirement Document
├── CLAUDE.md                     # Panduan coding
└── penjelasan.md                 # File ini
```

---

## MVC Dijelaskan

### Model (`app/Models/`)
Setiap file = satu tabel di database. Contoh:

```php
// Task.php — merepresentasikan tabel tasks
class Task extends Model
{
    // Kolom yang boleh diisi (mass assignment)
    #[Fillable(['user_id', 'title', 'category', ...])]

    // Casting tipe data (date, decimal, boolean)
    protected function casts(): array { return ['deadline' => 'date']; }

    // Relasi ke User (Task ini milik siapa?)
    public function user(): BelongsTo { return $this->belongsTo(User::class); }

    // Sub-task (children = task yang parent_id-nya = task ini)
    public function children(): HasMany { return $this->hasMany(Task::class, 'parent_id'); }
}
```

### Controller (`app/Http/Controllers/`)
Setiap controller menangani satu modul. Contoh alur:

```
User klik /tasks → Router → TaskController@index → query Task::where('user_id', auth()->id()) → kirim data ke React
```

```php
class TaskController extends Controller
{
    public function index() {
        $tasks = Task::where('user_id', auth()->id())->paginate(10);
        return Inertia::render('Tasks/Index', ['tasks' => $tasks]);  // Kirim ke React
    }

    public function store(TaskRequest $request) {
        Task::create([...$request->validated(), 'user_id' => auth()->id()]);
        return redirect()->route('tasks.index')->with('success', 'Berhasil!');
    }
}
```

### View (`resources/js/Pages/`)
Setiap halaman = satu file React (`.jsx`). Data dari Controller diterima sebagai props:

```jsx
export default function TasksIndex({ tasks }) {
    // tasks = data dari Controller
    return (
        <AuthenticatedLayout>
            <Head title="Checklist" />
            {tasks.data.map(task => <div>{task.title}</div>)}
        </AuthenticatedLayout>
    );
}
```

### Router (`routes/web.php`)
Mengarahkan URL ke Controller method:

```php
Route::get('/dashboard', [DashboardController::class, 'index']);  // Dashboard
Route::resource('tasks', TaskController::class);                    // Tasks CRUD
Route::middleware('admin')->prefix('admin')->group(function () {
    Route::get('/', [AdminController::class, 'index']);            // Admin dashboard
    Route::get('/users/{user}/manage', [AdminController::class, 'manage']);  // Kelola plan
});
```

---

## Database — 7 Tabel

| Tabel | Fungsi | Relasi |
|-------|--------|--------|
| **users** | Akun user & admin | - |
| **tasks** | Checklist pernikahan + sub-task | `user_id` → users, `parent_id` → tasks (self) |
| **budgets** | Anggaran & transaksi | `user_id` → users |
| **vendors** | Katalog vendor (global) | (tidak ada user_id — global) |
| **notes** | Catatan inspirasi | `user_id` → users |
| **messages** | Chat admin-user | `user_id` → users |
| **sessions/cache/jobs** | Internal Laravel | - |

---

## Flow Utama Aplikasi

### User:
```
Login → Dashboard (countdown, chart, ringkasan)
         ├── Vendor List → Browse vendor → Detail → "Add to Budget" → Budget terbuat
         ├── Budget Tracker → Kelola transaksi → "Add to Checklist" → Task + sub-task terbuat
         ├── Checklist → Task utama → expand ▶ → sub-task → toggle/delete
         ├── Catatan → Card view → CRUD catatan inspirasi
         ├── Pesan → Chat dengan admin
         └── Laporan → Ringkasan + Export PDF
```

### Admin:
```
Login → Dashboard Admin (tabel user)
         ├── Admin Panel → Statistik + user list
         ├── Kelola Vendor → CRUD vendor katalog
         ├── Chat Support → Lihat & balas semua chat user
         └── Kelola Plan (per user) → Tab: Dashboard | Tasks | Budget | Notes | Chat
```

---

## Perintah Dasar

```bash
./vendor/bin/sail up -d          # Start server
./vendor/bin/sail down            # Stop server
./vendor/bin/sail artisan migrate # Jalankan migration
./vendor/bin/sail artisan migrate:fresh --seed  # Reset database + seed
./vendor/bin/sail npm run dev     # Vite dev server (HMR)
./vendor/bin/sail npm run build   # Build production
```

## Cara Membuat Fitur Baru (Langkah-langkah)

1. **Migration** — buat/ubah tabel: `sail artisan make:migration nama_migration`
2. **Model** — representasi tabel: `sail artisan make:model NamaModel`
3. **Controller** — logika: `sail artisan make:controller NamaController --resource`
4. **Route** — daftarkan di `routes/web.php`
5. **Page** — buat file `.jsx` di `resources/js/Pages/`
6. **Sidebar** — tambah menu di `AuthenticatedLayout.jsx`
