import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Navbar } from '../components/layout/Navbar';
import { getCollectionPoints } from '../services/api';

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

// Custom marker icon for centers
const centerIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Map center updater component
const MapUpdater = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 13);
  }, [center, map]);
  return null;
};

const CentersPage = () => {
  const [centers, setCenters] = useState<Center[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCenter, setSelectedCenter] = useState<Center | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([39.9334, 32.8597]); // Ankara

  // Fetch centers
  useEffect(() => {
    const fetchCenters = async () => {
      try {
        const points = await getCollectionPoints();
        setCenters(points);
        
        // İlk merkezi seç
        if (points.length > 0) {
          setSelectedCenter(points[0]);
          setMapCenter([points[0].latitude, points[0].longitude]);
        }
      } catch (error) {
        console.error('Merkezler yüklenemedi:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCenters();
  }, []);

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          setMapCenter([latitude, longitude]);
        },
        (error) => {
          console.error('Konum alınamadı:', error);
        }
      );
    }
  }, []);

  // Filter centers
  const filteredCenters = centers.filter(center =>
    center.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    center.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle center selection
  const handleCenterSelect = (center: Center) => {
    setSelectedCenter(center);
    setMapCenter([center.latitude, center.longitude]);
  };

  return (
    <div className="bg-background-dark min-h-screen flex flex-col font-display">
      <Navbar />
      <div className="flex flex-col lg:flex-row flex-grow overflow-hidden">
        {/* Sol Kenar Çubuğu (Filtreler ve Liste) */}
        <aside className="w-full lg:w-96 bg-surface-dark border-r border-border-dark overflow-y-auto">
          <div className="p-6">
            {/* Başlık */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">location_on</span>
                Geri Dönüşüm Merkezleri
              </h2>
              <p className="text-gray-400 text-sm mt-2">
                Yakınınızdaki e-atık toplama noktalarını keşfedin
              </p>
            </div>

            {/* Arama */}
            <div className="mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Merkez veya adres ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 pl-12 bg-background-dark border border-border-dark rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                />
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                  search
                </span>
              </div>
            </div>

            {/* İstatistikler */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-background-dark/50 border border-border-dark rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-primary text-sm">
                    location_on
                  </span>
                  <span className="text-gray-400 text-xs">Toplam Merkez</span>
                </div>
                <p className="text-white text-2xl font-bold">{centers.length}</p>
              </div>
              <div className="bg-background-dark/50 border border-border-dark rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-accent text-sm">
                    eco
                  </span>
                  <span className="text-gray-400 text-xs">Aktif</span>
                </div>
                <p className="text-white text-2xl font-bold">{centers.length}</p>
              </div>
            </div>

            {/* Merkez Listesi */}
            <div className="space-y-3">
              {loading ? (
                <div className="text-center py-8">
                  <span className="material-symbols-outlined animate-spin text-primary text-4xl">
                    refresh
                  </span>
                  <p className="text-gray-400 mt-2">Merkezler yükleniyor...</p>
                </div>
              ) : filteredCenters.length === 0 ? (
                <div className="text-center py-8">
                  <span className="material-symbols-outlined text-gray-600 text-4xl">
                    search_off
                  </span>
                  <p className="text-gray-400 mt-2">Merkez bulunamadı</p>
                </div>
              ) : (
                filteredCenters.map((center) => (
                  <button
                    key={center.id}
                    onClick={() => handleCenterSelect(center)}
                    className={`w-full text-left p-4 rounded-lg border transition-all ${
                      selectedCenter?.id === center.id
                        ? 'bg-primary/10 border-primary'
                        : 'bg-background-dark/50 border-border-dark hover:border-primary/50'
                    }`}
                  >
                    <h3 className="text-white font-bold mb-1 flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-sm">
                        location_on
                      </span>
                      {center.name}
                    </h3>
                    <p className="text-gray-400 text-sm">{center.address}</p>
                    {userLocation && (
                      <p className="text-primary text-xs mt-2 flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">near_me</span>
                        {calculateDistance(
                          userLocation.lat,
                          userLocation.lng,
                          center.latitude,
                          center.longitude
                        ).toFixed(1)} km
                      </p>
                    )}
                  </button>
                ))
              )}
            </div>
          </div>
        </aside>

        {/* Sağ Taraf: Harita Alanı */}
        <main className="flex-grow relative bg-[#0f1a1c]">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <span className="material-symbols-outlined animate-spin text-6xl text-primary mb-4">
                  refresh
                </span>
                <h3 className="text-white text-xl font-bold">Harita Yükleniyor...</h3>
              </div>
            </div>
          ) : (
            <MapContainer
              center={mapCenter}
              zoom={13}
              className="h-full w-full"
              zoomControl={true}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <MapUpdater center={mapCenter} />
              
              {/* User location marker */}
              {userLocation && (
                <Marker position={[userLocation.lat, userLocation.lng]}>
                  <Popup>
                    <div className="text-center">
                      <span className="material-symbols-outlined text-primary">
                        person_pin_circle
                      </span>
                      <p className="font-bold">Konumunuz</p>
                    </div>
                  </Popup>
                </Marker>
              )}

              {/* Center markers */}
              {filteredCenters.map((center) => (
                <Marker
                  key={center.id}
                  position={[center.latitude, center.longitude]}
                  icon={centerIcon}
                  eventHandlers={{
                    click: () => handleCenterSelect(center),
                  }}
                >
                  <Popup>
                    <div className="p-2">
                      <h3 className="font-bold text-lg mb-2">{center.name}</h3>
                      <p className="text-sm text-gray-600 mb-3">{center.address}</p>
                      {userLocation && (
                        <p className="text-primary text-sm font-bold">
                          📍 {calculateDistance(
                            userLocation.lat,
                            userLocation.lng,
                            center.latitude,
                            center.longitude
                          ).toFixed(1)} km uzaklıkta
                        </p>
                      )}
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          )}

          {/* Legend */}
          <div className="absolute bottom-6 right-6 bg-surface-dark/95 backdrop-blur-lg border border-border-dark rounded-lg p-4 shadow-lg">
            <h4 className="text-white font-bold mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">info</span>
              Harita Açıklaması
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-white text-xs">person</span>
                </div>
                <span className="text-gray-300">Konumunuz</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-white text-xs">location_on</span>
                </div>
                <span className="text-gray-300">Toplama Merkezi</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

// Calculate distance between two coordinates (Haversine formula)
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

export default CentersPage;