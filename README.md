# Risk Scoring Application

Aplikasi penilaian risiko dengan React frontend dan Express backend.

## Teknologi

- **Backend**: Node.js, Express.js, Sequelize, PostgreSQL
- **Frontend**: React 19, React Router 7, Vite, Tailwind CSS
- **Authentication**: JWT Bearer Token

## Cara Menjalankan

### 1. Setup Database

Pastikan PostgreSQL sudah terinstall dan berjalan, kemudian buat database:

```bash
createdb risk_scoring_db
```

### 2. Setup Backend

```bash
cd server
npm install
```

Buat file `.env` di folder `server`:

```env
PORT=3000
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=risk_scoring_db
DB_HOST=localhost
DB_DIALECT=postgres
JWT_SECRET=your_jwt_secret_key
```

Jalankan migrations dan seeder:

```bash
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```

Jalankan server:

```bash
node --watch app.js
```

Server berjalan di `http://localhost:3000`

### 3. Setup Frontend

```bash
cd client
npm install
npm run dev
```

Frontend berjalan di `http://localhost:5173`

## Environment Variables

### Backend (.env di folder server)

| Variable | Deskripsi | Contoh |
|----------|-----------|--------|
| `PORT` | Port server backend | `3000` |
| `DB_USERNAME` | Username PostgreSQL | `postgres` |
| `DB_PASSWORD` | Password PostgreSQL | `your_password` |
| `DB_NAME` | Nama database | `risk_scoring_db` |
| `DB_HOST` | Host database | `localhost` |
| `DB_DIALECT` | Dialect database | `postgres` |
| `JWT_SECRET` | Secret key untuk JWT | `your_jwt_secret_key` |

### Frontend

Tidak memerlukan file .env (menggunakan Vite dengan config default)

## Default Login

Setelah menjalankan seeder, gunakan kredensial berikut untuk login:

- **Email**: `admin@gmail.com`
- **Password**: `admin`

## Fitur Utama

- ✅ Multi-step wizard untuk form penilaian
- ✅ Review page sebelum submit
- ✅ Dashboard dengan statistik sidebar
- ✅ Full Indonesian language
- ✅ Authentication dengan JWT
- ✅ CRUD aplikasi pembiayaan
- ✅ Sistem scoring dinamis
H = F × D                           (untuk setiap item)
subtotalInformasi = Σ(H) × B        (per informasi)
totalSummary = Σ(subtotalInformasi) (total semua informasi)
```

**Keterangan:**
- **F** (bobotF) = Skor item (0-100)
- **D** (bobotD) = Bobot group item
- **B** (bobotB) = Bobot informasi
- **H** = Hasil perkalian F × D

## 🚀 Instalasi & Setup

### Prerequisites
- Node.js >= 18.x
- PostgreSQL >= 14.x
- npm atau yarn

### 1. Clone Repository
```bash
git clone <repository-url>
cd Testing-Dev
```

### 2. Setup Backend

```bash
cd server
npm install
```

### 3. Konfigurasi Database

Edit file `server/config/config.json`:

```json
{
  "development": {
    "username": "postgres",
    "password": "your_password",
    "database": "risk_scoring_dev",
    "host": "127.0.0.1",
    "dialect": "postgres"
  }
}
```

### 4. Buat Database

```bash
# Buat database PostgreSQL
createdb risk_scoring_dev

# Atau menggunakan psql
psql -U postgres
CREATE DATABASE risk_scoring_dev;
\q
```

### 5. Jalankan Migration & Seeder

```bash
cd server

# Jalankan migrations
npx sequelize-cli db:migrate

# Jalankan seeders
npx sequelize-cli db:seed:all
```

### 6. Setup Frontend

```bash
cd ../client
npm install
```

## ▶️ Menjalankan Aplikasi

### Terminal 1 - Backend Server
```bash
cd server
npm run dev
```
Server akan berjalan di: `http://localhost:3000`

### Terminal 2 - Frontend Dev Server
```bash
cd client
npm run dev
```
Client akan berjalan di: `http://localhost:5173`



### Environment Variables
Create `.env` file in server:
```env
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://user:password@host:5432/dbname
```

### Start Production Server
```bash
cd server
NODE_ENV=production npm start
```

