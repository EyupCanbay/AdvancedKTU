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
        return `You are a senior expert in environmental impact assessment and carbon footprint analysis with over 15 years of industry experience.

TASK: Analyze the provided image and calculate environmental impact metrics.

REQUIRED OUTPUT - Return ONLY a valid JSON object with these exact keys:
{
  "fullyChargingPhones": <number of smartphones>,
  "lightHours": <hours of traditional light bulb usage equivalent>,
  "ledLighting": <hours of LED lighting equivalent>,
  "drivingCar": <kilometers of car driving equivalent>,
  "CO2Emission": <kg of CO2 emissions>,
  "cleanWater": <liters of clean water impact>,
  "soilDegradation": <square meters of soil degradation>,
  "contaminatingGroundwater": <liters of groundwater contamination>,
  "energyConsumptionOfSmallWorkshop": <hours of workshop energy>,
  "lossRareEarthElements": <kilograms of rare earth elements>,
  "microplasticPollutionMarineLife": <grams of microplastics>,
  "annualCarbonSequestrationCapacityTree": <years of tree sequestration>,
  "householdElectricityConsumption": <hours of household electricity>,
  "dailyWaterConsumptionPeople": <liters of daily water consumption>,
  "humanCarbonFootprintOneDay": <days of human carbon footprint>,
  "riskDegree": <integer from 1-10>,
  "cost": <estimated financial impact in USD>
}

CRITICAL REQUIREMENTS:
- Return ONLY valid JSON, no markdown formatting or code blocks
- All numeric values must be evidence-based and realistic
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
  "fullyChargingPhones": 125,
  "lightHours": 45.5,
  "ledLighting": 90,
  "drivingCar": 250,
  "CO2Emission": 1250.5,
  "cleanWater": 500,
  "soilDegradation": 150,
  "contaminatingGroundwater": 300,
  "energyConsumptionOfSmallWorkshop": 35,
  "lossRareEarthElements": 8.5,
  "microplasticPollutionMarineLife": 42,
  "annualCarbonSequestrationCapacityTree": 3,
  "householdElectricityConsumption": 24,
  "dailyWaterConsumptionPeople": 180,
  "humanCarbonFootprintOneDay": 0.5,
  "riskDegree": 7,
  "cost": 45000
}`;

            const analysisData = JSON.parse(text);

            return {
                fullyChargingPhones: analysisData.fullyChargingPhones,
                lightHours: analysisData.lightHours,
                ledLighting: analysisData.ledLighting,
                drivingCar: analysisData.drivingCar,
                CO2Emission: analysisData.CO2Emission,
                cleanWater: analysisData.cleanWater,
                soilDegradation: analysisData.soilDegradation,
                contaminatingGroundwater: analysisData.contaminatingGroundwater,
                energyConsumptionOfSmallWorkshop: analysisData.energyConsumptionOfSmallWorkshop,
                lossRareEarthElements: analysisData.lossRareEarthElements,
                microplasticPollutionMarineLife: analysisData.microplasticPollutionMarineLife,
                annualCarbonSequestrationCapacityTree: analysisData.annualCarbonSequestrationCapacityTree,
                householdElectricityConsumption: analysisData.householdElectricityConsumption,
                dailyWaterConsumptionPeople: analysisData.dailyWaterConsumptionPeople,
                humanCarbonFootprintOneDay: analysisData.humanCarbonFootprintOneDay,
                riskDegree: analysisData.riskDegree,
                cost: analysisData.cost
            };
        } catch (error) {
            console.error('Gemini API Hatası:', error);
            throw new Error(`API request failed: ${error.message}`);
        }
    }
}

module.exports = new GeminiService();
