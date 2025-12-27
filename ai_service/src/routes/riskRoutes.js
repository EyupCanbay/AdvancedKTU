const express = require('express');
const geminiService = require('../services/GeminiService');

/**
 * Risk Assessment Routes
 * Single Responsibility Principle: Only handles HTTP request/response
 * Open/Closed Principle: Can add new routes without modifying existing code
 */

const router = express.Router();

/**
 * POST /risk-degree
 * Analyze image and assess environmental impact metrics
 * 
 * Request body:
 * {
 *   "id": string (required),
 *   "path": string (required) - Path to image file
 * }
 * 
 * Response:
 * {
 *   "success": boolean,
 *   "data": {
 *     "fullyChargingPhones": number (count),
 *     "lightHours": number (hours),
 *     "ledLighting": number (hours),
 *     "drivingCar": number (km),
 *     "CO2Emission": number (kg),
 *     "cleanWater": number (liters),
 *     "soilDegradation": number (square meters),
 *     "contaminatingGroundwater": number (liters),
 *     "energyConsumptionOfSmallWorkshop": number (hours),
 *     "lossRareEarthElements": number (kilograms),
 *     "microplasticPollutionMarineLife": number (grams),
 *     "annualCarbonSequestrationCapacityTree": number (years),
 *     "householdElectricityConsumption": number (hours),
 *     "dailyWaterConsumptionPeople": number (liters),
 *     "humanCarbonFootprintOneDay": number (days),
 *     "riskDegree": integer (1-10),
 *     "cost": number (USD)
 *   }
 * }
 */
router.post('/risk-degree', async (req, res, next) => {
    try {
        const pathInput = req.body.image_path;

        console.log("Received path:", pathInput);

        if (!pathInput) {
            return res.status(400).json({
                success: false,
                message: "path is required"
            });
        }

        // Convert relative path to absolute path in container
        // ./uploads/file.jpg -> /app/uploads/file.jpg
        let imagePath = pathInput;
        if (pathInput.startsWith('./uploads/')) {
            imagePath = pathInput.replace('./uploads/', '/app/uploads/');
        } else if (pathInput.startsWith('uploads/')) {
            imagePath = '/app/' + pathInput;
        }
        
        console.log("Resolved path:", imagePath);

        const analysisData = await geminiService.analyzeImage(imagePath);

        res.status(200).json({
            success: true,
            data: analysisData
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
