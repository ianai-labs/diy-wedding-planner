# 💒 My Wedding Planner

Aplikasi web perencanaan pernikahan DIY — checklist, budget, vendor, catatan dalam satu platform terpusat.

![Laravel](https://img.shields.io/badge/Laravel-13-red?logo=laravel)
![React](https://img.shields.io/badge/React-19-blue?logo=react)
![Inertia](https://img.shields.io/badge/Inertia-2-purple)
![Tailwind](https://img.shields.io/badge/Tailwind-v4-06b6d4?logo=tailwindcss)
![Docker](https://img.shields.io/badge/Docker-Sail-2496ed?logo=docker)
![PHP](https://img.shields.io/badge/PHP-8.5-777bb4?logo=php)

---

## ✨ Fitur

### 👤 User
| Fitur | Deskripsi |
|-------|-----------|
| **Dashboard** | Countdown pernikahan, pie chart budget, progress checklist, deadline terdekat |
| **Vendor List** | Katalog **140 vendor** (7 kategori), sort by harga, filter kategori, Add to Budget |
| **Budget Tracker** | CRUD transaksi, progress bar spent/planned/sisa, Add to Checklist + sub-task |
| **Checklist** | Task utama + **sub-task** expandable, toggle status, filter & search |
| **Catatan** | Card view, upload gambar inspirasi |
| **Pesan** | Chat real-time dengan admin |
| **Laporan** | Ringkasan + Export PDF |

### 🛡️ Admin
| Fitur | Deskripsi |
|-------|-----------|
| **Dashboard Admin** | Overview user, search & filter, countdown per user |
| **Kelola Plan** | Manage task, budget, notes per user + chat |
| **Chat Support** | Lihat & balas chat semua user |
| **Kelola Vendor** | CRUD vendor katalog global |

---

## 🛠️ Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Backend | Laravel 13, PHP 8.5 |
| Frontend | React 19, Inertia 2, Tailwind CSS v4 |
| Database | MySQL 8.4 |
| Auth | Laravel Breeze (Inertia + React) |
| Charts | Chart.js + react-chartjs-2 |
| PDF | barryvdh/laravel-dompdf |
| Dev Env | Docker / Laravel Sail |

---

## 🚀 Cara Menjalankan

### Prasyarat
- **Docker Desktop** (dengan WSL2 untuk Windows)

### Setup
```bash
# Clone
git clone git@github.com:ianai-labs/diy-wedding-planner.git
cd diy-wedding-planner

# Jalankan
docker compose up -d
docker compose exec laravel.test composer install
docker compose exec laravel.test npm install && npm run build
docker compose exec laravel.test php artisan migrate --seed
docker compose exec laravel.test php artisan storage:link

# Buka http://localhost
```

### Login Demo
| Role | Email | Password |
|------|-------|----------|
| User | `user1@demo.com` | `password` |
| Admin | `admin@demo.com` | `password` |

> 20 user demo tersedia: `user1@demo.com` s/d `user20@demo.com`

---

## 📁 Struktur Proyek

```
app/
├── Http/Controllers/    # Logic backend
├── Models/              # Database model (User, Task, Budget, Vendor, Note, Message)
└── Requests/            # Form validation
resources/js/Pages/      # Halaman React + Inertia
routes/web.php           # Semua route
database/migrations/     # Skema database
```

> Baca `penjelasan.md` untuk dokumentasi lengkap setiap file.

---

## 🗄️ Database

| Tabel | Fungsi |
|-------|--------|
| `users` | Akun user & admin |
| `tasks` | Checklist + sub-task (`parent_id`) |
| `budgets` | Transaksi anggaran |
| `vendors` | Katalog vendor global |
| `notes` | Catatan inspirasi |
| `messages` | Chat admin-user |

---

## 🏗️ Arsitektur

```
Browser → Inertia Router → Laravel Controller → Model → MySQL
                ↕
         React Pages (JSX)
```

- **Controller**: Setiap modul punya Resource Controller (index, create, store, edit, update, destroy)
- **Middleware**: `auth` (semua user), `admin` (hanya role admin)
- **Inertia**: Jembatan Laravel ↔ React tanpa API

---

## ⚖️ License

MIT — dibuat untuk tugas mata kuliah Pemrograman Web.
