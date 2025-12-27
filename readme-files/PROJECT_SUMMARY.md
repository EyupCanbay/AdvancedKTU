# 📋 Proje Özeti - Hızlı Referans

## Proje Bilgileri

| Bilgi | Değer |
|-------|-------|
| **Proje Adı** | AdvancedKTU - Akıllı Atık Yönetim Sistemi |
| **Repository** | EyupCanbay/AdvancedKTU |
| **Durum** | Aktif Geliştirme 🚀 |
| **Son Güncelleme** | 27 Aralık 2025 |
| **Versiyon** | 1.0.0 |

---

## Mimari Özeti

```
Frontend (React)  →  API Gateway  →  3 Microservices  →  MongoDB
   :5173              Reverse Proxy      :8080, :8081        
                                         :5000
```

### Services

| Service | Port | Teknoloji | Sorumluluk |
|---------|------|-----------|-----------|
| **Auth Service** | 8080 | Go + Echo | Kullanıcı, Token, Roller |
| **Waste Service** | 8081 | Go + Echo | Atık, Analiz, İmpact |
| **AI Service** | 5000 | Node + Express | Gemini API Integration |
| **Frontend** | 5173 | React + Vite | UI/UX |
| **Database** | 27017 | MongoDB | Veri Depolaması |

---

## Teknoloji Stack

### Backend
- **Go** 1.24.2
- **Echo Framework** 4.14.0
- **MongoDB** 6.0
- **JWT** v5.3.0
- **bcrypt** (password hashing)

### Frontend
- **React** 19.2.0
- **TypeScript** 5.9.3
- **Vite** 7.2.4
- **Tailwind CSS** 4.1.18
- **Leaflet** 1.9.4 (maps)

### AI & Vision
- **Google Gemini API** 2.5
- **Google Cloud Vision** 5.3.4
- **Node.js** 18+

### DevOps
- **Docker** & **Docker Compose**
- **MongoDB Atlas** (Cloud)

---

## Temel Özellikler

### 1. 📸 AI-Destekli Atık Analizi
```
Resim → Google Cloud Vision → Gemini API → 18 Metrik
```
- Fully Charging Phones, CO2, Risk Degree, Cost, vb.

### 2. 🗺️ Harita Tabanlı Yönetim
- Leaflet.js ile interaktif harita
- Toplama noktaları gösterimi
- Rota hesaplama (future)

### 3. 👥 Kullanıcı Yönetimi
- Kayıt/Giriş (JWT authentication)
- Profil yönetimi
- Soft delete (veri korunma)

### 4. 🔐 Rol Yönetimi (RBAC)
```
User Role: Temel kullanıcı işlemleri
Admin Role: Kullanıcı ve sistem yönetimi
```

### 5. 📊 Gerçek Zamanlı Etki Analizi
- Toplam CO2 tasarrufu
- Su tasarrufu
- Enerji eşdeğeri
- Dashboard gösterimi

---

## API Endpoints

### Auth Service (/auth)
```
POST   /auth/login              - Giriş
POST   /auth/register           - Kayıt
GET    /swagger/               - Dokumentasyon
```

### Waste Service (/api)
```
POST   /api/upload             - Atık yükle
GET    /api/impact-analysis    - Etki analizi
GET    /api/collection-points  - Toplama noktaları
POST   /api/collection-request - Talep oluştur
```

### Admin Endpoints (/admin)
```
GET    /admin/users            - Tüm kullanıcılar
GET    /admin/users/{id}/roles - Kullanıcı rolleri
PUT    /admin/users/{id}/roles - Rol güncelle
```

---

## Veritabanı Collections

### users
- ID, Email, Password, FirstName, LastName
- Addresses (embedded), Roles, Active, DeletedAt
- CreatedAt, UpdatedAt

### wastes
- ID, UserID, ImagePath, Description, Status
- AIAnalysis (18 metrics), CreatedAt

### collection_points
- ID, Name, Latitude, Longitude, Address

### collection_requests
- ID, UserID, WasteID, CollectionPointID, Status, CreatedAt

---

## Kurulum (Docker)

```bash
# 1. Ortam ayarı
cat > .env << EOF
MONGO_URI=mongodb://admin:password123@mongo:27017
JWT_SECRET=your_secret_key
GEMINI_API_KEY=your_api_key
EOF

# 2. Servisleri başlat
docker-compose up -d

# 3. Kontrol
docker-compose ps
curl http://localhost:8080/swagger/
```

---

## Çalışma Mantığı

### Atık Analiz Akışı (6 Adım)
```
1. Resim Yükleme     (Frontend → Waste Service)
2. Dosya Kaydı       (Disk'e kaydetme)
3. AI İsteği         (Waste Service → AI Service)
4. Gemini Analizi    (Google Gemini API)
5. Sonuç Kaydı       (MongoDB güncelleme)
6. Dashboard Güncelle(Real-time metrics)
```

### Kimlik Doğrulama Akışı
```
1. Login (email, password)
2. Bcrypt Doğrulaması
3. JWT Token Oluşturma
4. Token Dönderme
5. Protected Route Kontrolü (JWTMiddleware)
6. Role Doğrulaması (RequireAdmin)
```

