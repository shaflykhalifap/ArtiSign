const Boom = require('@hapi/boom');
const os = require('os');
const fs = require('fs').promises;
const path = require('path');
const mlService = require('../services/mlService');
const logger = require('../utils/logger');
const config = require('../config');
const packageJson = require('../../package.json');

class HealthHandler {
  constructor() {
    this.startTime = Date.now();
    this.requestCount = 0;
    this.errorCount = 0;
  }

  async basicHealthCheck(request, h) {
    try {
      const status = mlService.getStatus();
      const uptime = (Date.now() - this.startTime) / 1000;
      
      return h.response({
        status: status.initialized ? 'healthy' : 'unhealthy',
        timestamp: new Date().toISOString(),
        models_loaded: status.models_loaded,
        server_info: {
          uptime,
          memory_usage: process.memoryUsage(),
          version: packageJson.version
        }
      }).code(200);

    } catch (error) {
      logger.error('Error in basic health check:', error);
      
      return h.response({
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: 'Health check failed'
      }).code(503);
    }
  }

  async detailedHealthCheck(request, h) {
    try {
      const mlStatus = mlService.getStatus();
      const uptime = (Date.now() - this.startTime) / 1000;
      const memUsage = process.memoryUsage();
      
      // Check storage
      const storageStatus = await this.checkStorageStatus();
      
      // Determine overall status
      let overallStatus = 'healthy';
      if (!mlStatus.initialized) {
        overallStatus = 'unhealthy';
      } else if (!storageStatus.uploads_directory.writable) {
        overallStatus = 'degraded';
      }

      const response = {
        status: overallStatus,
        timestamp: new Date().toISOString(),
        server: {
          uptime,
          memory: {
            used: memUsage.heapUsed,
            free: memUsage.heapTotal - memUsage.heapUsed,
            total: memUsage.heapTotal,
            percentage: (memUsage.heapUsed / memUsage.heapTotal) * 100
          },
          cpu_usage: await this.getCpuUsage(),
          load_average: os.loadavg()
        },
        models: {
          status: mlStatus.initialized ? 'initialized' : 'not_initialized',
          image_model: {
            loaded: mlStatus.models_loaded.image_model,
            classes: mlStatus.classes_loaded.image_classes,
            last_prediction: null // Would track this in production
          },
          landmark_model: {
            loaded: mlStatus.models_loaded.landmark_model,
            classes: mlStatus.classes_loaded.image_classes,
            last_prediction: null
          },
          video_model: {
            loaded: mlStatus.models_loaded.video_model,
            classes: mlStatus.classes_loaded.video_classes,
            last_prediction: null
          }
        },
        services: {
          ml_service: mlStatus.initialized ? 'running' : 'stopped',
          audio_service: 'running', // Would check actual service status
          database: null // No database in current implementation
        },
        storage: storageStatus
      };

      return h.response(response).code(200);

    } catch (error) {
      logger.error('Error in detailed health check:', error);
      
      return h.response({
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: 'Detailed health check failed'
      }).code(503);
    }
  }

  async modelsHealthCheck(request, h) {
    try {
      const mlStatus = mlService.getStatus();
      
      // Count loaded models
      const loadedCount = Object.values(mlStatus.models_loaded).filter(Boolean).length;
      const totalModels = Object.keys(mlStatus.models_loaded).length;
      
      let status = 'none_loaded';
      if (loadedCount === totalModels) status = 'all_loaded';
      else if (loadedCount > 0) status = 'partial_loaded';

      const modelDetails = {
        image_model: await this.getModelDetails('image', mlStatus),
        landmark_model: await this.getModelDetails('landmark', mlStatus),
        video_model: await this.getModelDetails('video', mlStatus)
      };

      return h.response({
        status,
        timestamp: new Date().toISOString(),
        models: modelDetails,
        performance_metrics: {
          total_predictions: this.requestCount,
          success_rate: this.requestCount > 0 ? 1 - (this.errorCount / this.requestCount) : 0,
          average_confidence: null, // Would track this in production
          peak_memory_usage: process.memoryUsage().heapUsed
        }
      }).code(200);

    } catch (error) {
      logger.error('Error in models health check:', error);
      throw Boom.internal('Models health check failed');
    }
  }

  async readinessCheck(request, h) {
    try {
      const mlStatus = mlService.getStatus();
      const storageStatus = await this.checkStorageStatus();
      
      const ready = mlStatus.initialized && 
                   storageStatus.uploads_directory.exists && 
                   storageStatus.uploads_directory.writable;

      return h.response({
        ready,
        timestamp: new Date().toISOString(),
        dependencies: {
          models_initialized: mlStatus.initialized,
          storage_accessible: storageStatus.uploads_directory.writable,
          services_running: true
        },
        message: ready ? 'Service is ready' : 'Service is not ready'
      }).code(ready ? 200 : 503);

    } catch (error) {
      logger.error('Error in readiness check:', error);
      
      return h.response({
        ready: false,
        timestamp: new Date().toISOString(),
        message: 'Readiness check failed'
      }).code(503);
    }
  }

