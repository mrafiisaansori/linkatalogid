# LINK KATALOG

LINK KATALOG adalah aplikasi katalog personal untuk seller, UMKM, freelancer, dan bisnis kecil. User bisa membuat halaman katalog publik dalam satu link, menampilkan produk atau jasa, lalu menerima order langsung lewat WhatsApp.

## Stack

- Frontend: Next.js 15, React 18, Tailwind CSS, TypeScript
- Backend data: PHP 8.2+ REST API
- Database production: MySQL
- Session/auth frontend: JWT cookie via `jose`

## Arsitektur

- UI tetap berjalan di Next.js.
- Semua transaksi data frontend diarahkan ke route `/api/*` di Next.js.
- Route tersebut menjadi proxy server-side ke backend PHP di `https://linkatalog.raftechsolution.web.id`.
- Backend PHP memakai Basic Auth untuk komunikasi dari frontend server ke backend.

## Route utama

- `/` landing page
- `/auth` autentikasi seller
- `/dashboard` dashboard seller
- `/dashboard/products` kelola produk
- `/dashboard/profile` edit profil
- `/{username}` katalog publik
- `/be-admin` login admin
- `/be-admin/dashboard` panel admin

## Setup lokal frontend

1. Install dependency:

```bash
npm install
```

2. Siapkan environment:

```bash
copy .env.example .env
```

3. Jalankan app:

```bash
npm run dev
```

4. Buka:

```text
http://localhost:3000
```

## Environment variable

Lihat `.env.example`:

```env
BACKEND_URL="https://linkatalog.raftechsolution.web.id"
BACKEND_AUTH_USER="your-backend-basic-auth-user"
BACKEND_AUTH_PASS="your-backend-basic-auth-password"
LINKATALOG_SESSION_SECRET="secret-random-panjang"
```

## Backend PHP

Folder `backend/` disiapkan untuk di-upload ke hosting terpisah dan sengaja tidak di-push ke git. Panduan deploy ada di [DEPLOY_VERCEL.md](/D:/Project/linkatalog/DEPLOY_VERCEL.md) dan detail backend ada di `backend/README.md`.
