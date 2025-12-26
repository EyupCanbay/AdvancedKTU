const express = require('express');
const { config, validateConfig } = require('./src/config/environment');
const riskRoutes = require('./src/routes/riskRoutes');
const errorHandler = require('./src/middleware/errorHandler');

/**
 * Main Application File
 * Single Responsibility Principle: Only handles server setup and initialization
 * Open/Closed Principle: Easy to add new routes and middleware
 */

// Validate environment configuration
validateConfig();

const app = express();

// Middleware
app.use(express.json());

// Health check endpoint
app.get("/", (req, res) => {
    res.status(200).json({
        "success": true,
        "message": "Server is working!"
    });
});

// API Routes
app.use(riskRoutes);

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
app.listen(config.PORT, () => {
    console.log(`Server ${config.PORT} portunda çalışıyor`);
});