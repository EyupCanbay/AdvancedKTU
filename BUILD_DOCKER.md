# Docker Build Rehberi - AdvancedKTU

## ⚠️ Hata Çözümü

Eğer bu hatayı alıyorsanız:
```
error: failed to solve: failed to read dockerfile: read /home/user/.local/tmp/buildkit-mount469906673/src: is a directory
```

**Sebep**: Build context yanlış veya dockerfile flagı hatalı kurgulanmış.

---

## ✅ Doğru Build Komutları

### Ana Dizinden Build Komutları

Tüm komutları **ana dizin** (`advancedKtu`) dizininden çalıştırın:

```powershell
cd c:\Users\canbay\Desktop\advancedKtu
```

### 1️⃣ Authentication Service

```bash
# Option 1: Dockerfile path belirtmeden (varsayılan Dockerfile)
docker build --target authentication-service -t advancedktu-auth:latest .

# Option 2: Açıkça Dockerfile path belirtmek
docker build -f Dockerfile --target authentication-service -t advancedktu-auth:latest .
```

**PowerShell**:
```powershell
docker build --target authentication-service -t advancedktu-auth:latest .
```

### 2️⃣ Waste Service

```bash
docker build --target waste-service -t advancedktu-waste:latest .
```

### 3️⃣ AI Service

```bash
docker build --target ai-service -t advancedktu-ai:latest .
```

### 4️⃣ Frontend

```bash
docker build --target frontend-builder -t advancedktu-frontend:latest .
```

### 5️⃣ Tüm Servisleri Sırayla Build Etme

```powershell
# PowerShell Script
$services = @(
    "authentication-service",
    "waste-service",
    "ai-service",
    "frontend-builder"
)

foreach ($service in $services) {
    Write-Host "Building $service..." -ForegroundColor Green
    docker build --target $service -t "advancedktu-$service`:latest" .
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Build failed for $service" -ForegroundColor Red
        exit 1
    }
}

Write-Host "All services built successfully!" -ForegroundColor Green
```

---

## 🔧 İlk Defa Build Ediyorsanız

### Adım 1: Dependency'leri İndir

```bash
# Go dependencies
cd authentication-service
go mod download
cd ..

cd waste-service
go mod download
cd ..

# Node.js dependencies (opsiyonel, Docker build'de yapılacak)
cd ai_service
npm install --ci
cd ..

cd frontend
npm install --ci
cd ..
```

### Adım 2: Dockerfile Validate Et

```bash
# PowerShell
Get-Content Dockerfile | Select-Object -First 20

# Bash
head -20 Dockerfile
```

### Adım 3: Docker Version Kontrol Et

```bash
docker --version
# Docker version 20.10+ gerekli
```

---

## 🐛 Hata Giderme

### Hata 1: "is a directory"
**Sebep**: Dockerfile path yanlış veya context path hatalı
**Çözüm**: 
```bash
# ❌ YANLIŞ
docker build -f authentication-service/ -t myapp .

# ✅ DOĞRU
docker build -f Dockerfile --target authentication-service -t myapp .
```

### Hata 2: "no such file or directory"
**Sebep**: COPY komutunda yanlış path
**Çözüm**: Ana dizinden çalıştırdığınızdan emin olun
```bash
cd c:\Users\canbay\Desktop\advancedKtu
docker build --target authentication-service -t myapp .
```

### Hata 3: "go.sum file not found"
**Sebep**: go.mod ve go.sum dosyaları eksik
**Çözüm**: Go dependencies indirin
```bash
cd authentication-service
go mod tidy
go mod download
cd ..
```

### Hata 4: "npm dependencies not found"
**Sebep**: node_modules eksik
**Çözüm**: Dockerfile bunu otomatik indir, veya manual:
```bash
cd ai_service
npm ci
cd ..
```

---

## 📋 Docker Compose ile Build (ÖNERILEN)

Daha kolay ve yapılandırılmış:

```bash
docker-compose up -d --build
```

Bu komut:
- Tüm servisleri otomatik build eder
- Doğru portlara map eder
- Database'i başlatır
- Network'ü oluşturur

---

## ✨ Advanced Build Options

### Build Cache Devre Dışı Bırak
```bash
docker build --target authentication-service --no-cache -t advancedktu-auth:latest .
```

### Belirli Build Args Geç
```bash
docker build \
  --target authentication-service \
  --build-arg GOLANG_VERSION=1.24 \
  -t advancedktu-auth:latest .
