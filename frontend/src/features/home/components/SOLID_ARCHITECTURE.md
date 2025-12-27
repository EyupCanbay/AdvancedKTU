# SOLID Prensipleri - Çoklu Cihaz Sistemi Mimarisi

## Genel Bakış
Çoklu cihaz seçim ve yönetim sistemi SOLID prensiplerini takip ederek geliştirilmiştir.

---

## 1. **Single Responsibility Principle (SRP)**
Her bileşen **tek bir sorumluluğa** sahiptir:

### DeviceForm.tsx
- **Sorumluluğu**: Tek bir cihaz ekleme formunun yönetimi
- Validasyon, form durumu ve kullanıcı girdisini yönetir
- Başka hiçbir işlemin sorumluluğunu almaz

```tsx
// ✅ İyi: Sadece form yönetimi
const DeviceForm: React.FC<DeviceFormProps> = ({ onSubmit, onCancel }) => {
  // Form state ve validasyon
}
```

### DeviceList.tsx
- **Sorumluluğu**: Cihaz listesinin görüntülenmesi ve silme işlemi
- Cihazları gösterir, ağırlık hesaplar, silme butonu sağlar
- Veri yönetimi veya API çağrılarından sorumlu değildir

```tsx
// ✅ İyi: Sadece listeleme ve görüntüleme
const DeviceList: React.FC<DeviceListProps> = ({ devices, onRemove }) => {
  // List rendering ve display logic
}
```

### MultiDeviceSelector.tsx
- **Sorumluluğu**: Çoklu cihaz seçim workflow'u yönetimi
- Bileşenleri koordine eder, state'i yönetir, API çağrılarını tetikler

---

## 2. **Open/Closed Principle (OCP)**
Sistemin **genişletmeye açık, değiştirilmeye kapalı** olması:

### Genişletme Senaryoları:
```tsx
// Yeni cihaz kategorisi eklemek kolaydır (DeviceForm'ı değiştirmeden)
const categories = [
  'Telefon',
  'Bilgisayar',
  // ✅ Buraya yeni kategoriler ekle
  'Drone',
  'Smartwatch'
];

// Yeni validation kuralı eklemek kolaydır
const validateForm = (): boolean => {
  // ✅ Yeni validasyonlar buraya ekle
}
```

### Değiştirme İhtiyacı Yoktur:
- Mevcut bileşenleri değiştirmeden yeni özellikler eklenir
- `minDevices` ve `maxDevices` props'ları ile konfigürasyon yapılabilir

---

## 3. **Liskov Substitution Principle (LSP)**
Alt sınıflar üst sınıf yerine geçebilir:

### Interface Uyumluluğu:
```tsx
// DeviceForm ve DeviceList aynı device tipini kullanır
interface Device {
  id: string;
  name: string;
  category: string;
  weight?: number;
  condition?: 'good' | 'moderate' | 'poor';
}

// Her iki bileşen de bu interface'i respects ediyor
```

---

## 4. **Interface Segregation Principle (ISP)**
Clients sadece ihtiyaç duydukları methods'lara bağımlı:

### Minimal Interface'ler:
```tsx
// DeviceForm sadece ihtiyacı olan props'ları alır
interface DeviceFormProps {
  onSubmit: (device: Device) => void;
  onCancel: () => void;
}

// DeviceList sadece listesi için gereken props'ları alır
interface DeviceListProps {
  devices: Device[];
  onRemove: (deviceId: string) => void;
}

// MultiDeviceSelector sadece seleksiyon için gereken props'ları alır
interface MultiDeviceSelectorProps {
  onDevicesSelected: (devices: Device[]) => void;
  onCancel: () => void;
  minDevices?: number;
  maxDevices?: number;
}
```

---

## 5. **Dependency Inversion Principle (DIP)**
Yüksek seviye modüller düşük seviye modüllere bağımlı değildir:

### API Soyutlaması:
```tsx
// ✅ API fonksiyonu soyutlanmış
export const submitMultipleDevices = async (devices: Device[]): Promise<MultiDeviceSubmission>

// MultiDeviceSelector API'yi çağırır
// Ancak API'nin nasıl çalıştığını bilmesi gerekmez
const result = await submitMultipleDevices(devices);
```

### Service Layer:
```
MultiDeviceSelector (UI)
        ↓
  submitMultipleDevices (API Service - Abstraction)
        ↓
  Backend (Implementation)
```

---

## Mimari Diyagram

```
┌─────────────────────────────────────────────────┐
│          WasteSubmissionModal                    │
│  (Mode: initial | single | multiple)            │
└──────────┬──────────────────────────────────────┘
           │
           ├─→ [Tek Atık] → Fotoğraf Analizi
           │
           └─→ [Çoklu Atık]
               │
               └─→ MultiDeviceSelector
                   │
                   ├─→ DeviceForm (SRP)
                   │   └─ FormData, Validasyon
                   │
                   ├─→ DeviceList (SRP)
                   │   └─ Listeler, Siler
                   │
                   └─→ submitMultipleDevices (DIP)
                       └─ API → Backend
```

---

## Type Definitions (Interface Segregation)

```tsx
// Device türü - temel cihaz bilgisi
interface Device {
  id: string;
  name: string;
  category: string;
  weight?: number;
  condition?: 'good' | 'moderate' | 'poor';
}

// Input türü - form girişi
interface DeviceInputDto {
  name: string;
  category: string;
  weight?: number;
  condition?: 'good' | 'moderate' | 'poor';
}

// Submission türü - backend'e gönderilen veri
interface MultiDeviceSubmission {
  devices: Device[];
  totalWeight: number;
  submissionDate: Date;
}
```

---

## API Service (DIP + Abstraction)

```tsx
/**
 * Çoklu cihaz bilgilerini backend'e gönder
 * Dependency Inversion Principle: Interface üzerinden çalışır
 */
export const submitMultipleDevices = async (devices: Device[]): Promise<MultiDeviceSubmission> => {
  try {
    // API çağrısı
    const response = await fetch(`${WASTE_API}/devices/multiple`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    
    return await response.json();
  } catch (error) {
    console.error("Çoklu Cihaz Gönderimi Hatası:", error);
    throw error;
  }
};
```

---

## Avantajları

✅ **Maintainability**: Her bileşen tek sorumluluğa sahip  
✅ **Scalability**: Yeni özellikler eklemek kolay  
✅ **Testability**: Her bileşen bağımsız test edilebilir  
✅ **Reusability**: Bileşenler başka yerlerde yeniden kullanılabilir  
✅ **Flexibility**: Props ile davranış özelleştirilir  
✅ **Clean Code**: Kod basit ve okunması kolay  

---

## Kullanım Örneği

```tsx
// Home.tsx içinde
const [isModalOpen, setIsModalOpen] = useState(false);

<WasteSubmissionModal 
  onClose={() => setIsModalOpen(false)}
  onAnalysisComplete={(data) => console.log(data)}
/>

// Modal içinde:
// Kullanıcı "3+ Cihaz Ekle" butonunu tıklar
// → MultiDeviceSelector açılır
// → DeviceForm ile cihaz eklenir
// → DeviceList cihazları gösterir
// → submitMultipleDevices çağrılır
// → Backend'e veriler gönderilir
```

---

## Sonuç

Bu mimari SOLID prensiplerini takip ederek:
- 🎯 Kod kalitesini arttırır
- 🔧 Bakım ve genişletme işlemlerini kolaylaştırır
- 📦 Reusable bileşenler sağlar
- 🚀 Ölçeklenebilir yapı oluşturur
