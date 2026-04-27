# LINK KATALOG

LINK KATALOG adalah web app katalog jualan personal untuk seller, UMKM, freelancer, dan pemilik bisnis kecil. User bisa membuat halaman katalog publik dalam satu link, menampilkan produk atau jasa, lalu menerima order langsung melalui WhatsApp.

Project ini dibangun sebagai aplikasi demo yang terasa seperti produk startup sungguhan: cepat, mobile-first, modern, dan siap dipresentasikan.

## Highlight

- Landing page modern dengan preview katalog versi mobile
- Sign up dan sign in dengan alur sederhana
- Dashboard user untuk mengelola profil dan katalog
- CRUD produk/jasa dengan badge, kategori, dan status aktif
- Public catalog page dengan search, filter kategori, dan CTA WhatsApp
- Light mode dan dark mode dengan preferensi yang tersimpan
- Admin panel private di `/be-admin`
- Tracking analytics untuk page view, product view, dan WhatsApp click
- Audit log untuk aksi admin penting

## Tech Stack

- Next.js 15
- React 18
- Tailwind CSS
- TypeScript
- Prisma ORM
- SQLite
- bcrypt
- jose

## Route Utama

- `/` Landing page
- `/auth` Autentikasi user
- `/dashboard` Dashboard user
- `/dashboard/products` Kelola produk dan jasa
- `/dashboard/profile` Edit profil publik
- `/{username}` Halaman katalog publik
- `/be-admin` Admin login
- `/be-admin/dashboard` Admin dashboard

## Fitur User

- Membuat akun dan memilih link katalog sendiri
- Mengedit nama, bio, foto profil, WhatsApp, lokasi, dan aksen tema
- Menambah, mengubah, dan menonaktifkan produk atau jasa
- Membagikan satu link katalog publik
- Menerima order langsung lewat WhatsApp dengan pesan otomatis
- Melihat ringkasan statistik dasar di dashboard

## Fitur Admin

- Login admin terpisah dari user publik
- Dashboard monitoring platform
- Manajemen user dan status akun
- Monitoring produk, katalog, dan event analytics
- Audit log untuk login, logout, view detail user, dan perubahan status user

## Setup Lokal

1. Install dependency:

```bash
npm install
```

2. Siapkan environment file:

```bash
copy .env.example .env
```

3. Buat schema database SQLite:

```bash
npm run db:push
```

4. Isi data demo:

```bash
npm run db:seed
```

5. Jalankan project:

```bash
npm run dev
```

6. Buka di browser:

```text
http://localhost:3000
```

## Script

```bash
npm run dev
npm run build
npm run start
npm run db:push
npm run db:seed
npm run prisma:generate
```

## Environment Variable

Contoh variabel ada di [.env.example](./.env.example):

```env
DATABASE_URL="file:./dev.db"
LINKATALOG_SESSION_SECRET="ganti-dengan-secret-random-yang-panjang"
```

## Data Demo

Project ini sudah disiapkan dengan sample data agar langsung terlihat penuh saat dijalankan:

- 1 akun seller demo
- 4 produk/jasa demo
- event analytics dummy
- admin user untuk local development melalui proses seed

Catatan:

- SQLite dipakai untuk local/demo environment
- Untuk deployment production dengan data write yang aktif, sebaiknya pindah ke database server seperti PostgreSQL
- Ganti secret session dan kredensial seed sebelum dipakai di environment publik

## Build

Project ini memakai pemisahan output build agar proses `dev` dan `build` tidak saling bentrok:

- development output: `.next-dev`
- production build output: `.next-build`

Jadi build lokal cukup dijalankan dengan:

```bash
npm run build
```

## Status Project

Saat ini project sudah layak untuk:

- demo produk
- presentasi client
- portfolio
- push ke GitHub

Untuk production internet-facing, area yang tetap perlu perhatian adalah database persistence, secret management, dan hardening deployment environment.

## Author

Project ini dibuat dan dikembangkan oleh **mrafiisaansori**.
