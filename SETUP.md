# Setup Guide — My Wedding Planner

Cara teman kelompok menjalankan proyek ini di laptop masing-masing.

## Yang Dibutuhkan (Install Sekali)

### Windows
1. **WSL2** — buka PowerShell as Administrator, ketik: `wsl --install` → restart
2. **Docker Desktop** — download: https://www.docker.com/products/docker-desktop/
   - Buka Settings → Resources → WSL Integration → centang Ubuntu → Apply & Restart
3. **VS Code** (opsional) — https://code.visualstudio.com/

---

## Cara Menjalankan Proyek

### 1. Ekstrak file proyek
- Kamu kirim dalam bentuk **ZIP** atau copy folder `diy-wedding-planner`
- Ekstrak ke folder manapun, misal: `C:\Users\nama\diy-wedding-planner`

### 2. Buka terminal WSL (Ubuntu)

### 3. Jalankan
```bash
cd /mnt/c/Users/nama/diy-wedding-planner    # sesuaikan path
docker compose up -d                         # start server
docker compose exec laravel.test npm install # install JS
docker compose exec laravel.test npm run build  # build frontend
docker compose exec laravel.test php artisan migrate --seed  # setup database
docker compose exec laravel.test php artisan storage:link
```

### 4. Buka browser
```
http://localhost
```

---

## Login Demo

| Role | Email | Password |
|------|-------|----------|
| User | `user1@demo.com` | `password` |
| Admin | `admin@demo.com` | `password` |

> Ada 20 user demo: `user1@demo.com` sampai `user20@demo.com`, semua password `password`

---

## Kalau Mau Edit/Run Vite (HMR)

Setelah edit file `.jsx` di `resources/js/Pages/`, jalankan di terminal terpisah:
```bash
docker compose exec laravel.test npm run dev
```
Lalu refresh browser. Perubahan langsung terlihat tanpa reload manual.

---

## Troubleshooting

| Masalah | Solusi |
|--------|--------|
| `docker: command not found` | Docker Desktop belum running, buka dulu |
| Port 80 sudah dipakai | Matikan XAMPP/Skype/IIS, atau restart laptop |
| Halaman putih | Jalankan `docker compose exec laravel.test npm run build` |
| Database error | `docker compose exec laravel.test php artisan migrate:fresh --seed` |
| Permission error (Linux) | `sudo chown -R $USER:$USER .` |

---

## Struktur Singkat Proyek

| Folder | Isi |
|--------|-----|
| `app/Models/` | Database (User, Task, Budget, Vendor, Note, Message) |
| `app/Http/Controllers/` | Logic backend |
| `resources/js/Pages/` | Halaman depan (React) |
| `routes/web.php` | Semua route/URL |
| `database/migrations/` | Skema database |

> Baca `penjelasan.md` untuk dokumentasi lengkap setiap file.
