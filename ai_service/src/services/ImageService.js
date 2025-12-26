const fs = require('fs');
const path = require('path');

/**
 * ImageService - Handles image file operations
 * Single Responsibility Principle: Only responsible for image file handling
 */

class ImageService {
    /**
     * Validate if image file exists
     * @param {string} imagePath - Path to the image file
     * @throws {Error} If file doesn't exist
     */
    validateImageExists(imagePath) {
        if (!fs.existsSync(imagePath)) {
            throw new Error(`Dosya bulunamadı: ${imagePath}`);
        }
    }

    /**
     * Read image file and convert to base64
     * @param {string} imagePath - Path to the image file
     * @returns {string} Base64 encoded image data
     */
    readImageAsBase64(imagePath) {
        this.validateImageExists(imagePath);
        const imageBuffer = fs.readFileSync(imagePath);
        return imageBuffer.toString('base64');
    }

    /**
     * Determine MIME type based on file extension
     * @param {string} imagePath - Path to the image file
     * @returns {string} MIME type (image/png or image/jpeg)
     */
    getMimeType(imagePath) {
        const ext = path.extname(imagePath).toLowerCase();
        return ext === '.png' ? 'image/png' : 'image/jpeg';
    }

    /**
     * Get image data in the format required by Gemini API
     * @param {string} imagePath - Path to the image file
     * @returns {object} Image data object for API
     */
    getImageData(imagePath) {
        const base64Data = this.readImageAsBase64(imagePath);
        const mimeType = this.getMimeType(imagePath);

        return {
            inlineData: {
                data: base64Data,
                mimeType: mimeType
            }
        };
    }
}

module.exports = new ImageService();
