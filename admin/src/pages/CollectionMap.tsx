import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvent } from 'react-leaflet';
import { MapPin, Plus, Edit2, Trash2 } from 'lucide-react';
import L from 'leaflet';
import { usePointStore, CollectionPoint } from '../store/pointStore';
import api from '../lib/api';
import toast from 'react-hot-toast';

// Fix leaflet icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface ClickPoint {
  lat: number;
  lng: number;
}

const CollectionMap: React.FC = () => {
  const { points, addPoint, updatePoint, deletePoint, setPoints } = usePointStore();
  const [selectedLocation, setSelectedLocation] = useState<ClickPoint | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    latitude: 0,
    longitude: 0,
  });

  useEffect(() => {
    fetchPoints();
  }, []);

  const fetchPoints = async () => {
    try {
      const response = await api.get('/api/points');
      setPoints(response.data);
    } catch (error: any) {
      const errorMsg = error.response?.data?.error || 'Noktalar yüklenemedi';
      toast.error(errorMsg);
    }
  };

  const MapClickHandler: React.FC = () => {
    useMapEvent('click', (e) => {
      console.log('Map clicked at:', e.latlng);
      setSelectedLocation({ lat: e.latlng.lat, lng: e.latlng.lng });
      setFormData({
        name: '',
        address: '',
        latitude: e.latlng.lat,
        longitude: e.latlng.lng,
      });
      setShowAddModal(true);
      setEditingId(null);
    });
    return null;
  };

  const handleSavePoint = async () => {
    if (!formData.name || !formData.address) {
      toast.error('Tüm alanları doldurunuz');
      return;
    }

    try {
      if (editingId) {
        const response = await api.put(`/api/points/${editingId}`, formData);
        const updatedPoint: CollectionPoint = {
          id: editingId,
          ...formData,
        };
        updatePoint(editingId, updatedPoint);
        toast.success('Nokta güncellendi');
      } else {
        const response = await api.post('/api/points', formData);
        const newPoint: CollectionPoint = {
          id: response.data.id || Date.now().toString(),
          ...formData,
        };
        addPoint(newPoint);
        toast.success('Nokta eklendi');
      }
      setShowAddModal(false);
      setEditingId(null);
      setSelectedLocation(null);
    } catch (error: any) {
      const errorMsg = error.response?.data?.error || error.message || 'İşlem başarısız';
      console.error('Point save error:', error);
      toast.error(errorMsg);
    }
  };

  const handleEditPoint = (point: CollectionPoint) => {
    console.log('Editing point:', point);
    setFormData({
      name: point.name,
      address: point.address,
      latitude: point.latitude,
      longitude: point.longitude,
    });
    setEditingId(point.id);
    setShowAddModal(true);
  };

  const handleDeletePoint = async (id: string) => {
    if (confirm('Bu noktayı silmek istediğinizden emin misiniz?')) {
      try {
        await api.delete(`/api/points/${id}`);
        deletePoint(id);
        toast.success('Nokta silindi');
      } catch (error: any) {
        const errorMsg = error.response?.data?.error || 'Silme başarısız';
        toast.error(errorMsg);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Toplama Noktaları</h1>
          <div className="text-sm text-gray-600 bg-blue-50 px-4 py-2 rounded">
            💡 Harita üzerine tıklayarak yeni nokta ekleyebilirsiniz
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map */}
          <div className={`lg:col-span-2 bg-white rounded-lg shadow overflow-hidden h-96 lg:h-[600px] ${showAddModal ? 'pointer-events-none opacity-50' : ''}`}>
            <MapContainer
              center={[39.9, 32.8]}
              zoom={6}
              className="w-full h-full"
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; OpenStreetMap contributors'
              />
              <MapClickHandler />
              
              {/* Existing Points */}
              {points.map((point) => (
                <Marker
                  key={point.id}
                  position={[point.latitude, point.longitude]}
                >
                  <Popup>
                    <div className="w-48">
                      <h3 className="font-semibold text-gray-900">{point.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{point.address}</p>
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => handleEditPoint(point)}
                          className="flex-1 bg-blue-500 text-white text-sm py-1 rounded hover:bg-blue-600"
                        >
                          Düzenle
                        </button>
                        <button
                          onClick={() => handleDeletePoint(point.id)}
                          className="flex-1 bg-red-500 text-white text-sm py-1 rounded hover:bg-red-600"
                        >
                          Sil
                        </button>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}

              {/* New Point Marker */}
              {selectedLocation && (
                <Marker position={[selectedLocation.lat, selectedLocation.lng]}>
                  <Popup>Yeni nokta ({selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)})</Popup>
                </Marker>
              )}
            </MapContainer>
          </div>

          {/* Points List */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <MapPin size={20} />
              Noktalar ({points.length})
            </h2>
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {points.map((point) => (
                <div key={point.id} className="p-3 border border-gray-200 rounded-lg">
                  <h3 className="font-semibold text-gray-900 text-sm">{point.name}</h3>
                  <p className="text-xs text-gray-600 mt-1">{point.address}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {point.latitude.toFixed(4)}, {point.longitude.toFixed(4)}
                  </p>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => handleEditPoint(point)}
                      className="flex-1 text-blue-500 text-xs hover:text-blue-700 flex items-center justify-center gap-1"
                    >
                      <Edit2 size={14} /> Düzenle
                    </button>
                    <button
                      onClick={() => handleDeletePoint(point.id)}
                      className="flex-1 text-red-500 text-xs hover:text-red-700 flex items-center justify-center gap-1"
                    >
                      <Trash2 size={14} /> Sil
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Add/Edit Modal */}
        {showAddModal ? (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={(e) => {
              // Modal arka planına tıklandığında kapat
              if (e.target === e.currentTarget) {
                setShowAddModal(false);
                setEditingId(null);
                setSelectedLocation(null);
              }
            }}
          >
            <div 
              className="bg-white rounded-lg p-6 w-96"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold mb-4">
                {editingId ? 'Noktayı Düzenle' : 'Yeni Nokta Ekle'}
              </h2>
              
              <input
                type="text"
                placeholder="Nokta Adı"
                value={formData.name}
                onChange={(e) => {
                  console.log('Name changed:', e.target.value);
                  setFormData({ ...formData, name: e.target.value });
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded mb-3 focus:ring-2 focus:ring-blue-500"
              />
              
              <input
                type="text"
                placeholder="Adres"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded mb-3 focus:ring-2 focus:ring-blue-500"
              />
              
              <input
                type="number"
                placeholder="Enlem"
                value={formData.latitude}
                onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded mb-3 focus:ring-2 focus:ring-blue-500"
                step="0.0001"
              />
              
              <input
                type="number"
                placeholder="Boylam"
                value={formData.longitude}
                onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded mb-4 focus:ring-2 focus:ring-blue-500"
                step="0.0001"
              />
              
              <div className="flex gap-2">
                <button
                  onClick={handleSavePoint}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded"
                >
                  Kaydet
                </button>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingId(null);
                    setSelectedLocation(null);
                  }}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 rounded"
                >
                  İptal
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default CollectionMap;
