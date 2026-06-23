# PRD — My Wedding Planner (MVP)

**Versi:** 1.0  
**Status:** Draft  
**Tanggal:** Juni 2026

---

## 1. Overview

**My Wedding Planner** adalah aplikasi web untuk membantu pasangan merencanakan pernikahan secara mandiri (DIY). MVP difokuskan pada 4 fitur inti: Checklist, Budget, Vendor, dan Notes — semua dalam satu platform terpusat.

---

## 2. Tujuan MVP

- Pasangan dapat mencatat dan memantau progress persiapan pernikahan
- Pengelolaan anggaran secara real-time
- Penyimpanan data vendor dalam satu tempat
- Catatan inspirasi pernikahan

---

## 3. Target Pengguna

| Tipe | Deskripsi |
|---|---|
| **User** | Pasangan yang akan menikah |
| **Admin** | Monitoring & keperluan demo |

---

## 4. Tech Stack

| Layer | Teknologi |
|---|---|
| Environment | Docker / Laravel Sail (PHP 8.4, Node.js, MySQL dalam container) |
| Backend | Laravel 12, PHP 8.2+ |
| Database | MySQL |
| Frontend | Inertia 2 + React 19, TypeScript, Tailwind CSS v4, shadcn/ui, Alpine.js |
| Auth | Laravel Starter Kit: Inertia + React (session-based) |
| Export | maatwebsite/excel, barryvdh/laravel-dompdf |

---

## 5. Database

### 5.1 Tabel Users
| Field | Tipe | Keterangan |
|---|---|---|
| id | BIGINT PK | Auto increment |
| name | VARCHAR(100) | Nama lengkap |
| email | VARCHAR(100) | Unique |
| password | VARCHAR(255) | Bcrypt |
| partner_name | VARCHAR(100) | Nullable |
| wedding_date | DATE | Tanggal pernikahan |
| total_budget | DECIMAL(15,2) | Default 0 |
| role | ENUM('user','admin') | Default 'user' |

### 5.2 Tabel Tasks
| Field | Tipe | Keterangan |
|---|---|---|
| id | BIGINT PK | |
| user_id | BIGINT FK | → users |
| title | VARCHAR(200) | |
| category | ENUM | H-365, H-180, H-90, H-30, H-7 |
| description | TEXT | Nullable |
| deadline | DATE | Nullable |
| status | ENUM | pending, progress, completed |
| priority | ENUM | low, medium, high |

### 5.3 Tabel Budgets
| Field | Tipe | Keterangan |
|---|---|---|
| id | BIGINT PK | |
| user_id | BIGINT FK | → users |
| category | ENUM | venue, catering, decoration, photo_video, dress, ring, others |
| description | VARCHAR(255) | |
| amount | DECIMAL(15,2) | |
| date | DATE | |
| status | ENUM | planned, spent |
| receipt_path | VARCHAR(255) | Nullable |

### 5.4 Tabel Vendors
| Field | Tipe | Keterangan |
|---|---|---|
| id | BIGINT PK | |
| user_id | BIGINT FK | → users |
| name | VARCHAR(200) | |
| category | ENUM | photography, decoration, catering, mua, mc, others |
| contact | VARCHAR(50) | |
| address | TEXT | Nullable |
| notes | TEXT | Nullable |
| rating | INT(1–5) | Nullable |

### 5.5 Tabel Notes
| Field | Tipe | Keterangan |
|---|---|---|
| id | BIGINT PK | |
| user_id | BIGINT FK | → users |
| title | VARCHAR(200) | |
| content | TEXT | |
| image_path | VARCHAR(255) | Nullable |

---

## 6. Fitur MVP

### 6.1 Authentication
- **Register** — nama, email, password, tanggal pernikahan, total budget
- **Login** — email & password
- **Logout**

### 6.2 Dashboard
- Countdown hari menuju pernikahan
- Ringkasan: Total Budget / Terpakai / Sisa
- Progress checklist (persentase)
- Pie chart distribusi budget per kategori
- Doughnut chart progress task
- Notifikasi 5 task dengan deadline terdekat (≤7 hari ditandai peringatan)

