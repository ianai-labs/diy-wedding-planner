# Bab 7 — Kesimpulan & Saran

## 7.1 Kesimpulan

Proyek **My Wedding Planner** telah berhasil dibangun sebagai aplikasi web full-stack menggunakan Laravel 13 dan React 19 dengan arsitektur Inertia.js. Aplikasi mengintegrasikan enam modul utama dalam satu platform terpusat: checklist persiapan, pelacakan anggaran, katalog vendor, catatan inspirasi, komunikasi chat dengan admin, dan reporting.

Seluruh capaian pembelajaran mata kuliah **Pemrograman Web Lanjutan** telah terpenuhi:

1. **Routing & Controller** — 79 route terstruktur dengan resource controller dan pemisahan user/admin
2. **Model & Eloquent ORM** — 6 model dengan relasi One-to-Many dan self-referencing
3. **Form Request & Validasi** — 6 dedicated Form Request classes dengan aturan validasi lengkap
4. **Authentication & Authorization** — Session-based auth (Breeze) + role-based middleware
5. **Blade Template** — Digunakan untuk PDF export (DOMPDF)
6. **Fitur Lanjutan** — AJAX update status, file upload, export PDF, search & filter, pagination, chat

### Statistik Proyek

| Metrik | Jumlah |
|---|---|
| Tabel database | 6 aplikasi |
| Controller | 20 file |
| Model | 6 file |
| Form Request | 6 file |
| Middleware | 2 file |
| Migration | 11 file |
| Halaman React | 37 file |
| Komponen UI | 12 reusable |
| User stories | 38 (30 user + 8 admin) |
| Data seeder | 141 record (21 user + 120 vendor) |

### Kelebihan Aplikasi

- **Arsitektur modern** — Inertia.js memberikan pengalaman SPA tanpa kompleksitas REST API
- **Keamanan ketat** — Ownership check di setiap operasi, role-based middleware, validasi di backend
- **Fitur melampaui MVP** — Chat, admin panel, sub-tasks, dan auto-generate template melampaui spesifikasi awal
- **Development terisolasi** — Docker/Sail, tidak perlu instalasi runtime di host
- **UI responsif** — Tailwind CSS + shadcn/ui, mobile-friendly

## 7.2 Saran Pengembangan

| Area | Saran |
|---|---|
| Testing | Menambahkan unit test (PHPUnit) dan feature test untuk seluruh modul |
| API | Mengintegrasikan Laravel Sanctum untuk mendukung mobile app |
| Notifikasi | Mengaktifkan email notifikasi via SMTP untuk verifikasi dan reminder |
| Kolaborasi | Mendukung multi-user dalam satu akun untuk pasangan |
| Activity Log | Mencatat riwayat perubahan data user (*audit trail*) |
| Template Checklist | Menyediakan template checklist bawaan yang dapat dipilih user |

---

## 7.3 Pembelajaran

Pengerjaan proyek ini memberikan pemahaman praktis dalam:

1. **Full-stack development** — Integrasi nyata backend Laravel dengan frontend React melalui Inertia.js
2. **Database design** — Normalisasi, relasi One-to-Many, self-referencing (adjacency list)
3. **Security best practices** — Session-based auth, CSRF, XSS prevention, ownership verification
4. **Clean code** — DRY principle, Form Request extraction, reusable components
5. **Docker containerization** — Multi-service orchestration dengan Laravel Sail
6. **Software documentation** — PRD, user stories, ERD, technical documentation

---

Laporan ini disusun sebagai dokumentasi resmi proyek akhir mata kuliah **Pemrograman Web Lanjutan** (3 SKS). Seluruh kode sumber tersedia di repository proyek dan dapat dijalankan mengikuti panduan pada **Lampiran B — Cara Menjalankan**.