```

### Build Output Detaylı Gör
```bash
docker build --target authentication-service --progress=plain -t advancedktu-auth:latest .
```

### Multi-Platform Build
```bash
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  --target authentication-service \
  -t advancedktu-auth:latest .
```

---

## 📊 Build Sonrası İşlemler

### Container'ı Çalıştır

**Authentication Service**:
```bash
docker run -d \
  -p 8080:8080 \
  -e MONGO_URI="mongodb://admin:password123@mongo:27017" \
  -e JWT_SECRET="super_secret_key_change_me" \
  --name auth-container \
  advancedktu-auth:latest
```

**Waste Service**:
```bash
docker run -d \
  -p 8081:8081 \
  -e MONGO_URI="mongodb://admin:password123@mongo:27017" \
  --name waste-container \
  advancedktu-waste:latest
```

**AI Service**:
```bash
docker run -d \
  -p 3000:3000 \
  -e GOOGLE_API_KEY="your-key-here" \
  --name ai-container \
  advancedktu-ai:latest
```

### Images Kontrol Et
```bash
docker images | grep advancedktu
```

### Containers Kontrol Et
```bash
docker ps -a | grep advancedktu
```

---

## 🚀 Production Build

### Optimize Edilmiş Build

```bash
# Boyut optimizasyonu
docker build \
  --target authentication-service \
  -t advancedktu-auth:1.0.0 \
  --build-arg BUILDKIT_INLINE_CACHE=1 \
  .

# Yayınlama
docker tag advancedktu-auth:1.0.0 docker.io/username/advancedktu-auth:1.0.0
docker push docker.io/username/advancedktu-auth:1.0.0
```

### Versioning

```bash
# Latest tag'ı güncelle
docker tag advancedktu-auth:latest advancedktu-auth:v1.0.0
docker tag advancedktu-auth:latest advancedktu-auth:v1.0.0-$(date +%Y%m%d)
```

---

## 📝 Dockerfile Yapısı Özet

```
Dockerfile (Ana Dosya)
├── Stage 1: authentication-service-builder
├── Stage 2: authentication-service (Runtime)
├── Stage 3: waste-service-builder
├── Stage 4: waste-service (Runtime)
├── Stage 5: ai-service-builder
├── Stage 6: ai-service (Runtime)
├── Stage 7: frontend-builder
└── Stage 8: frontend (Runtime)
```

Her stage `--target` flagı ile seçilir:
```bash
docker build --target <stage-name> -t image-name .
```

---

## ✅ Çalıştığını Kontrol Etme

```bash
# 1. Image'ı kontrol et
docker images advancedktu-*

# 2. Container'ı çalıştır
docker run -p 8080:8080 advancedktu-auth:latest

# 3. Health check yap
curl http://localhost:8080/health

# 4. Logs kontrol et
docker logs <container-id>

# 5. Durdur ve kaldır
docker stop <container-id>
docker rm <container-id>
```

---

## 💡 İpuçları

1. **Ana dizinden build edin** - Dockerfile COPY komutları buna dayanır
2. **Docker Compose kullanın** - Daha basit ve test edilmiş
3. **Build cache'i kullanın** - Tekrarlanan builds hızlı olur
4. **Multi-stage build avantajları** - Daha küçük final images
5. **Production ortamında versioning** - Semantic versioning kullanın

---

**Sorular?** Docker logs'ları kontrol edin:
```bash
docker logs <container-id> --tail 50 --follow
```
