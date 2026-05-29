# Deploy Guide - Frontend (Vercel) + Backend (PHP/MySQL)

Arsitektur:

```text
+--------------------------+      HTTPS + Basic Auth      +-------------------------------+
|  Next.js frontend        |  ---------------------->     |  PHP REST API (backend/)      |
|  app.vercel.app          |                              |  linkatalog.raftechsolution   |
|  (Vercel)                |  <--- JSON responses ----    |  .web.id                      |
+--------------------------+                              +-------------------------------+
                                                            |
                                                            v MySQL (raftechs_linkatalog)
```

- Frontend tetap Next.js di Vercel.
- Semua route `/api/*` di frontend menjadi proxy tipis ke backend PHP.
- Cookie session user/admin tetap di-issue oleh Next.js.
- Backend PHP di-host terpisah dan terkoneksi ke MySQL hosting.

## Setup backend

1. Upload isi folder `backend/` ke document root subdomain `linkatalog.raftechsolution.web.id`.
2. Import `backend/schema.sql` ke database `raftechs_linkatalog`.
3. Jika database live sudah ada, jalankan juga `backend/migration-email-verification.sql`.
4. Jalankan `php seed.php` untuk membuat admin awal `admin / Indones!4`.
5. Cek health endpoint:

```bash
curl -u admin:'Indones!4' https://linkatalog.raftechsolution.web.id/health
```

## Setup frontend di Vercel

Set environment variables berikut:

| Key | Value |
| --- | --- |
| `BACKEND_URL` | `https://linkatalog.raftechsolution.web.id` |
| `BACKEND_AUTH_USER` | `admin` |
| `BACKEND_AUTH_PASS` | `Indones!4` |
| `LINKATALOG_SESSION_SECRET` | secret random panjang |

## Verifikasi

1. Buka `/be-admin`, login `admin / Indones!4`.
2. Register seller baru dari `/auth`.
3. Ubah profil dan tambah produk dari dashboard.
4. Buka `/{username}` dan pastikan katalog publik tampil.
5. Cek panel admin: dashboard, users, products, analytics, dan audit log harus sudah membaca data real dari MySQL.
6. Coba registrasi seller baru lalu verifikasi email dengan kode yang dikirim via SMTP.

## Catatan

- Folder `backend/` tetap tidak di-push ke git.
- Frontend tidak lagi bergantung pada Prisma/SQLite untuk transaksi data.
- Backend sekarang membutuhkan konfigurasi SMTP aktif untuk verifikasi email seller.
- Kalau setelah deploy pertama mau lebih aman, ganti password Basic Auth dan password admin database.
