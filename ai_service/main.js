const fs = require('fs');
const path = require('path');
const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const API_KEY = process.env.GEMINI_API_KEY;

// API Key validation
if (!API_KEY) {
    console.error('ERROR: GEMINI_API_KEY environment variable is not set!');
    console.error('Please create a .env file with: GEMINI_API_KEY=your_api_key');
    process.exit(1);
}

const app = express();
const PORT = 3000;
app.use(express.json());

app.listen(PORT, () => {
    console.log(`Server ${PORT} portunda çalışıyor`);
});

// Check server
app.get("/", (req, res) => {
    res.status(200).json({
        "success": true,
        "message": "Server is working!"
    });
})

app.post("/risk-degree", async (req, res) => {
    // String gelen id'yi number'a çevirelim, hata vermesin
    const id = Number(req.body.id);
    const pathInput = req.body.path;

    if (!pathInput) {
        res.status(400).json({
            "success": false,
            "message": "path is required"
        });
        return;
    }

    try {
        const response = await geminiRequest(pathInput);
        
        // JSON parsing hatası kontrolü
        if (!response.success) {
             res.status(500).json(response);
             return;
        }

        res.status(200).json({
            "success": true,
            "data": response.data
        });
    } catch (error) {
        res.status(500).json({
            "success": false,
            "message": error.message
        });
    }
})

/*
* Gemini API isteği (Düzeltilmiş Versiyon)
*/
async function geminiRequest(imagePath) {
    try {
        // API Key kontrol
        if (!API_KEY) {
            return { success: false, message: "API key not configured. Set GEMINI_API_KEY environment variable." };
        }

        // Dosya var mı kontrol edelim
        if (!fs.existsSync(imagePath)) {
            return { success: false, message: "Dosya bulunamadı: " + imagePath };
        }

        const imageBuffer = fs.readFileSync(imagePath);
        const base64Image = imageBuffer.toString('base64');
        
        const ext = path.extname(imagePath).toLowerCase();
        const mimeType = ext === '.png' ? 'image/png' : 'image/jpeg';

        const genAI = new GoogleGenerativeAI(API_KEY);

        const model = genAI.getGenerativeModel({ 
            model: "gemini-2.5-flash",
            generationConfig: { responseMimeType: "application/json" } 
        });

        const prompt = `You are a senior expert in logistics risk assessment and supply chain analysis with over 15 years of industry experience.

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

        const imagePart = {
            inlineData: {
                data: base64Image,
                mimeType: mimeType
            }
        };

        // const result = await model.generateContent([prompt, imagePart]);
        // const response = await result.response;
        // const text = response.text();

        const text = "{\"riskDegree\": 7, \"carbonEmission\": 1500, \"cost\": 25000, \"reasoning\": \"The image indicates suboptimal handling procedures and equipment conditions that elevate operational risks. Worker safety appears compromised due to inadequate containment measures for hazardous materials, increasing potential liabilities. Process inefficiencies are evident, likely causing delays and bottlenecks that impact overall supply chain performance. To mitigate these risks, it is recommended to implement advanced training programs and upgrade handling equipment to enhance safety and efficiency.\"}";
        const analysisData = JSON.parse(text);

        return {
            success: true,
            data: {
                riskDegree: analysisData.riskDegree,
                carbonEmission: analysisData.carbonEmission,
                cost: analysisData.cost,
                reasoning: analysisData.reasoning
            }
        };

    } catch (error) {
        console.error('API Hatası:', error);
        return {
            success: false,
            message: `API request failed: ${error.message}`
        };
    }
}