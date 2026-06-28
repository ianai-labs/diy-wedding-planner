# Bab 2 — Desain Sistem

## 2.1 Arsitektur Aplikasi

My Wedding Planner menggunakan arsitektur **monolithic SPA** dengan Inertia.js sebagai jembatan antara backend Laravel dan frontend React. Pola ini dipilih karena menghilangkan kebutuhan REST API terpisah sambil tetap memberikan pengalaman *single-page application* yang responsif (Inertia.js Documentation, 2024).

```
┌──────────────────────────────────────────────────────┐
│                    BROWSER                            │
│  ┌────────────────────────────────────────────────┐  │
│  │           React 19 + Inertia.js                 │  │
│  │  Layouts (2) │ Pages (37) │ Components (12)    │  │
│  │  Tailwind CSS v4 + shadcn/ui + Chart.js        │  │
│  └────────────────────┬───────────────────────────┘  │
│                       │ XHR (JSON)                    │
└───────────────────────┼──────────────────────────────┘
                        │
┌───────────────────────┼──────────────────────────────┐
│               DOCKER (Laravel Sail)                   │
│  ┌────────────────────┴────────────────────────────┐  │
│  │              LARAVEL 13                          │  │
│  │  Routes → Controllers → Form Requests           │  │
│  │  Models (Eloquent ORM) → MySQL 8.4              │  │
│  └─────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────┘
```

**Gambar 2.1** — Arsitektur sistem My Wedding Planner

## 2.2 Diagram Alur Sistem

```mermaid
flowchart TD
    A([User Buka Aplikasi]) --> B{Autentikasi?}
    B -->|Belum| C[Halaman Welcome]
    C --> D[Register]
    C --> E[Login]
    E --> F{Valid?}
    F -->|Ya| G[Dashboard]
    F -->|Tidak| E
    D --> G

    G --> H1[Checklist]
    G --> H2[Budget Tracker]
    G --> H3[Vendor Catalog]
    G --> H4[Notes]
    G --> H5[Chat]
    G --> H6[Reports]
    G --> H7[Profile]

    H1 --> I1[CRUD Task + Sub-tasks]
    H1 --> I2[Update Status via AJAX]

    H2 --> J1[CRUD Transaksi]
    H2 --> J2[Upload Receipt]
    H2 --> J3[Konversi Budget → Task]

    H3 --> K1[Browse + Search + Sort]
    H3 --> K2[Add Vendor ke Budget]

    H4 --> L1[CRUD Catatan + Upload Gambar]
    H5 --> M1[Chat User ↔ Admin]
    H6 --> N1[Ringkasan + Export PDF]
```

**Gambar 2.2** — Diagram alur sistem (flowchart)

## 2.3 Alur Request Lifecycle

```mermaid
sequenceDiagram
    participant B as Browser (React)
    participant I as Inertia.js
    participant L as Laravel Backend
    participant M as Eloquent Model
    participant DB as MySQL

    B->>I: Klik link / submit form
    I->>L: XHR Request (GET/POST/PUT/DELETE)
    L->>L: Route matching → Middleware → Controller
    L->>L: Validasi (Form Request)
    L->>M: Query/Insert/Update/Delete
    M->>DB: SQL
    DB-->>M: Result set
    M-->>L: Model / Collection
    L-->>I: Inertia::render('Page', props)
    I-->>B: JSON → Render React component

    Note over B,DB: Khusus update status task (AJAX)
    B->>L: PATCH /tasks/{id}/status
    L->>DB: UPDATE tasks SET status = ...
    L-->>B: JSON { success: true }
    B->>B: Update UI tanpa reload
```

**Gambar 2.3** — Sequence diagram request lifecycle

## 2.4 Struktur Fitur

```
My Wedding Planner
│
├── 🔐 Authentication (Laravel Breeze — session-based)
│   ├── Register dengan field wedding_date & budget
│   ├── Login + Remember me + Logout
│   └── Forgot/Reset password + Email verification
│
├── 📊 Dashboard
│   ├── Countdown hari pernikahan
│   ├── Ringkasan budget (total / spent / planned / sisa)
│   ├── Pie chart budget per kategori + Doughnut chart status task
│   └── 5 deadline terdekat dengan warning ≤ 7 hari
│
├── ✅ Checklist / Tasks
│   ├── CRUD + sub-tasks (expand/collapse, toggle, inline create)
│   ├── Search + filter (kategori, status) + pagination
│   └── Update status via AJAX tanpa reload
│
├── 💰 Budget Tracker
│   ├── CRUD + upload receipt (max 2MB)
│   ├── Search + filter (kategori, bulan) + pagination
│   └── Konversi budget → checklist + auto sub-task template
│
├── 🏪 Vendor Catalog (global)
│   ├── Browse + search + filter + sort by price
│   ├── Add vendor ke budget (user) | CRUD vendor (admin)
│   └── 120 vendor pre-seeded (6 kategori × 20)
│
├── 📝 Notes
│   ├── CRUD + upload gambar (max 2MB)
│   └── Card view + search + pagination
│
├── 💬 Chat (User ↔ Admin)
│   └── Real-time display dengan auto-scroll
│
├── 📈 Reports
│   └── Ringkasan data + Export PDF checklist
│
├── 👤 Profile
│   └── Edit profil + ganti password + hapus akun
│
└── 🛡️ Admin Panel
    ├── Dashboard admin + monitoring plan user
    ├── Kelola data user (CRUD inline via modal)
    └── Export CSV & PDF + Manajemen vendor global
```

**Gambar 2.4** — Struktur fitur aplikasi

## 2.5 Tech Stack

| Layer | Teknologi | Versi |
|---|---|---|
| Environment | Docker / Laravel Sail | latest |
| Backend | Laravel | 13.x |
| Bahasa Backend | PHP | 8.3+ |
| Database | MySQL | 8.4 |
| Frontend Framework | React | 19.x |
| Frontend Bridge | Inertia.js | 2.x |
| CSS Framework | Tailwind CSS | v4 |
| UI Components | shadcn/ui | latest |
| Charts | Chart.js + react-chartjs-2 | 4.x / 5.x |
| Auth | Laravel Breeze (React + Inertia) | 2.x |
| PDF Export | barryvdh/laravel-dompdf | 3.x |

Pemilihan Laravel sebagai framework didasarkan pada ekosistem yang lengkap (authentication, ORM, migration, validation), sementara Inertia.js dipilih untuk menghindari kompleksitas REST API dan state management terpisah (Stauffer, 2024).
