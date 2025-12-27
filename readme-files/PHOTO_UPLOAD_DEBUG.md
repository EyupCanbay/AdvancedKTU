# 🔍 Fotoğraf Yükleme Hata Testi

## Test Adımları

1. **Tüm servisleri başlat:**
   ```bash
   # Terminal 1: Waste Service
   cd waste-service
   go run cmd/api/main.go
   
   # Terminal 2: AI Service
   cd ai_service
   npm start
   
   # Terminal 3: Frontend
   cd frontend
   npm run dev
   ```

2. **Tarayıcı Console'u Aç:**
   - Chrome: F12 > Console
   - Safari: Cmd+Option+C

3. **Atık Bildir'e Tıkla:**
   - Ana sayfada "Atık Bildir" butonuna tıkla
   - "Fotoğraf ile Analiz Et" seç

4. **Fotoğraf Yükle:**
   - Herhangi bir elektronik cihaz fotoğrafı seç
   - Console'da logları izle

## 📊 Beklenen Log Çıktısı

### Frontend Console:
```
📸 [WasteSubmissionModal] handleFileChange tetiklendi
✅ [WasteSubmissionModal] Dosya seçildi: {name: "iphone.jpg", size: 2048576, type: "image/jpeg"}
🖼️ [WasteSubmissionModal] Preview URL oluşturuldu: blob:http://localhost:5173/...
🚀 [WasteSubmissionModal] handleSubmit başladı
📤 [WasteSubmissionModal] Dosya gönderiliyor: {name: "iphone.jpg", ...}
🔧 [API] analyzeWasteImage başladı
📁 [API] Dosya bilgileri: {...}
🔑 [API] Token kontrol: ✅ Mevcut
📦 [API] FormData oluşturuldu
🌐 [API] İstek URL: http://localhost:8081/api/upload
📤 [API] Fetch başlatılıyor...
📥 [API] Response alındı: {status: 201, ok: true}
✅ [API] JSON parse başarılı: {id: "...", ai_analysis: {...}}
✅ [WasteSubmissionModal] API yanıtı alındı
🎉 [WasteSubmissionModal] AI analizi başarılı
🗺️ [WasteSubmissionModal] Milestone sayfasına yönlendiriliyor...
```

### Backend (waste-service) Terminal:
```
📤 [Handler] Upload endpoint çağrıldı
✅ [Handler] UserID alındı: 674f...
📝 [Handler] Description: 
📁 [Handler] Dosya alındı: {filename: "iphone.jpg", size: 2048576}
🔄 [Handler] Service.UploadAndAnalyze çağrılıyor...
✅ [Handler] Upload başarılı, waste ID: 674f...
```

## ❌ Olası Hatalar ve Çözümleri

### Hata 1: Network Error
```
💥 [API] KRITIK HATA: TypeError: Failed to fetch
🌐 [API] Network hatası - Backend çalışmıyor olabilir!
```
**Çözüm:** Waste service'i başlat (port 8081)

### Hata 2: 401 Unauthorized
```
❌ [API] Response başarısız: {status: 401}
```
**Çözüm:** Login olun veya token'ı kontrol edin

### Hata 3: 400 Bad Request
```
❌ [Handler] FormFile hatası: multipart: NextPart: EOF
```
**Çözüm:** Dosya doğru gönderilmiyor, FormData'yı kontrol et

### Hata 4: 500 Internal Server Error
```
💥 [Handler] UploadAndAnalyze hatası: ...
```
**Çözüm:** AI service'in çalıştığından emin olun (port 8082)

### Hata 5: CORS Error
```
Access to fetch at 'http://localhost:8081/api/upload' has been blocked by CORS policy
```
**Çözüm:** Waste service CORS ayarlarını kontrol et

## 🐛 Debug Komutları

```bash
# Port kontrolü
lsof -ti:8081  # Waste service
lsof -ti:8082  # AI service
lsof -ti:5173  # Frontend

# Servis health check
curl http://localhost:8081/api/health
curl http://localhost:8082/health

# Manuel test
curl -X POST http://localhost:8081/api/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "image=@test.jpg"
```

## 📝 Not

Tüm loglar emoji ile işaretlendi:
- 📸 = Dosya seçimi
- 🚀 = İşlem başlangıcı
- ✅ = Başarılı
- ❌ = Hata
- 🔧 = API işlemi
- 💥 = Kritik hata
- 🌐 = Network
- 📤/📥 = Request/Response

Bu sayede console'da kolay takip edebilirsiniz!
