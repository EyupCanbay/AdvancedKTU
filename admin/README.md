# Advanced KTU Admin Panel

Güzel ve işlevsel bir React admin paneli.

## Özellikler

✨ **Dashboard** - Temel istatistikler ve grafikler
👥 **Kullanıcı Yönetimi** - Tüm kullanıcıları listele, düzenle, sil
🗺️ **Harita Yönetimi** - Toplama noktalarını harita üzerinde yönet (Drag & Drop)
♻️ **Atık Yönetimi** - Atık kayıtlarını görüntüle, durumlarını güncelle

## Teknolojiler

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Vite** - Build tool
- **Zustand** - State management
- **React Leaflet** - Harita entegrasyonu
- **Recharts** - Grafikler
- **Axios** - HTTP requests

## Kurulum

```bash
cd admin
npm install
```

## Geliştirme

```bash
npm run dev
```

Tarayıcıya gidin: `http://localhost:3001`

## Build

```bash
npm run build
```

## Yapısı

```
src/
├── pages/           # Sayfa bileşenleri
│   ├── Dashboard.tsx
│   ├── Users.tsx
│   ├── Waste.tsx
│   └── CollectionMap.tsx
├── components/      # Yeniden kullanılabilir bileşenler
│   └── Sidebar.tsx
├── store/          # Zustand state stores
├── lib/            # Yardımcı fonksiyonlar (API client vb.)
└── App.tsx         # Ana uygulama
```

## API Entegrasyonu

Tüm API çağrıları `src/lib/api.ts` üzerinden yapılır. Mock data kullanan bölümleri backend API'nıza bağlamak için yorum işaretlerini kaldırın.

### Beklenen Backend Endpoints

- `GET /users` - Tüm kullanıcıları al
- `PUT /users/:id` - Kullanıcı güncelle
- `DELETE /users/:id` - Kullanıcı sil
- `POST /users` - Yeni kullanıcı ekle
- `GET /collection-points` - Toplama noktalarını al
- `POST /collection-points` - Yeni toplama noktası ekle
- `PUT /collection-points/:id` - Toplama noktası güncelle
- `DELETE /collection-points/:id` - Toplama noktası sil
- `GET /wastes` - Tüm atık kayıtlarını al
- `PATCH /wastes/:id/status` - Atık durumunu güncelle
- `DELETE /wastes/:id` - Atık kaydını sil

## Özelleştirme

### Tema Renkleri

`tailwind.config.js` içinde renkleri özelleştir:

```javascript
colors: {
  primary: '#3b82f6',
  secondary: '#10b981',
  danger: '#ef4444',
}
```

### API Base URL

`.env.local` dosyasında:

```
VITE_API_BASE_URL=http://localhost:8000
```

## Lisans

MIT
