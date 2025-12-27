import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getCollectionPoints, createCollectionRequest } from '../services/api';

// Leaflet marker icon fix
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

interface Center {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
}

// Map component to update view when center is selected
const MapUpdater = ({ center }: { center: [number, number] | null }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, 13);
    }
  }, [center, map]);
  return null;
};

export const SelectCenterPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [selectedCenter, setSelectedCenter] = useState<Center | null>(null);
  const [centers, setCenters] = useState<Center[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [selectionMode, setSelectionMode] = useState<'center' | 'myLocation'>('center'); // Seçim modu
  const [userDescription, setUserDescription] = useState(''); // Kullanıcı açıklaması
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null); // Kullanıcı konumu
  const [locationLoading, setLocationLoading] = useState(false);

  const wasteData = state?.stats || {};
  const wasteID = state?.wasteID || '';
  const multipleDeviceData = state?.data || {}; // Çoklu cihaz verileri

  // Backend'den merkezleri yükle
  useEffect(() => {
    const fetchCenters = async () => {
      try {
        const points = await getCollectionPoints();
        setCenters(points);
      } catch (error) {
        console.error('Merkezler yüklenemedi:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCenters();
  }, []);

  // Kullanıcı konumunu al
  const handleGetMyLocation = () => {
    setLocationLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          setSelectionMode('myLocation');
          setSelectedCenter(null);
          setLocationLoading(false);
        },
        (error) => {
          console.error('Konum alınamadı:', error);
          alert('Konum bilgisi alınamadı. Lütfen tarayıcı izinlerini kontrol edin.');
          setLocationLoading(false);
        }
      );
    } else {
      alert('Tarayıcınız GPS desteklemiyor.');
      setLocationLoading(false);
    }
  };

  // Filtreleme
  const filteredCenters = centers.filter(center => {
    const matchesSearch = center.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         center.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const handleSelectCenter = (center: Center) => {
    setSelectedCenter(center);
  };

  const handleConfirmSelection = async () => {
    // Merkez seçimi modu
    if (selectionMode === 'center') {
      if (!selectedCenter || !wasteID) {
        alert('Lütfen bir merkez seçin ve waste ID\'nin geçerli olduğundan emin olun.');
        return;
      }

      setSubmitting(true);
      try {
        await createCollectionRequest(wasteID, selectedCenter.id);
        
        navigate('/', { 
          state: { 
            message: `${selectedCenter.name} merkezine teslimat talebiniz kaydedildi.` 
          } 
        });
      } catch (error) {
        console.error('Teslimat talebi oluşturulamadı:', error);
        alert('Teslimat talebi oluşturulurken hata oluştu. Lütfen tekrar deneyin.');
      } finally {
        setSubmitting(false);
      }
    } 
    // Konumum (GPS) seçimi modu
    else if (selectionMode === 'myLocation') {
      if (!userLocation || !userDescription.trim() || !wasteID) {
        alert('Lütfen konumunuzun alındığından ve açıklama yazıldığından emin olun.');
        return;
      }

      setSubmitting(true);
      try {
        // GPS konumuna dayalı teslimat talebini oluştur
        // Not: Backend'de bu işlem için yeni endpoint gerekebilir
        await createCollectionRequest(wasteID, null, {
          latitude: userLocation.lat,
          longitude: userLocation.lng,
          description: userDescription
        });
        
        navigate('/', { 
          state: { 
            message: 'Konum tabanlı teslimat talebiniz kaydedildi. E-atık toplama ekibi sizinle iletişime geçecektir.' 
          } 
        });
      } catch (error) {
        console.error('Teslimat talebi oluşturulamadı:', error);
        alert('Teslimat talebi oluşturulurken hata oluştu. Lütfen tekrar deneyin.');
      } finally {
        setSubmitting(false);
      }
    }
  };

  // Harita merkezi - seçili merkez varsa onun konumunu göster, yoksa kullanıcı konumu veya Türkiye ortası
  const mapCenter: [number, number] = selectedCenter 
    ? [selectedCenter.latitude, selectedCenter.longitude]
    : userLocation
    ? [userLocation.lat, userLocation.lng]
    : [40.995, 39.771]; // KTÜ koordinatları varsayılan

  return (
    <div className="bg-background-dark text-white font-display min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 glass-panel border-b border-border-dark px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center justify-center size-10 rounded-lg bg-surface-dark border border-border-dark text-primary hover:bg-border-dark transition-colors"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <div className="flex items-center gap-3">
              <div className="size-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center text-white font-bold">
                <span className="material-symbols-outlined text-xl">location_on</span>
              </div>
              <h2 className="text-white text-xl font-bold tracking-tight">Teslimat Noktası Seç</h2>
            </div>
          </div>
        </div>
      </nav>

      {/* Ana İçerik */}
      <main className="flex-grow flex flex-col lg:flex-row max-w-7xl mx-auto w-full">
        {/* Sol Panel - Merkez Listesi */}
        <aside className="w-full lg:w-[450px] flex flex-col border-r border-border-dark bg-background-dark overflow-y-auto">
          <div className="p-6 flex flex-col gap-6">
            {/* Başlık */}
            <div className="flex flex-col gap-2">
              <h1 className="text-2xl font-bold text-white">E-Atık Toplama Merkezleri</h1>
              <p className="text-text-subtle text-sm">Size en yakın merkezi seçin ve teslimat talebinizi oluşturun.</p>
            </div>

            {/* Arama ve Filtre */}
            <div className="flex flex-col gap-3">
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-primary">search</span>
                <input
                  type="text"
                  placeholder="Merkez, semt veya adres ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-surface-dark border border-border-dark text-white text-sm rounded-lg p-3.5 pl-10 outline-none focus:border-primary transition-colors"
                  disabled={selectionMode === 'myLocation'}
                />
              </div>
              
              {/* Konumum Butonu */}
              <button
                onClick={handleGetMyLocation}
                disabled={locationLoading}
                className={`w-full px-4 py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${
                  selectionMode === 'myLocation'
                    ? 'bg-accent/20 border border-accent text-accent'
                    : 'bg-primary/20 border border-primary text-primary hover:bg-primary/30'
                }`}
              >
                <span className="material-symbols-outlined text-sm">
                  {locationLoading ? 'refresh' : 'location_on'}
                </span>
                {locationLoading ? 'Konum alınıyor...' : 'Konumum Kullan'}
              </button>

              {/* Description Textarea - Konumum Modu İçin */}
              {selectionMode === 'myLocation' && (
                <div className="pt-2 border-t border-border-dark">
                  <label className="text-sm font-bold text-white mb-2 block">
                    Cihazlarınız Hakkında Açıklama
                  </label>
                  <textarea
                    value={userDescription}
                    onChange={(e) => setUserDescription(e.target.value.slice(0, 1000))}
                    placeholder="Örn: 3 adet eski telefon, 2 adet tablet, 1 eski laptop..."
                    rows={3}
                    className="w-full bg-surface-dark border border-border-dark text-white text-sm rounded-lg p-3 outline-none focus:border-accent transition-colors resize-none"
                  />
                  <p className="text-gray-500 text-xs mt-1">
                    {userDescription.length} / 1000
                  </p>
                </div>
              )}
              
              <div className="text-sm text-text-subtle">
                {loading ? 'Yükleniyor...' : `${centers.length} merkez bulundu`}
              </div>
            </div>

            {/* Merkez Listesi - Sadece merkez seçimi modunda göster */}
            {selectionMode === 'center' && (
            <div className="flex flex-col gap-3">
              {loading ? (
                <div className="text-center py-12 text-text-subtle">
                  <span className="material-symbols-outlined text-5xl mb-3 opacity-30 animate-spin">refresh</span>
                  <p>Merkezler yükleniyor...</p>
                </div>
              ) : filteredCenters.length > 0 ? (
                filteredCenters.map(center => (
                  <CenterCard
                    key={center.id}
                    center={center}
                    isSelected={selectedCenter?.id === center.id}
                    onClick={() => handleSelectCenter(center)}
                  />
                ))
              ) : (
                <div className="text-center py-12 text-text-subtle">
                  <span className="material-symbols-outlined text-5xl mb-3 opacity-30">search_off</span>
                  <p>Arama kriterlerinize uygun merkez bulunamadı.</p>
                </div>
              )}
            </div>
            )}
          </div>
        </aside>

        {/* Sağ Panel - Harita ve Detaylar */}
        <main className="flex-grow flex flex-col bg-surface-dark/30">
          {/* Interactive Harita */}
          <div className="flex-grow relative min-h-[400px]">
            <MapContainer 
              center={mapCenter} 
              zoom={13} 
              style={{ height: '100%', width: '100%' }}
              className="z-0"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <MapUpdater center={selectedCenter ? [selectedCenter.latitude, selectedCenter.longitude] : null} />
              
              {/* Kullanıcı konumu göster - Konumum modu aktif ise */}
              {selectionMode === 'myLocation' && userLocation && (
                <Marker 
                  position={[userLocation.lat, userLocation.lng]}
                  icon={L.icon({
                    iconUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0iIzE0YWFiOCIgZD0iTTEyIDJDNi40OCAyIDIgNi40OCAyIDEyYzAgNC40MSAzLjA1IDguMTQgNy4xNyA5LjQ4VjIyYzAgLjU1LjQ1IDEgMSAxaDEuOTdjLjU1IDAgMS0uNDUgMS0xdi0uNTJjNC4xMi0xLjM0IDcuMTctNS4wNyA3LjE3LTkuNDhjMC01LjUyLTQuNDgtMTAtMTAtMTB6bTAgMThjLTQuNDEgMC04LTMuNTktOC04czMuNTktOCA4LTggOCAzLjU5IDggOC0zLjU5IDgtOCA4eiIvPjwvc3ZnPg==',
                    iconSize: [32, 32],
                    iconAnchor: [16, 32],
                    popupAnchor: [0, -32]
                  })}
                >
                  <Popup>
                    <div className="text-sm">
                      <strong className="block mb-1 text-accent">Konumunuz</strong>
                      <span className="text-xs text-gray-600">Lat: {userLocation.lat.toFixed(4)}, Lng: {userLocation.lng.toFixed(4)}</span>
                    </div>
                  </Popup>
                </Marker>
              )}
              
              {/* Merkezleri haritada göster */}
              {centers.map(center => (
                <Marker 
                  key={center.id} 
                  position={[center.latitude, center.longitude]}
                  eventHandlers={{
                    click: () => handleSelectCenter(center)
                  }}
                >
                  <Popup>
                    <div className="text-sm">
                      <strong className="block mb-1">{center.name}</strong>
                      <span className="text-xs text-gray-600">{center.address}</span>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>

          {/* Alt Panel - Seçili Merkez Detayları veya Konum Doğrulama */}
          {(selectedCenter || (selectionMode === 'myLocation' && userLocation)) && (
            <div className="glass-panel border-t border-border-dark p-6">
              {selectionMode === 'center' && selectedCenter ? (
                // Merkez seçimi modu
                <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                  {/* Merkez Özeti */}
                  <div className="flex items-start gap-4 flex-grow">
                    <div className="size-14 rounded-full bg-accent/20 flex items-center justify-center text-accent shrink-0">
                      <span className="material-symbols-outlined text-2xl">apartment</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">{selectedCenter.name}</h3>
                      <p className="text-text-subtle text-sm">{selectedCenter.address}</p>
                      <div className="flex gap-4 mt-2 text-sm">
                        <span className="flex items-center gap-1 text-accent">
                          <span className="material-symbols-outlined text-sm">near_me</span>
                          Seçildi
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Onay Butonu */}
                  <button
                    onClick={handleConfirmSelection}
                    disabled={submitting}
                    className="group relative overflow-hidden rounded-xl bg-primary px-8 py-4 text-lg font-bold text-white shadow-[0_0_30px_-5px_rgba(20,170,184,0.4)] transition-all hover:scale-[1.02] shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                    <div className="relative flex items-center gap-2">
                      {submitting ? (
                        <>
                          <span className="animate-spin">⏳</span>
                          <span>Gönderiliyor...</span>
                        </>
                      ) : (
                        <>
                          <span>Merkezi Seç ve Devam Et</span>
                          <span className="material-symbols-outlined">check_circle</span>
                        </>
                      )}
                    </div>
                  </button>
                </div>
              ) : (
                // Konumum modu - Açıklama ve doğrulama
                <div className="max-w-4xl mx-auto space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-2">Cihazlarınız Hakkında Açıklama</h3>
                    <p className="text-text-subtle text-sm mb-4">
                      Lütfen gönderilecek cihazlar hakkında ayrıntılı açıklama yazın ve harita üzerindeki konumunuzun doğru olduğunu teyit edin.
                    </p>
                    <textarea
                      value={userDescription}
                      onChange={(e) => setUserDescription(e.target.value)}
                      placeholder="Örn: 3 adet eski telefon, 2 adet tablet, 1 eski laptop..."
                      rows={4}
                      className="w-full bg-surface-dark border border-border-dark text-white rounded-lg p-4 outline-none focus:border-primary transition-colors resize-none"
                    />
                    <p className="text-gray-400 text-xs mt-2">
                      {userDescription.length} / 1000 karakter
                    </p>
                  </div>

                  {/* Konum Doğrulama */}
                  <div>
                    <h3 className="text-lg font-bold text-white mb-2">Konumunuz Haritada Gösteriliyor</h3>
                    <p className="text-text-subtle text-sm mb-3">Burası doğru mu? Eğer evet ise devam edin.</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-surface-dark rounded-lg p-3 border border-border-dark">
                        <p className="text-xs text-text-subtle mb-1">Enlem (Latitude)</p>
                        <p className="text-white font-bold">{userLocation?.lat.toFixed(6)}</p>
                      </div>
                      <div className="bg-surface-dark rounded-lg p-3 border border-border-dark">
                        <p className="text-xs text-text-subtle mb-1">Boylam (Longitude)</p>
                        <p className="text-white font-bold">{userLocation?.lng.toFixed(6)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Onay Butonları */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setSelectionMode('center');
                        setUserDescription('');
                        setUserLocation(null);
                      }}
                      className="flex-1 px-6 py-3 rounded-lg font-bold border border-primary text-primary hover:bg-primary/10 transition-all"
                    >
                      Geri Dön
                    </button>
                    <button
                      onClick={handleConfirmSelection}
                      disabled={submitting || !userDescription.trim()}
                      className={`flex-1 px-6 py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${
                        userDescription.trim()
                          ? 'bg-accent hover:bg-accent-dark text-background-dark shadow-glow'
                          : 'bg-border-dark text-gray-600 cursor-not-allowed'
                      }`}
                    >
                      {submitting ? (
                        <>
                          <span className="animate-spin material-symbols-outlined text-sm">sync</span>
                          Gönderiliyor...
                        </>
                      ) : (
                        <>
                          <span>Onay ve Teslimat Talep Et</span>
                          <span className="material-symbols-outlined">check_circle</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </main>
    </div>
  );
};

// Merkez Kartı Bileşeni
const CenterCard = ({ center, isSelected, onClick }: { 
  center: Center; 
  isSelected: boolean; 
  onClick: () => void;
}) => (
  <div
    onClick={onClick}
    className={`glass-panel rounded-xl p-4 cursor-pointer transition-all group hover:border-primary ${
      isSelected ? 'border-primary border-2 bg-primary/5' : 'border-border-dark'
    }`}
  >
    <div className="flex items-start justify-between mb-3">
      <div className="flex items-start gap-3 flex-grow">
        <div className="size-12 rounded-lg flex items-center justify-center shrink-0 bg-accent/20 text-accent">
          <span className="material-symbols-outlined text-2xl">location_on</span>
        </div>
        <div className="flex-grow">
          <h4 className="text-base font-bold text-white mb-1">{center.name}</h4>
          <p className="text-text-subtle text-xs">{center.address}</p>
        </div>
      </div>
      {isSelected && (
        <span className="material-symbols-outlined text-primary text-2xl">check_circle</span>
      )}
    </div>

    <div className="flex items-center justify-between text-xs border-t border-border-dark pt-3">
      <span className="flex items-center gap-1 text-text-subtle">
        <span className="material-symbols-outlined text-sm text-primary">near_me</span>
        Lat: {center.latitude.toFixed(4)}, Lng: {center.longitude.toFixed(4)}
      </span>
    </div>
  </div>
);
