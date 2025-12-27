# 🤖 EkoBot CLI Kullanım Kılavuzu

## 🚀 Hızlı Başlangıç

### 1. Ollama'yı Başlatın

```bash
# Ollama servisini başlatın
ollama serve
```

### 2. Modeli İndirin (İlk Kullanımda)

```bash
# gpt-oss:120b-cloud modelini indirin
ollama pull gpt-oss:120b-cloud
```

### 3. Waste Service'i Başlatın

```bash
# Başka bir terminalde waste-service'i çalıştırın
cd ../waste-service
go run cmd/api/main.go
```

### 4. Bağımlılıkları Yükleyin

```bash
npm install
```

### 5. Chatbot'u Çalıştırın

```bash
npm start
# veya
node chat.js
```

## 💬 Komutlar

### Temel Komutlar

- **exit** veya **çıkış** - Chatbot'tan çık
- **clear** veya **temizle** - Ekranı temizle
- **history** veya **geçmiş** - Konuşma geçmişini göster
- **yardım** veya **help** - Yardım menüsünü göster

### Örnek Sorular

```
🧑 Sen: En yakın toplama noktası nerede?
🧑 Sen: Nasıl atık bildirebilirim?
🧑 Sen: E-atık nedir?
🧑 Sen: Cihazımın değeri ne kadar?
🧑 Sen: Toplam etkimiz nedir?
🧑 Sen: Telefonu nasıl geri dönüştürebilirim?
```

## ⚙️ Yapılandırma

`.env` dosyasını düzenleyerek ayarları değiştirebilirsiniz:

```env
# Ollama URL ve Model
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=gpt-oss:120b-cloud

# Servis URL'leri
WASTE_SERVICE_URL=http://localhost:8081

# Bot Ayarları
MAX_HISTORY=10              # Konuşma geçmişi uzunluğu
RESPONSE_TIMEOUT=30000      # Yanıt timeout (ms)
DEBUG=false                 # Debug modu (intent'leri göster)
```

## 🎯 Özellikler

### 1. Intent Tanıma Sistemi

Bot, mesajınızı analiz ederek ne istediğinizi anlar:

- **FIND_LOCATION** - Toplama noktaları
- **HOW_TO_RECYCLE** - Geri dönüşüm süreci
- **WHAT_IS_EWASTE** - E-atık bilgisi
- **CHECK_DEVICE_VALUE** - Cihaz değerlendirme
- **SHOW_IMPACT** - Çevresel etki istatistikleri
- **HELP** - Yardım
- **GREETING** - Selamlaşma

### 2. Akıllı Eylemler

Yüksek güvenilirlikle tanınan istekler için direkt eylemler:

- 📍 **Yakın toplama noktalarını göster** (Waste Service API)
- 📱 **Geri dönüşüm rehberi** (5 adımlı süreç)
- 🌍 **E-atık bilgisi** (tanım, örnekler, tehlikeler)
- 💰 **Değer tahmini** (örnek fiyat aralıkları)
- 🌱 **Çevresel etki** (CO₂, su, enerji tasarrufu)

### 3. Ollama Entegrasyonu

- **Model**: gpt-oss:120b-cloud (120 milyar parametre)
- **Lokale çalışır**: İnternet bağlantısı gerekmez
- **Hızlı yanıtlar**: Optimize edilmiş parametreler
- **Konuşma hafızası**: 10 mesaja kadar geçmiş

### 4. Görsel Arayüz

- 🎨 **Renkli terminal**: Chalk ile güzel görünüm
- ⏳ **Yükleme animasyonları**: Ora spinner
- 📊 **Formatlanmış çıktılar**: Okunabilir, yapılandırılmış
- 💬 **Akıllı promptlar**: Kullanıcı dostu

## 🔧 Sorun Giderme

### Ollama Bağlantı Hatası

```
❌ Ollama servisine bağlanılamadı
```

**Çözüm:**
```bash
# Ollama'nın çalıştığından emin olun
ollama serve

# Model yüklü mü kontrol edin
ollama list

# Model yoksa indirin
ollama pull gpt-oss:120b-cloud
```

### Waste Service Hatası

```
❌ Toplama noktaları yüklenemedi
```

**Çözüm:**
```bash
# Waste service çalışıyor mu?
curl http://localhost:8081/api/health

# Servisi başlatın
cd ../waste-service
go run cmd/api/main.go
```

### Yavaş Yanıtlar

**Çözüm:**
```env
# .env dosyasında model değiştir (daha küçük model)
OLLAMA_MODEL=llama3.2:3b
```

## 📊 Debug Modu

Intent tanıma sistemini görmek için:

```env
# .env
DEBUG=true
```

Çıktı:
```
ℹ Intent: FIND_LOCATION (85%)
📍 Size en yakın toplama noktaları:
...
```

## 🚀 Gelişmiş Kullanım

### Özel Model Kullanma

```bash
# Farklı bir model indirin
ollama pull mistral:7b

# .env'de modeli değiştirin
OLLAMA_MODEL=mistral:7b
```

### Kendi Prompt'unuzu Yazın

[src/services/PromptBuilder.js](src/services/PromptBuilder.js) dosyasını düzenleyin:

```javascript
static buildSystemPrompt() {
  return `
Sen EkoBot'sun...
// Kendi system prompt'unuz
  `;
}
```

### Yeni Intent Ekleyin

[src/services/IntentRecognizer.js](src/services/IntentRecognizer.js) dosyasına yeni intent ekleyin:

```javascript
CUSTOM_INTENT: {
  keywords: ['anahtar', 'kelimeler'],
  patterns: [/regex.*pattern/i],
  action: 'customAction'
}
```

[src/services/ActionHandler.js](src/services/ActionHandler.js) dosyasına action ekleyin:

```javascript
case 'customAction':
  return this.handleCustomAction();
```

## 📝 Notlar

- Bot her 10 mesajda bir geçmişi temizler (hafıza yönetimi)
- Timeout 60 saniye (uzun yanıtlar için)
- CTRL+C ile güvenli çıkış
- Tüm yanıtlar Türkçe
- Emoji kullanımı dengeli (2-3 per mesaj)

## 🤝 Katkıda Bulunma

Geliştirme önerileri için:

1. Intent tanıma doğruluğunu artırın
2. Yeni action'lar ekleyin
3. Prompt optimizasyonu yapın
4. Görsel iyileştirmeler

## 📄 Lisans

MIT License - E-Atık Koruyucuları Projesi
