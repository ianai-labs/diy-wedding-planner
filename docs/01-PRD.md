# Spesifikasi Produk — My Wedding Planner

**Versi:** 1.0 | **Status:** Final | **Tanggal:** Juni 2026

Dokumen ini merupakan *Product Requirements Document* (PRD) untuk MVP My Wedding Planner, disusun sebagai bagian dari laporan proyek mata kuliah Pemrograman Web Lanjutan.

---

## 1. Product Overview

**My Wedding Planner** adalah aplikasi web terpusat untuk membantu pasangan merencanakan pernikahan secara mandiri (*do-it-yourself*). Aplikasi mengintegrasikan empat fungsi inti — checklist, anggaran, vendor, dan catatan — dalam satu platform dengan dashboard analitik.

## 2. Tujuan MVP

- Pasangan dapat mencatat dan memantau kemajuan persiapan pernikahan melalui checklist terstruktur berbasis *timeline*
- Pengelolaan anggaran secara *real-time* dengan kemampuan upload bukti pembayaran
- Katalog vendor global yang dapat diakses bersama
- Dokumentasi catatan inspirasi pernikahan dengan gambar

## 3. Tech Stack

| Layer | Teknologi |
|---|---|
| Environment | Docker / Laravel Sail (PHP 8.4, Node.js, MySQL dalam container) |
| Backend Framework | Laravel 13, PHP 8.3+ |
| Database | MySQL 8.4 |
| Frontend Framework | React 19 + Inertia.js 2 |
| CSS | Tailwind CSS v4 + shadcn/ui |
| Authentication | Laravel Breeze (React + Inertia, session-based) |
| Charts | Chart.js 4 + react-chartjs-2 5 |
| PDF Export | barryvdh/laravel-dompdf 3 |

## 4. Database — Ringkasan

| Tabel | Field Kunci | Relasi |
|---|---|---|
| **users** | id, name, email, password, partner_name, wedding_date, total_budget, role | — |
| **tasks** | id, user_id, parent_id, title, category, deadline, status, priority | belongsTo User, self-ref (sub-tasks) |
| **budgets** | id, user_id, category, description, amount, date, status, receipt_path | belongsTo User |
| **vendors** | id, name, category, price, contact, address, notes, rating | **Global** (tanpa user_id) |
| **notes** | id, user_id, title, content, image_path | belongsTo User |
| **messages** | id, user_id, message, is_from_admin | belongsTo User |

> Lihat **Bab 3 — Desain Database** untuk ERD lengkap dan daftar migration.

## 5. Fitur Aplikasi

### 5.1 Authentication
- Register dengan field tambahan: partner_name, wedding_date, total_budget
- Login + "Remember me" + Logout
- Forgot password + Email verification
- Role-based access: user dan admin

### 5.2 Dashboard
- Countdown hari menuju pernikahan
- Ringkasan budget (total, spent, planned, sisa)
- Progress checklist (persentase)
- Pie chart distribusi budget per kategori
- Doughnut chart distribusi status task
- 5 deadline terdekat dengan warning ≤ 7 hari

### 5.3 Checklist / Tasks
- CRUD dengan field: judul, kategori (H-365 s/d H-7), deskripsi, deadline, status (pending/progress/completed), prioritas (low/medium/high)
- Sub-tasks: expand/collapse, toggle checkbox, inline create, hapus
- Search + filter (kategori, status) + pagination 10/halaman
- Update status via AJAX (PATCH, tanpa reload halaman)
- Auto-generate sub-task template dari konversi budget

### 5.4 Budget Tracker
- CRUD transaksi dengan kategori (venue, catering, decoration, photo_video, dress, ring, others)
- Ringkasan: total budget, spent, planned, sisa + progress bar
- Upload bukti pembayaran (receipt) — jpg/jpeg/png, max 2MB
- Search + filter (kategori, bulan) + pagination 10/halaman
- Konversi item budget → task checklist + auto sub-task template (3-5 sub-task sesuai kategori)

### 5.5 Vendor Catalog
- Katalog global (dikelola admin, diakses semua user)
- Card view dengan: nama, kategori, harga, kontak, rating bintang (1-5)
- Search + filter kategori + sort by price (ascending/descending)
- User: browse + "Add to Budget" | Admin: CRUD penuh
- 120 vendor pre-seeded dalam 6 kategori

### 5.6 Notes
- CRUD catatan dengan judul, konten, dan upload gambar (max 2MB)
- Card view (responsive grid 1/2/3 kolom)
- Search + pagination

### 5.7 Chat
- Real-time messaging antara user dan admin
- Auto-scroll ke pesan terbaru
- Panel admin menampilkan daftar user dengan chat

### 5.8 Reports
- Ringkasan statistik (total task, budget, vendor, notes)
- Export checklist ke PDF via DOMPDF

### 5.9 Admin Panel
- Dashboard admin dengan statistik global
- Monitoring plan user (read-only tab view: Dashboard, Tasks, Budgets, Notes, Chat)
- Kelola data user (CRUD inline via modal: tambah task/budget/note + chat)
- Edit/hapus akun user
- Manajemen vendor global (CRUD)
- Export data user ke CSV dan PDF

## 6. Validasi

| Modul | Aturan |
|---|---|
| Register | email unique, password min 8 karakter |
| Task | title, category, status, priority wajib diisi |
| Budget | amount > 0, receipt wajib image ≤ 2MB |
| Vendor | name, category, contact, price wajib diisi |
| Note | title dan content wajib, image ≤ 2MB |

## 7. Batasan MVP (Out of Scope)

- REST API / JWT / Laravel Sanctum
- Email / push notification
- Multi-user collaboration dalam satu akun
- Template checklist bawaan
- Payment gateway / transaksi finansial
