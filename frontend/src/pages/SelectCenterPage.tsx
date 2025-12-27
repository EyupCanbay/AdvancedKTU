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

  const wasteData = state?.stats || {};
  const wasteID = state?.wasteID || ''; // Waste ID'yi state'den alıyoruz

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
  };

  // Harita merkezi - seçili merkez varsa onun konumunu göster, yoksa Türkiye ortası
  const mapCenter: [number, number] = selectedCenter 
    ? [selectedCenter.latitude, selectedCenter.longitude]
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
                />
              </div>
              
              <div className="text-sm text-text-subtle">
                {loading ? 'Yükleniyor...' : `${centers.length} merkez bulundu`}
              </div>
            </div>

            {/* Merkez Listesi */}
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

          {/* Alt Panel - Seçili Merkez Detayları ve Onay */}
          {selectedCenter && (
            <div className="glass-panel border-t border-border-dark p-6">
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
