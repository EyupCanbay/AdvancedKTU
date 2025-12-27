const axios = require('axios');

class OllamaService {
  constructor(baseUrl = 'http://localhost:11434', model = 'gpt-oss:120b-cloud', apiKey = null) {
    this.baseUrl = baseUrl;
    this.model = model;
    this.apiKey = apiKey;
    this.options = {
      temperature: 0.7,
      num_predict: 500,
      top_k: 40,
      top_p: 0.95
    };
  }

  /**
   * Get axios config with optional API key
   * @private
   */
  getAxiosConfig(timeout = 60000) {
    const config = { timeout };
    
    if (this.apiKey) {
      config.headers = {
        'Authorization': `Bearer ${this.apiKey}`
      };
    }
    
    return config;
  }

  /**
   * Chat with context and conversation history
   * @param {string} systemPrompt - System instructions
   * @param {Array} conversationHistory - Previous messages
   * @returns {Promise<string>} - Bot response
   */
  async chatWithContext(systemPrompt, conversationHistory) {
    try {
      // Format messages for Ollama
      const messages = this.formatMessages(systemPrompt, conversationHistory);
      
      // Call Ollama API
      const response = await axios.post(
        `${this.baseUrl}/api/chat`,
        {
          model: this.model,
          messages,
          stream: false,
          options: this.options
        },
        this.getAxiosConfig(60000)
      );
      
      return response.data.message.content;
    } catch (error) {
      console.error('Ollama API Error:', error.message);
      
      if (error.code === 'ECONNREFUSED') {
        throw new Error('Ollama servisine bağlanılamadı. Ollama çalışıyor mu kontrol edin.');
      }
      
      throw new Error(`Ollama API hatası: ${error.message}`);
    }
  }

  /**
   * Format messages for Ollama API
   * @private
   */
  formatMessages(systemPrompt, history) {
    const messages = [
      { 
        role: 'system', 
        content: systemPrompt
      }
    ];
    
    // Add conversation history
    for (const msg of history) {
      messages.push({
        role: msg.role,
        content: msg.content
      });
    }
    
    return messages;
  }

  /**
   * Simple single message generation (no history)
   * @param {string} prompt - User prompt
   * @returns {Promise<string>} - Bot response
   */
  async generate(prompt) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/api/generate`,
        {
          model: this.model,
          prompt,
          stream: false,
          options: this.options
        },
        this.getAxiosConfig(60000)
      );
      
      return response.data.response;
    } catch (error) {
      console.error('Ollama Generation Error:', error.message);
      throw new Error(`Yanıt oluşturulamadı: ${error.message}`);
    }
  }

  /**
   * Check if Ollama is running and model is available
   * @returns {Promise<boolean>}
   */
  async checkHealth() {
    try {
      const response = await axios.get(`${this.baseUrl}/api/tags`, this.getAxiosConfig(5000));
      const models = response.data.models || [];
      const modelExists = models.some(m => m.name === this.model);
      
      if (!modelExists) {
        console.warn(`⚠️  Model "${this.model}" bulunamadı. Yüklü modeller:`);
        models.forEach(m => console.log(`   - ${m.name}`));
      }
      
      return modelExists;
    } catch (error) {
      return false;
    }
  }
}

module.exports = OllamaService;
