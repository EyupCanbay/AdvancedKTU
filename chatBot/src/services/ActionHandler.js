const axios = require('axios');
const chalk = require('chalk');

class ActionHandler {
  constructor(wasteServiceUrl) {
    this.wasteServiceUrl = wasteServiceUrl || 'http://localhost:8081';
  }

  /**
   * Execute action based on intent
   * @param {string} action - Action to execute
   * @param {string} message - Original user message
   * @returns {Promise<Object>} - Action result
   */
  async executeAction(action, message) {
    switch (action) {
      case 'showNearbyPoints':
        return await this.showNearbyPoints();
      
      case 'showRecycleGuide':
        return this.showRecycleGuide();
      
      case 'showEWasteInfo':
        return this.showEWasteInfo();
      
      case 'estimateValue':
        return this.estimateValue();
      
      case 'showImpact':
        return await this.showImpact();
      
      case 'greet':
        return this.greet();
      
      case 'showHelp':
        return this.showHelp();
      
      case 'reportProblem':
        return this.reportProblem();
      
      default:
        return null;
    }
  }

  async showNearbyPoints() {
    try {
      const response = await axios.get(`${this.wasteServiceUrl}/api/points`, {
        timeout: 5000
      });
      
      const points = response.data.slice(0, 3);
      
      let message = chalk.green('📍 Size en yakın toplama noktaları:\n\n');
      
      points.forEach((point, idx) => {
        message += chalk.cyan(`${idx + 1}. ${point.name}\n`);
        message += `   📍 ${point.address}\n`;
        message += `   🗺️  Konum: ${point.latitude}, ${point.longitude}\n\n`;
      });
      
      message += chalk.yellow('💡 Haritada görmek için web uygulamasını ziyaret edin.');
      
      return { message, skipGemini: true };
    } catch (error) {
      return {
        message: chalk.red('❌ Toplama noktaları yüklenemedi. Servis çalışıyor mu kontrol edin.'),
        skipGemini: true
      };
    }
  }

  showRecycleGuide() {
    const message = chalk.green(`
📱 ${chalk.bold('E-atık Bildirimi Nasıl Yapılır?')}

${chalk.cyan('1.')} Ana sayfada "Atık Bildir" butonuna tıklayın
${chalk.cyan('2.')} Cihazınızın fotoğrafını yükleyin
${chalk.cyan('3.')} AI analiz sonucunu bekleyin (30 saniye)
${chalk.cyan('4.')} Size en yakın toplama noktasını seçin
${chalk.cyan('5.')} Tamamlandı! 🎉

${chalk.yellow('💡 İpucu:')} Cihazın tüm taraflarının görüneceği şekilde fotoğraf çekin.

Hemen başlamak için: ${chalk.blue('http://localhost:5173')}
    `);
    
    return { message, skipGemini: true };
  }

  showEWasteInfo() {
    const message = chalk.green(`
🌍 ${chalk.bold('E-Atık Nedir?')}

Elektronik atık (e-atık), kullanım ömrünü tamamlamış elektronik cihazlardır.

${chalk.cyan('📱 Örnekler:')}
• Telefonlar, tabletler
• Bilgisayarlar, laptoplar
• Televizyonlar
• Akıllı saatler
• Ev aletleri

${chalk.red('⚠️ Tehlikeleri:')}
• Ağır metaller (kurşun, cıva, kadmiyum)
• Toprak ve su kirliliği
• İnsan sağlığına zarar
• Doğada 1000+ yıl kalabilir

${chalk.green('✅ Çözüm:')}
Güvenli geri dönüşüm ile hem doğayı koruyor, hem değerli materyalleri kurtarıyoruz!
    `);
    
    return { message, skipGemini: true };
  }

  estimateValue() {
    const message = chalk.green(`
💰 ${chalk.bold('Cihaz Değeri Hesaplama')}

Cihazınızın değerini öğrenmek için web uygulamasında fotoğraf yükleyin.

${chalk.cyan('📊 Örnek Değerler:')}
📱 iPhone: 250-1500₺
💻 Laptop: 500-3000₺
⌚ Akıllı Saat: 100-800₺
📺 TV: 300-2000₺

${chalk.yellow('💡 Değer şunlara bağlıdır:')}
• Marka ve model
• Durumu (çalışıyor mu?)
• Yaşı
• Aksesuarları

Web uygulaması: ${chalk.blue('http://localhost:5173')}
    `);
    
    return { message, skipGemini: true };
  }

