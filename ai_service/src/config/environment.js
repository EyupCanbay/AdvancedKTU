require('dotenv').config();

/**
 * Environment Configuration
 * Single Responsibility Principle: Handles all environment variable validation
 */

const config = {
    API_KEY: process.env.GEMINI_API_KEY,
    PORT: process.env.PORT || 3000,
    NODE_ENV: process.env.NODE_ENV || 'development'
};

/**
 * Validate required environment variables
 * Throws error if critical configuration is missing
 */
function validateConfig() {
    if (!config.API_KEY) {
        console.error('ERROR: GEMINI_API_KEY environment variable is not set!');
        console.error('Please create a .env file with: GEMINI_API_KEY=your_api_key');
        process.exit(1);
    }
}

module.exports = {
    config,
    validateConfig
};
