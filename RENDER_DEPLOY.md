# 🚀 Render.com Deploy Rehberi - AdvancedKTU

## 📋 İçindekiler
1. [Render Blueprint Nedir?](#render-blueprint-nedir)
2. [Ön Hazırlık](#ön-hazırlık)
3. [Adım Adım Deploy](#adım-adım-deploy)
4. [Environment Variables](#environment-variables)
5. [Veritabanı Kurulumu](#veritabanı-kurulumu)
6. [API Keys Konfigürasyonu](#api-keys-konfigürasyonu)
7. [Troubleshooting](#troubleshooting)
8. [Monitoring ve Logs](#monitoring-ve-logs)

---

## 🎯 Render Blueprint Nedir?

**Render Blueprint** tek bir YAML dosyasıyla tüm servisleri otomatik olarak deploy eder:
- ✅ Tüm containerları build eder
- ✅ Environment variables'ları atar
- ✅ Services'ları birbirine bağlar
- ✅ Auto-deploys yapılandırır
- ✅ Health checks ayarlar

**Dosya**: `render.yaml`

---

## ✅ Ön Hazırlık

### 1. Render Hesabı Oluştur
1. https://render.com adresine git
2. **Sign Up** (GitHub ile sign up önerilir)
3. E-postanı doğrula

### 2. GitHub Repository Bağla
1. Render Dashboard → **Blueprints** bölümüne git
2. **New Blueprint Instance** tıkla
3. GitHub repository'ni select et
4. Branch: `master` veya `main` seç

### 3. Repository Gereksinimleri
```
Repository'de bulunması gerekenler:
✅ Dockerfile (Multi-stage, tüm services)
✅ render.yaml (Blueprint configuration)
✅ docker-compose.yml (Local testing için)
✅ Tüm source code (authentication-service/, waste-service/, ai_service/, frontend/)
✅ .dockerignore (Optimize builds)
```

### 4. Render Resources Limitleri (Free Plan)
| Resource | Limit |
|----------|-------|
| Build Time | 30 minutes |
| Memory per service | 512MB |
| CPU | Shared |
| Storage | Ephemeral (container restart'ta silinir) |
| Concurrent Builds | 1 |
| Auto-deploy | ✅ Yes |

---

## 🚀 Adım Adım Deploy

### Adım 1: Render Dashboard'a Git
```
https://dashboard.render.com
```

### Adım 2: Blueprint'i Oluştur
1. **Blueprints** → **New Blueprint Instance**
2. GitHub repo select et
3. Branch select et: `master`
4. **Create Blueprint Instance** tıkla

### Adım 3: Build Başlasın
- Render otomatik olarak deploy başlattı
- **Deployments** tabında progress'i izle
- Her service için build logs kontrol et

### Adım 4: Build Status'ü İzle

```
Dashboard Sekmeler:
├─ Deployments (build progress)
├─ Logs (real-time logs)
├─ Events (deployment events)
└─ Settings (konfigürasyon)
```

### Adım 5: Service URLs'ini Kontrol Et
Deploy tamamlandıktan sonra:
- **auth-service**: `https://advancedktu-auth.onrender.com`
- **waste-service**: `https://advancedktu-waste.onrender.com`
- **ai-service**: `https://advancedktu-ai.onrender.com`
- **frontend**: `https://advancedktu-frontend.onrender.com`

---

## 🔐 Environment Variables

### Render Dashboard'da Variables Ayarla

1. **Service Select** → **Environment** tab
2. **Add Environment Variable** tıkla
3. Manual olarak enter et:

#### 1️⃣ MongoDB URI (Tüm Go Services)

```
Key: MONGO_URI
Value: mongodb+srv://username:password@cluster.mongodb.net/
```

**Bunu MongoDB Atlas'tan al**:
1. https://cloud.mongodb.com adresine git
2. **Connect** → **Connect your application**
3. URI'yi kopyala

#### 2️⃣ JWT Secret (Auth Service)

```
Key: JWT_SECRET
Value: <Render otomatik generate eder>
```

Render auto-generate eder (`generateValue: true` ile), veya manual:
```
Value: your-super-secret-jwt-key-min-32-chars-long!
```

#### 3️⃣ Google Gemini API Key (AI Service)

```
Key: GOOGLE_GENERATIVE_AI_API_KEY
Value: <Google Cloud Console'dan al>
```

**Bunu Google Cloud'tan al**:
1. https://console.cloud.google.com adresine git
2. **APIs & Services** → **Credentials**
3. **Create API Key**
4. Select: **Generative Language API**
5. Key'i kopyala

#### 4️⃣ Frontend Environment Variables

```
Key: VITE_API_BASE_URL
Value: https://advancedktu-waste.onrender.com

Key: VITE_AUTH_API_URL
Value: https://advancedktu-auth.onrender.com

Key: VITE_AI_API_URL
Value: https://advancedktu-ai.onrender.com
```

---

## 💾 Veritabanı Kurulumu

### ⚠️ Render'da Database Yok!

**Neden?** Render'ın free plan'ında hosted database desteği yok.

### ✅ Çözüm: MongoDB Atlas Kullan (Free)

#### 1. MongoDB Atlas Hesabı Oluştur
```
https://www.mongodb.com/cloud/atlas
1. Sign Up
2. Create Organization
3. Create Project
4. Create Cluster (Free M0 tier)
```

#### 2. Connection String Oluştur
```
1. Cluster → Connect
2. "Connect your application"
3. URI formatı:
   mongodb+srv://username:password@cluster-xxx.mongodb.net/dbname
```

#### 3. IP Whitelist Ayarla
```
1. Network Access
2. Add IP Address
3. Allow from anywhere: 0.0.0.0/0
   (Production'da belirli IPs önerilir)
```

#### 4. Render'da MONGO_URI Konfigür
```
render.yaml'da:
- key: MONGO_URI
  sync: false  # Manuel olarak Render Dashboard'da gir
```

---

## 🔑 API Keys Konfigürasyonu

### Google Cloud Setup

#### Step 1: Google Cloud Project Oluştur
```
1. https://console.cloud.google.com
2. Select Project → New Project
3. Project name: AdvancedKTU
4. Create
```

#### Step 2: APIs Enable Et
```
1. APIs & Services → Library
2. Search: "Generative Language API"
3. Enable
4. Search: "Cloud Vision API"
5. Enable
```

#### Step 3: API Key Oluştur
```
1. APIs & Services → Credentials
2. Create Credentials → API Key
3. Key'i kopyala
4. Edit → Restrict key:
   - API Restrictions: Generative Language API
   - HTTP referrers: *.onrender.com
```

#### Step 4: Render'da Konfigür
```
Environment Variables:
- GOOGLE_GENERATIVE_AI_API_KEY: <API_KEY>
```

---

## 🔗 Services Arasında Haberleşme

### Service URLs (Otomatik)

Render `render.yaml`'daki `fromService` ile otomatik handle eder:

```yaml
- key: AUTH_SERVICE_URL
  fromService:
    type: web
    name: advancedktu-auth
    property: url
```

Bu otomatik olarak:
```
AUTH_SERVICE_URL=https://advancedktu-auth.onrender.com
```

### CORS Konfigürasyonu

**Problem**: Frontend farklı domain'den API çağırıyor.

**Çözüm**: Go services'te CORS enable et:

```go
// authentication-service/cmd/api/main.go

config := cors.DefaultConfig()
config.AllowOrigins = []string{
    "https://advancedktu-frontend.onrender.com",
    "https://advancedktu-waste.onrender.com",
    "http://localhost:5174", // Dev
    "http://localhost:3000",  // Dev
}
e.Use(cors.New(config))
```

---

## 📊 Deployment Architecture

```
┌─────────────────────────────────────────────┐
│         Render.com (Cloud Platform)         │
├─────────────────────────────────────────────┤
│                                             │
│  ┌──────────────────────────────────────┐  │
│  │      Frontend (React/Vite)           │  │
│  │  advancedktu-frontend.onrender.com   │  │
│  └──────────────────────────────────────┘  │
│                   ↓                         │
│  ┌──────────────────────────────────────┐  │
│  │   API Gateway (Load Balancer)        │  │
│  └──────────────────────────────────────┘  │
│   ↙           ↓           ↘               │
│                                             │
│  ┌─────────────┐  ┌──────────────┐  ┌─────┐
│  │   Auth Svc  │  │ Waste Svc    │  │ AI  │
│  │  :8080      │  │  :8081       │  │ :30 │
│  └─────────────┘  └──────────────┘  └─────┘
│        ↓              ↓                ↓   │
│  ┌──────────────────────────────────────┐  │
│  │    MongoDB Atlas (Shared Cloud DB)   │  │
│  │  mongodb+srv://user:pass@cluster.    │  │
│  └──────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
```

---

## 🧪 Deploy Sonrası Test

### 1️⃣ Health Checks

```bash
# Auth Service
curl https://advancedktu-auth.onrender.com/swagger/

# Waste Service
curl https://advancedktu-waste.onrender.com/

# AI Service
curl https://advancedktu-ai.onrender.com/

# Frontend
curl https://advancedktu-frontend.onrender.com/
```

### 2️⃣ Database Connection

```bash
# Auth Service logs'ta bak
mongoDB connection successful

# Logs check:
Render Dashboard → Service → Logs
```

### 3️⃣ API Test

```bash
# Register user
curl -X POST https://advancedktu-auth.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"pass123"}'

# Login
curl -X POST https://advancedktu-auth.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"pass123"}'
```

### 4️⃣ Frontend Test

```
Browser'da: https://advancedktu-frontend.onrender.com
Login, waste submit, vs. test et
```

---

## 📖 Monitoring ve Logs

### Real-time Logs

```
1. Render Dashboard → Service Select
2. Logs tab
3. Real-time update'i izle
```

### Build Logs

```
1. Deployments tab
2. Latest deployment select
3. Build log'u gör
```

### Performance Monitoring

```
1. Service → Metrics
2. CPU, Memory, Requests izle
3. Error rate kontrol et
```

---

## 🐛 Troubleshooting

### Build Hatası: "go.mod not found"

**Sebep**: Dockerfile COPY path yanlış

```dockerfile
# ❌ YANLIŞ
COPY authentication-service/go.mod ./

# ✅ DOĞRU
COPY authentication-service/go.mod authentication-service/go.sum ./
```

### Build Hatası: "npm ERR! code ENOENT"

**Sebep**: Frontend package.json'da bağlantı yok

```json
{
  "scripts": {
    "build": "vite build"  // ✅ İlk npm install, sonra build
  }
}
```

### Service Crash: "MONGO_URI is required"

**Sebep**: Environment variable set değil

**Çözüm**:
```
1. Service → Environment
2. MONGO_URI ekle
3. Redeploy
```

### Service Timeout: "health check failed"

**Sebep**: Service başlamada 30 secs'ten uzun alıyor

**Çözüm**:
```yaml
# render.yaml
healthCheckInterval: 60  # Increase timeout
```

### CORS Error: "Origin not allowed"

**Sebep**: Frontend domain CORS whitelist'te yok

**Çözüm**:
```go
config.AllowOrigins = []string{
    "https://advancedktu-frontend.onrender.com",  // Add this
}
```

### Database Connection Error

**Sebep**: MongoDB Atlas IP whitelist'te Render IP yok

**Çözüm**:
```
1. MongoDB Atlas → Network Access
2. Add IP Address
3. 0.0.0.0/0 (Allow All)
4. Retry
```

---

## 💾 Backups ve Disaster Recovery

### Database Backups
```
MongoDB Atlas otomatik backup alır (daily)
1. Atlas → Backups
2. Restore point select et
3. Restore
```

### Code Rollback
```
Render Dashboard:
1. Deployments tab
2. Previous deployment select
3. "Redeploy" tıkla
```

---

## 🔄 Continuous Deployment

### Auto-Deploy Aktif
```yaml
# render.yaml
autoDeploy: true
```

**Ne olur**:
- GitHub'a push → Render otomatik redeploy
- Branch: master yapılan her commit redeploy

### Manual Deploy
```
Render Dashboard → Service → Manual Deploy
```

---

## 📈 Scaling (Gelecek)

Free plan'dan upgrade:

```
Service → Settings → Plan
├─ Starter ($7/month)
├─ Standard ($25/month)
└─ Pro ($100/month)
```

**Neler gain edersin**:
- ✅ Persistent storage
- ✅ More memory (1-8GB)
- ✅ More CPU
- ✅ Auto-scaling
- ✅ Dedicated instances

---

## 🎯 Deploy Checklist

- [ ] Render account oluştur
- [ ] GitHub repo bağla
- [ ] render.yaml gözden geçir
- [ ] Dockerfile multi-stage check et
- [ ] MongoDB Atlas account oluştur
- [ ] Google API keys oluştur
- [ ] Render Dashboard'da env vars gir
  - [ ] MONGO_URI
  - [ ] JWT_SECRET
  - [ ] GOOGLE_GENERATIVE_AI_API_KEY
- [ ] Blueprint instance oluştur
- [ ] Build progress'i izle
- [ ] Health checks kontrol et
- [ ] API endpoints test et
- [ ] Frontend test et
- [ ] Logs kontrol et
- [ ] Monitoring setup et

---

## 📞 Support ve Kaynaklar

- **Render Docs**: https://render.com/docs
- **Render Discord**: https://discord.gg/render
- **Render Status**: https://status.render.com

---

**Happy Deploying! 🚀**
