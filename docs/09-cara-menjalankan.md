# Lampiran B — Cara Menjalankan Aplikasi

Panduan lengkap untuk menjalankan proyek dari nol setelah `git clone`.

---

## B.1 Prasyarat

| Software | Minimal | Cek Versi |
|---|---|---|
| **Docker Desktop** | Versi terbaru | `docker --version` |
| **WSL2** (Windows) | Terintegrasi | `wsl --status` |
| **Git** | Versi terbaru | `git --version` |

> ⚠️ **Tidak perlu menginstal PHP, Composer, Node.js, npm, atau MySQL di host.** Semua dependensi berjalan di dalam container Docker melalui Laravel Sail.

---

## B.2 Langkah Instalasi

### Langkah 1 — Clone Repository

```bash
git clone <url-repository> diy-wedding-planner
cd diy-wedding-planner
```

### Langkah 2 — Install Dependensi PHP (jika vendor belum ada)

```bash
docker run --rm -v $(pwd):/opt -w /opt laravelsail/php84-composer:latest composer install
```

### Langkah 3 — Setup Environment

```bash
cp .env.example .env
./vendor/bin/sail artisan key:generate
```

### Langkah 4 — Jalankan Container

```bash
./vendor/bin/sail up -d
```

Verifikasi dengan `docker ps` — dua container harus berjalan:
- `diy-wedding-planner-laravel.test-1` (aplikasi + PHP)
- `diy-wedding-planner-mysql-1` (database)

### Langkah 5 — Setup Database

```bash
./vendor/bin/sail artisan migrate --seed
./vendor/bin/sail artisan storage:link
```

### Langkah 6 — Install & Build Frontend

```bash
./vendor/bin/sail npm install
./vendor/bin/sail npm run build    # Production build
```

Atau untuk development dengan *Hot Module Replacement*:

```bash
./vendor/bin/sail npm run dev      # Vite HMR (terminal terpisah)
```

### Langkah 7 — Buka Aplikasi

Akses **http://localhost** di browser.

---

## B.3 Akun Demo

| Role | Email | Password |
|---|---|---|
| **Admin** | `admin@demo.com` | `password` |
| **User** | `user1@demo.com` s/d `user20@demo.com` | `password` |

---

## B.4 Perintah Sehari-hari

### Docker / Sail

```bash
./vendor/bin/sail up -d          # Start containers
./vendor/bin/sail down           # Stop containers
./vendor/bin/sail restart        # Restart
```

### Database

```bash
./vendor/bin/sail artisan migrate           # Jalankan migrasi
./vendor/bin/sail artisan migrate:fresh --seed  # Reset database
```

### Artisan Commands

```bash
./vendor/bin/sail artisan make:model NamaModel -m
./vendor/bin/sail artisan make:controller NamaController --resource
```

### Frontend

```bash
./vendor/bin/sail npm run dev     # Development (HMR)
./vendor/bin/sail npm run build   # Production build
```

### Alias (Opsional)

Tambahkan di `~/.bashrc`:
```bash
alias sail='[ -f sail ] && bash sail || ./vendor/bin/sail'
```

---

## B.5 Troubleshooting

| Masalah | Solusi |
|---|---|
| Port 80 sudah dipakai | Ubah `APP_PORT=8080` di `.env`, lalu `sail restart` |
| MySQL container tidak sehat | `sail restart` atau `docker logs diy-wedding-planner-mysql-1` |
| Halaman *blank* (Vite tidak berjalan) | `sail npm run dev` (terminal terpisah) |
| Storage symlink error | `sail artisan storage:link` |
| Permission storage | `sail root-shell` lalu `chmod -R 775 storage bootstrap/cache` |
| Container rusak total | `sail down && docker volume rm diy-wedding-planner_sail-mysql && sail build --no-cache && sail up -d && sail artisan migrate --seed` |

---

## B.6 Ringkasan Cepat

```bash
git clone <url> diy-wedding-planner && cd diy-wedding-planner
cp .env.example .env
./vendor/bin/sail artisan key:generate
./vendor/bin/sail up -d
./vendor/bin/sail artisan migrate --seed
./vendor/bin/sail artisan storage:link
./vendor/bin/sail npm install && ./vendor/bin/sail npm run build
# Buka http://localhost
```
