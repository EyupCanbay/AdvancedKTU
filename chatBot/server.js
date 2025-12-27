require('dotenv').config();
const express = require('express');
const cors = require('cors');
const OllamaService = require('./src/services/GeminiService');
const IntentRecognizer = require('./src/services/IntentRecognizer');
const ActionHandler = require('./src/services/ActionHandler');
const PromptBuilder = require('./src/services/PromptBuilder');

const app = express();

// Configuration
const PORT = process.env.PORT || 8083;
const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'gpt-oss:120b-cloud';
const OLLAMA_API_KEY = process.env.OLLAMA_API_KEY || null;
const WASTE_SERVICE_URL = process.env.WASTE_SERVICE_URL || 'http://localhost:8081';

// Middleware
app.use(cors());
app.use(express.json());

// Initialize services
const ollamaService = new OllamaService(OLLAMA_URL, OLLAMA_MODEL, "2e076dc923dd4c039d90db1ed2e95222.wJhjlJsz-qjUWufvNf6Nr1GI");
const actionHandler = new ActionHandler(WASTE_SERVICE_URL);

// In-memory conversation storage (her kullanıcı için ayrı)
const conversations = new Map();

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'CarboBot API',
    model: OLLAMA_MODEL,
    timestamp: new Date().toISOString()
  });
});

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, sessionId = 'default' } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ 
        error: 'Message is required',
        message: 'Lütfen bir mesaj girin.'
      });
    }

    // Get or create conversation history
    if (!conversations.has(sessionId)) {
      conversations.set(sessionId, []);
    }
    const conversationHistory = conversations.get(sessionId);

    // Add user message to history
    conversationHistory.push({ 
      role: 'user', 
      content: message.trim() 
    });

    // Keep history manageable (last 10 exchanges)
    if (conversationHistory.length > 20) {
      conversations.set(sessionId, conversationHistory.slice(-20));
    }

    // 1. Recognize intent
    const recognition = IntentRecognizer.recognize(message);
    
    // 2. Execute action if confidence is high
    let response = null;
    if (recognition.confidence > 0.5 && recognition.action) {
      const actionResult = await actionHandler.executeAction(recognition.action, message);
      
      if (actionResult && actionResult.skipGemini) {
        // Use action response directly (remove ANSI colors)
        response = actionResult.message.replace(/\x1B\[[0-9;]*m/g, '');
      }
    }

    // 3. If no action response, use Ollama AI
    if (!response) {
      const context = {
        currentPage: 'web',
        lastIntent: recognition.intent,
        lastAction: recognition.action
      };

      const systemPrompt = PromptBuilder.buildFullPrompt(context);
      response = await ollamaService.chatWithContext(systemPrompt, conversationHistory);
    }

    // Add bot response to history
    conversationHistory.push({ 
      role: 'assistant', 
      content: response 
    });

    // Return response
    res.json({
      success: true,
      message: response,
      intent: recognition.intent,
      confidence: recognition.confidence,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Chat error:', error);
    
    // Handle specific errors
    if (error.message.includes('Ollama')) {
      return res.status(503).json({ 
        error: 'Service unavailable',
        message: 'Ollama servisi şu anda kullanılamıyor. Lütfen daha sonra tekrar deneyin.'
      });
    }

    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Bir hata oluştu. Lütfen tekrar deneyin.'
    });
  }
});

// Get conversation history
app.get('/api/chat/history/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  const history = conversations.get(sessionId) || [];
  
  res.json({
    success: true,
    history,
    count: history.length
  });
});

// Clear conversation history
app.delete('/api/chat/history/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  conversations.delete(sessionId);
  
  res.json({
    success: true,
    message: 'Konuşma geçmişi temizlendi.'
  });
});

// Start server
app.listen(PORT, async () => {
  console.log('\n╔══════════════════════════════════════════════════════════════╗');
  console.log('║         🤖 CarboBot API Server Started 🌍                   ║');
  console.log('╚══════════════════════════════════════════════════════════════╝\n');
  console.log(`🚀 Server running on: http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`💬 Chat endpoint: POST http://localhost:${PORT}/api/chat`);
  console.log(`🤖 Model: ${OLLAMA_MODEL}`);
  
  // Check Ollama health
  const isHealthy = await ollamaService.checkHealth();
  if (isHealthy) {
    console.log('✅ Ollama bağlantısı başarılı!');
  } else {
    console.log('⚠️  Ollama servisine bağlanılamadı!');
    console.log('💡 Ollama\'yı başlatmak için: ollama serve');
    console.log(`💡 Model yüklemek için: ollama pull ${OLLAMA_MODEL}`);
  }
  
  console.log('\n📡 CORS enabled for all origins');
  console.log('⏳ Ready to accept requests...\n');
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n🛑 Server kapatılıyor...');
  console.log('👋 Görüşürüz!\n');
  process.exit(0);
});
