# 🌍 AdvancedKTU - Akıllı Atık Yönetim Sistemi

> Çevreci bir geleceği inşa etmek için AI-destekli atık analiz ve yönetim platformu

**Repository**: [EyupCanbay/AdvancedKTU](https://github.com/EyupCanbay/AdvancedKTU)  
**Status**: Aktif Geliştirme 🚀

---

## 📋 İçindekiler

1. [Proje Özeti](#proje-özeti)
2. [Teknik Yapı](#teknik-yapı)
3. [Sistem Mimarisi](#sistem-mimarisi)
4. [Kurulum ve Çalıştırma](#kurulum-ve-çalıştırma)
5. [API Dokümantasyonu](#api-dokümantasyonu)
6. [Veritabanı Şeması](#veritabanı-şeması)
7. [Çalışma Mantığı](#çalışma-mantığı)
8. [Teknoloji Stack](#teknoloji-stack)

---

## 🎯 Proje Özeti

**AdvancedKTU**, Karadeniz Teknik Üniversitesi tarafından geliştirilen **akıllı atık yönetim sistemidir**.

### Ana Hedefler

✅ **AI-Destekli Atık Analizi** - Google Gemini AI kullanarak atık resimleri analiz et  
✅ **Çevresel Etki Hesaplaması** - Atığın CO₂, su, enerji etkisini ölç  
✅ **Harita Tabanlı Yönetim** - Geri dönüşüm noktalarını harita üzerinde göster  
✅ **Rol Tabanlı Erişim Kontrol** - Admin ve Kullanıcı seviyeleri ile güvenlik  
✅ **Gerçek Zamanlı Dashboard** - Kurumsal etki analiz panosu

### Temel Özellikler

| Özellik | Açıklama | Status |
|---------|----------|--------|
| 📸 Atık Analizi | Resim yükleme ve AI analizi | ✅ Tamamlandı |
| 🗺️ Harita Entegrasyonu | Leaflet.js ile interaktif harita | ✅ Tamamlandı |
| 👥 Kullanıcı Yönetimi | Kayıt, giriş, profil yönetimi | ✅ Tamamlandı |
| 🔐 Rol Yönetimi | Admin/User seviyeleri ve soft delete | ✅ Tamamlandı |
| 📊 Etki Analizi | Gerçek zamanlı çevre etki metrikleri | ✅ Tamamlandı |
| 🔑 JWT Authentication | Token tabanlı güvenlik | ✅ Tamamlandı |

---

## 🏗️ Teknik Yapı

### 4.1 Teknolojik Bileşenler

#### **Kullanılan Yazılım Teknolojileri**

```
┌─────────────────────────────────────────────────────────┐
│                   YAZILIM STACKı                        │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Frontend:                                             │
│  • React 19 + TypeScript (UI Framework)               │
│  • Vite (Build Tool)                                  │
│  • Tailwind CSS v4 (Styling)                          │
│  • Leaflet + React-Leaflet (Harita)                   │
│  • React Router v7 (Navigation)                       │
│                                                         │
│  Backend Services:                                     │
│  • Go 1.24.2 (Authentication & Waste Service)         │
│  • Node.js + Express (AI Service)                     │
│  • Echo Framework (REST API)                          │
│                                                         │
│  Veritabanı:                                          │
│  • MongoDB 6.0 (NoSQL Database)                       │
│                                                         │
│  AI & Görüntü İşleme:                                │
│  • Google Gemini API 2.5 (AI Analysis)               │
│  • Google Cloud Vision API (Image Processing)        │
│                                                         │
│  DevOps & Deployment:                                │
│  • Docker & Docker Compose (Containerization)        │
│  • MongoDB Atlas (Cloud Database)                     │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

#### **Kullanılan Donanımlar**

| Hardware | Özellik | Kullanım |
|----------|---------|----------|
| **Server CPU** | 2+ Core | Microservices hosting |
| **RAM** | 2GB+ | Service ve MongoDB execution |
| **Storage** | 10GB+ | MongoDB ve uploaded images |
| **Network** | High-speed | API communications |
| **Camera/Scanner** | Modern Smartphone | Atık resimleri çekme |

#### **Haberleşme / Veri İşleme Yöntemleri**

```
HABERLEŞME ARKİTEKTÜRÜ
═══════════════════════════════════════════════════════════

1. REST API Haberleşmesi (HTTP/HTTPS)
   ┌─────────────────────────────────────────────────────┐
   │ Client ↔ API Gateway ↔ Microservices ↔ Database    │
   │ • JSON Request/Response                             │
   │ • Bearer Token Authentication (JWT)                 │
   │ • CORS Enabled (Cross-Origin)                       │
   └─────────────────────────────────────────────────────┘

2. Veri İşleme Akışı
   ┌────────────────┐
   │ Atık Resmi     │
   │ Yükleniyor     │
   └────────┬───────┘
            │
   ┌────────▼───────────────────┐
   │ Waste Service              │
   │ • File Storage             │
   │ • Metadata Kayıt           │
   └────────┬───────────────────┘
            │
   ┌────────▼──────────────────────────────┐
   │ AI Service (Gemini)                   │
   │ • Image Analysis                       │
   │ • Metrics Calculation                  │
   │ • Risk Assessment                      │
   └────────┬──────────────────────────────┘
            │
   ┌────────▼───────────────────────────┐
   │ Database Storage                   │
   │ • Analysis Results                  │
   │ • Impact Metrics                    │
   │ • Audit Trail                       │
   └────────────────────────────────────┘

3. Veri Formatları
   • REST: JSON (application/json)
   • Database: BSON (MongoDB Native)
   • Files: JPG/PNG (Image Upload)
```

---

## 🏛️ Sistem Mimarisi

### Microservices Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                            │
│                     (React + TypeScript)                        │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ Home         │  │ Login/Reg    │  │ Waste Submit │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ Map          │  │ Impact Dash  │  │ Admin Panel  │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────┬──────────────────────────────────────┘
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
        ▼                 ▼                 ▼
┌──────────────────┐ ┌──────────────┐ ┌──────────────┐
│  AUTH SERVICE    │ │ WASTE SERVICE│ │ AI SERVICE   │
│  (Port: 8080)    │ │ (Port: 8081) │ │ (Port: 5000) │
│                  │ │              │ │              │
│ Go + Echo + JWT  │ │ Go + Echo    │ │ Node + Expr  │
│                  │ │              │ │ + Gemini API │
│ • Login/Register │ │ • Upload     │ │              │
│ • Token Validation│ │ • Analysis   │ │ • Image Anal │
│ • User CRUD      │ │ • Collection │ │ • Risk Score │
│ • Role Management│ │ • Impact     │ │ • Metrics    │
└──────────┬───────┘ └──────┬───────┘ └──────────────┘
           │                │
           └────────┬───────┘
                    │
        ┌───────────▼────────────┐
        │   SHARED MONGODB       │
        │   Instance             │
        │                        │
        │ Collections:           │
        │ • users               │
        │ • wastes              │
        │ • collection_points   │
        │ • collection_requests │
        │ • impact_analysis     │
        └────────────────────────┘
```

### Layered Architecture (Per Service)

```
AUTHENTICATION SERVICE EXAMPLE
═══════════════════════════════════════════════════

API Layer (Handler)
├── user_handler.go        (Request/Response)
├── auth_handler.go        (Login/Register)
└── middleware/
    ├── jwt_middleware.go  (Token Validation)
    └── auth_middleware.go (Authorization & RBAC)
           │
Service Layer
├── user_service.go        (Business Logic)
├── auth_service.go        (Authentication Logic)
└── Includes:
    • Password Hashing
    • Token Generation
    • Role Management
    • Soft Delete Logic
           │
Repository Layer (Data Access)
├── repository.go          (Database Operations)
└── Implements:
    • CRUD Operations
    • Query Filtering
    • Transaction Management
           │
Domain Layer (Models & Interfaces)
├── user.go               (Domain Models)
├── role.go               (Role Management)
└── Interfaces:
    • Repository Interface
    • Service Interface
```

---

## 🚀 Kurulum ve Çalıştırma

### Ön Gereksinimler

```bash
✓ Docker & Docker Compose (v2.0+)
✓ Go 1.24.2+
✓ Node.js 18+
✓ MongoDB Client (Optional, for CLI access)
✓ Google Cloud Account (Gemini API)
```

### Hızlı Başlangıç (Docker)

#### **1️⃣ Ortam Değişkenlerini Ayarla**

```bash
# Proje dizininde .env dosyası oluştur
cat > .env << EOF
# MongoDB
MONGO_URI=mongodb://admin:password123@mongo:27017
DB_NAME=auth_db

# Authentication Service
AUTH_PORT=8080
JWT_SECRET=your_super_secret_key_change_me

# Waste Service
WASTE_PORT=8081
AI_SERVICE_URL=http://ai-service:5000/risk-degree

# AI Service
AI_PORT=5000
GEMINI_API_KEY=your_gemini_api_key_here
EOF
```

#### **2️⃣ Docker Compose ile Başlat**

```bash
# Tüm servisleri başlat
docker-compose up -d

# Logs'u takip et
docker-compose logs -f

# Sağlık durumunu kontrol et
docker-compose ps
```

#### **3️⃣ Servisleri Doğrula**

```bash
# Auth Service - Health Check
curl http://localhost:8080/swagger/

# Waste Service - Health Check
curl http://localhost:8081/api/impact-analysis

# AI Service - Health Check
curl http://localhost:5000/
```

### Manuel Kurulum (Geliştirme)

#### **Authentication Service**

```bash
cd authentication-service

# Dependencies yükle
go mod download

# Swagger docs oluştur
swag init -g cmd/api/main.go

# Servisi çalıştır
go run cmd/api/main.go
# Output: Server running on port 8080
```

#### **Waste Service**

```bash
cd waste-service

# Dependencies yükle
go mod download

# Servisi çalıştır
go run cmd/api/main.go
# Output: Server running on port 8081
```

#### **AI Service**

```bash
cd ai_service

# Dependencies yükle
npm install

# Environment dosyası oluştur
cp example.env .env
# GEMINI_API_KEY'i .env'de ayarla

# Servisi çalıştır
npm start
# Output: Server running on port 5000
```

#### **Frontend**

```bash
cd frontend

# Dependencies yükle
npm install

# Development sunucusu başlat
npm run dev
# Output: http://localhost:5173
```

---

## 📡 API Dokümantasyonu

### Authentication Service (Port: 8080)

#### **1. Login**

```http
POST /auth/login
Content-Type: application/json

Request:
{
  "email": "admin@example.com",
  "password": "password123"
}

Response 200:
{
  "message": "login successful",
  "token": "eyJhbGc...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "admin@example.com",
    "first_name": "Admin",
    "last_name": "User",
    "roles": ["user", "admin"],
    "active": true
  }
}
```

#### **2. Register**

```http
POST /auth/register
Content-Type: application/json

Request:
{
  "email": "newuser@example.com",
  "password": "password123",
  "first_name": "John",
  "last_name": "Doe",
  "addresses": [
    {
      "title": "Home",
      "city": "Istanbul",
      "district": "Kadikoy",
      "full_address": "Example St. 1"
    }
  ]
}

Response 201:
{
  "message": "registration successful"
}
```

#### **3. Admin - Kullanıcı Rolü Güncelle**

```http
PUT /admin/users/{userId}/roles
Authorization: Bearer {admin_token}
Content-Type: application/json

Request:
{
  "roles": ["user", "admin"]
}

Response 200:
{
  "message": "user roles updated successfully"
}
```

#### **4. Admin - Tüm Kullanıcıları Listele**

```http
GET /admin/users
Authorization: Bearer {admin_token}

Response 200:
[
  {
    "id": "507f1f77bcf86cd799439011",
    "email": "admin@example.com",
    "first_name": "Admin",
    "last_name": "User",
    "roles": ["user", "admin"],
    "active": true,
    "deleted_at": null,
    "created_at": "2025-12-27T10:00:00Z"
  },
  ...
]
```

### Waste Service (Port: 8081)

#### **1. Atık Yükle ve Analiz Et**

```http
POST /api/upload
Authorization: Bearer {token}
Content-Type: multipart/form-data

Request:
- file: @waste_image.jpg
- description: "Electronic waste - old computer"
- user_id: {userId}

Response 201:
{
  "id": "507f1f77bcf86cd799439012",
  "user_id": "507f1f77bcf86cd799439011",
  "image_path": "C:/uploads/1234567890_image.jpg",
  "description": "Electronic waste - old computer",
  "status": "analyzed",
  "ai_analysis": {
    "fullyChargingPhones": 45,
    "CO2Emission": 15.5,
    "riskDegree": 8,
    "cost": 245.50,
    ...
  },
  "created_at": "2025-12-27T11:30:00Z"
}
```

#### **2. Etki Analizi (Gerçek Zamanlı)**

```http
GET /api/impact-analysis
Authorization: Bearer {token}

Response 200:
{
  "totalCO2Saved": 245.5,
  "totalEnergyEquivalent": 156.2,
  "totalWaterSaved": 5000.0,
  "treesEquivalent": 12.3,
  "carsOffRoad": 2.1,
  "phonesCharged": 450,
  "lightHoursTotal": 1200.5,
  "totalWasteProcessed": 87,
  "highRiskWastes": 12,
  "lastUpdated": "2025-12-27T11:45:00Z"
}
```

#### **3. Toplama Noktalarını Getir**

```http
GET /api/collection-points
Authorization: Bearer {token}

Response 200:
[
  {
    "id": "507f1f77bcf86cd799439013",
    "name": "KTÜ Toplama Merkezi",
    "latitude": 40.995,
    "longitude": 39.771,
    "address": "Kanuni Kampüsü, Rize"
  },
  ...
]
```

### AI Service (Port: 5000)

#### **1. Risk Derecesi Hesapla**

```http
POST /risk-degree
Content-Type: application/json

Request:
{
  "image_path": "C:/uploads/1234567890_image.jpg",
  "description": "Electronic waste"
}

Response 200:
{
  "success": true,
  "data": {
    "fullyChargingPhones": 45,
    "lightHours": 120.5,
    "CO2Emission": 15.5,
    "cleanWater": 5000.0,
    "riskDegree": 8,
    "cost": 245.50,
    ...
  }
}
```

---

## 🗄️ Veritabanı Şeması

### MongoDB Collections

#### **1. users Collection**

```javascript
{
  "_id": ObjectId("507f1f77bcf86cd799439011"),
  
  // Authentication
  "email": "admin@example.com",
  "password": "$2a$10$...(bcrypt)",
  
  // Profile
  "first_name": "Admin",
  "last_name": "User",
  
  // Authorization
  "roles": ["user", "admin"],
  
  // Status
  "active": true,
  "deleted_at": null,  // Soft Delete
  
  // Addresses
  "addresses": [
    {
      "title": "Office",
      "city": "Rize",
      "district": "Merkez",
      "full_address": "KTÜ Kampüsü"
    }
  ],
  
  // Timestamps
  "created_at": ISODate("2025-12-27T10:00:00Z"),
  "updated_at": ISODate("2025-12-27T10:30:00Z")
}
```

#### **2. wastes Collection**

```javascript
{
  "_id": ObjectId("507f1f77bcf86cd799439012"),
  "user_id": "507f1f77bcf86cd799439011",
  "image_path": "C:/uploads/1234567890_image.jpg",
  "description": "Electronic waste - old computer",
  
  "status": "analyzed",  // analyzing, analyzed, analysis_failed
  
  // AI Analysis Results
  "ai_analysis": {
    "fullyChargingPhones": 45,
    "lightHours": 120.5,
    "ledLighting": 240.3,
    "drivingCar": 85.5,
    "CO2Emission": 15.5,
    "cleanWater": 5000.0,
    "soilDegradation": 250.0,
    "contaminatingGroundwater": 1000.0,
    "energyConsumptionOfSmallWorkshop": 45.2,
    "lossRareEarthElements": 2.5,
    "microplasticPollutionMarineLife": 150.0,
    "annualCarbonSequestrationCapacityTree": 15,
    "householdElectricityConsumption": 50.0,
    "dailyWaterConsumptionPeople": 2000.0,
    "humanCarbonFootprintOneDay": 5,
    "riskDegree": 8,
    "cost": 245.50
  },
  
  "created_at": ISODate("2025-12-27T11:30:00Z")
}
```

#### **3. collection_points Collection**

```javascript
{
  "_id": ObjectId("507f1f77bcf86cd799439013"),
  "name": "KTÜ Toplama Merkezi",
  "latitude": 40.995,
  "longitude": 39.771,
  "address": "Kanuni Kampüsü, Rize"
}
```

#### **4. collection_requests Collection**

```javascript
{
  "_id": ObjectId("507f1f77bcf86cd799439014"),
  "user_id": "507f1f77bcf86cd799439011",
  "waste_id": ObjectId("507f1f77bcf86cd799439012"),
  "collection_point_id": ObjectId("507f1f77bcf86cd799439013"),
  
  "status": "created",  // created, completed
  
  "created_at": ISODate("2025-12-27T11:45:00Z")
}
```

### Veritabanı İlişkileri

```
users (1) ──────────────┐
                        │
                        (*)── wastes
                        │
                        └──── collection_requests (*)

collection_requests (*)── collection_points
```

---

## 🔄 Çalışma Mantığı

### 4.2 Sistem Adımları

#### **Atık Analiz Akışı (6 Adım)**

```
STEP 1: Atık Resmi Yükleme
════════════════════════════════════
┌─────────────────────────────────────────────────────┐
│ 1. Kullanıcı Waste Submit formuna gider             │
│ 2. Resim seçer ve açıklama ekler                    │
│ 3. POST /api/upload request'i gönderir              │
│ 4. Waste Service resmi alır                         │
│ 5. Disk'e kaydeder (uploads/ klasörü)               │
│ 6. Database'e kayıt oluşturur (status: analyzing)   │
│ 7. Response döner (image_path ile)                  │
└─────────────────────────────────────────────────────┘
          │
          ▼
STEP 2: AI Analizi Başla
════════════════════════════════════
┌─────────────────────────────────────────────────────┐
│ 1. Waste Service AI Service'i çağırır               │
│ 2. POST /risk-degree {image_path, description}      │
│ 3. AI Service dosyayı okur                          │
│ 4. Google Cloud Vision API'yi kullanır              │
│ 5. Görüntü özelliklerini çıkarır                    │
│ 6. Gemini API'ye gönderir                           │
│ 7. Detaylı prompt ile analiz ister                  │
└─────────────────────────────────────────────────────┘
          │
          ▼
STEP 3: Metrikleri Hesapla
════════════════════════════════════
┌─────────────────────────────────────────────────────┐
│ AI şu metrikleri hesaplar:                          │
│                                                     │
│ • Fullycharging Phones: 45 (pil kapasitesi)         │
│ • CO2 Emission: 15.5 kg (karbon ayakizi)            │
│ • Risk Degree: 8/10 (tehlike seviyesi)              │
│ • Cost: $245.50 (ekonomik değer)                    │
│ • Water Impact: 5000 L (su tüketimi)                │
│ • Energy: 120.5 saatlik enerji eşdeğeri             │
│                                                     │
│ Formüller:                                          │
│ • CO2 = atık_türü × ağırlık × emisyon_faktörü       │
│ • Su = bileşenler × su_kullanımı × yoğunluk         │
│ • Enerji = üretim_enerjisi / kullanım_süresi        │
└─────────────────────────────────────────────────────┘
          │
          ▼
STEP 4: Sonuçları Kaydet
════════════════════════════════════
┌─────────────────────────────────────────────────────┐
│ 1. AI response'ı parse eder (JSON)                  │
│ 2. Waste document'i günceller:                      │
│    • status: "analyzed"                             │
│    • ai_analysis: {...metrics...}                   │
│ 3. UpdateAnalysis() çağırır                         │
│ 4. MongoDB'ye kaydeder                              │
│ 5. Impact Analysis günceller                        │
└─────────────────────────────────────────────────────┘
          │
          ▼
STEP 5: Dashboard Güncelle
════════════════════════════════════
┌─────────────────────────────────────────────────────┐
│ 1. Real-time impact analysis hesaplanır:            │
│    • totalCO2Saved += 15.5 kg                       │
│    • totalWaterSaved += 5000 L                      │
│    • totalWasteProcessed += 1                       │
│    • if (riskDegree > 7) highRiskWastes++           │
│                                                     │
│ 2. Etki Ağaç Eşdeğerleri:                           │
│    treesEquivalent = CO2Saved / 25 kg (yıllık)      │
│                                                     │
│ 3. Araba Eşdeğerleri:                               │
│    carsOffRoad = CO2Saved / 4600 kg (yıllık)        │
└─────────────────────────────────────────────────────┘
          │
          ▼
STEP 6: Kullanıcı Yanıtı
════════════════════════════════════
┌─────────────────────────────────────────────────────┐
│ Frontend'e döner:                                   │
│ {                                                   │
│   "success": true,                                  │
│   "waste": {...},                                   │
│   "impact": {                                       │
│     "CO2Saved": 15.5,                               │
│     "WaterSaved": 5000,                             │
│     "RiskLevel": "High"                             │
│   }                                                 │
│ }                                                   │
│                                                     │
│ Kullanıcı Success mesajı görür                      │
│ Impact Dashboard güncellenmiş görünür               │
└─────────────────────────────────────────────────────┘
```

#### **Kimlik Doğrulama Akışı**

```
LOGIN
═════════════════════════════════════════════════════

1. POST /auth/login {email, password}
        │
2. Auth Service email'e göre user bulur
        │
3. Bcrypt ile password doğrular
        │
4. Doğru ise JWT token oluşturur:
   JWT = Header.Payload.Signature
   
   Payload:
   {
     "sub": "user_id",
     "email": "user@example.com",
     "roles": ["user", "admin"],
     "exp": 1735123200
   }
        │
5. Response döner:
   {
     "token": "eyJhbG...",
     "user": {...}
   }
        │
6. Frontend token'ı localStorage'a kaydeder


PROTECTED ROUTE ACCESS
═════════════════════════════════════════════════════

1. GET /api/upload (Bearer token ile)
   
   Header: Authorization: Bearer eyJhbG...
        │
2. JWT Middleware:
   • Bearer token'ı çıkarır
   • Secret key'i valideler
   • Signature doğrular
   • Expiration kontrol eder
        │
3. Doğru ise:
   • Token'ı context'e kaydeder
   • Next handler'ı çağırır
        │
4. Yanlış ise:
   • 401 Unauthorized dönderir


ADMIN OPERATIONS
═════════════════════════════════════════════════════

1. GET /admin/users (admin token ile)
        │
2. JWT Middleware (yukarıdaki gibi)
        │
3. RequireAdmin() Middleware:
   • Token'dan roles çıkarır
   • "admin" role'ü kontrol eder
        │
4. Yetkiliyse:
   • GetAll() servisi çağırır
   • Soft delete kontrol edilir
   • Response döner
        │
5. Yetkisizse:
   • 403 Forbidden dönderir
```

### Algoritma ve Karar Yapısı

#### **AI Analiz Algoritması**

```python
# Pseudo-code: Risk Degree Hesaplama

function calculateRiskDegree(wasteType, weight, material, age):
    
    # Adım 1: Hazır Materyaller Tablosu
    material_risk_factors = {
        "electronic": 9.5,
        "battery": 8.5,
        "plastic": 6.0,
        "metal": 4.0,
        "glass": 2.0,
        "organic": 1.0
    }
    
    base_risk = material_risk_factors[material]
    
    # Adım 2: Ağırlık Faktörü (3x10 = 30kg)
    weight_multiplier = min(weight / 10, 2.0)  # Max 2x
    
    # Adım 3: Yaş Faktörü (eski = daha tehlikeli)
    age_factor = 1.0 + (age / 50)  # Linear increase
    
    # Adım 4: Toplam Risk Puanı
    risk_score = (base_risk * weight_multiplier * age_factor) / 2
    
    # Adım 5: 1-10 Aralığına Normalizasyon
    final_risk = min(max(risk_score, 1), 10)
    
    return round(final_risk, 1)


# Örnek:
calculateRiskDegree("electronic", 3, "electronic", 10)
= (9.5 * (3/10 * 2) * 1.2) / 2
= (9.5 * 0.6 * 1.2) / 2
= 6.84
→ Risk: 7/10
```

#### **Etki Analizi Algoritması**

```python
# Pseudo-code: CO2 Etki Hesaplama

function calculateCO2Impact(wasteType, weight, analysisResult):
    
    # Adım 1: Atık Türü Bazlı Emisyon
    emission_factors = {
        "electronic": 85.0,      # kg CO2 / kg waste
        "plastic": 5.5,
        "metal": 8.0,
        "battery": 45.0
    }
    
    base_emissions = emission_factors[wasteType] * weight
    
    # Adım 2: AI Verilerinden Ayarla
    if analysisResult.battery_capacity > 0:
        base_emissions *= 1.3  # Bataryalı cihazlar daha riskli
    
    if analysisResult.rare_earth_content > 0:
        base_emissions *= 1.5  # Nadir toprak elementleri
    
    # Adım 3: Geri Dönüştürülebilirlik Faktörü
    recyclability_factor = 1.0 - (recyclability_rate / 100) * 0.7
    
    final_co2 = base_emissions * recyclability_factor
    
    return round(final_co2, 2)


# Ağaç Eşdeğeri Hesaplama
trees_equivalent = co2_saved / 25  # 1 ağaç = 25 kg CO2/yıl
```

### Otomasyon Düzeyi

```
OTOMASYONUN SEVİYELERİ
═════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────┐
│ Seviye 5: TAM OTOMASİON (Yapılanlar)               │
├─────────────────────────────────────────────────────┤
│                                                     │
│ ✅ Resim Yükleme:                                  │
│    • Otomatik file storage                         │
│    • Automatic metadata extraction                 │
│    • Database record creation                      │
│                                                     │
│ ✅ AI Analizi:                                     │
│    • Automatic Gemini API call                     │
│    • JSON parsing otomatik                         │
│    • Database update otomatik                      │
│                                                     │
│ ✅ Impact Calculation:                             │
│    • Real-time metric aggregation                  │
│    • Automatic dashboard update                    │
│    • Zero manual intervention                      │
│                                                     │
│ ✅ Authentication:                                 │
│    • Automatic JWT generation                      │
│    • Token validation otomatik                     │
│    • Role-based access kontrolü                    │
│                                                     │
│ ✅ Soft Delete:                                    │
│    • Automatic deleted_at timestamp                │
│    • Automatic data filtering                      │
│                                                     │
│ ✅ Error Handling:                                 │
│    • Automatic retry logic                         │
│    • Graceful fallback                             │
│    • Structured error responses                    │
│                                                     │
└─────────────────────────────────────────────────────┘

GÖZLÜKTEN SONRAKI ADIMLAR
═════════════════════════════════════════════════════

[ ] Seviye 6: Intelligent Routing
    • Atık türüne göre otomatik collection point seçimi
    • Machine learning based recommendations

[ ] Seviye 7: Self-Healing
    • Hata durumunda otomatik recovery
    • Automatic rollback

[ ] Seviye 8: Predictive Analytics
    • Atık miktarı tahmini
    • Trend analizi
```

---

## 💻 Teknoloji Stack

### Backend

| Technology | Version | Kullanım |
|------------|---------|----------|
| **Go** | 1.24.2 | Microservices (Auth, Waste) |
| **Echo** | v4.14.0 | REST API Framework |
| **MongoDB** | 6.0 | Primary Database |
| **JWT** | v5.3.0 | Token Authentication |
| **bcrypt** | - | Password Hashing |
| **Swagger** | v1.16.6 | API Documentation |

### Frontend

| Technology | Version | Kullanım |
|------------|---------|----------|
| **React** | 19.2.0 | UI Framework |
| **TypeScript** | ~5.9.3 | Type Safety |
| **Vite** | 7.2.4 | Build Tool |
| **React Router** | v7.11.0 | Navigation |
| **Tailwind CSS** | v4.1.18 | Styling |
| **Leaflet** | 1.9.4 | Map Library |
| **React-Leaflet** | 5.0.0 | React Binding |

### AI & Vision

| Technology | Version | Kullanım |
|------------|---------|----------|
| **Google Gemini API** | 2.5 | Text Analysis |
| **Google Vision API** | 5.3.4 | Image Processing |
| **Node.js** | 18+ | AI Service Host |
| **Express** | 5.2.1 | REST API |

### DevOps

| Technology | Versiyon | Kullanım |
|------------|---------|----------|
| **Docker** | 24+ | Containerization |
| **Docker Compose** | 2.0+ | Orchestration |
| **MongoDB Atlas** | - | Cloud Database |

---

## 📚 Ek Dokümantasyon

- [API Endpoints](./API_ENDPOINTS.md) - Detaylı API referansı
- [Database Schema](./DATABASE_SCHEMA.md) - Veritabanı tasarımı
- [RBAC Documentation](./authentication-service/RBAC_DOCUMENTATION.md) - Rol yönetimi
- [Implementation Summary](./IMPLEMENTATION_SUMMARY.md) - Geliştirme özeti

---

## 🤝 Katkıda Bulunma

Bu proje geliştirilmeye açıktır. Katkı sağlamak için:

```bash
# 1. Fork et
# 2. Feature branch oluştur
git checkout -b feature/your-feature

# 3. Commit et
git commit -m 'feat: Add your feature'

# 4. Push et
git push origin feature/your-feature

# 5. Pull Request oluştur
```

---

## 📄 Lisans

Bu proje MIT Lisansı altında lisanslanmıştır.

---

## 📧 İletişim

**Geliştirici**: Eyüp CANBAY  
**Repository**: [EyupCanbay/AdvancedKTU](https://github.com/EyupCanbay/AdvancedKTU)

---

**Son Güncelleme**: 27 Aralık 2025  
**Versiyon**: 1.0.0  
**Durum**: Aktif Geliştirme 🚀
