# Bab 6 — Kendala & Solusi

Bab ini mendokumentasikan kendala teknis dan non-teknis yang dihadapi selama pengembangan serta solusi yang diterapkan.

---

## 6.1 Kendala Teknis

### 1. Storage Link pada Docker

**Kendala:** Perintah `php artisan storage:link` membuat symlink dengan path absolut di dalam container (`/var/www/html/storage/app/public`), yang tidak dikenali oleh host.

**Solusi:** Symlink tetap berfungsi normal karena aplikasi berjalan di dalam container yang sama. File upload dan akses via `Storage::url()` berjalan sesuai harapan. Tidak diperlukan konfigurasi tambahan.

### 2. Vite HMR di Dalam Container

**Kendala:** Vite *dev server* perlu berjalan di dalam container Sail dan port 5173 harus diekspos ke host agar *Hot Module Replacement* berfungsi.

**Solusi:** Docker Compose sudah mengekspos port 5173. Vite dijalankan dengan `./vendor/bin/sail npm run dev`. Plugin Laravel Vite secara otomatis mendeteksi environment Docker dan mengkonfigurasi ulang host.

### 3. N+1 Query Problem pada Admin Dashboard

**Kendala:** Method `index()` di `AdminController` melakukan query terpisah untuk setiap user dalam loop `transform()` — menyebabkan puluhan query tambahan (N+1).

**Solusi:** Mengganti dengan *batch query* menggunakan `whereIn()` dan `pluck()` untuk mengumpulkan data spent dan completed tasks semua user dalam 2 query, lalu memetakan hasilnya:

```php
$spentMap = Budget::whereIn('user_id', $userIds)
    ->where('status', 'spent')
    ->selectRaw('user_id, SUM(amount) as total')
    ->groupBy('user_id')
    ->pluck('total', 'user_id');
```

### 4. Duplikasi Logika Query

**Kendala:** Method `plan()`, `manage()`, dan `show()` di `AdminController` menduplikasi query yang sama untuk tasks, budgets, notes, dan messages — melanggar prinsip DRY.

**Solusi:** Mengekstrak query berulang ke dalam private method `getUserData()` dan `calcProgress()`:

```php
private function getUserData(User $user): array
{
    return [
        'tasks'    => Task::where('user_id', $user->id)->latest()->get(),
        'budgets'  => Budget::where('user_id', $user->id)->latest()->get(),
        // ...
    ];
}
```

### 5. Self-Referencing Sub-tasks

**Kendala:** Fitur sub-task memerlukan hierarki task dalam satu tabel yang sama, yang tidak didukung secara native oleh Laravel.

**Solusi:** Menerapkan pola *adjacency list* — menambahkan kolom `parent_id` (foreign key ke `tasks.id`) dan mendefinisikan relasi self-referencing di model:

```php
public function parent(): BelongsTo { return $this->belongsTo(Task::class, 'parent_id'); }
public function children(): HasMany { return $this->hasMany(Task::class, 'parent_id'); }
```

### 6. Progress Bar Overflow pada Budget

**Kendala:** Progress bar pada halaman budget menampilkan dua segmen (spent + planned) yang jika dijumlahkan dapat melebihi 100% lebar — menyebabkan tampilan pecah.

**Solusi:** Menambahkan `overflow-hidden` pada container dan meng-clamp lebar segmen *planned* terhadap sisa lebar yang tersedia setelah segmen *spent*.

### 7. Chat Message Ordering

**Kendala:** Pesan chat ditampilkan dengan urutan terbalik — pesan terbaru di atas, terlama di bawah — karena penggunaan `->latest()` di backend.

**Solusi:** Mengganti menjadi `->oldest()` untuk semua endpoint chat (user dan admin) agar pesan terlama di atas dan terbaru di bawah, sesuai konvensi aplikasi chat.

---

## 6.2 Kendala Non-Teknis

### 8. Scope Creep — Admin Panel

**Kendala:** PRD awal tidak menyertakan admin panel, namun kebutuhan untuk demo dan presentasi mendorong penambahannya.

**Solusi:** Admin panel dikembangkan secara inkremental setelah seluruh fitur MVP selesai. Implementasi menggunakan middleware `admin` yang terisolasi dari route user biasa, sehingga tidak memengaruhi arsitektur inti.

### 9. Vendor Global vs Per-User

**Kendala:** Desain awal (migration ke-7) membuat vendor dengan `user_id`, namun kemudian direvisi menjadi katalog global. Ini memerlukan migration tambahan untuk menghapus kolom dan foreign key.

**Solusi:** Migration ke-9 (`modify_vendors_table`) menghapus constraint foreign key `user_id` dan menambahkan kolom `price`. Vendor menjadi katalog bersama yang dikelola admin.

### 10. Tidak Ada REST API

**Kendala:** Keputusan menggunakan Inertia.js berarti tidak ada REST API endpoints — aplikasi tidak dapat melayani mobile client atau integrasi pihak ketiga.

**Solusi:** Ini adalah keputusan desain yang disengaja untuk MVP. Jika diperlukan di masa depan, Laravel Sanctum dapat ditambahkan sebagai layer API tanpa mengubah struktur yang sudah ada.

---

Kendala-kendala di atas menjadi pembelajaran berharga dalam memahami trade-off arsitektur, pentingnya perencanaan query database, dan manajemen scope dalam pengembangan perangkat lunak.
