import React, { useState, useEffect } from 'react';
import { Trash2, Eye, EyeOff, Search, Filter } from 'lucide-react';
import { useWasteStore } from '../store/wasteStore';
import api from '../lib/api';
import toast from 'react-hot-toast';

const Waste: React.FC = () => {
  const { wastes, setWastes, setLoading, updateStatus, deleteWaste } = useWasteStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showImageModal, setShowImageModal] = useState<string | null>(null);

  useEffect(() => {
    fetchWastes();
  }, []);

  const fetchWastes = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/wastes');
      setWastes(response.data || []);
    } catch (error: any) {
      const errorMsg = error.response?.data?.error || 'Atık verileri yüklenemedi';
      toast.error(errorMsg);
      setWastes([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredWastes = (wastes || []).filter((waste) => {
    const matchesSearch =
      (waste.user_id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      waste.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || waste.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await api.patch(`/api/wastes/${id}`, { status: newStatus });
      updateStatus(id, newStatus);
      toast.success(`Durum güncellendi: ${newStatus}`);
    } catch (error: any) {
      const errorMsg = error.response?.data?.error || 'Durum güncellenemedi';
      toast.error(errorMsg);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Kayıt silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      await api.delete(`/api/wastes/${id}`);
      deleteWaste(id);
      toast.success('Kayıt silindi');
    } catch (error: any) {
      const errorMsg = error.response?.data?.error || 'Silme başarısız';
      toast.error(errorMsg);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'analyzing':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
        return 'bg-blue-100 text-blue-800';
      case 'collected':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskColor = (riskDegree: number) => {
    if (riskDegree >= 8) return 'bg-red-100 text-red-800';
    if (riskDegree >= 5) return 'bg-orange-100 text-orange-800';
    return 'bg-green-100 text-green-800';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-6 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Atık Yönetimi</h1>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Kullanıcı ID veya atık ID ile ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter size={20} className="text-gray-500" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tüm Durumlar</option>
              <option value="analyzing">Analiz Ediliyor</option>
              <option value="pending">Beklemede</option>
              <option value="collected">Toplandı</option>
            </select>
          </div>
        </div>

        {/* Wastes Grid */}
        <div className="space-y-4">
          {filteredWastes.map((waste) => (
            <div key={waste.id} className="bg-white rounded-lg shadow hover:shadow-lg transition">
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Atık #{waste.id}</h3>
                    <p className="text-sm text-gray-600">Kullanıcı: {waste.user_id}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <select
                      value={waste.status}
                      onChange={(e) => handleStatusChange(waste.id, e.target.value)}
                      className={`px-3 py-1 rounded-full text-sm font-medium border-0 ${getStatusColor(waste.status)} cursor-pointer`}
                    >
                      <option value="analyzing">Analiz Ediliyor</option>
                      <option value="pending">Beklemede</option>
                      <option value="collected">Toplandı</option>
                    </select>
                    <button
                      onClick={() => setExpandedId(expandedId === waste.id ? null : waste.id)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      {expandedId === waste.id ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {/* Details */}
                {waste.ai_analysis && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="bg-gray-50 p-3 rounded">
                      <p className="text-xs text-gray-600">Risk Seviyesi</p>
                      <p className={`text-lg font-bold mt-1 ${getRiskColor(waste.ai_analysis?.riskDegree || 0).split(' ')[0]}`}>
                        {waste.ai_analysis?.riskDegree || 0}/10
                      </p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded">
                      <p className="text-xs text-gray-600">CO₂ Emisyonu</p>
                      <p className="text-lg font-bold text-green-600 mt-1">
                        {(waste.ai_analysis?.CO2Emission || 0).toFixed(0)}kg
                      </p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded">
                      <p className="text-xs text-gray-600">Geri Dönüştürülebilirlik</p>
                      <p className="text-lg font-bold text-purple-600 mt-1">
                        {Math.min(100, Math.round(((waste.ai_analysis?.riskDegree || 0) / 10) * 100))}%
                      </p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded">
                      <p className="text-xs text-gray-600">Tarih</p>
                      <p className="text-sm font-semibold mt-1">{waste.created_at}</p>
                    </div>
                  </div>
                )}

                {/* Expanded Details */}
                {expandedId === waste.id && waste.ai_analysis && (
                  <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-gray-900 mb-3">AI Analiz Sonuçları</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      <div>
                        <p className="text-xs text-gray-600">Telefon Şarj</p>
                        <p className="text-sm font-semibold">{waste.ai_analysis?.fullyChargingPhones || 0}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Temiz Su</p>
                        <p className="text-sm font-semibold">{waste.ai_analysis?.cleanWater || 0}L</p>
                      </div>
                      {waste.ai_analysis && Object.entries(waste.ai_analysis).map(([key, value]) => {
                        if (typeof value === 'number' && !['riskDegree', 'cost', 'CO2Emission', 'fullyChargingPhones', 'cleanWater'].includes(key)) {
                          return (
                            <div key={key}>
                              <p className="text-xs text-gray-600 capitalize">{key}</p>
                              <p className="text-sm font-semibold">{value}</p>
                            </div>
                          );
                        }
                      })}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-wrap gap-2">
                  <select
                    value={waste.status}
                    onChange={(e) => handleStatusChange(waste.id, e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="analyzing">Analiz Ediliyor</option>
                    <option value="pending">Beklemede</option>
                    <option value="collected">Toplandı</option>
                  </select>

                  {waste.imagePath && (
                    <button
                      onClick={() => setShowImageModal(waste.id)}
                      className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm"
                    >
                      Görseli Gör
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(waste.id)}
                    className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm flex items-center gap-1 ml-auto"
                  >
                    <Trash2 size={16} />
                    Sil
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Image Modal */}
        {showImageModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Atık Görseli</h2>
                <button
                  onClick={() => setShowImageModal(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
              <img
                src={wastes.find((w) => w.id === showImageModal)?.imagePath}
                alt="Waste"
                className="w-full h-auto rounded-lg bg-gray-100"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Waste;
