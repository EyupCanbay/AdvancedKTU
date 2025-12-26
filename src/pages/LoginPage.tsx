import { Link } from 'react-router-dom'; // Bunu eklemeyi unutma
import React, { useState } from 'react';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="bg-background-dark min-h-screen flex flex-col font-display text-white">
      <main className="flex-grow flex items-center justify-center p-4 relative overflow-hidden">
        {/* Arka Plan Işımaları */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-teal-link/10 rounded-full blur-[80px] pointer-events-none"></div>

        <div className="w-full max-w-[480px] relative z-10">
          <div className="glass-panel shadow-glow rounded-xl p-8 md:p-10 flex flex-col gap-6">
            
            {/* Header */}
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary mb-2">
                <span className="material-symbols-outlined text-[28px]">forest</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight">
                Geleceği Korumak İçin<br/>Giriş Yap
              </h1>
              <p className="text-gray-400 text-sm">Hesabınıza erişmek için bilgilerinizi girin.</p>
            </div>

            {/* Form */}
            <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-5 mt-2">
              <div className="flex flex-col gap-2">
                <label className="text-gray-200 text-sm font-medium" htmlFor="email">E-posta</label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary text-[20px]">mail</span>
                  <input 
                    className="w-full bg-[#11221c] border border-input-border text-white text-sm rounded-lg focus:ring-1 focus:ring-primary focus:border-primary block p-3.5 pl-10 outline-none transition-all" 
                    id="email" type="email" placeholder="ornek@email.com" required 
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-gray-200 text-sm font-medium" htmlFor="password">Şifre</label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary text-[20px]">lock</span>
                  <input 
                    className="w-full bg-[#11221c] border border-input-border text-white text-sm rounded-lg focus:ring-1 focus:ring-primary focus:border-primary block p-3.5 pl-10 pr-10 outline-none transition-all" 
                    id="password" type={showPassword ? "text" : "password"} placeholder="••••••••" required 
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {showPassword ? 'visibility' : 'visibility_off'}
                    </span>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer text-gray-300">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-600 bg-[#11221c] text-primary focus:ring-primary" />
                  Beni hatırla
                </label>
                <a href="#" className="text-teal-link hover:underline font-medium">Şifremi Unuttum?</a>
              </div>

              <button className="w-full bg-primary hover:bg-[#0da673] text-background-dark font-bold rounded-lg py-3.5 flex items-center justify-center gap-2 shadow-lg shadow-primary/20 transition-all active:scale-95">
                Giriş Yap <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </button>

              <div className="flex items-center gap-4 my-2 text-gray-500 text-xs uppercase">
                <div className="flex-grow border-t border-gray-700"></div>
                veya
                <div className="flex-grow border-t border-gray-700"></div>
              </div>

              <button type="button" className="w-full bg-white/5 hover:bg-white/10 border border-input-border text-white rounded-lg py-3.5 flex items-center justify-center gap-3 transition-all">
                {/* Google Icon SVG buraya gelecek */}
                Google ile Devam Et
              </button>
            </form>

            <p className="text-center text-sm text-gray-400">
              Henüz hesabınız yok mu? <Link 
      to="/register" 
      className="text-primary font-bold hover:underline transition-all ml-1"
    >
      Hemen Kayıt Ol
    </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;