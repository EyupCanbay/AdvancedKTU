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
 * Analyze image and assess risk degree
 * 
 * Request body:
 * {
 *   "id": number (optional),
 *   "path": string (required) - Path to image file
 * }
 * 
 * Response:
 * {
 *   "success": boolean,
 *   "data": {
 *     "riskDegree": number,
 *     "carbonEmission": number,
 *     "cost": number,
 *     "reasoning": string
 *   }
 * }
 */
router.post('/risk-degree', async (req, res, next) => {
    try {
        const pathInput = req.body.path;

        if (!pathInput) {
            return res.status(400).json({
                success: false,
                message: "path is required"
            });
        }

        const analysisData = await geminiService.analyzeImage(pathInput);

        res.status(200).json({
            success: true,
            data: analysisData
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
