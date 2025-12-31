# 🌱 AdvancedKTU - Akıllı Atık Yönetim Sistemi

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Go](https://img.shields.io/badge/Go-1.24.2-00ADD8?logo=go)
![React](https://img.shields.io/badge/React-19.2.0-61DAFB?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-6.0-47A248?logo=mongodb)

**AI Destekli, Mikro Servis Mimarisine Sahip Modern Atık Yönetim Platformu**

[🚀 Hızlı Başlangıç](#-hızlı-başlangıç) •
[📖 Dokümantasyon](#-dokümantasyon) •
[🏗️ Mimari](#-mimari-yapı) •
[💻 Teknolojiler](#-teknoloji-stack) •
[🤝 Katkıda Bulunma](#-katkıda-bulunma)

</div>

---

## 📋 İçindekiler

- [Genel Bakış](#-genel-bakış)
- [Özellikler](#-temel-özellikler)
- [Mimari Yapı](#-mimari-yapı)
- [Teknoloji Stack](#-teknoloji-stack)
- [Hızlı Başlangıç](#-hızlı-başlangıç)
- [Servisler](#-servisler)
- [API Dokümantasyonu](#-api-dokümantasyonu)
- [Deployment](#-deployment)
- [Geliştirme](#-geliştirme)
- [Katkıda Bulunma](#-katkıda-bulunma)
- [Lisans](#-lisans)

---

## 🎯 Genel Bakış

**AdvancedKTU**, modern mikro servis mimarisi ve yapay zeka teknolojilerini kullanarak atık yönetimini dijitalleştiren, çevre dostu bir platformdur. Kullanıcılar atık toplama noktalarını harita üzerinde görüntüleyebilir, atık fotoğraflarını AI ile analiz edebilir ve çevre üzerindeki etkilerini anlık olarak takip edebilirler.

### 🌟 Ana Hedefler

- 🔬 **AI Destekli Analiz**: Google Gemini ve Cloud Vision API ile atık sınıflandırma
- 🗺️ **Coğrafi Görselleştirme**: Leaflet.js ile interaktif harita yönetimi
- 📊 **Etki Analizi**: CO2, su ve enerji tasarrufu hesaplamaları
- 🔐 **Güvenli Erişim**: JWT tabanlı kimlik doğrulama ve rol yönetimi
- ⚡ **Yüksek Performans**: Go ile yazılmış mikro servisler
- 🎨 **Modern UI/UX**: React 19 + TypeScript + Tailwind CSS

---

## ✨ Temel Özellikler

### 🤖 1. AI Destekli Atık Analizi

```
📸 Fotoğraf Yükleme → 👁️ Cloud Vision API → 🧠 Gemini API → 📈 18 Farklı Metrik
```

**Hesaplanan Metrikler:**
- Fully Charging Phones (kaç telefon şarj edilebilir)
- CO2 Emission (kg CO2 salımı)
- Water Saved (litre su tasarrufu)
- Energy Saved (kWh enerji tasarrufu)
- Risk Degree (0-100 risk skoru)
- Cost Estimation (maliyet tahmini)
- Trees Planted Equivalent (kaç ağaç dikme eşdeğeri)
- Ve daha fazlası...

### 🗺️ 2. Harita Tabanlı Atık Toplama Noktaları

- **Interaktif Harita**: Leaflet.js ile gerçek zamanlı konum görüntüleme
- **En Yakın Merkez**: Kullanıcı konumuna göre otomatik öneriler
- **Detaylı Bilgi**: Her merkez için adres, tür ve iletişim bilgileri
- **Marker Grupları**: Farklı atık türleri için renkli işaretçiler

### 👥 3. Kullanıcı ve Rol Yönetimi

**Kullanıcı Tipleri:**
```
🧑 User Role
├── Atık kayıtları oluşturma/güncelleme
├── Harita görüntüleme
├── Impact Dashboard erişimi
└── Profil yönetimi

👨‍💼 Admin Role
├── Tüm User yetenekleri
├── Kullanıcı yönetimi (CRUD)
├── Rol atama/değiştirme
└── Sistem genelinde raporlama
```

**Güvenlik Özellikleri:**
- JWT token authentication (24 saat geçerlilik)
- bcrypt password hashing
- Role-based access control (RBAC)
- Soft delete (veri korunması)
- Token validation middleware

### 📊 4. Gerçek Zamanlı Etki Dashboard'u

```javascript
{
  "total_co2_saved": "1,245.5 kg",
  "total_water_saved": "3,890 L",
  "total_energy_saved": "567 kWh",
  "trees_equivalent": "12 ağaç",
  "waste_records": 156,
  "impact_score": 87
}
```

### 💬 5. AI Chatbot (CarboBot)

- Ollama AI ile doğal dil işleme
- Atık yönetimi danışmanlığı
- Gerçek zamanlı soru-cevap
- Konuşma geçmişi yönetimi

---

## 🏗️ Mimari Yapı

### Sistem Diyagramı

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT LAYER                             │
│              React 19 + TypeScript + Tailwind               │
│                                                              │
│  📄 Pages: Home, Login, Register, Centers, Dashboard        │
│  🧩 Components: Map, Modal, Sidebar, Charts                 │
│  🔌 Services: API Client (Axios)                            │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   │ HTTP/REST
                   ▼
┌─────────────────────────────────────────────────────────────┐
│                   API GATEWAY (NGINX)                       │
│                    Reverse Proxy                            │
└─────┬──────────────┬───────────────┬────────────────────────┘
      │              │               │
      ▼              ▼               ▼
┌──────────┐  ┌──────────┐   ┌──────────────┐
│   Auth   │  │  Waste   │   │  AI Service  │
│ Service  │  │ Service  │   │              │
│          │  │          │   │  ┌─────────┐ │
│  :8080   │  │  :8081   │   │  │ Gemini  │ │
│          │  │          │   │  │   API   │ │
│  Go 1.24 │  │ Go 1.24  │   │  └─────────┘ │
│  + Echo  │  │ + Echo   │   │  :5000       │
│          │  │          │   │  Node.js     │
└────┬─────┘  └────┬─────┘   └──────────────┘
     │             │
     └─────────────┴──────────────┐
                                  │
                          ┌───────▼────────┐
                          │   MongoDB 6.0  │
                          │                │
                          │  • auth_db     │
                          │  • waste_db    │
                          └────────────────┘
```

### Mikro Servis İletişimi

```
┌──────────────┐
│   Frontend   │
└──────┬───────┘
       │
       │ 1. Login Request
       ▼
┌──────────────┐
│ Auth Service │ ──────→ JWT Token
└──────┬───────┘
       │
       │ 2. Waste Submission (with token)
       ▼
┌──────────────┐      3. Image Analysis
│Waste Service │ ──────────────────────→ ┌────────────┐
└──────┬───────┘                         │ AI Service │
       │                                 └────────────┘
       │                                       │
       │                4. Analysis Results    │
       │ ←────────────────────────────────────┘
       │
       ▼
    MongoDB
```

---

## 💻 Teknoloji Stack

### Backend

<table>
<tr>
<td width="50%">

**🔵 Go Services**
```yaml
Language: Go 1.24.2
Framework: Echo v4.14.0
Database Driver: mongo-driver v1.17.6
Auth: JWT v5.3.0
Crypto: bcrypt
Documentation: Swagger/OpenAPI
```

**Servisler:**
- Authentication Service (Port: 8080)
- Waste Service (Port: 8081)

</td>
<td width="50%">

**🟢 Node.js Services**
```yaml
Runtime: Node.js 18+
Framework: Express 5.2.1
AI: @google/generative-ai v0.24.1
Vision: @google-cloud/vision v5.3.4
HTTP Client: axios v1.13.2
```

**Servisler:**
- AI Service (Port: 5000)
- ChatBot Service (Port: 8083)

</td>
</tr>
</table>

### Frontend

```yaml
Framework: React 19.2.0
Language: TypeScript 5.9.3
Build Tool: Vite 7.2.4
Styling: Tailwind CSS 4.1.18
Animation: Framer Motion 12.23.26
Maps: Leaflet 1.9.4 + React-Leaflet 5.0.0
Routing: React Router DOM 7.11.0
```

### Database

```yaml
Database: MongoDB 6.0
Type: NoSQL Document Store
Collections:
  - users (authentication, profiles)
  - waste_records (submissions, analysis)
  - collection_centers (locations, info)
```

### DevOps & Infrastructure

```yaml
Containerization: Docker & Docker Compose
Orchestration: Kubernetes (K8s manifests)
Monitoring: Prometheus + Grafana
CI/CD: GitHub Actions
Cloud: MongoDB Atlas
Package Management: Go Modules, npm
```

---

## 🚀 Hızlı Başlangıç

### Gereksinimler

```bash
# Node.js
node --version  # v18+ gerekli

# Go
go version      # 1.24+ gerekli

# Docker
docker --version
docker-compose --version

# MongoDB (opsiyonel, Docker kullanırsanız)
mongod --version
```

### 1. Repository'yi Klonlayın

```bash
git clone https://github.com/yourusername/AdvancedKTU.git
cd AdvancedKTU
```

### 2. Environment Dosyalarını Hazırlayın

```bash
# AI Service
cp ai_service/example.env ai_service/.env

# AI Service .env düzenle
GEMINI_API_KEY=your_gemini_api_key_here
PORT=5000
```

### 3. Docker Compose ile Başlatın

```bash
# Tüm servisleri başlat
docker-compose up -d

# Logları takip et
docker-compose logs -f

# Durum kontrol
docker-compose ps
```

### 4. Servislere Erişim

| Servis | URL | Açıklama |
|--------|-----|----------|
| **Frontend** | http://localhost | Ana uygulama |
| **Admin Panel** | http://localhost:3001 | Yönetim paneli |
| **Auth API** | http://localhost:8080 | Authentication API |
| **Waste API** | http://localhost:8081 | Waste Management API |
| **AI Service** | http://localhost:3000 | AI Analysis API |
| **ChatBot** | http://localhost:8083 | ChatBot API |
| **Swagger UI** | http://localhost:8080/swagger/ | API Dokümantasyonu |
| **MongoDB** | localhost:27017 | Database |

### 5. İlk Kullanıcı Oluşturma

```bash
# Admin kullanıcısı oluştur
curl -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password123",
    "first_name": "Admin",
    "last_name": "User",
    "role": "admin"
  }'

# Login ol
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password123"
  }'
```

---

## 🔧 Servisler

### 1. Authentication Service (Go)

**Sorumluluklar:**
- Kullanıcı kayıt ve giriş
- JWT token yönetimi
- Kullanıcı CRUD operasyonları
- Rol yönetimi (Admin/User)
- Soft delete

**Teknolojiler:**
- Go 1.24 + Echo Framework
- MongoDB + mongo-driver
- JWT (golang-jwt/jwt/v5)
- bcrypt (password hashing)
- Swagger (API docs)

**Endpoints:**
```
POST   /auth/register      - Kullanıcı kaydı
POST   /auth/login         - Giriş yap
GET    /auth/validate      - Token doğrulama
GET    /users              - Kullanıcı listesi
GET    /users/:id          - Kullanıcı detayı
PUT    /users/:id          - Kullanıcı güncelleme
DELETE /users/:id          - Kullanıcı silme (soft)
PUT    /admin/users/:id/roles - Rol güncelleme
GET    /swagger/*          - API Dokümantasyonu
```

### 2. Waste Service (Go)

**Sorumluluklar:**
- Atık kayıtları yönetimi
- Fotoğraf upload işlemleri
- AI servisi ile entegrasyon
- İstatistik ve raporlama
- Toplama merkezi yönetimi

**Teknolojiler:**
- Go 1.24 + Echo Framework
- MongoDB + mongo-driver
- JWT middleware
- Multipart form handling

**Endpoints:**
```
POST   /api/waste/records        - Atık kaydı oluştur
GET    /api/waste/records        - Tüm kayıtlar
GET    /api/waste/records/:id    - Kayıt detayı
PUT    /api/waste/records/:id    - Kayıt güncelleme
DELETE /api/waste/records/:id    - Kayıt silme
GET    /api/waste/stats          - İstatistikler
GET    /api/waste/my-impact      - Kullanıcı etkisi
GET    /api/waste/centers        - Toplama merkezleri
GET    /api/waste/centers/nearest - En yakın merkez
POST   /api/waste/upload         - Fotoğraf yükleme
```

### 3. AI Service (Node.js)

**Sorumluluklar:**
- Google Cloud Vision API entegrasyonu
- Google Gemini API entegrasyonu
- Atık türü sınıflandırma
- 18 farklı metrik hesaplama
- Risk analizi

**Teknolojiler:**
- Node.js + Express
- Google Generative AI (Gemini)
- Google Cloud Vision API
- Axios (HTTP client)

**Analiz Metrikleri:**
```javascript
{
  "fullychargingphones": number,
  "co2emission": number,
  "watersaved": number,
  "energysaved": number,
  "riskdegree": number,
  "costestimation": number,
  "treesplantedequivalent": number,
  "fuelequivalent": number,
  "vehiclesdrivendistance": number,
  "householdelectricityequivalent": number,
  "plasticbottlessaved": number,
  "papersheetsaved": number,
  "garbagebagsavoided": number,
  "greenhousegases": number,
  "landfillspacesaved": number,
  "recyclingrate": number,
  "toxicchemicalsavoided": number,
  "wildlifeprotection": number
}
```

### 4. ChatBot Service (Node.js)

**Sorumluluklar:**
- Ollama AI entegrasyonu
- Doğal dil işleme
- Konuşma geçmişi yönetimi
- Atık yönetimi danışmanlığı

**Teknolojiler:**
- Node.js + Express
- Ollama API
- Axios

### 5. Frontend (React)

**Özellikler:**
- Responsive design (mobile-first)
- Dark/Light mode
- Real-time updates
- Interactive maps
- Form validation
- Loading states
- Error handling

**Sayfalar:**
```
/ (Home)                    - Landing page
/login                      - Giriş sayfası
/register                   - Kayıt sayfası
/centers                    - Harita ve merkezler
/impact                     - Impact dashboard
/milestones                 - Başarı rozetleri
/about                      - Hakkımızda
/contact                    - İletişim
/privacy                    - Gizlilik politikası
/terms                      - Kullanım şartları
```

### 6. Admin Panel (React)

**Özellikler:**
- Kullanıcı yönetimi
- İstatistikler
- Sistem ayarları
- Log görüntüleme

---

## 📚 API Dokümantasyonu

### Swagger UI

```bash
# Authentication Service Swagger
http://localhost:8080/swagger/index.html
```

### API İstek Örnekleri

#### 1. Kullanıcı Kaydı

```bash
curl -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securepass123",
    "first_name": "John",
    "last_name": "Doe",
    "addresses": [
      {
        "title": "Home",
        "city": "Istanbul",
        "district": "Kadikoy",
        "full_address": "Moda Cad. No: 123"
      }
    ]
  }'
```

#### 2. Giriş Yapma

```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securepass123"
  }'

# Response:
# {
#   "message": "login successful",
#   "token": "eyJhbGciOiJIUzI1NiIs...",
#   "user": { ... }
# }
```

#### 3. Atık Kaydı Oluşturma

```bash
curl -X POST http://localhost:8081/api/waste/records \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "waste_type": "electronic",
    "weight": 2.5,
    "image_path": "/uploads/device123.jpg",
    "collection_center_id": "center_001",
    "description": "Old laptop",
    "ai_analysis": {
      "co2emission": 15.5,
      "riskdegree": 45,
      "energysaved": 12.3
    }
  }'
```

#### 4. İstatistikleri Görüntüleme

```bash
curl -X GET http://localhost:8081/api/waste/stats \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Response:
# {
#   "total_records": 156,
#   "total_weight": 523.4,
#   "co2_saved": 1245.5,
#   "by_type": { ... }
# }
```

Detaylı API dokümantasyonu için: [`readme-files/API_ENDPOINTS.md`](readme-files/API_ENDPOINTS.md)

---

## 🐳 Deployment

### Docker Compose (Önerilen)

```bash
# Tüm servisleri başlat
docker-compose up -d

# Belirli bir servisi yeniden başlat
docker-compose restart auth-service

# Logları görüntüle
docker-compose logs -f waste-service

# Durdur ve temizle
docker-compose down
docker-compose down -v  # Volume'leri de sil
```

### Kubernetes

```bash
# Namespace oluştur ve deploy et
kubectl apply -k k8s/

# Pod durumlarını kontrol et
kubectl get pods -n advancedktu

# Servisleri listele
kubectl get svc -n advancedktu

# Port forwarding
kubectl port-forward svc/frontend 5174:5174 -n advancedktu

# Logs
kubectl logs -f deployment/auth-service -n advancedktu
```

Kubernetes dokümantasyonu için: [`k8s/README.md`](k8s/README.md)

### Manuel Deployment

#### 1. MongoDB Kurulumu

```bash
# Docker ile MongoDB
docker run -d \
  --name mongodb \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=password123 \
  mongo:6.0
```

#### 2. Backend Servisleri

```bash
# Authentication Service
cd authentication-service
go mod download
go run cmd/api/main.go

# Waste Service
cd waste-service
go mod download
go run cmd/api/main.go
```

#### 3. AI Service

```bash
cd ai_service
npm install
npm start
```

#### 4. Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 🛠️ Geliştirme

### Proje Yapısı

```
AdvancedKTU/
├── authentication-service/     # Go - Auth & User Management
│   ├── cmd/api/               # Main entry point
│   ├── internal/
│   │   ├── config/            # Configuration
│   │   ├── domain/            # Business models
│   │   ├── handler/           # HTTP handlers
│   │   ├── repository/        # Data access layer
│   │   └── service/           # Business logic
│   └── docs/                  # Swagger docs
│
├── waste-service/             # Go - Waste Management
│   ├── cmd/api/
│   ├── internal/
│   │   ├── config/
│   │   ├── domain/
│   │   ├── handler/
│   │   ├── middleware/
│   │   ├── repository/
│   │   └── service/
│   └── upload/                # File storage
│
├── ai_service/                # Node.js - AI Analysis
│   ├── src/
│   │   ├── config/            # API keys, settings
│   │   ├── middleware/        # Express middleware
│   │   ├── routes/            # API routes
│   │   └── services/          # AI logic
│   └── main.js
│
├── chatBot/                   # Node.js - AI ChatBot
│   ├── src/services/
│   ├── chat.js                # CLI interface
│   └── server.js              # HTTP server
│
├── frontend/                  # React - User Interface
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   ├── pages/             # Route pages
│   │   ├── services/          # API clients
│   │   ├── types/             # TypeScript types
│   │   └── features/          # Feature modules
│   └── public/
│
├── admin/                     # React - Admin Panel
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── lib/
│       └── store/
│
├── k8s/                       # Kubernetes Manifests
│   ├── 00-namespace.yaml
│   ├── 01-mongodb.yaml
│   ├── 02-auth-service.yaml
│   ├── 03-waste-service.yaml
│   ├── 04-ai-service.yaml
│   ├── 05-frontend.yaml
│   ├── 06-ingress.yaml
│   ├── 07-monitoring.yaml
│   └── ...
│
├── readme-files/              # Detaylı Dokümantasyon
│   ├── API_ENDPOINTS.md
│   ├── ARCHITECTURE_DETAILED.md
│   ├── DATABASE_SCHEMA.md
│   ├── PROJECT_SUMMARY.md
│   └── ...
│
├── docker-compose.yml         # Multi-container setup
├── Dockerfile                 # Multi-stage builds
└── README.md                  # Bu dosya
```

### Veritabanı Şeması

**Users Collection:**
```javascript
{
  "_id": ObjectId,
  "email": String (unique),
  "password": String (bcrypt),
  "first_name": String,
  "last_name": String,
  "role": "admin" | "user",
  "active": Boolean,
  "deleted_at": Date | null,
  "addresses": [
    {
      "title": String,
      "city": String,
      "district": String,
      "full_address": String
    }
  ],
  "created_at": Date,
  "updated_at": Date
}
```

**Waste Records Collection:**
```javascript
{
  "_id": ObjectId,
  "user_id": String,
  "waste_type": String,
  "weight": Number,
  "image_path": String,
  "collection_center_id": String,
  "description": String,
  "ai_analysis": {
    "fullychargingphones": Number,
    "co2emission": Number,
    "watersaved": Number,
    "energysaved": Number,
    "riskdegree": Number,
    // ... 13 more metrics
  },
  "status": "pending" | "collected" | "processed",
  "created_at": Date,
  "updated_at": Date
}
```

Detaylı şema için: [`readme-files/DATABASE_SCHEMA.md`](readme-files/DATABASE_SCHEMA.md)

### Kod Standartları

**Go Services:**
```bash
# Format
go fmt ./...

# Lint
golangci-lint run

# Test
go test ./... -v
```

**Node.js Services:**
```bash
# Lint
npm run lint

# Test
npm test
```

**React Applications:**
```bash
# Lint
npm run lint

# Type check
npm run type-check

# Build
npm run build
```

---

## 📊 Monitoring ve Logging

### Prometheus + Grafana

```bash
# Prometheus metrics
http://localhost:9090

# Grafana dashboard
http://localhost:3000
```

### Loglama

```bash
# Docker Compose logs
docker-compose logs -f [service_name]

# Kubernetes logs
kubectl logs -f deployment/[service-name] -n advancedktu

# Belirli bir container
kubectl logs pod/[pod-name] -c [container-name] -n advancedktu
```

---

## 🧪 Testing

### Backend Tests

```bash
# Authentication Service
cd authentication-service
go test ./internal/... -v -cover

# Waste Service
cd waste-service
go test ./internal/... -v -cover
```

### Frontend Tests

```bash
cd frontend
npm test
```

### Integration Tests

```bash
# Docker Compose ile test ortamı
docker-compose -f docker-compose.test.yml up -d
npm run test:integration
```

---

## 🔒 Güvenlik

### Best Practices

- ✅ JWT token authentication
- ✅ bcrypt password hashing
- ✅ Role-based access control (RBAC)
- ✅ Input validation ve sanitization
- ✅ CORS configuration
- ✅ Rate limiting
- ✅ HTTPS enforcement (production)
- ✅ Environment variables için secrets
- ✅ SQL injection prevention
- ✅ XSS protection

### Environment Variables

```bash
# Hassas bilgileri .env dosyasında sakla
GEMINI_API_KEY=your_secret_key
MONGO_URI=mongodb://localhost:27017
JWT_SECRET=your_jwt_secret
```

**⚠️ Uyarı:** `.env` dosyalarını asla Git'e commit etmeyin!

---

## 📖 Dokümantasyon

Detaylı dokümantasyon `readme-files/` klasöründe bulunmaktadır:

| Dosya | Açıklama |
|-------|----------|
| [PROJECT_SUMMARY.md](readme-files/PROJECT_SUMMARY.md) | Proje hızlı özeti |
| [ARCHITECTURE_DETAILED.md](readme-files/ARCHITECTURE_DETAILED.md) | Detaylı mimari dokümantasyonu |
| [API_ENDPOINTS.md](readme-files/API_ENDPOINTS.md) | Tüm API endpoint'leri |
| [DATABASE_SCHEMA.md](readme-files/DATABASE_SCHEMA.md) | Veritabanı şemaları |
| [DEPLOYMENT_GUIDE.md](k8s/DEPLOYMENT_GUIDE.md) | Kubernetes deployment rehberi |
| [DOCKER_BUILD_GUIDE.md](DOCKER_BUILD_GUIDE.md) | Docker build rehberi |

---

## 🤝 Katkıda Bulunma

Katkılarınızı bekliyoruz! 

### Adımlar

1. **Fork** edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'feat: Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. **Pull Request** açın

### Commit Mesajları

Conventional Commits formatını kullanın:

```
feat: Yeni özellik ekleme
fix: Bug düzeltme
docs: Dokümantasyon güncelleme
style: Kod formatı değişikliği
refactor: Kod refactoring
test: Test ekleme/güncelleme
chore: Build process, dependency güncellemeleri
```

---

## 📝 Changelog

### v1.0.0 (2025-12-31)

**Yeni Özellikler:**
- ✨ AI destekli atık analizi (18 metrik)
- ✨ Leaflet.js ile interaktif harita
- ✨ JWT authentication ve rol yönetimi
- ✨ Impact dashboard
- ✨ ChatBot entegrasyonu
- ✨ Admin panel
- ✨ Kubernetes manifests
- ✨ Docker Compose setup

**İyileştirmeler:**
- 🔧 Mikro servis mimarisi
- 🔧 MongoDB entegrasyonu
- 🔧 Swagger API dokümantasyonu
- 🔧 Responsive design

---

## 📜 Lisans

Bu proje [MIT Lisansı](LICENSE) altında lisanslanmıştır.

```
MIT License

Copyright (c) 2025 AdvancedKTU

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 👥 Ekip

**Developed by Advanced KTU Team**
- 👨‍💻 [Eyüp Canbay](https://github.com/EyupCanbay)
- 👨‍💻 [Eren Akkoç](https://github.com/ernakkc) 
- 👨‍💻 [Rayan Ali Salem](https://github.com/VKWHM) 
- 👨‍💻 [Muhammed Emin Gökçek](https://github.com/gkck38) 
- 👨‍💻 [Çağatay Turunç](https://github.com/CagatayTurunc)

---

## 📞 İletişim ve Destek

### Sorularınız mı var?

- 🐛 Issues: [GitHub Issues](https://github.com/EyupCanbay/AdvancedKTU/issues)
- 📖 Wiki: [Project Wiki](https://github.com/EyupCanbay/AdvancedKTU/wiki)

### Faydalı Bağlantılar

- [Google Gemini API Docs](https://ai.google.dev/docs)
- [Google Cloud Vision API](https://cloud.google.com/vision/docs)
- [Echo Framework](https://echo.labstack.com/)
- [React Documentation](https://react.dev/)
- [Leaflet.js](https://leafletjs.com/)
- [MongoDB Manual](https://docs.mongodb.com/)

---

<div align="center">

**🌱 Sürdürülebilir bir gelecek için birlikte çalışıyoruz! 🌱**

⭐ **Bu projeyi beğendiyseniz yıldız vermeyi unutmayın!** ⭐

Made with ❤️ by Advanced KTU Team

</div>