### 6.3 Checklist (Tasks) — CRUD
- List task dengan search, filter (kategori & status), pagination (10/hal)
- Tambah / edit / hapus task
- Update status via AJAX (tanpa reload)
- Field: judul, kategori, deskripsi, deadline, status, prioritas

### 6.4 Budget Tracker — CRUD
- Ringkasan budget + progress bar di atas halaman
- List transaksi dengan search, filter (kategori & bulan), pagination (10/hal)
- Tambah / edit / hapus transaksi
- Upload bukti pembayaran (jpg/jpeg/png, max 2MB)
- Export ke Excel

### 6.5 Vendor — CRUD
- List vendor dengan search, filter (kategori), pagination (10/hal)
- Tambah / edit / hapus vendor
- Field: nama, kategori, kontak, alamat, catatan, rating

### 6.6 Notes — CRUD
- List catatan (card view), search, pagination (10/hal)
- Tambah / edit / hapus catatan
- Upload gambar inspirasi (jpg/jpeg/png, max 2MB)

### 6.7 Reports
- Ringkasan semua data (task, budget, vendor, notes)
- Export Checklist → PDF
- Export Budget → Excel

---

## 7. Validasi

| Modul | Aturan Penting |
|---|---|
| Register | email unique, password min 8 karakter, wedding_date > today |
| Task | title & category & status & priority wajib |
| Budget | amount > 0, file upload max 2MB (jpg/jpeg/png) |
| Vendor | name, category, contact wajib |
| Note | title & content wajib, file upload max 2MB |

---

## 8. Keamanan

| Aspek | Implementasi |
|---|---|
| Password | Bcrypt hash |
| CSRF | Inertia handle otomatis via XSRF token |
| XSS | React JSX auto-escape |
| SQL Injection | Eloquent ORM |
| Auth | Session + Middleware |
| File Upload | Validasi tipe & ukuran |

---

## 9. Struktur Folder (Ringkas)

```
wedding-planner/
├── app/Http/Controllers/    # DashboardController, TaskController, BudgetController,
│                            # VendorController, NoteController, ReportController
├── app/Http/Requests/       # TaskRequest, BudgetRequest, VendorRequest, NoteRequest
├── app/Models/              # User, Task, Budget, Vendor, Note
├── app/Exports/             # BudgetExport
├── database/migrations/     # 5 tabel
├── database/seeders/        # UserSeeder, DatabaseSeeder
├── resources/js/
│   ├── Pages/               # Halaman Inertia (Dashboard, Tasks/Index, Tasks/Create, dll.)
│   ├── Components/          # React components (Button, Card, Modal, Chart, dll.)
│   └── Layouts/             # AuthenticatedLayout, GuestLayout
├── resources/views/         # Hanya untuk PDF export (reports/pdf-checklist.blade.php)
├── routes/web.php           # Semua route web
└── bootstrap/app.php        # Konfigurasi middleware & aplikasi
```

---

## 10. Out of Scope (MVP)

Fitur berikut **tidak termasuk** dalam MVP dan dapat dikembangkan di versi berikutnya:

- API endpoints / JWT (Laravel Sanctum) — dikeluarkan dari MVP
- Admin dashboard (role admin hanya tersedia di database, belum ada UI khusus)
- Notifikasi email / push notification
- Multi-user collaboration (pasangan berbagi akun yang sama)
- Template checklist bawaan sistem

---

## 11. Estimasi Modul

| No | Modul | Kompleksitas |
|---|---|---|
| 1 | Authentication | Rendah |
| 2 | Dashboard | Sedang |
| 3 | Checklist (CRUD + AJAX) | Sedang |
| 4 | Budget Tracker (CRUD + Upload) | Sedang |
| 5 | Vendor (CRUD) | Rendah |
| 6 | Notes (CRUD + Upload) | Rendah |
| 7 | Reports (Export PDF/Excel) | Sedang |

---

*PRD ini mencakup scope minimum untuk meluncurkan produk yang fungsional dan dapat diuji pengguna.*
