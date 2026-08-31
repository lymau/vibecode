# Backend Service (Bun + ElysiaJS + Drizzle + MySQL)

Layanan backend yang dibangun menggunakan runtime **Bun**, framework **ElysiaJS**, **Drizzle ORM**, dan database **MySQL**.

## Struktur Direktori

```
backend/
├── drizzle/              # File migrasi SQL hasil generate Drizzle
├── src/
│   ├── db/
│   │   ├── index.ts      # Koneksi database MySQL dengan Drizzle
│   │   └── schema.ts     # Definisi skema tabel Drizzle
│   ├── index.ts          # Entry point server ElysiaJS
│   └── index.test.ts     # Pengujian endpoint Elysia
├── .env                  # Konfigurasi environment lokal
├── .env.example          # Contoh variabel environment
├── drizzle.config.ts     # Konfigurasi Drizzle Kit
├── package.json          # Dependensi dan script Bun
└── tsconfig.json         # Konfigurasi TypeScript
```

## Cara Menjalankan

### 1. Instalasi Dependensi
```bash
bun install
```

### 2. Konfigurasi Environment
Salin `.env.example` ke `.env` dan sesuaikan URL koneksi database MySQL:
```bash
cp .env.example .env
```

### 3. Database Migration
Generate migrasi skema:
```bash
bun run db:generate
```

Terapkan skema langsung ke database (push):
```bash
bun run db:push
```

Buka Drizzle Studio:
```bash
bun run db:studio
```

### 4. Menjalankan Server
Mode Development (dengan auto-reload):
```bash
bun run dev
```

Mode Production:
```bash
bun run start
```

### 5. Testing
```bash
bun test
```
