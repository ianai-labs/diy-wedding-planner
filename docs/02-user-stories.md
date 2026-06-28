# Lampiran A — User Stories

Dokumen ini memetakan kebutuhan pengguna dalam format *user story* standar: "Sebagai [peran], saya ingin [tindakan] agar [manfaat]."

---

## A.1 User Stories — User (Pasangan)

### Authentication
| ID | Story |
|---|---|
| US-A01 | Sebagai pengguna baru, saya ingin mendaftar dengan nama, email, password, tanggal pernikahan, dan total budget agar dapat menggunakan aplikasi. |
| US-A02 | Sebagai pengguna terdaftar, saya ingin login dengan email dan password agar dapat mengakses data pernikahan saya. |
| US-A03 | Sebagai pengguna, saya ingin logout agar akun saya aman saat tidak digunakan. |

### Dashboard
| ID | Story |
|---|---|
| US-D01 | Sebagai pengguna, saya ingin melihat *countdown* hari menuju pernikahan agar mengetahui sisa waktu persiapan. |
| US-D02 | Sebagai pengguna, saya ingin melihat ringkasan anggaran (total, terpakai, sisa) di dashboard agar cepat memantau keuangan. |
| US-D03 | Sebagai pengguna, saya ingin melihat progress checklist dalam bentuk persentase dan grafik agar mengetahui tingkat kesiapan. |
| US-D04 | Sebagai pengguna, saya ingin melihat 5 task dengan deadline terdekat agar dapat memprioritaskan yang mendesak. |

### Checklist (Tasks)
| ID | Story |
|---|---|
| US-T01 | Sebagai pengguna, saya ingin menambah task baru dengan judul, kategori, deadline, status, dan prioritas. |
| US-T02 | Sebagai pengguna, saya ingin mencari dan memfilter task berdasarkan kategori dan status. |
| US-T03 | Sebagai pengguna, saya ingin mengedit task yang sudah ada. |
| US-T04 | Sebagai pengguna, saya ingin menghapus task yang tidak diperlukan. |
| US-T05 | Sebagai pengguna, saya ingin mengubah status task (pending → progress → completed) dengan cepat tanpa reload halaman. |
| US-T06 | Sebagai pengguna, saya ingin menambah sub-task di dalam task utama untuk memecah pekerjaan besar menjadi lebih kecil. |
| US-T07 | Sebagai pengguna, saya ingin mencentang sub-task yang sudah selesai. |

### Budget Tracker
| ID | Story |
|---|---|
| US-B01 | Sebagai pengguna, saya ingin mencatat transaksi anggaran dengan kategori, deskripsi, jumlah, tanggal, dan status. |
| US-B02 | Sebagai pengguna, saya ingin memfilter transaksi berdasarkan kategori dan bulan. |
| US-B03 | Sebagai pengguna, saya ingin mengunggah bukti pembayaran (*receipt*) untuk transaksi. |
| US-B04 | Sebagai pengguna, saya ingin mengkonversi item anggaran menjadi task checklist agar langsung muncul di daftar persiapan beserta sub-task templatenya. |

### Vendor Catalog
| ID | Story |
|---|---|
| US-V01 | Sebagai pengguna, saya ingin mencari vendor berdasarkan nama, kategori, dan harga. |
| US-V02 | Sebagai pengguna, saya ingin melihat detail vendor (kontak, alamat, rating, harga). |
| US-V03 | Sebagai pengguna, saya ingin menambahkan vendor ke anggaran saya. |

### Notes
| ID | Story |
|---|---|
| US-N01 | Sebagai pengguna, saya ingin membuat catatan inspirasi dengan judul, konten, dan gambar. |
| US-N02 | Sebagai pengguna, saya ingin melihat catatan dalam tampilan kartu (*card view*) yang menarik. |
| US-N03 | Sebagai pengguna, saya ingin mencari catatan berdasarkan judul. |

### Reports
| ID | Story |
|---|---|
| US-R01 | Sebagai pengguna, saya ingin melihat ringkasan semua data saya dalam satu halaman. |
| US-R02 | Sebagai pengguna, saya ingin mengekspor checklist saya ke format PDF. |

### Chat
| ID | Story |
|---|---|
| US-C01 | Sebagai pengguna, saya ingin mengirim pesan ke admin untuk berkonsultasi tentang persiapan pernikahan. |
| US-C02 | Sebagai pengguna, saya ingin melihat riwayat percakapan dengan admin. |

### Profile
| ID | Story |
|---|---|
| US-P01 | Sebagai pengguna, saya ingin mengedit profil saya (nama, email, partner, tanggal pernikahan, anggaran). |
| US-P02 | Sebagai pengguna, saya ingin mengganti password. |
| US-P03 | Sebagai pengguna, saya ingin menghapus akun saya jika sudah tidak diperlukan. |

---

## A.2 User Stories — Admin

| ID | Story |
|---|---|
| ADM01 | Sebagai admin, saya ingin melihat daftar semua user beserta statistik ringkasan (task, budget, countdown). |
| ADM02 | Sebagai admin, saya ingin memfilter user berdasarkan nama dan rentang tanggal pernikahan. |
| ADM03 | Sebagai admin, saya ingin melihat *plan* seorang user secara detail (task, budget, notes, chat) dalam tampilan tab. |
| ADM04 | Sebagai admin, saya ingin menambah, mengedit, dan menghapus data user (task, budget, notes) melalui modal di panel kelola. |
| ADM05 | Sebagai admin, saya ingin mengedit data profil user dan menghapus akun user. |
| ADM06 | Sebagai admin, saya ingin menambah, mengedit, dan menghapus vendor di katalog global. |
| ADM07 | Sebagai admin, saya ingin membalas pesan user melalui panel chat. |
| ADM08 | Sebagai admin, saya ingin mengekspor data user ke format CSV dan PDF. |

---

Total: **30 user stories** untuk User + **8 user stories** untuk Admin = **38 user stories**.