  async showImpact() {
    try {
      const response = await axios.get(`${this.wasteServiceUrl}/api/impact-analysis`, {
        timeout: 5000
      });
      
      const impact = response.data;
      
      const message = chalk.green(`
🌱 ${chalk.bold('Toplam Çevresel Etkimiz:')}

${chalk.cyan('🌍')} ${impact.totalCO2Saved.toFixed(1)} kg CO₂ tasarrufu
${chalk.cyan('💧')} ${impact.totalWaterSaved.toFixed(0)} L su korundu
${chalk.cyan('⚡')} ${impact.totalEnergyEquivalent.toFixed(0)} kWh enerji
${chalk.cyan('🌳')} ${impact.treesEquivalent.toFixed(0)} yıl ağaç emilimi

${chalk.yellow('📱')} ${impact.totalWasteProcessed} cihaz geri dönüştürüldü
${chalk.yellow('⚠️')} ${impact.highRiskWastes} yüksek riskli atık güvenle imha edildi

${chalk.green('Bu, şu anlama geliyor:')}
• ${impact.carsOffRoad.toFixed(1)} km araba yolculuğu
• ${impact.phonesCharged} telefon şarjı
• ${(impact.totalEnergyEquivalent / 30).toFixed(1)} evin günlük enerji ihtiyacı

${chalk.blue('Daha fazla detay: http://localhost:5173/impact')}
      `);
      
      return { message, skipGemini: true };
    } catch (error) {
      return {
        message: chalk.red('❌ Etki istatistikleri yüklenemedi. Servis çalışıyor mu kontrol edin.'),
        skipGemini: true
      };
    }
  }

  greet() {
    const message = chalk.green(`
👋 ${chalk.bold('Merhaba! Ben CarboBot.')}

${chalk.cyan('E-Atık Koruyucuları platformunun karbon ayak izi uzmanıyım.')}

${chalk.yellow('Size nasıl yardımcı olabilirim?')}

${chalk.green('💡 Popüler sorular:')}
• "En yakın toplama noktası nerede?"
• "Nasıl atık bildirebilirim?"
• "E-atık nedir ve neden önemli?"
• "Cihazımın değeri ne kadar?"
• "Ne kadar CO₂ tasarrufu yaptık?"

${chalk.dim('💬 İpucu: "yardım" yazarak tüm yeteneklerimi görebilirsiniz.')}
    `);
    
    return { message, skipGemini: true };
  }

  showHelp() {
    const message = chalk.green(`
🤖 ${chalk.bold('CarboBot - Yardım Menüsü')}

${chalk.cyan('📍 Konum & Harita')}
• "En yakın toplama noktası nerede?"
• "Bana en yakın merkez hangisi?"
• "Adres ve yol tarifi"

${chalk.cyan('♻️ Geri Dönüşüm Rehberi')}
• "Nasıl atık bildirebilirim?"
• "Hangi cihazlar kabul ediliyor?"
• "Geri dönüşüm süreci nasıl işliyor?"
• "Telefonu nasıl geri dönüştürebilirim?"

${chalk.cyan('💰 Cihaz Değerlendirme')}
• "Cihazımın değeri ne kadar?"
• "iPhone ne kadar eder?"
• "Hangi cihazlar daha değerli?"

${chalk.cyan('📊 Çevresel Etki & İstatistikler')}
• "Toplam CO₂ tasarrufumuz ne kadar?"
• "Ne kadar enerji tasarrufu yaptık?"
• "Çevresel etkimiz nedir?"
• "Su tasarrufu istatistikleri"

${chalk.cyan('🎓 E-Atık Eğitimi')}
• "E-atık nedir?"
• "E-atığın çevreye zararları neler?"
• "Geri dönüşüm neden bu kadar önemli?"
• "Hangi metaller geri kazanılıyor?"

${chalk.yellow('⚙️ Sistem Komutları:')}
• ${chalk.cyan('yardım / help')} - Bu menüyü göster
• ${chalk.cyan('temizle / clear')} - Ekranı temizle
• ${chalk.cyan('geçmiş / history')} - Konuşma geçmişini göster
• ${chalk.cyan('çıkış / exit')} - Uygulamadan çık

${chalk.dim('💬 Aklına takılan her şeyi sorabilirsin! Ben buradayım. 🌱')}
    `);
    
    return { message, skipGemini: true };
  }

  reportProblem() {
    const message = chalk.yellow(`
😔 ${chalk.bold('Üzgünüm, bir sorunla karşılaştınız.')}

${chalk.cyan('Lütfen sorunu detaylı anlatır mısınız?')}

${chalk.yellow('📝 Şunları belirtirseniz yardımcı olur:')}
• Ne yapmaya çalışıyordunuz?
• Hangi adımda hata oluştu?
• Aldığınız hata mesajı neydi?
• Hangi cihazı kullanıyorsunuz?

${chalk.cyan('Alternatif İletişim:')}
📧 Email: support@ewasteheroes.com
💬 WhatsApp: +90 xxx xxx xx xx

${chalk.green('Sorununuzu en kısa sürede çözeceğiz!')}
    `);
    
    return { message, skipGemini: true };
  }
}

module.exports = ActionHandler;
