const Boom = require('@hapi/boom');
const path = require('path');
const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');
const mlService = require('../services/mlService');
const logger = require('../utils/logger');
const { validateVideoFile } = require('../utils/validator');
const config = require('../config');

class VideoHandler {
  async predictVideo(request, h) {
    try {
      const { payload } = request;
      
      // Validate request
      if (!payload || !payload.video) {
        throw Boom.badRequest('No video file provided');
      }

      // Validate file
      const validation = validateVideoFile(payload.video);
      if (!validation.isValid) {
        throw Boom.badRequest(validation.error);
      }

      // Generate unique filename
      const filename = `${uuidv4()}_${payload.video.hapi.filename}`;
      const filepath = path.join(config.server.uploadsPath, filename);

      // Save uploaded file
      await this.saveFile(payload.video, filepath);

      try {
        // Get frame count from request or use default
        const numFrames = payload.frames || config.video.defaultFrameCount;

        // Predict using ML service
        const prediction = await mlService.predictVideo(filepath, numFrames);

        // Log prediction for analytics
        logger.info('Video prediction completed', {
          filename: payload.video.hapi.filename,
          predicted_class: prediction.predicted_class,
          confidence: prediction.confidence,
          frames_processed: prediction.frames_processed,
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
            frames_processed: prediction.frames_processed || 0,
            video_duration: await this.getVideoDuration(filepath)
          },
          timestamp: new Date().toISOString()
        }).code(200);

      } catch (predictionError) {
        // Clean up file in case of prediction error
        await this.cleanupFile(filepath);
        throw predictionError;
      }

    } catch (error) {
      logger.error('Error in video prediction:', error);
      
      if (Boom.isBoom(error)) {
        throw error;
      }
      
      throw Boom.internal('Internal server error during video prediction');
    }
  }

  async predictVideoStream(request, h) {
    try {
      const { payload } = request;
      
      if (!payload || !payload.video_chunk) {
        throw Boom.badRequest('No video chunk provided');
      }

      // For streaming video, we would need to implement
      // a more complex system with temporary storage
      // This is a placeholder for future implementation
      
      return h.response({
        success: false,
        error: 'Video streaming prediction not yet implemented',
        message: 'Please use the standard video upload endpoint'
      }).code(501);

    } catch (error) {
      logger.error('Error in video stream prediction:', error);
      throw Boom.internal('Error in video stream prediction');
    }
  }

  async saveFile(file, filepath) {
    try {
      const fileStream = fs.createWriteStream(filepath);
      
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
      logger.error('Error saving video file:', error);
      throw error;
    }
  }

  async cleanupFile(filepath) {
    try {
      await fs.unlink(filepath);
    } catch (error) {
      // Log but don't throw - cleanup is not critical
      logger.warn(`Failed to cleanup video file ${filepath}:`, error);
    }
  }

  async getVideoDuration(filepath) {
    try {
      // This would require ffmpeg or similar tool
      // For now, return null as placeholder
      return null;
    } catch (error) {
      logger.warn('Could not get video duration:', error);
      return null;
    }
  }

  async getVideoInfo(request, h) {
    try {
      const info = {
        supported_formats: config.upload.videoFormats,
        max_file_size: config.upload.maxVideoSize,
        max_file_size_mb: Math.round(config.upload.maxVideoSize / 1024 / 1024),
        max_duration_seconds: config.video.maxVideoDuration,
        default_frame_count: config.video.defaultFrameCount,
        frame_size: config.video.frameSize,
        endpoints: {
          predict: '/api/video/predict',
          stream: '/api/video/predict/stream'
        }
      };

      return h.response({
        success: true,
        data: info
      }).code(200);

    } catch (error) {
      logger.error('Error getting video info:', error);
      throw Boom.internal('Error retrieving video information');
    }
  }

  async extractFrames(request, h) {
    try {
      const { payload } = request;
      
      if (!payload || !payload.video) {
        throw Boom.badRequest('No video file provided');
      }

      // Validate file
      const validation = validateVideoFile(payload.video);
      if (!validation.isValid) {
        throw Boom.badRequest(validation.error);
      }

      // Generate unique filename
      const filename = `${uuidv4()}_${payload.video.hapi.filename}`;
      const filepath = path.join(config.server.uploadsPath, filename);

      // Save uploaded file
      await this.saveFile(payload.video, filepath);

      try {
        // Extract frames (this would need ffmpeg implementation)
        const frames = await this.extractVideoFrames(filepath);

        // Clean up uploaded file
        await this.cleanupFile(filepath);

        return h.response({
          success: true,
          data: {
            frames_extracted: frames.length,
            frames: frames
          },
          timestamp: new Date().toISOString()
        }).code(200);

      } catch (extractionError) {
        await this.cleanupFile(filepath);
        throw extractionError;
      }

    } catch (error) {
      logger.error('Error extracting video frames:', error);
      
      if (Boom.isBoom(error)) {
        throw error;
      }
      
      throw Boom.internal('Error extracting video frames');
    }
  }

  async extractVideoFrames(filepath) {
    // Placeholder for frame extraction logic
    // Would need ffmpeg or similar tool
    return [];
  }
}

module.exports = new VideoHandler();