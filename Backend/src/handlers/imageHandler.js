const Boom = require('@hapi/boom');
const path = require('path');
const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');
const mlService = require('../services/mlService');
const logger = require('../utils/logger');
const { validateImageFile } = require('../utils/validator');
const config = require('../config');

class ImageHandler {
  async predictImage(request, h) {
    try {
      const { payload } = request;
      
      // Validate request
      if (!payload || !payload.image) {
        throw Boom.badRequest('No image file provided');
      }

      // Validate file
      const validation = validateImageFile(payload.image);
      if (!validation.isValid) {
        throw Boom.badRequest(validation.error);
      }

      // Generate unique filename
      const filename = `${uuidv4()}_${payload.image.hapi.filename}`;
      const filepath = path.join(config.server.uploadsPath, filename);

      // Save uploaded file
      await this.saveFile(payload.image, filepath);

      try {
        // Predict using ML service
        const prediction = await mlService.predictImage(filepath);

        // Log prediction for analytics
        logger.info('Image prediction completed', {
          filename: payload.image.hapi.filename,
          predicted_class: prediction.predicted_class,
          confidence: prediction.confidence,
          success: prediction.success
        });

        // Clean up uploaded file
        await this.cleanupFile(filepath);

        if (!prediction.success) {
          throw Boom.badRequest(prediction.error);
        }

        return h.response({
          success: true,
          data: {
            predicted_class: prediction.predicted_class,
            confidence: Number(prediction.confidence.toFixed(4)),
            landmarks_detected: prediction.landmarks_detected || 0
          },
          timestamp: new Date().toISOString()
        }).code(200);

      } catch (predictionError) {
        // Clean up file in case of prediction error
        await this.cleanupFile(filepath);
        throw predictionError;
      }

    } catch (error) {
      logger.error('Error in image prediction:', error);
      
      if (Boom.isBoom(error)) {
        throw error;
      }
      
      throw Boom.internal('Internal server error during image prediction');
    }
  }

  async predictImageBase64(request, h) {
    try {
      const { image_data } = request.payload;
      
      if (!image_data) {
        throw Boom.badRequest('No image data provided');
      }

      // Validate base64 format
      if (!image_data.startsWith('data:image/')) {
        throw Boom.badRequest('Invalid image data format');
      }

      // Extract base64 data
      const base64Data = image_data.split(',')[1];
      if (!base64Data) {
        throw Boom.badRequest('Invalid base64 image data');
      }

      // Convert base64 to buffer
      const imageBuffer = Buffer.from(base64Data, 'base64');
      
      // Generate temporary filename
      const filename = `${uuidv4()}_temp.jpg`;
      const filepath = path.join(config.server.uploadsPath, filename);

      // Save buffer to file
      await fs.writeFile(filepath, imageBuffer);

      try {
        // Predict using ML service
        const prediction = await mlService.predictImage(filepath);

        // Log prediction
        logger.info('Base64 image prediction completed', {
          predicted_class: prediction.predicted_class,
          confidence: prediction.confidence,
          success: prediction.success
        });

        // Clean up temporary file
        await this.cleanupFile(filepath);

        if (!prediction.success) {
          throw Boom.badRequest(prediction.error);
        }

        return h.response({
          success: true,
          data: {
            predicted_class: prediction.predicted_class,
            confidence: Number(prediction.confidence.toFixed(4)),
            landmarks_detected: prediction.landmarks_detected || 0
          },
          timestamp: new Date().toISOString()
        }).code(200);

      } catch (predictionError) {
        // Clean up file in case of prediction error
        await this.cleanupFile(filepath);
        throw predictionError;
      }

    } catch (error) {
      logger.error('Error in base64 image prediction:', error);
      
      if (Boom.isBoom(error)) {
        throw error;
      }
      
      throw Boom.internal('Internal server error during base64 image prediction');
    }
  }

  async saveFile(file, filepath) {
    try {
      const fileStream = require('fs').createWriteStream(filepath);
      
      return new Promise((resolve, reject) => {
        file.pipe(fileStream);
        
        file.on('error', (error) => {
          reject(error);
        });
        
        fileStream.on('error', (error) => {
          reject(error);
        });
        
        fileStream.on('finish', () => {
          resolve();
        });
      });
    } catch (error) {
      logger.error('Error saving file:', error);
      throw error;
    }
  }

  async cleanupFile(filepath) {
    try {
      await fs.unlink(filepath);
    } catch (error) {
      // Log but don't throw - cleanup is not critical
      logger.warn(`Failed to cleanup file ${filepath}:`, error);
    }
  }

  async getImageInfo(request, h) {
    try {
      const info = {
        supported_formats: config.upload.imageFormats,
        max_file_size: config.upload.maxImageSize,
        max_file_size_mb: Math.round(config.upload.maxImageSize / 1024 / 1024),
        endpoints: {
          predict_file: '/api/image/predict',
          predict_base64: '/api/image/predict/base64'
        }
      };

      return h.response({
        success: true,
        data: info
      }).code(200);

    } catch (error) {
      logger.error('Error getting image info:', error);
      throw Boom.internal('Error retrieving image information');
    }
  }
}

module.exports = new ImageHandler();