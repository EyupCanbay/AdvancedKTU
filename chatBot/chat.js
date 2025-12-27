require('dotenv').config();
const readline = require("readline");
const chalk = require('chalk');
const ora = require('ora');
const OllamaService = require('./src/services/GeminiService');
const IntentRecognizer = require('./src/services/IntentRecognizer');
const ActionHandler = require('./src/services/ActionHandler');
const PromptBuilder = require('./src/services/PromptBuilder');

// Configuration
const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'gpt-oss:120b-cloud';
const OLLAMA_API_KEY = process.env.OLLAMA_API_KEY || "2e076dc923dd4c039d90db1ed2e95222.wJhjlJsz-qjUWufvNf6Nr1GI";
const WASTE_SERVICE_URL = process.env.WASTE_SERVICE_URL || 'http://localhost:8081';
const MAX_HISTORY = parseInt(process.env.MAX_HISTORY) || 10;

// Initialize services
const ollamaService = new OllamaService(OLLAMA_URL, OLLAMA_MODEL, OLLAMA_API_KEY);

const actionHandler = new ActionHandler(WASTE_SERVICE_URL);

// Conversation state
let conversationHistory = [];
const context = {
  currentPage: 'cli',
  lastIntent: null,
  lastAction: null
};

// Terminal interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: chalk.cyan('💬 Sen: ')
});

// Welcome message
console.clear();
console.log(chalk.green.bold('\n╔══════════════════════════════════════════════════════════════╗'));
console.log(chalk.cyan.bold('║         🤖 CarboBot - Karbon Ayak İzi Asistanı 🌍          ║'));
console.log(chalk.green.bold('║              E-Atık Koruyucuları Platformu                   ║'));
console.log(chalk.green.bold('╚══════════════════════════════════════════════════════════════╝\n'));

// Check Ollama health
(async () => {
  const spinner = ora(chalk.dim('Ollama bağlantısı kontrol ediliyor...')).start();
  const isHealthy = await ollamaService.checkHealth();
  
  if (isHealthy) {
    spinner.succeed(chalk.green(`Ollama bağlantısı başarılı! Model: ${OLLAMA_MODEL}`));
  } else {
    spinner.warn(chalk.yellow('⚠️  Ollama servisine bağlanılamadı veya model bulunamadı.'));
    console.log(chalk.dim('💡 Ollama\'yı başlatmak için: ollama serve'));
    console.log(chalk.dim(`💡 Model yüklemek için: ollama pull ${OLLAMA_MODEL}\n`));
  }
  
  console.log(chalk.cyan('👋 Merhaba! Ben CarboBot, karbon ayak izi ve e-atık konusunda uzmanım.'));
  console.log(chalk.yellow('🌱 Size çevre dostu kararlar almanızda yardımcı olacağım!\n'));
  console.log(chalk.dim('💡 Komutlar: "yardım" | "geçmiş" | "temizle" | "çıkış"'));
  console.log(chalk.dim('💬 Örnek: "En yakın toplama noktası nerede?" veya "CO₂ tasarrufumuz ne kadar?"\n'));
  
  rl.prompt();
})();

// Handle user input
rl.on('line', async (input) => {
  const userInput = input.trim();
  
  // Handle empty input
  if (!userInput) {
    rl.prompt();
    return;
  }
  
  // Handle exit commands
  if (['exit', 'quit', 'çıkış', 'çık'].includes(userInput.toLowerCase())) {
    console.log(chalk.green('\n👋 Görüşmek üzere! Çevre için yaptıklarınız harika! 🌍💚'));
    console.log(chalk.cyan('✨ Unutma: Her geri dönüştürdüğün cihaz, daha yeşil bir gelecek demek!\n'));
    rl.close();
    return;
  }
  
  // Handle clear command
  if (['clear', 'temizle'].includes(userInput.toLowerCase())) {
    console.clear();
    console.log(chalk.green('✨ Ekran temizlendi!\n'));
    rl.prompt();
    return;
  }
  
  // Handle history command
  if (['history', 'geçmiş', 'konuşma'].includes(userInput.toLowerCase())) {
    displayHistory();
    rl.prompt();
    return;
  }
  
  // Process message
  await processMessage(userInput);
  
  rl.prompt();
});

