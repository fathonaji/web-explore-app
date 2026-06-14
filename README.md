# Windows Explorer Web

Aplikasi sederhana Windows Explorer. Dengan fitur panel kiri menampilkan struktur folder lengkap, lalu panel kanan menampilkan direct subfolder dan file dari folder yang dipilih.

## Tech Stack

- Bun
- Elysia
- Vue 3 Composition API
- PostgreSQL
- Drizzle ORM

Project ini dipisah menjadi dua folder:

```txt
api  -> backend Elysia
web  -> frontend Vue
```

## Fitur

- Menampilkan semua folder saat halaman pertama dibuka
- Folder tree bisa dibuka dan ditutup
- Klik folder untuk melihat direct subfolder dan file
- Search folder dan file
- Seed data untuk demo
- Unit test untuk backend module explorer

## Setup Database

Buat database PostgreSQL:

```sql
CREATE DATABASE windows_explorer;
```

Lalu buat file `.env` di folder `api`:

```bash
cd api
cp .env.example .env
```

Sesuaikan `DATABASE_URL` jika konfigurasi PostgreSQL lokal berbeda.

Jalankan migration dan seed:

```bash
bun run db:migrate
bun run db:seed
```

## Menjalankan Backend

```bash
cd api
bun install
bun run dev
```

Backend berjalan di:

```txt
http://localhost:3000
```

## Menjalankan Frontend

```bash
cd web
bun install
bun run dev
```

Frontend berjalan di:

```txt
http://localhost:5173
```

## API

```txt
GET /api/v1/health
GET /api/v1/folders/tree
GET /api/v1/folders/:folderId/children
GET /api/v1/search?q=keyword
```

## Test

Backend:

```bash
cd api
bun run test
```

Frontend build check:

```bash
cd web
bun run build
```
