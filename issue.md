# Perencanaan Fitur Login dan Session

Dokumen ini berisi spesifikasi dan langkah-langkah implementasi fitur login dan pengelolaan session untuk dikerjakan.

## Spesifikasi Database

Buat tabel `sessions` dengan struktur berikut:
- `id`: `integer` (Auto Increment, Primary Key)
- `token`: `varchar(255)` (Not Null, akan diisi dengan UUID)
- `user_id`: `integer` (Foreign Key, merujuk ke tabel `users`)
- `created_at`: `timestamp` (Default: `current_timestamp`)

## Spesifikasi API

Buat endpoint API login menggunakan ElysiaJS:

**Endpoint:** `POST /api/users/login`

**Request Body:**
```json
{
    "email": "billy@localhost",
    "password": "michelle"
}
```

**Response Sukses:**
```json
{
    "data": "token_uuid_disini"
}
```

**Response Error (Email/Password salah):**
```json
{
    "error": "Email atau password salah"
}
```

## Struktur File dan Folder

Kode harus diletakkan di dalam folder `src` dengan pengelompokan sebagai berikut:
- **`routes/`**: Untuk menyimpan file routing ElysiaJS.
  - Format penamaan: `[nama]-route.ts` (contoh: `users-route.ts`).
- **`services/`**: Untuk menyimpan logika bisnis aplikasi.
  - Format penamaan: `[nama]-service.ts` (contoh: `users-service.ts`).

## Langkah-langkah Implementasi

1. **Buat Skema Database & Migrasi:**
   - Definisikan skema tabel `sessions` pada file konfigurasi ORM (seperti Drizzle).
   - Pastikan tipe data dan relasi (Foreign Key) `user_id` ke tabel `users` sudah benar.
   - Buat dan jalankan migrasi database agar tabel `sessions` berhasil dibuat.

2. **Buat Service Login (`src/services/users-service.ts`):**
   - Buat fungsi/metode (misal: `loginUser(payload)`) yang menerima data email dan password.
   - Cari data user di database berdasarkan `email`.
   - Jika user tidak ditemukan, lemparkan error (misal: "Email atau password salah").
   - Jika user ditemukan, verifikasi kesesuaian `password` yang dikirim dengan password yang ada di database.
   - Jika password tidak cocok, lemparkan error "Email atau password salah".
   - Jika password cocok, *generate* `token` baru (misalnya menggunakan UUID).
   - Simpan data session baru (berisi `user_id` dan `token`) ke dalam tabel `sessions`.
   - Kembalikan `token` tersebut.

3. **Buat Route Login (`src/routes/users-route.ts`):**
   - Inisialisasi plugin/route ElysiaJS untuk menangani request `POST /api/users/login`.
   - Tambahkan validasi skema Request Body (menggunakan TypeBox / `t` bawaan Elysia) agar harus memuat `email` dan `password`.
   - Di dalam fungsi *handler*, ekstrak `email` dan `password` dari body, lalu panggil fungsi dari `users-service.ts`.
   - Gunakan blok *try/catch* atau mekanisme error handling bawaan framework. Jika terjadi kesalahan validasi/autentikasi, kembalikan status `400` atau `401` dengan pesan `{"error": "Email atau password salah"}`.
   - Jika proses berhasil, kembalikan format respons `{"data": "<token>"}`.

4. **Daftarkan Route di Aplikasi Utama:**
   - Buka entry point aplikasi backend (misal `src/index.ts`).
   - Impor router dari `users-route.ts` dan daftarkan ke instance utama ElysiaJS (menggunakan `.use()`).

5. **Pengujian (Testing):**
   - Jalankan development server.
   - Lakukan uji coba hit ke endpoint login (melalui cURL, Postman, atau REST Client) menggunakan skenario sukses maupun gagal untuk memastikan respons sudah sesuai dengan spesifikasi.