  async livenessCheck(request, h) {
    const uptime = (Date.now() - this.startTime) / 1000;
    
    return h.response({
      alive: true,
      timestamp: new Date().toISOString(),
      uptime
    }).code(200);
  }

  async apiInfo(request, h) {
    return h.response({
      name: 'BISINDO Sign Language Translator API',
      version: packageJson.version,
      description: 'RESTful API untuk menerjemahkan bahasa isyarat BISINDO',
      endpoints: {
        image: [
          '/api/image/predict',
          '/api/image/predict/base64',
          '/api/image/info'
        ],
        video: [
          '/api/video/predict',
          '/api/video/predict/stream',
          '/api/video/frames',
          '/api/video/info'
        ],
        audio: [
          '/api/audio/tts',
          '/api/audio/stt',
          '/api/audio/stt/stream',
          '/api/audio/formats',
          '/api/audio/info'
        ],
        classes: [
          '/api/classes',
          '/api/classes/image',
          '/api/classes/video',
          '/api/classes/search',
          '/api/classes/{className}',
          '/api/classes/categories'
        ],
        health: [
          '/api/health',
          '/api/health/detailed',
          '/api/health/models',
          '/api/health/ready',
          '/api/health/live'
        ]
      },
      documentation: '/documentation',
      timestamp: new Date().toISOString()
    }).code(200);
  }

  // Helper methods
  async checkStorageStatus() {
    try {
      const uploadsPath = config.server.uploadsPath;
      const modelsPath = config.server.modelsPath;
      
      // Check uploads directory
      let uploadsExists = false;
      let uploadsWritable = false;
      let spaceAvailable = null;
      
      try {
        await fs.access(uploadsPath);
        uploadsExists = true;
        
        // Test write permission
        const testFile = path.join(uploadsPath, '.write_test');
        await fs.writeFile(testFile, 'test');
        await fs.unlink(testFile);
        uploadsWritable = true;
        
        // Get available space (simplified)
        const stats = await fs.stat(uploadsPath);
        spaceAvailable = stats.size;
      } catch (error) {
        // Directory doesn't exist or not writable
      }

      // Check models directory
      let modelsExists = false;
      let modelFilesCount = 0;
      
      try {
        await fs.access(modelsPath);
        modelsExists = true;
        
        const files = await fs.readdir(modelsPath);
        modelFilesCount = files.length;
      } catch (error) {
        // Directory doesn't exist
      }

      return {
        uploads_directory: {
          exists: uploadsExists,
          writable: uploadsWritable,
          space_available: spaceAvailable
        },
        models_directory: {
          exists: modelsExists,
          files_count: modelFilesCount
        }
      };

    } catch (error) {
      logger.error('Error checking storage status:', error);
      return {
        uploads_directory: { exists: false, writable: false, space_available: null },
        models_directory: { exists: false, files_count: 0 }
      };
    }
  }

  async getModelDetails(modelType, mlStatus) {
    const modelPaths = {
      image: config.models.imageModel,
      landmark: config.models.landmarkModel,
      video: config.models.videoModel
    };

    const path = modelPaths[modelType];
    let sizeM = null;
    
    try {
      const stats = await fs.stat(path);
      sizeMb = Math.round(stats.size / 1024 / 1024);
    } catch (error) {
      // File doesn't exist
    }

    const classesCount = modelType === 'video' 
      ? mlStatus.classes_loaded.video_classes 
      : mlStatus.classes_loaded.image_classes;

    return {
      path,
      loaded: mlStatus.models_loaded[`${modelType}_model`],
      size_mb: sizeMb,
      classes_count: classesCount,
      last_used: null, // Would track this in production
      predictions_count: 0, // Would track this in production
      average_inference_time: null // Would track this in production
    };
  }

  async getCpuUsage() {
    try {
      // Simple CPU usage calculation
      const startUsage = process.cpuUsage();
      
      return new Promise((resolve) => {
        setTimeout(() => {
          const endUsage = process.cpuUsage(startUsage);
          const totalUsage = endUsage.user + endUsage.system;
          const percentage = (totalUsage / 1000000) * 100; // Convert to percentage
          resolve(Math.min(percentage, 100));
        }, 100);
      });
    } catch (error) {
      return null;
    }
  }

  incrementRequestCount() {
    this.requestCount++;
  }

  incrementErrorCount() {
    this.errorCount++;
  }
}

module.exports = new HealthHandler();