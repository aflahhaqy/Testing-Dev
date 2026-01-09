# 🎯 Risk Scoring System

Aplikasi web untuk menghitung skor risiko pembiayaan berdasarkan berbagai kriteria yang dinormalisasi.

## 📋 Deskripsi

Risk Scoring System adalah aplikasi full-stack yang membantu menilai risiko pembiayaan berdasarkan data pemohon. Sistem ini menggunakan bobot hierarkis (B, D, F) untuk menghitung skor risiko akhir dan mengklasifikasikannya menjadi:

- **HIGH RISK** - Score ≤ 55
- **MEDIUM RISK** - Score 56-70  
- **LOW RISK** - Score > 70

## 🏗️ Teknologi

### Backend
- **Node.js** + **Express.js** - REST API Server
- **Sequelize ORM** - Database management
- **PostgreSQL** - Relational database
- **CORS** - Cross-origin resource sharing

### Frontend
- **Vue 3** - Progressive JavaScript framework
- **Vite** - Fast build tool
- **Axios** - HTTP client
- **Composition API** - Modern Vue development

## 📊 Struktur Database

### Tables

1. **Informations** - Kategori utama (6 informasi)
   - `id`, `name`, `bobotB` (bobot kategori 0-1)

2. **GroupItems** - Sub-kategori dalam informasi
   - `id`, `informationId`, `name`, `bobotD` (bobot grup)

3. **Items** - Pilihan item dalam grup
   - `id`, `groupItemId`, `name`, `bobotF` (skor item 0-100)

4. **RiskResults** - Hasil perhitungan
   - `id`, `totalScore`, `riskLevel`, `selections` (JSONB)

### Associations
```
Information (1) ---> (N) GroupItem (1) ---> (N) Item
```

## 🧮 Rumus Perhitungan

```
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

## 📡 API Endpoints

### GET /api/master-data
Mengambil semua data master dengan struktur nested (informations → groupItems → items)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "INFORMASI 1 - Data Pemohon",
      "bobotB": 0.05,
      "groupItems": [
        {
          "id": 1,
          "name": "Umur Pemohon",
          "bobotD": 0.3,
          "items": [
            {
              "id": 1,
              "name": "56-65 Tahun",
              "bobotF": 25
            }
          ]
        }
      ]
    }
  ]
}
```

### POST /api/calculate
Menghitung risk score berdasarkan selections

**Request Body:**
```json
{
  "selections": {
    "1": 3,   // groupItemId: itemId
    "2": 8,
    "3": 12
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "resultId": 1,
    "totalSummary": 68.45,
    "riskLevel": "MEDIUM",
    "perInfoSubtotals": [
      {
        "informationId": 1,
        "informationName": "INFORMASI 1 - Data Pemohon",
        "bobotB": 0.05,
        "subtotal": 45.5,
        "weightedSubtotal": 2.28,
        "groupItems": [
          {
            "groupItemId": 1,
            "groupItemName": "Umur Pemohon",
            "bobotD": 0.3,
            "selectedItemId": 3,
            "selectedItemName": "31-45 Tahun",
            "bobotF": 75,
            "H": 22.5
          }
        ]
      }
    ]
  }
}
```

### GET /api/results
Mengambil semua hasil perhitungan yang pernah disimpan

### GET /api/results/:id
Mengambil hasil perhitungan spesifik berdasarkan ID

## 🎨 Fitur Aplikasi

### Frontend Features
- ✅ Form dinamis dengan radio buttons untuk setiap kategori
- ✅ Progress bar real-time saat mengisi form
- ✅ Validasi input (harus pilih 1 item per group)
- ✅ Perhitungan otomatis saat submit
- ✅ Visualisasi hasil dengan color-coded risk level
- ✅ Breakdown detail perhitungan per informasi
- ✅ Responsive design untuk mobile & desktop
- ✅ Loading states & error handling

### Backend Features
- ✅ RESTful API endpoints
- ✅ Validasi input komprehensif
- ✅ Nested query dengan Sequelize associations
- ✅ Perhitungan matematis akurat
- ✅ Error handling & logging
- ✅ CORS enabled untuk development

## 📁 Struktur Project

```
Testing-Dev/
├── client/                 # Frontend Vue 3
│   ├── src/
│   │   ├── App.vue        # Main component
│   │   ├── main.js        # Entry point
│   │   └── assets/        # Styles & images
│   ├── package.json
│   └── vite.config.js
│
├── server/                 # Backend Node.js
│   ├── controllers/
│   │   └── riskScoringController.js
│   ├── models/
│   │   ├── information.js
│   │   ├── groupitem.js
│   │   ├── item.js
│   │   └── riskresult.js
│   ├── routes/
│   │   └── riskScoring.js
│   ├── migrations/         # Database migrations
│   ├── seeders/            # Database seeders
│   ├── config/
│   │   └── config.json    # DB configuration
│   ├── index.js           # Server entry point
│   └── package.json
│
└── README.md
```

## 🧪 Testing

### Test Backend API
```bash
# Test master data endpoint
curl http://localhost:3000/api/master-data

# Test calculate endpoint
curl -X POST http://localhost:3000/api/calculate \
  -H "Content-Type: application/json" \
  -d '{"selections": {"1": 3, "2": 8}}'
```

### Test Frontend
1. Buka browser: `http://localhost:5173`
2. Pilih 1 item untuk setiap kategori
3. Klik "Hitung Risk Score"
4. Lihat hasil perhitungan dan breakdown detail

## 🔧 Troubleshooting

### Database Connection Error
```bash
# Check PostgreSQL service
sudo service postgresql status

# Restart PostgreSQL
sudo service postgresql restart
```

### Port Already in Use
```bash
# Kill process on port 3000 (backend)
lsof -ti:3000 | xargs kill -9

# Kill process on port 5173 (frontend)
lsof -ti:5173 | xargs kill -9
```

### Migration Errors
```bash
# Reset database
npx sequelize-cli db:migrate:undo:all
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```

## 📝 Data Seeder

Database sudah include sample data untuk 6 kategori informasi:
1. **INFORMASI 1** - Data Pemohon (Umur, Status, Pendidikan, Pekerjaan)
2. **INFORMASI 2** - Tempat Tinggal (Alamat, Kepemilikan, Lama Tinggal)
3. **INFORMASI 3** - Pekerjaan (Kategori Perusahaan, Lama Bekerja, Penghasilan)
4. **INFORMASI 4** - Finansial (Rekening, Saldo, Track Record, SLIK, Kartu Kredit)
5. **INFORMASI 5** - Pembiayaan (Tenor, Debt Service Ratio)
6. **INFORMASI 6** - Agunan (Appraisal, Luas Bangunan, Tujuan, LTV)

Total: **21 Group Items** dan **83 Items**

## 🎯 Validasi Input

Backend akan memvalidasi:
- ✅ Format selections (harus object)
- ✅ Kelengkapan pilihan (harus pilih semua group items)
- ✅ Item ID valid (item ada dalam database)
- ✅ Group item ID valid

Frontend akan memvalidasi:
- ✅ Progress bar menunjukkan kelengkapan
- ✅ Tombol "Hitung" disabled jika belum lengkap
- ✅ Alert jika ada kategori yang belum dipilih

## 🚀 Production Deployment

### Build Frontend
```bash
cd client
npm run build
```

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

## 📄 License

MIT License - Feel free to use for your projects!

## 👨‍💻 Author

Built with ❤️ by Senior Fullstack Engineer

---

**Happy Coding! 🚀**

