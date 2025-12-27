import { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: '👋 Merhaba! Ben CarboBot, karbon ayak izi ve e-atık konusunda uzmanım. Size nasıl yardımcı olabilirim?',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      // Call CarboBot API
      const response = await fetch(origin(`:8083/api/chat`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputValue,
          sessionId: 'web-chat-' + Math.random().toString(36).substr(2, 9)
        })
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();

      const botResponse: Message = {
        role: 'assistant',
        content: data.message,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    } catch (error) {
      console.error('Chat error:', error);

      // Fallback to local response if API fails
      const botResponse: Message = {
        role: 'assistant',
        content: '😔 Üzgünüm, şu anda bir bağlantı sorunu yaşıyorum. Lütfen daha sonra tekrar deneyin veya sayfayı yenileyin.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }
  };

  const getBotResponse = (input: string): string => {
    const lower = input.toLowerCase();

    // Selamlaşma
    if (lower.match(/^(merhaba|selam|hey|hi|hello|günaydın|iyi günler)$/)) {
      return '👋 Merhaba! Ben CarboBot, size e-atık yönetimi ve çevresel etki konusunda yardımcı olabilirim. Ne öğrenmek istersiniz?';
    }

    // Konum ve toplama noktaları
    if (lower.includes('nerede') || lower.includes('yakın') || lower.includes('toplama') ||
      lower.includes('nokta') || lower.includes('merkez') || lower.includes('adres') ||
      lower.includes('harita') || lower.includes('konum')) {
      return '📍 Size en yakın toplama noktalarını bulmak için haritaya bakabilirsiniz. Şu anda sistemde kayıtlı onlarca toplama merkezi var. İsterseniz bulunduğunuz bölgeyi söylerseniz size yardımcı olabilirim!';
    }

    // Atık bildirme
    if (lower.includes('nasıl') || lower.includes('bildir') || lower.includes('süreç') ||
      lower.includes('yükle') || lower.includes('fotoğraf') || lower.includes('analiz') ||
      lower.includes('başlat')) {
      return '📱 E-atık bildirmek çok kolay!\n\n1️⃣ "Atık Bildir" butonuna tıklayın\n2️⃣ Cihazınızın fotoğrafını yükleyin\n3️⃣ AI analizi bekleyin (30 saniye)\n4️⃣ Size en yakın toplama noktasını seçin\n5️⃣ Tamamlandı! 🎉\n\nHemen denemek ister misiniz?';
    }

    // CO2, karbon, çevresel etki
    if (lower.includes('co2') || lower.includes('karbon') || lower.includes('etki') ||
      lower.includes('tasarruf') || lower.includes('çevre') || lower.includes('katkı') ||
      lower.includes('istatistik') || lower.includes('su') || lower.includes('enerji')) {
      return '🌱 Harika soru! Toplam çevresel etkimizi görmek için "Etki Dashboard" sayfasını ziyaret edebilirsiniz.\n\n📊 Şu anda görüntüleyebileceğiniz veriler:\n• CO₂ tasarrufu (kg)\n• Su korunması (litre)\n• Enerji tasarrufu (kWh)\n• Ağaç eşdeğeri\n• Ve daha fazlası!\n\nGerçek zamanlı güncelleniyoruz! 🔄';
    }

    // Değer, fiyat
    if (lower.includes('değer') || lower.includes('fiyat') || lower.includes('kaç') ||
      lower.includes('para') || lower.includes('ücret') || lower.includes('kazanç') ||
      lower.includes('ne kadar')) {
      return '💰 Cihazınızın değerini öğrenmek için fotoğraf yükleyin!\n\nAI sistemimiz:\n• Cihaz türünü tanır\n• Durumunu analiz eder\n• Piyasa değerini hesaplar\n• Geri dönüşüm değerini gösterir\n\n📱 iPhone, laptop, tablet gibi cihazlar genelde 250-3000₺ arasında değer alıyor. Hemen deneyin!';
    }

    // E-atık nedir
    if (lower.includes('e-atık') || lower.includes('elektronik') || lower.includes('nedir') ||
      lower.includes('ne demek') || lower.includes('tanım')) {
      return '🌍 E-atık, kullanım ömrünü tamamlamış elektronik cihazlardır.\n\n📱 Örnekler:\n• Telefonlar, tabletler\n• Bilgisayarlar, laptoplar\n• Televizyonlar\n• Akıllı saatler\n• Ev aletleri\n\n⚠️ Tehlikeleri:\n• Ağır metaller (kurşun, cıva)\n• Toprak ve su kirliliği\n• İnsan sağlığına zarar\n• Doğada 1000+ yıl kalır\n\n✅ Çözüm: Güvenli geri dönüşüm!';
    }

    // Yardım
    if (lower.includes('yardım') || lower.includes('help') || lower.includes('ne yapabilir') ||
      lower.includes('komut') || lower.includes('özellik')) {
      return '🤖 Size şu konularda yardımcı olabilirim:\n\n📍 Konum: "En yakın toplama noktası nerede?"\n♻️ Süreç: "Nasıl atık bildirebilirim?"\n🌱 Etki: "CO₂ tasarrufumuz ne kadar?"\n💰 Değer: "Cihazımın değeri ne kadar?"\n🎓 Eğitim: "E-atık nedir?"\n\nDaha fazla soru sormaktan çekinmeyin! 😊';
    }

    // Sorun, hata
    if (lower.includes('sorun') || lower.includes('hata') || lower.includes('çalışmıyor') ||
      lower.includes('problem') || lower.includes('bug')) {
      return '😔 Üzgünüm, bir sorun mu yaşıyorsunuz?\n\n📝 Lütfen sorunu detaylı anlatır mısınız?\n• Ne yapmaya çalışıyordunuz?\n• Hangi adımda hata oluştu?\n• Hata mesajı neydi?\n\nAlternatif İletişim:\n📧 support@ewasteheroes.com\n💬 0850 xxx xx xx\n\nSize yardımcı olmak için buradayım!';
    }

    // Rozet, puan, liderlik
    if (lower.includes('rozet') || lower.includes('puan') || lower.includes('lider') ||
      lower.includes('sıralama') || lower.includes('başarı') || lower.includes('ödül')) {
      return '🏆 Gamification sistemimiz çok heyecan verici!\n\n🎖️ Kazanabileceğiniz rozetler:\n• İlk Adım (1 atık)\n• Yeşil Kahraman (5 atık)\n• Çevre Savunucusu (10 atık)\n• Dünya Kurtaran (50 atık)\n\n📊 Liderlik tablosunda yerinizi alın ve diğer kullanıcılarla yarışın!\n\nHer atık bildirimi puanınızı artırır! 🚀';
    }

    // Güvenlik, veri
    if (lower.includes('güvenli') || lower.includes('veri') || lower.includes('gizli') ||
      lower.includes('kişisel')) {
      return '🔒 Güvenliğiniz bizim önceliğimiz!\n\n✅ Cihazlarınızdaki veriler:\n• Fiziksel olarak yok edilir\n• Profesyonel ekipler tarafından temizlenir\n• Geri dönüşüm öncesi silinir\n\n🛡️ Kişisel bilgileriniz:\n• Şifrelenmiş olarak saklanır\n• 3. taraflarla paylaşılmaz\n• KVKK\'ya uygun işlenir\n\nVerileriniz güvende!';
    }

    // Genel fallback - daha spesifik
    return `🤔 "${input}" hakkında size nasıl yardımcı olabilirim?\n\n💡 Bunları sorabilirsiniz:\n• "En yakın toplama noktası nerede?"\n• "Nasıl atık bildirebilirim?"\n• "CO₂ tasarrufumuz ne kadar?"\n• "Telefonumun değeri ne kadar?"\n• "E-atık nedir?"\n\nYa da başka bir şey mi öğrenmek istiyorsunuz? 😊`;
  };

  const quickActions = [
    { icon: 'location_on', text: 'En yakın nokta', action: 'En yakın toplama noktası nerede?' },
    { icon: 'recycling', text: 'Nasıl bildirilir?', action: 'Nasıl atık bildirebilirim?' },
    { icon: 'eco', text: 'CO₂ tasarrufu', action: 'CO₂ tasarrufumuz ne kadar?' },
    { icon: 'help', text: 'Yardım', action: 'Bana yardım eder misin?' }
  ];

  const handleQuickAction = (action: string) => {
    setInputValue(action);
    setTimeout(() => sendMessage(), 100);
  };

  return (
    <>
      {/* Chat Button - Her zaman en üstte */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-[150] size-16 rounded-full bg-gradient-to-br from-primary to-accent text-white shadow-2xl hover:scale-110 transition-all duration-300 flex items-center justify-center ${isOpen ? 'rotate-0' : ''
          }`}
        aria-label="Chat with CarboBot"
      >
        <span className={`material-symbols-outlined text-3xl transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}>
          {isOpen ? 'close' : 'smart_toy'}
        </span>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-[145] w-[380px] h-[600px] bg-background-dark/95 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-slide-up">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-accent p-5 flex items-center gap-3">
            <div className="size-12 rounded-full bg-white/20 flex items-center justify-center animate-pulse">
              <span className="material-symbols-outlined text-2xl text-white">smart_toy</span>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-white text-lg">CarboBot</h3>
              <p className="text-white/80 text-xs">Karbon Ayak İzi Asistanı</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-green-400 animate-pulse"></div>
              <button
                onClick={() => setIsOpen(false)}
                className="size-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors"
                aria-label="Close chat"
              >
                <span className="material-symbols-outlined text-white text-xl">close</span>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div
                  className={`size-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user'
                    ? 'bg-primary/20 text-primary'
                    : 'bg-accent/20 text-accent'
                    }`}
                >
                  <span className="material-symbols-outlined text-lg">
                    {msg.role === 'user' ? 'person' : 'smart_toy'}
                  </span>
                </div>
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-3 ${msg.role === 'user'
                    ? 'bg-primary text-white rounded-tr-sm'
                    : 'bg-white/5 text-gray-200 rounded-tl-sm'
                    }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  <span className="text-[10px] opacity-60 mt-1 block">
                    {msg.timestamp.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3">
                <div className="size-8 rounded-full bg-accent/20 text-accent flex items-center justify-center">
                  <span className="material-symbols-outlined text-lg">smart_toy</span>
                </div>
                <div className="bg-white/5 rounded-2xl rounded-tl-sm px-4 py-3">
                  <div className="flex gap-1">
                    <div className="size-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="size-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="size-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          {messages.length <= 2 && (
            <div className="px-4 pb-3">
              <div className="grid grid-cols-2 gap-2">
                {quickActions.map((qa, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleQuickAction(qa.action)}
                    className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-xs text-gray-300 transition-colors border border-white/5"
                  >
                    <span className="material-symbols-outlined text-sm text-primary">{qa.icon}</span>
                    <span className="truncate">{qa.text}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-white/5">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Mesajınızı yazın..."
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-colors"
              />
              <button
                onClick={sendMessage}
                disabled={!inputValue.trim()}
                className="size-11 rounded-xl bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-white">send</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
