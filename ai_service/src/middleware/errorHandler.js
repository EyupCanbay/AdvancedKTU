/**
 * Error Handling Middleware
 * Single Responsibility Principle: Only handles errors
 * Centralizes error handling for consistency
 */

const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);

    // Handle specific error types
    if (err.message.includes('Dosya bulunamadı') || err.message.includes('File not found')) {
        return res.status(404).json({
            success: false,
            message: err.message
        });
    }

    if (err.message.includes('JSON')) {
        return res.status(400).json({
            success: false,
            message: "Invalid response format from API"
        });
    }

    // Generic error response
    res.status(500).json({
        success: false,
        message: err.message || "Internal server error"
    });
};

module.exports = errorHandler;
