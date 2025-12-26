const { GoogleGenerativeAI } = require("@google/generative-ai");
const { config } = require('../config/environment');
const imageService = require('./ImageService');

/**
 * GeminiService - Handles Gemini API interactions
 * Single Responsibility Principle: Only responsible for API communication
 * Dependency Inversion: Depends on abstractions (imageService)
 */

class GeminiService {
    constructor() {
        this.model = null;
        this.initializeModel();
    }

    /**
     * Initialize Gemini API client and model
     */
    initializeModel() {
        if (!config.API_KEY) {
            throw new Error("API key not configured. Set GEMINI_API_KEY environment variable.");
        }

        const genAI = new GoogleGenerativeAI(config.API_KEY);
        this.model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            generationConfig: { responseMimeType: "application/json" }
        });
    }

    /**
     * Get the risk assessment prompt
     * @returns {string} Prompt template for Gemini API
     */
    getRiskAssessmentPrompt() {
        return `You are a senior expert in logistics risk assessment and supply chain analysis with over 15 years of industry experience.

TASK: Conduct a comprehensive risk analysis on the provided logistics/supply chain image.

ANALYSIS FRAMEWORK:
Evaluate the following dimensions in your analysis:
1. Operational Risk: Equipment condition, handling procedures, environmental factors
2. Safety Risk: Worker safety, hazmat compliance, containment measures
3. Efficiency Risk: Process delays, bottlenecks, workflow optimization potential
4. Regulatory Risk: Compliance with logistics standards and regulations
5. Environmental Impact: Carbon footprint, emissions, sustainability concerns

REQUIRED OUTPUT - Return ONLY a valid JSON object with these exact keys:
{
  "riskDegree": <integer from 1-10, where 1=minimal risk, 10=critical risk>,
  "carbonEmission": <number representing estimated kg of CO2 emissions>,
  "cost": <number representing estimated financial impact in USD>,
  "reasoning": <string with detailed professional analysis (2-3 sentences minimum)>
}

REASONING GUIDELINES:
- Provide specific observations from the image
- Explain the connection between identified issues and risk metrics
- Suggest one improvement recommendation if applicable
- Use professional logistics terminology

CRITICAL REQUIREMENTS:
- Return ONLY valid JSON, no markdown formatting or code blocks
- Do not wrap response in \`\`\`json or similar markers
- Ensure all numeric values are reasonable and evidence-based
- All keys must be present in the response`;
    }

    /**
     * Analyze image for risk assessment
     * @param {string} imagePath - Path to the image file
     * @returns {Promise<object>} Risk assessment data
     * @throws {Error} If API request fails or response is invalid
     */
    async analyzeImage(imagePath) {
        try {
            const imageData = imageService.getImageData(imagePath);
            const prompt = this.getRiskAssessmentPrompt();

            // -----------* ALTTAKİ 3 SATIR YORUMA ALINDI | GERÇEK YARIŞMADA SİL *----------- 
            // const result = await this.model.generateContent([prompt, imageData]);
            // const response = await result.response;
            // const text = response.text();
            const text = `{
  "riskDegree": 7,
  "carbonEmission": 1250.5,
  "cost": 45000,
  "reasoning": "The image indicates suboptimal handling procedures and equipment conditions that elevate operational risks. Worker safety measures appear insufficient, increasing the likelihood of accidents. Additionally, inefficiencies in the workflow suggest potential delays, contributing to higher carbon emissions and financial costs."
}`;

            const analysisData = JSON.parse(text);

            return {
                riskDegree: analysisData.riskDegree,
                carbonEmission: analysisData.carbonEmission,
                cost: analysisData.cost,
                reasoning: analysisData.reasoning
            };
        } catch (error) {
            console.error('Gemini API Hatası:', error);
            throw new Error(`API request failed: ${error.message}`);
        }
    }
}

module.exports = new GeminiService();
