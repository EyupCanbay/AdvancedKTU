class IntentRecognizer {
  static intents = {
    FIND_LOCATION: {
      keywords: ['nerede', 'yakın', 'toplama noktası', 'toplama merkezi', 'adres', 'konum', 'bırakabilirim', 'götürebilirim'],
      patterns: [
        /en yakın.*nerede/i,
        /yakın.*toplama/i,
        /nerede.*bırak/i,
        /nereye.*götür/i,
        /hangi.*nokta/i
      ],
      action: 'showNearbyPoints'
    },
    
    HOW_TO_RECYCLE: {
      keywords: ['nasıl', 'geri dönüşüm', 'bildir', 'yükle', 'süreç', 'adımlar', 'işlem'],
      patterns: [
        /nasıl.*geri.*dönüş/i,
        /nasıl.*bildir/i,
        /süreç.*ne/i,
        /ne.*yapmalı/i
      ],
      action: 'showRecycleGuide'
    },
    
    WHAT_IS_EWASTE: {
      keywords: ['e-atık nedir', 'elektronik atık', 'nedir', 'ne demek', 'tanım', 'açıklama'],
      patterns: [
        /e-atık.*nedir/i,
        /elektronik.*atık.*ne/i,
        /nedir.*e-atık/i
      ],
      action: 'showEWasteInfo'
    },
    
    CHECK_DEVICE_VALUE: {
      keywords: ['değer', 'fiyat', 'kaç para', 'ne kadar', 'ücret', 'kazanç'],
      patterns: [
        /ne kadar.*değer/i,
        /kaç.*para/i,
        /değer.*ne/i,
        /fiyat.*ne/i
      ],
      action: 'estimateValue'
    },
    
    SHOW_IMPACT: {
      keywords: ['etki', 'tasarruf', 'co2', 'çevre', 'katkı', 'fayda', 'istatistik'],
      patterns: [
        /ne kadar.*etki/i,
        /çevre.*etki/i,
        /co2.*tasarruf/i,
        /istatistik/i
      ],
      action: 'showImpact'
    },
    
    GREETING: {
      keywords: ['merhaba', 'selam', 'hey', 'hi', 'hello', 'günaydın', 'iyi günler'],
      patterns: [
        /^merhaba$/i,
        /^selam$/i,
        /^hey$/i
      ],
      action: 'greet'
    },
    
    HELP: {
      keywords: ['yardım', 'help', 'ne yapabilirim', 'seçenekler', 'komutlar'],
      patterns: [
        /yardım/i,
        /ne.*yapabilir/i,
        /hangi.*özellik/i
      ],
      action: 'showHelp'
    },
    
    REPORT_PROBLEM: {
      keywords: ['sorun', 'hata', 'çalışmıyor', 'problem', 'bug', 'şikayet'],
      patterns: [
        /sorun.*var/i,
        /çalışmıyor/i,
        /hata.*aldım/i
      ],
      action: 'reportProblem'
    }
  };

  /**
   * Recognize user intent from message
   * @param {string} message - User message
   * @returns {Object} - Intent, confidence, and action
   */
  static recognize(message) {
    const scores = {};
    const normalized = message.toLowerCase().trim();
    
    // Calculate scores for each intent
    for (const [intentName, intent] of Object.entries(this.intents)) {
      let score = 0;
      
      // Keyword matching (60% weight)
      const keywordMatches = intent.keywords.filter(kw => 
        normalized.includes(kw.toLowerCase())
      ).length;
      
      if (keywordMatches > 0) {
        score += (keywordMatches / intent.keywords.length) * 0.6;
      }
      
      // Pattern matching (30% weight)
      const patternMatches = intent.patterns.filter(pattern => 
        pattern.test(message)
      ).length;
      
      if (patternMatches > 0) {
        score += 0.3;
      }
      
      scores[intentName] = score;
    }
    
    // Get highest scoring intent
    const entries = Object.entries(scores);
    if (entries.length === 0) {
      return { intent: 'GENERAL', confidence: 0.5, action: 'chat' };
    }
    
    const [topIntent, confidence] = entries.sort(([,a], [,b]) => b - a)[0];
    
    // Minimum confidence threshold
    if (confidence < 0.3) {
      return { intent: 'GENERAL', confidence: 0.5, action: 'chat' };
    }
    
    return {
      intent: topIntent,
      confidence,
      action: this.intents[topIntent].action
    };
  }
}

module.exports = IntentRecognizer;
