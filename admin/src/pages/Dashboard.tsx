import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, Trash2, MapPin, AlertCircle } from 'lucide-react';
import api from '../lib/api';
import toast from 'react-hot-toast';

interface Stats {
  totalUsers: number;
  activeWastes: number;
  collectionPoints: number;
  riskAlerts: number;
}

interface WasteData {
  month: string;
  analyzed: number;
  pending: number;
  collected: number;
}

interface StatusDataItem {
  name: string;
  value: number;
  color: string;
}

interface CO2DataItem {
  week: string;
  emission: number;
}

interface ImpactAnalysis {
  totalCO2Saved: number;
  totalEnergyEquivalent: number;
  totalWaterSaved: number;
  treesEquivalent: number;
  carsOffRoad: number;
  phonesCharged: number;
  lightHoursTotal: number;
  totalWasteProcessed: number;
  highRiskWastes: number;
  lastUpdated: string;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    activeWastes: 0,
    collectionPoints: 0,
    riskAlerts: 0,
  });
  const [wasteData, setWasteData] = useState<WasteData[]>([]);
  const [statusData, setStatusData] = useState<StatusDataItem[]>([]);
  const [co2Data, setCO2Data] = useState<CO2DataItem[]>([]);
  const [impactData, setImpactData] = useState<ImpactAnalysis | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const [usersRes, wasteRes, pointsRes, impactRes] = await Promise.all([
        api.get('/users').catch(() => ({ data: [] })),
        api.get('/api/wastes').catch(() => ({ data: [] })),
        api.get('/api/points').catch(() => ({ data: [] })),
        api.get('/api/impact-analysis').catch(() => ({ data: null })),
      ]);

      const wastes = wasteRes.data || [];
      const users = usersRes.data || [];
      const points = pointsRes.data || [];
      const impact = impactRes.data;

      // Store impact data
      if (impact) {
        setImpactData(impact);
      }

      // Calculate stats
      const riskCount = wastes.filter((w: any) => 
        w.aiAnalysis?.riskDegree >= 7
      ).length;

      const analyzedCount = wastes.filter((w: any) => w.status === 'analyzing').length;
      const pendingCount = wastes.filter((w: any) => w.status === 'pending').length;
      const collectedCount = wastes.filter((w: any) => w.status === 'collected').length;

      setStats({
        totalUsers: users.length,
        activeWastes: wastes.length,
        collectionPoints: points.length,
        riskAlerts: riskCount,
      });

      // Generate trend data (mock - will show actual counts from DB)
      const trendData: WasteData[] = [
        { month: 'Oca', analyzed: Math.ceil(analyzedCount * 0.3), pending: Math.ceil(pendingCount * 0.3), collected: Math.ceil(collectedCount * 0.3) },
        { month: 'Şub', analyzed: Math.ceil(analyzedCount * 0.4), pending: Math.ceil(pendingCount * 0.4), collected: Math.ceil(collectedCount * 0.4) },
        { month: 'Mar', analyzed: Math.ceil(analyzedCount * 0.5), pending: Math.ceil(pendingCount * 0.5), collected: Math.ceil(collectedCount * 0.5) },
        { month: 'Nis', analyzed: Math.ceil(analyzedCount * 0.6), pending: Math.ceil(pendingCount * 0.6), collected: Math.ceil(collectedCount * 0.6) },
        { month: 'May', analyzed: Math.ceil(analyzedCount * 0.8), pending: Math.ceil(pendingCount * 0.8), collected: Math.ceil(collectedCount * 0.8) },
        { month: 'Haz', analyzed: analyzedCount, pending: pendingCount, collected: collectedCount },
      ];
      setWasteData(trendData);

      // Status distribution
      const total = analyzedCount + pendingCount + collectedCount || 1;
      setStatusData([
        { name: 'Analiz Ediliyor', value: Math.round((analyzedCount / total) * 100), color: '#f59e0b' },
        { name: 'Beklemede', value: Math.round((pendingCount / total) * 100), color: '#3b82f6' },
        { name: 'Toplandı', value: Math.round((collectedCount / total) * 100), color: '#10b981' },
      ]);

      // CO2 data from waste analysis
      const totalCO2 = wastes.reduce((sum: number, w: any) => 
        sum + (w.aiAnalysis?.CO2Emission || 0), 0
      );
      const weeks = [
        { week: '1. Hafta', emission: Math.ceil(totalCO2 * 0.15) },
        { week: '2. Hafta', emission: Math.ceil(totalCO2 * 0.25) },
        { week: '3. Hafta', emission: Math.ceil(totalCO2 * 0.3) },
        { week: '4. Hafta', emission: Math.ceil(totalCO2 * 0.3) },
      ];
      setCO2Data(weeks);
    } catch (error) {
      toast.error('İstatistikler yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-6 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Toplam Kullanıcı', value: stats.totalUsers, icon: Users, color: 'bg-blue-500' },
            { label: 'Aktif Atık', value: stats.activeWastes, icon: Trash2, color: 'bg-green-500' },
            { label: 'Toplama Noktaları', value: stats.collectionPoints, icon: MapPin, color: 'bg-purple-500' },
            { label: 'Risk Uyarıları', value: stats.riskAlerts, icon: AlertCircle, color: 'bg-red-500' },
          ].map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  </div>
                  <div className={`${stat.color} p-3 rounded-full`}>
                    <Icon className="text-white" size={24} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Gerçek Zamanlı Etki Analizi */}
        {impactData && (
          <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="bg-green-500 w-3 h-3 rounded-full mr-3 animate-pulse"></span>
              Gerçek Zamanlı Etki Analizi
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg p-4 shadow">
                <p className="text-sm text-gray-600 mb-1">Toplam CO₂ Tasarrufu</p>
                <p className="text-2xl font-bold text-green-600">{impactData.totalCO2Saved.toFixed(1)} kg</p>
              </div>
              
              <div className="bg-white rounded-lg p-4 shadow">
                <p className="text-sm text-gray-600 mb-1">Ağaç Eşdeğeri</p>
                <p className="text-2xl font-bold text-green-700">{impactData.treesEquivalent.toFixed(0)} yıl</p>
              </div>
              
              <div className="bg-white rounded-lg p-4 shadow">
                <p className="text-sm text-gray-600 mb-1">Tasarruf Edilen Su</p>
                <p className="text-2xl font-bold text-blue-600">{impactData.totalWaterSaved.toFixed(0)} L</p>
              </div>
              
              <div className="bg-white rounded-lg p-4 shadow">
                <p className="text-sm text-gray-600 mb-1">Enerji Eşdeğeri</p>
                <p className="text-2xl font-bold text-yellow-600">{impactData.totalEnergyEquivalent.toFixed(0)} kWh</p>
              </div>
              
              <div className="bg-white rounded-lg p-4 shadow">
                <p className="text-sm text-gray-600 mb-1">Şarj Edilen Telefon</p>
                <p className="text-2xl font-bold text-purple-600">{impactData.phonesCharged}</p>
              </div>
              
              <div className="bg-white rounded-lg p-4 shadow">
                <p className="text-sm text-gray-600 mb-1">LED Aydınlatma</p>
                <p className="text-2xl font-bold text-indigo-600">{impactData.lightHoursTotal.toFixed(0)} saat</p>
              </div>
              
              <div className="bg-white rounded-lg p-4 shadow">
                <p className="text-sm text-gray-600 mb-1">Araba Eşdeğeri</p>
                <p className="text-2xl font-bold text-orange-600">{impactData.carsOffRoad.toFixed(1)} km</p>
              </div>
              
              <div className="bg-white rounded-lg p-4 shadow">
                <p className="text-sm text-gray-600 mb-1">Yüksek Risk Atık</p>
                <p className="text-2xl font-bold text-red-600">{impactData.highRiskWastes}</p>
              </div>
            </div>
            
            <div className="mt-4 text-right text-xs text-gray-500">
              Son Güncelleme: {new Date(impactData.lastUpdated).toLocaleString('tr-TR')}
            </div>
          </div>
        )}

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Atık Analiz Trendi */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Atık Analiz Trendi</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={wasteData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="analyzed" stroke="#3b82f6" name="Analiz Ediliyor" />
                <Line type="monotone" dataKey="pending" stroke="#f59e0b" name="Beklemede" />
                <Line type="monotone" dataKey="collected" stroke="#10b981" name="Toplandı" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Durum Dağılımı */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Durum Dağılımı</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CO2 Emissions Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Haftalık CO₂ Emisyonu (kg)</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={co2Data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="emission" fill="#10b981" name="CO₂ (kg)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
