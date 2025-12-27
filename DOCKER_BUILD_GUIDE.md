# Docker Build Rehberi - AdvancedKTU

Bu dosya, ana dizindeki `Dockerfile`'ı kullanarak tüm mikroservisleri Docker image'larına dönüştürme işlemini açıklar.

## 📋 Mevcut Servisler

| Servis | Dil | Port | Target |
|--------|-----|------|--------|
| Authentication Service | Go 1.24 | 8080 | `authentication-service` |
| Waste Service | Go 1.24 | 8081 | `waste-service` |
| AI Service | Node.js 22 | 3000 | `ai_service` |
| Frontend | React + Vite | 5174 | `frontend` |
| Admin Dashboard | React + Vite | 5173 | `admin` |

## 🚀 Kullanım

### 1. Tek Bir Servis İçin Image Oluştur

```bash
# Authentication Service
docker build -f Dockerfile --target authentication-service -t advancedktu-auth:latest .

# Waste Service
docker build -f Dockerfile --target waste-service -t advancedktu-waste:latest .

# AI Service
docker build -f Dockerfile --target ai_service -t advancedktu-ai:latest .

# Frontend
docker build -f Dockerfile --target frontend -t advancedktu-frontend:latest .

# Admin Dashboard
docker build -f Dockerfile --target admin -t advancedktu-admin:latest .
```

### 2. Tüm Servisler İçin Build Yap (PowerShell)

```powershell
# Services array
$services = @("authentication-service", "waste-service", "ai_service", "frontend", "admin")

# Her servis için image oluştur
foreach ($service in $services) {
    Write-Host "Building $service..." -ForegroundColor Green
    docker build -f Dockerfile --target $service -t advancedktu-$service`:latest .
}

Write-Host "Tüm servisler başarıyla build edildi!" -ForegroundColor Green
```

### 3. Servis Çalıştır

```bash
# Authentication Service
docker run -d -p 8080:8080 --name auth-service advancedktu-auth:latest

# Waste Service
docker run -d -p 8081:8081 --name waste-service advancedktu-waste:latest

# AI Service
docker run -d -p 3000:3000 --name ai-service advancedktu-ai:latest

# Frontend
docker run -d -p 5174:5174 --name frontend advancedktu-frontend:latest

# Admin Dashboard
docker run -d -p 5173:5173 --name admin advancedktu-admin:latest
```

### 4. Ağ Oluştur ve Containerları Bağla

```bash
# Docker network oluştur
docker network create advancedktu-network

# Containerları network'e bağla
docker run -d -p 8080:8080 --network advancedktu-network --name auth advancedktu-auth:latest
docker run -d -p 8081:8081 --network advancedktu-network --name waste advancedktu-waste:latest
docker run -d -p 3000:3000 --network advancedktu-network --name ai advancedktu-ai:latest
docker run -d -p 5174:5174 --network advancedktu-network --name frontend advancedktu-frontend:latest
docker run -d -p 5173:5173 --network advancedktu-network --name admin advancedktu-admin:latest
```

### 5. Docker Compose ile Tüm Servisleri Çalıştır

Daha kolay yönetim için `docker-compose.yml` dosyasını kullanın:

```bash
docker-compose up -d
```

## 🔍 Image Bilgisi

### Layer Yapısı (Multi-Stage Build)

Her servis için iki aşama kullanılır:

1. **Builder Stage**:
   - Go servisleri: Go 1.24-alpine build environment
   - Node.js servisleri: node:22-alpine build environment
   - Dependencies kurulur
   - Kod derlenir/build edilir

2. **Runtime Stage**:
   - Minimal alpine image
   - Yalnızca gerekli bileşenler kopyalanır
   - Boyut optimizasyonu sağlanır

### Image Boyutları (Tahmini)

| Servis | Builder | Final |
|--------|---------|-------|
| auth-service | ~400MB | ~30MB |
| waste-service | ~400MB | ~30MB |
| ai_service | ~450MB | ~200MB |
| frontend | ~450MB | ~200MB |
| admin | ~450MB | ~200MB |

## 📊 Build Komutları Referansı

```bash
# Belirli bir servis için
docker build -f Dockerfile --target <service-name> -t <tag> .

# Tag'li build
docker build -f Dockerfile --target authentication-service -t advancedktu-auth:1.0.0 .

# Build arguments ile
docker build \
  -f Dockerfile \
  --target waste-service \
  --build-arg GO_VERSION=1.24 \
  -t advancedktu-waste:latest \
  .

# No cache ile (force rebuild)
docker build --no-cache -f Dockerfile --target ai_service -t advancedktu-ai:latest .

# Verbose output ile
docker build --progress=plain -f Dockerfile --target frontend -t advancedktu-frontend:latest .
```

## 🐛 Troubleshooting

### Build Başarısız Oluyorsa

```bash
# Build context kontrol et
docker build --progress=plain -f Dockerfile --target authentication-service .

# Specific error kontrol et
docker build -f Dockerfile --target waste-service -t test . 2>&1 | head -50

# Cache temizle
docker builder prune -a
```

### Container Başlamıyorsa

```bash
# Log kontrol et
docker logs <container-id>

# Interactive mode ile çalıştır
docker run -it advancedktu-auth:latest /bin/sh

# Environment variables kontrol et
docker run -it -e DEBUG=true advancedktu-auth:latest ./api
```

## 📝 Best Practices

1. **Production Build'i İçin**:
   ```bash
   docker build -f Dockerfile --target authentication-service -t advancedktu-auth:1.0.0 .
   docker tag advancedktu-auth:1.0.0 registry.example.com/advancedktu-auth:1.0.0
   docker push registry.example.com/advancedktu-auth:1.0.0
   ```

2. **Registry'ye Push**:
   ```bash
   # Docker Hub
   docker login
   docker build --target authentication-service -t yourusername/advancedktu-auth:latest .
   docker push yourusername/advancedktu-auth:latest
   ```

3. **Development İçin**:
   ```bash
   # Mount volume ile develop
   docker run -it -v $(pwd)/authentication-service:/app advancedktu-auth:latest
   ```

## 🔗 İlgili Dosyalar

- `Dockerfile` - Ana multi-service Dockerfile (bu dosya)
- `.dockerignore` - Build sırasında göz ardı edilecek dosyalar
- `docker-compose.yml` - Compose orchestration
- `authentication-service/Dockerfile` - Original auth service (referans)
- `waste-service/Dockerfile` - Original waste service (referans)
- `ai_service/Dockerfile` - Original AI service (referans)
- `frontend/Dockerfile` - Original frontend (referans)
- `admin/Dockerfile` - Original admin service (referans)

## ✅ Sonraki Adımlar

1. Tüm servisleri build et:
   ```bash
   $services = @("authentication-service", "waste-service", "ai_service", "frontend", "admin")
   foreach ($service in $services) {
       docker build -f Dockerfile --target $service -t advancedktu-$service`:latest .
   }
   ```

2. Network oluştur:
   ```bash
   docker network create advancedktu-network
   ```

3. docker-compose.yml'i güncelle ve çalıştır:
   ```bash
   docker-compose up -d
   ```

4. Servisleri test et:
   ```bash
   curl http://localhost:8080/health  # Auth
   curl http://localhost:8081/health  # Waste
   curl http://localhost:3000/health  # AI
   ```

---

**Sorular?** Docker documentation: https://docs.docker.com/
