import { Link, useNavigate } from 'react-router-dom';
import React, { useState } from 'react';

const LoginPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Form State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Backend LoginRequest yapısına göre istek
      const response = await fetch('http://localhost:8080/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Giriş bilgileri hatalı");
      }

      // 1. Token'ı kaydet
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // 2. Başarılı giriş sonrası ana sayfaya yönlendir
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#112022] min-h-screen flex flex-col font-display text-white">
      <main className="flex-grow flex items-center justify-center p-4 relative overflow-hidden">
        <div className="w-full max-w-[480px] relative z-10">
          <div className="glass-panel shadow-glow rounded-xl p-8 md:p-10 flex flex-col gap-6">
            
            <div className="flex flex-col items-center text-center">
              <h1 className="text-2xl font-bold text-white mb-2">Giriş Yap</h1>
              {error && <p className="text-red-400 text-sm bg-red-400/10 p-2 rounded w-full">{error}</p>}
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-gray-200 text-sm font-medium">E-posta</label>
                <input 
                  className="w-full bg-[#11221c] border border-[#244447] text-white rounded-lg p-3.5 outline-none focus:border-primary" 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ornek@email.com" 
                  required 
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-gray-200 text-sm font-medium">Şifre</label>
                <div className="relative">
                  <input 
                    className="w-full bg-[#11221c] border border-[#244447] text-white rounded-lg p-3.5 pr-10 outline-none focus:border-primary" 
                    type={showPassword ? "text" : "password"} 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••" 
                    required 
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {showPassword ? 'visibility' : 'visibility_off'}
                    </span>
                  </button>
                </div>
              </div>

              <button 
                disabled={loading}
                className="w-full bg-primary hover:bg-primary-dark text-[#11221c] font-bold rounded-lg py-3.5 transition-all disabled:opacity-50"
              >
                {loading ? "Giriş Yapılıyor..." : "Giriş Yap"}
              </button>
            </form>

            <p className="text-center text-sm text-gray-400">
              Henüz hesabınız yok mu? <Link to="/register" className="text-primary font-bold hover:underline ml-1">Hemen Kayıt Ol</Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;