// Process user message
async function processMessage(message) {
  // Add to history
  conversationHistory.push({ role: 'user', content: message });
  
  // Keep history manageable
  if (conversationHistory.length > MAX_HISTORY * 2) {
    conversationHistory = conversationHistory.slice(-MAX_HISTORY * 2);
  }
  
  // Show thinking indicator
  const spinner = ora({
    text: chalk.dim('Düşünüyorum...'),
    color: 'cyan'
  }).start();
  
  try {
    // 1. Recognize intent
    const recognition = IntentRecognizer.recognize(message);
    context.lastIntent = recognition.intent;
    
    // Debug info (optional)
    if (process.env.DEBUG === 'true') {
      spinner.info(chalk.dim(`Intent: ${recognition.intent} (${(recognition.confidence * 100).toFixed(0)}%)`));
      spinner.start();
    }
    
    // 2. Execute action if confidence is high
    let actionResult = null;
    if (recognition.confidence > 0.5 && recognition.action) {
      context.lastAction = recognition.action;
      actionResult = await actionHandler.executeAction(recognition.action, message);
    }
    
    // 3. If action provided a response, use it directly
    if (actionResult && actionResult.skipGemini) {
      spinner.stop();
      console.log('\n' + actionResult.message + '\n');
      
      // Add to history as assistant message
      conversationHistory.push({ 
        role: 'assistant', 
        content: actionResult.message.replace(/\x1B\[[0-9;]*m/g, '') // Remove colors
      });
      
      return;
    }
    
    // 4. Otherwise, get AI response with context
    spinner.text = chalk.dim('Ollama ile konuşuyorum...');
    
    const systemPrompt = PromptBuilder.buildFullPrompt(context);
    const response = await ollamaService.chatWithContext(systemPrompt, conversationHistory);
    
    spinner.stop();
    
    // 5. Display response
    console.log('\n' + chalk.green('🤖 CarboBot: ') + response + '\n');
    
    // 6. Add to history
    conversationHistory.push({ role: 'assistant', content: response });
    
    // 7. If action result has additional info, show it
    if (actionResult && actionResult.message) {
      console.log(actionResult.message + '\n');
    }
    
  } catch (error) {
    spinner.stop();
    console.error(chalk.red('\n❌ Bir hata oluştu: ') + error.message + '\n');
    
    // Provide helpful error messages
    if (error.message.includes('API')) {
      console.log(chalk.yellow('💡 API anahtarınızı kontrol edin veya internet bağlantınızı kontrol edin.\n'));
    } else if (error.message.includes('timeout')) {
      console.log(chalk.yellow('💡 İstek zaman aşımına uğradı. Tekrar deneyin.\n'));
    }
  }
}

// Display conversation history
function displayHistory() {
  console.log(chalk.green.bold('\n📜 Konuşma Geçmişi:\n'));
  
  if (conversationHistory.length === 0) {
    console.log(chalk.dim('Henüz konuşma yok.\n'));
    return;
  }
  
  conversationHistory.forEach((msg, idx) => {
    const isUser = msg.role === 'user';
    const icon = isUser ? '💬' : '🤖';
    const color = isUser ? chalk.cyan : chalk.green;
    const label = isUser ? 'Sen' : 'CarboBot';
    
    console.log(color(`${icon} ${label}: `) + msg.content);
    
    if (idx < conversationHistory.length - 1) {
      console.log(chalk.dim('─'.repeat(60)));
    }
  });
  
  console.log('\n');
}

// Handle Ctrl+C gracefully
rl.on('SIGINT', () => {
  console.log(chalk.yellow('\n\n⚠️  Çıkmak için "exit" yazın veya Ctrl+C\'ye tekrar basın.\n'));
  rl.prompt();
});

// Handle close
rl.on('close', () => {
  console.log(chalk.dim('\n🌱 CarboBot kapatıldı. Çevre için teşekkürler!'));
  process.exit(0);
});