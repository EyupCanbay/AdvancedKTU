import React from 'react';
import { Link } from 'react-router-dom';

const RegisterPage = () => {
  return (
    <div className="bg-[#112022] text-white min-h-screen flex flex-col font-display selection:bg-primary selection:text-white">
      <main className="flex-grow flex items-center justify-center relative px-4 py-24 w-full overflow-hidden">
        {/* Arka Plan Dekorasyonu */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[5%] left-[20%] w-[20%] h-[20%] bg-primary/5 rounded-full blur-[80px]"></div>
        </div>

        <div className="glass-panel w-full max-w-[520px] rounded-2xl p-8 md:p-10 relative z-10">
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 border border-primary/20">
              <span className="material-symbols-outlined text-primary text-2xl">person_add</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-center text-white mb-2">Yeni Bir Hesap Oluştur</h2>
            <p className="text-gray-400 text-center text-sm md:text-base">Geri dönüşüm hareketine katılın ve dünyayı değiştirin.</p>
          </div>

          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            {/* Ad Soyad */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-300 ml-1" htmlFor="fullname">Ad Soyad</label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary text-[20px]">person</span>
                <input className="block w-full rounded-xl border border-[#244447] bg-[#152A26] text-white placeholder-gray-500 pl-11 pr-4 py-3.5 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all sm:text-sm" id="fullname" placeholder="Adınız ve Soyadınız" type="text"/>
              </div>
            </div>

            {/* E-posta */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-300 ml-1" htmlFor="email">E-posta</label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary text-[20px]">mail</span>
                <input className="block w-full rounded-xl border border-[#244447] bg-[#152A26] text-white placeholder-gray-500 pl-11 pr-4 py-3.5 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all sm:text-sm" id="email" placeholder="ornek@email.com" type="email"/>
              </div>
            </div>

            {/* Şifre Satırı */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-300 ml-1" htmlFor="password">Şifre</label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary text-[20px]">lock</span>
                  <input className="block w-full rounded-xl border border-[#244447] bg-[#152A26] text-white placeholder-gray-500 pl-11 pr-4 py-3.5 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all sm:text-sm" id="password" placeholder="••••••••" type="password"/>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-300 ml-1" htmlFor="password_confirm">Şifre Tekrar</label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary text-[20px]">lock_reset</span>
                  <input className="block w-full rounded-xl border border-[#244447] bg-[#152A26] text-white placeholder-gray-500 pl-11 pr-4 py-3.5 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all sm:text-sm" id="password_confirm" placeholder="••••••••" type="password"/>
                </div>
              </div>
            </div>

            <button className="w-full py-3.5 px-4 rounded-xl text-sm font-bold text-[#11221c] bg-primary hover:bg-primary-dark transition-all active:scale-[0.99]">
              Kayıt Ol
            </button>

            <div className="relative flex justify-center text-sm py-2">
              <span className="px-2 text-gray-500 text-xs uppercase tracking-wider">veya</span>
            </div>

            <button type="button" className="w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-xl border border-[#244447] bg-white/5 hover:bg-white/10 text-white text-sm font-medium transition-all">
              <span>Google ile Kayıt Ol</span>
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-400">
              Zaten hesabınız var mı? 
              <Link 
      to="/login" 
      className="font-bold text-primary hover:text-primary-dark ml-1 hover:underline"
    >Giriş Yap</Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RegisterPage;