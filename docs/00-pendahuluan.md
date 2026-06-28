# Bab 1 — Pendahuluan

## 1.1 Latar Belakang

Perencanaan pernikahan merupakan proses multidimensi yang melibatkan pengelolaan anggaran, pemilihan vendor, penyusunan checklist, dan dokumentasi inspirasi secara simultan. Berdasarkan survei dari The Knot (2024), rata-rata pasangan menghabiskan waktu 12–15 bulan untuk persiapan pernikahan dengan rata-rata biaya mencapai Rp 150–300 juta di Indonesia. Kompleksitas ini sering kali diperburuk oleh tidak adanya platform terpusat yang mengintegrasikan seluruh aspek perencanaan.

Mayoritas pasangan mengandalkan kombinasi spreadsheet, catatan ponsel, dan komunikasi tidak terstruktur dengan vendor. Pendekatan fragmented ini menyebabkan tiga masalah utama: (1) kesulitan melacak realisasi anggaran secara *real-time*, (2) data vendor yang tersebar dan sulit diakses kembali, serta (3) ketiadaan checklist terstruktur berbasis *timeline* yang baku (WeddingWire, 2024).

Mata kuliah **Pemrograman Web Lanjutan** menuntut mahasiswa untuk membangun aplikasi web berbasis framework Laravel yang mengintegrasikan berbagai konsep: ORM Eloquent, authentication/authorization, form validation, file upload, AJAX, dan export data. Proyek ini dirancang untuk memenuhi seluruh capaian pembelajaran tersebut dalam satu aplikasi utuh yang mendekati kasus nyata.

## 1.2 Rumusan Masalah

1. Bagaimana merancang dan membangun platform terpusat untuk manajemen persiapan pernikahan menggunakan Laravel dan React?
2. Bagaimana mengimplementasikan pengelolaan anggaran, checklist, vendor, dan catatan inspirasi dalam satu aplikasi terintegrasi?
3. Bagaimana mengamankan data pengguna melalui authentication dan authorization berbasis peran?

## 1.3 Tujuan

1. Membangun aplikasi web **My Wedding Planner** menggunakan Laravel 13 dan React 19 dengan arsitektur Inertia.js
2. Mengimplementasikan fitur checklist terstruktur dengan sub-tasks, budget tracker dengan upload bukti, katalog vendor global, dan catatan inspirasi
3. Menerapkan session-based authentication dengan role-based authorization (admin dan user)

## 1.4 Batasan Masalah

Proyek ini merupakan **MVP (Minimum Viable Product)** dengan batasan:

1. Tidak ada REST API endpoints — komunikasi frontend-backend melalui Inertia.js
2. Tidak ada notifikasi email atau push notification
3. Vendor dikelola sebagai katalog global oleh admin (bukan per-user)
4. Tidak ada payment gateway atau transaksi finansial nyata
5. Tidak ada fitur kolaborasi multi-user dalam satu akun

## 1.5 Target Pengguna

| Peran | Deskripsi |
|---|---|
| **User** | Pasangan yang akan menikah, menggunakan aplikasi untuk mengelola checklist, anggaran, vendor, dan catatan pribadi |
| **Admin** | Administrator sistem yang memonitor seluruh pengguna, memberikan dukungan via chat, dan mengelola katalog vendor global |

## 1.6 Metodologi Pengembangan

Proyek dikembangkan dengan pendekatan **waterfall sederhana** yang disesuaikan untuk skala proyek mata kuliah: analisis kebutuhan → desain sistem → desain database → implementasi → pengujian → dokumentasi. Setiap tahap didokumentasikan dalam laporan ini.

---

*Laporan ini disusun untuk memenuhi tugas mata kuliah **Pemrograman Web Lanjutan** (3 SKS).*