### Rol Tabanlı Erişim
```
User:
├── Kendi profil (oku/yaz)
├── Atık yükle
├── Harita görünüm
└── İmpact dashboard

Admin:
├── Tüm kullanıcılar (CRUD)
├── Roller yönet
├── Admin dashboard
└── Sistem yönetimi
```

---

## Algoritma Özeti

### Risk Degree Hesaplama
```
Risk = (Base_Risk × Weight_Factor × Age_Factor) / 2
Normalize to 1-10 range
```

### CO2 Etki Hesaplama
```
CO2 = (Atık_Türü_Emisyon × Ağırlık) × Recyclability_Factor
Trees_Equivalent = CO2 / 25 kg/year
```

### Impact Metrics
```
Total CO2 Saved = Σ (her waste'in CO2)
Water Saved = Σ (her waste'in su etkisi)
Trees Equivalent = CO2 / 25
Cars Off-Road = CO2 / 4600
```

---

## Otomasyon Düzeyleri

| Seviye | Tanım | Status |
|--------|-------|--------|
| 1️⃣ **Manual** | Tamamen manuel | ❌ |
| 2️⃣ **Assisted** | Admin yardımı | ❌ |
| 3️⃣ **Automated** | Temel otomasyon | ❌ |
| 4️⃣ **Smart** | Akıllı karar | ❌ |
| 5️⃣ **Autonomous** | Tam otomasyon | ✅ |
| 6️⃣ **Intelligent Routing** | ML önerileri | 🔜 |

---

## Security Features

```
✅ JWT Token Authentication
✅ Role-Based Access Control (RBAC)
✅ Bcrypt Password Hashing
✅ Soft Delete (Data Protection)
✅ SQL Injection Prevention
✅ CORS Security
✅ Request Validation
✅ Token Expiration (24h)
✅ Admin-Only Endpoints
```

---

## Dosya Yapısı

```
advancedKtu/
├── README_COMPREHENSIVE.md       (Bu dosya)
├── ARCHITECTURE_DETAILED.md      (Mimari detayları)
├── API_ENDPOINTS.md              (API Referansı)
├── DATABASE_SCHEMA.md            (Veritabanı)
├── RBAC_DOCUMENTATION.md         (Rol Yönetimi)
│
├── authentication-service/       (Go + Echo)
│   ├── cmd/api/main.go
│   ├── internal/
│   │   ├── domain/               (Models)
│   │   ├── service/              (Business Logic)
│   │   ├── repository/           (Data Access)
│   │   ├── handler/              (HTTP)
│   │   └── middleware/           (Auth/RBAC)
│   └── docs/                     (Swagger)
│
├── waste-service/                (Go + Echo)
│   ├── cmd/api/main.go
│   ├── internal/
│   │   ├── domain/
│   │   ├── service/
│   │   ├── repository/
│   │   ├── handler/
│   │   └── middleware/
│   └── uploads/                  (Atık resimleri)
│
├── ai_service/                   (Node + Express)
│   ├── main.js
│   ├── src/
│   │   ├── config/
│   │   ├── services/             (GeminiService)
│   │   ├── routes/
│   │   └── middleware/
│   └── example.env
│
├── frontend/                     (React + TypeScript)
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.tsx
│   │   │   ├── LoginPage.tsx
│   │   │   ├── CentersPage.tsx
│   │   │   └── ImpactDashboard.tsx
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   └── features/
│   │   └── main.tsx
│   └── vite.config.ts
│
└── docker-compose.yml            (Tüm servisleri başlat)
```

---

## Önemli Kaynaklar

| Kaynağı | Link |
|---------|------|
| API Docs | `/swagger/` (Auth Service) |
| Database | MongoDB Atlas Cloud |
| AI API | Google Gemini API v2.5 |
| Maps | Leaflet.js Library |
| Frontend | React 19 + TypeScript |

---

## Geliştirme Checklist

- [x] Authentication Service (JWT + RBAC)
- [x] Waste Service (Upload + Analysis)
- [x] AI Service (Gemini Integration)
- [x] Frontend (React UI)
- [x] Database Schema
- [x] Soft Delete Mekanizması
- [x] Role-Based Access Control
- [x] Real-time Impact Dashboard
- [ ] Unit Tests
- [ ] Integration Tests
- [ ] E2E Tests
- [ ] Performance Optimization
- [ ] Deployment Pipeline
- [ ] Monitoring & Logging

---

## Sorun Giderme

### Port Çakışması
```bash
# Port 8080 başka biri kullanıyorsa
lsof -i :8080
kill -9 <PID>
```

### MongoDB Bağlantı Hatası
```bash
# Mongo çalışıyor mu kontrol et
docker ps | grep mongo

# Logs kontrol et
docker logs ktu_mongo
```

### AI Service Hatası
```bash
# GEMINI_API_KEY ayarlandı mı?
echo $GEMINI_API_KEY

# Logs kontrol et
docker logs ktu_ai_service
```

---

## İletişim & Katkı

**Geliştirici**: Eyüp CANBAY  
**GitHub**: EyupCanbay/AdvancedKTU  

Katkı yapmak için: Fork → Branch → Commit → PR

---

**Versiyon**: 1.0.0  
**Son Güncelleme**: 27 Aralık 2025  
**Status**: ✅ Tamamlandı
