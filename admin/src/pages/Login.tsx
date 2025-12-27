import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, AlertCircle } from 'lucide-react';
import api from '../lib/api';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setToken } = useAuthStore();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('Login isteği gönderiliyor:', { email, password });
      const response = await api.post('/auth/login', {
        email,
        password,
      });

      console.log('Login başarılı:', response.data);
      const { token, user } = response.data;
      
      // Token ve user bilgilerini store'a kaydet
      setToken(token);
      useAuthStore.setState({ user });
      
      // Role kontrolü
      if (user.role !== 'admin') {
        setError('Sadece admin kullanıcılar giriş yapabilir!');
        toast.error('Sadece admin kullanıcılar giriş yapabilir!');
        setToken(null);
        useAuthStore.setState({ user: null });
        setLoading(false);
        return;
      }
      
      toast.success(`Hoş geldiniz, ${user.first_name}!`);
      navigate('/');
    } catch (err: any) {
      console.error('Login hatası:', err);
      const errorMsg = err.response?.data?.error || err.message || 'Giriş başarısız. Kimlik bilgilerinizi kontrol edin.';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md">
        <div className="flex items-center justify-center mb-8">
          <div className="bg-blue-600 p-3 rounded-full">
            <LogIn className="text-white" size={32} />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">Admin Panel</h1>
        <p className="text-center text-gray-600 mb-8">Advanced KTU Yönetim Sistemi</p>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="text-red-600 mt-0.5 flex-shrink-0" size={20} />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ornek@example.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Şifre
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 rounded-lg transition"
          >
            {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-gray-700">
            <strong>Demo Hesaplar:</strong>
          </p>
          <p className="text-xs text-gray-600 mt-2">
            Email: admin@example.com<br />
            Şifre: password
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
