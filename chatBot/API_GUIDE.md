# 🚀 CarboBot API Kurulum ve Kullanım

## Hızlı Başlangıç

### 1. Ollama'yı Başlat
```bash
# Terminalde
ollama serve
```

### 2. API Server'ı Başlat
```bash
# chatBot klasöründe
npm run server
```

Server şu adreste çalışacak: **http://localhost:8083**

### 3. Frontend'i Başlat
```bash
# frontend klasöründe
npm run dev
```

## 📡 API Endpoints

### POST /api/chat
Chatbot'a mesaj gönder

```bash
curl -X POST http://localhost:8083/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "En yakın toplama noktası nerede?",
    "sessionId": "user123"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "📍 Size en yakın toplama noktaları...",
  "intent": "FIND_LOCATION",
  "confidence": 0.85,
  "timestamp": "2025-12-27T07:30:00.000Z"
}
```

### GET /health
Server durumunu kontrol et

```bash
curl http://localhost:8083/health
```

### GET /api/chat/history/:sessionId
Konuşma geçmişini getir

```bash
curl http://localhost:8083/api/chat/history/user123
```

### DELETE /api/chat/history/:sessionId
Konuşma geçmişini temizle

```bash
curl -X DELETE http://localhost:8083/api/chat/history/user123
```

## 🎯 Özellikler

✅ **Intent Recognition** - Kullanıcı niyetini otomatik tanır
✅ **Action Handling** - 9 farklı aksiyon (konum, değer, etki vb.)
✅ **Ollama Integration** - gpt-oss:120b-cloud model
✅ **Conversation Memory** - Her kullanıcı için ayrı geçmiş
✅ **CORS Enabled** - Tüm origin'lerden erişim
✅ **Error Handling** - Akıllı hata yönetimi
✅ **Fallback Support** - API çöktüğünde frontend local yanıt verir

## 🔧 Yapılandırma

`.env` dosyası:
```env
PORT=8083
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=gpt-oss:120b-cloud
WASTE_SERVICE_URL=http://localhost:8081
```

## 📊 Mimari

```
Frontend (React)
    ↓ HTTP POST
CarboBot API (Express - Port 8083)
    ↓
Intent Recognizer → Confidence > 0.5?
    ↓ YES              ↓ NO
Action Handler     Ollama AI
    ↓                  ↓
Response ← ← ← ← ← ←
```

## 🎭 Test Senaryoları

```bash
# Konum sorgusu
curl -X POST http://localhost:8083/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "En yakın toplama noktası nerede?"}'

# CO2 sorgusu
curl -X POST http://localhost:8083/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "CO2 tasarrufumuz ne kadar?"}'

# Atık bildirme
curl -X POST http://localhost:8083/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Nasıl atık bildirebilirim?"}'
```

## 🐛 Sorun Giderme

### API çalışmıyor
```bash
# Port 8083 meşgul mü kontrol et
lsof -ti:8083

# Serveri öldür
kill -9 $(lsof -ti:8083)

# Tekrar başlat
npm run server
```

### Ollama bağlantı hatası
```bash
# Ollama çalışıyor mu?
curl http://localhost:11434/api/tags

# Ollama'yı başlat
ollama serve

# Model yükle
ollama pull gpt-oss:120b-cloud
```

### Frontend bağlanamıyor
```bash
# CORS ayarlarını kontrol et
# server.js'de: app.use(cors())

# Frontend URL'i kontrol et
# ChatBot.tsx: http://localhost:8083/api/chat
```

## 📈 Production

Production için:
1. `.env` dosyasında `OLLAMA_URL` güncelle
2. Rate limiting ekle (express-rate-limit)
3. Authentication ekle (JWT)
4. Logging ekle (winston)
5. PM2 ile çalıştır

```bash
npm install -g pm2
pm2 start server.js --name carbobot-api
pm2 logs carbobot-api
```

## 🎉 Başarı!

Artık frontend'deki chatbot gerçek AI yanıtları kullanıyor! 🤖✨
