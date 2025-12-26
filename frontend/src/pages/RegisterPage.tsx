import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Backend RegisterRequest yapısına uygun state
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    password_confirm: "",
    city: "",
    district: "",
    full_address: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.password_confirm) {
      setError("Şifreler eşleşmiyor!");
      return;
    }

    setLoading(true);

    // İsim ve Soyisimi ayırıyoruz
    const nameParts = formData.fullname.trim().split(" ");
    const firstName = nameParts[0];
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";

    // Backend'in beklediği JSON yapısı
    const payload = {
      email: formData.email,
      password: formData.password,
      first_name: firstName,
      last_name: lastName,
      addresses: [
        {
          title: "Birincil Adres",
          city: formData.city,
          district: formData.district,
          full_address: formData.full_address
        }
      ]
    };

    try {
      const response = await fetch('http://localhost:8080/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Kayıt başarısız");
      }

      // Başarılıysa giriş sayfasına yönlendir
      navigate('/login');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#112022] text-white min-h-screen flex flex-col font-display">
      <main className="flex-grow flex items-center justify-center relative px-4 py-24 w-full">
        <div className="glass-panel w-full max-w-[520px] rounded-2xl p-8 relative z-10">
          <h2 className="text-2xl font-bold text-center mb-6">Kayıt Ol</h2>
          
          {error && <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg mb-4 text-sm">{error}</div>}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <input className="w-full bg-[#152A26] border border-[#244447] p-3.5 rounded-xl outline-none focus:border-primary" 
              id="fullname" placeholder="Ad Soyad" type="text" onChange={handleChange} required />
            
            <input className="w-full bg-[#152A26] border border-[#244447] p-3.5 rounded-xl outline-none focus:border-primary" 
              id="email" placeholder="E-posta" type="email" onChange={handleChange} required />

            {/* Adres Bölümü - Backend zorunlu kıldığı için eklendi */}
            <div className="grid grid-cols-2 gap-4">
              <input className="bg-[#152A26] border border-[#244447] p-3.5 rounded-xl outline-none" 
                id="city" placeholder="Şehir" onChange={handleChange} required />
              <input className="bg-[#152A26] border border-[#244447] p-3.5 rounded-xl outline-none" 
                id="district" placeholder="İlçe" onChange={handleChange} required />
            </div>
            <input className="w-full bg-[#152A26] border border-[#244447] p-3.5 rounded-xl outline-none" 
              id="full_address" placeholder="Tam Adres (Sokak, No...)" onChange={handleChange} required />

            <div className="grid grid-cols-2 gap-4">
              <input className="bg-[#152A26] border border-[#244447] p-3.5 rounded-xl outline-none" 
                id="password" placeholder="Şifre" type="password" onChange={handleChange} required />
              <input className="bg-[#152A26] border border-[#244447] p-3.5 rounded-xl outline-none" 
                id="password_confirm" placeholder="Şifre Tekrar" type="password" onChange={handleChange} required />
            </div>

            <button disabled={loading} className="w-full py-3.5 rounded-xl bg-primary text-[#11221c] font-bold hover:bg-primary-dark transition-all">
              {loading ? "Kaydediliyor..." : "Kayıt Ol"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-400">
            Zaten hesabınız var mı? <Link to="/login" className="text-primary font-bold hover:underline ml-1">Giriş Yap</Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default RegisterPage;