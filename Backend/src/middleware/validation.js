const Joi = require('joi');
const Boom = require('@hapi/boom');
const { validateImageFile, validateVideoFile, validateAudioFile } = require('../utils/validator');
const logger = require('../utils/logger');

/**
 * Validation middleware for Hapi.js
 * Provides reusable validation functions and file validation
 */

const validation = {
  name: 'validation',
  version: '1.0.0',
  register: async function (server, options) {
    
    // Add custom validation methods to server
    server.method('validateFile', this.validateFile);
    server.method('validatePredictionInput', this.validatePredictionInput);
    server.method('validateAudioInput', this.validateAudioInput);

    // Pre-handler for file uploads
    server.ext('onPostAuth', (request, h) => {
      // Skip if no file upload
      if (!request.payload || !this.hasFileUpload(request)) {
        return h.continue;
      }

      try {
        this.validateFileUpload(request);
        return h.continue;
      } catch (error) {
        throw error;
      }
    });
  },

  // Validate file uploads
  validateFile(file, type) {
    switch (type) {
      case 'image':
        return validateImageFile(file);
      case 'video':
        return validateVideoFile(file);
      case 'audio':
        return validateAudioFile(file);
      default:
        return { isValid: false, error: 'Unsupported file type' };
    }
  },

  // Check if request has file upload
  hasFileUpload(request) {
    const { payload } = request;
    return payload && (payload.image || payload.video || payload.audio);
  },

  // Validate file upload in request
  validateFileUpload(request) {
    const { payload, path } = request;

    // Determine file type based on endpoint
    let fileType = 'unknown';
    let file = null;

    if (path.includes('/image/')) {
      fileType = 'image';
      file = payload.image;
    } else if (path.includes('/video/')) {
      fileType = 'video';
      file = payload.video;
    } else if (path.includes('/audio/')) {
      fileType = 'audio';
      file = payload.audio;
    }

    if (!file) {
      throw Boom.badRequest(`No ${fileType} file provided`);
    }

    // Validate file
    const validation = this.validateFile(file, fileType);
    if (!validation.isValid) {
      logger.warn('File validation failed:', {
        fileType,
        error: validation.error,
        filename: file.hapi?.filename,
        path: request.path
      });
      throw Boom.badRequest(validation.error);
    }

    // Log successful validation
    logger.debug('File validation passed:', {
      fileType,
      filename: file.hapi?.filename,
      size: file._data?.length || 0,
      path: request.path
    });
  },

  // Validate ML prediction input
  validatePredictionInput(payload, type) {
    const schemas = {
      image: Joi.object({
        image: Joi.any().required()
      }),
      
      imageBase64: Joi.object({
        image_data: Joi.string().required().pattern(/^data:image\/[a-zA-Z]+;base64,/)
      }),
      
      video: Joi.object({
        video: Joi.any().required(),
        frames: Joi.number().integer().min(10).max(60).default(30)
      }),
      
      realtime: Joi.object({
        frame: Joi.string().required(),
        timestamp: Joi.number().required(),
        frameNumber: Joi.number().integer().required()
      })
    };

    const schema = schemas[type];
    if (!schema) {
      throw Boom.badRequest('Invalid prediction type');
    }

    const { error, value } = schema.validate(payload);
    if (error) {
      throw Boom.badRequest(`Validation error: ${error.details[0].message}`);
    }

    return value;
  },

  // Validate audio processing input
  validateAudioInput(payload, type) {
    const schemas = {
      tts: Joi.object({
        text: Joi.string().required().min(1).max(1000),
        language: Joi.string().valid('id', 'en', 'ms', 'jv').default('id'),
        voice_speed: Joi.number().min(0.5).max(2.0).default(1.0),
        voice_type: Joi.string().valid('male', 'female').optional()
      }),
      
      stt: Joi.object({
        audio: Joi.any().required(),
        language: Joi.string().valid('id-ID', 'en-US', 'ms-MY').default('id-ID')
      })
    };

    const schema = schemas[type];
    if (!schema) {
      throw Boom.badRequest('Invalid audio processing type');
    }

    const { error, value } = schema.validate(payload);
    if (error) {
      throw Boom.badRequest(`Validation error: ${error.details[0].message}`);
    }

    return value;
  },

  // Validate query parameters
  validateQuery: {
    pagination: Joi.object({
      page: Joi.number().integer().min(1).default(1),
      limit: Joi.number().integer().min(1).max(100).default(10),
      sort: Joi.string().valid('asc', 'desc').default('asc'),
      sortBy: Joi.string().default('created_at')
    }),

    search: Joi.object({
      q: Joi.string().required().min(1).max(100),
      type: Joi.string().valid('image', 'video', 'all').default('all'),
      limit: Joi.number().integer().min(1).max(50).default(10)
    }),

    filter: Joi.object({
      category: Joi.string().optional(),
      difficulty: Joi.string().valid('easy', 'medium', 'hard').optional(),
      confidence: Joi.number().min(0).max(1).optional()
    })
  },

  // Validate real-time settings
  validateRealtimeSettings: Joi.object({
    confidence_threshold: Joi.number().min(0.1).max(1.0).default(0.7),
    prediction_interval: Joi.number().integer().min(1).max(30).default(5),
    smoothing_enabled: Joi.boolean().default(true),
    max_fps: Joi.number().integer().min(1).max(30).default(15)
  }),

  // Common validation schemas
  schemas: {
    uuid: Joi.string().uuid(),
    objectId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/),
    language: Joi.string().valid('id', 'en', 'ms', 'jv'),
    confidence: Joi.number().min(0).max(1),
    timestamp: Joi.date().iso(),
    
    // File validation
    filename: Joi.string().max(255).pattern(/^[^<>:"/\\|?*\x00-\x1f]+$/),
    fileSize: Joi.number().positive().max(50 * 1024 * 1024), // 50MB max
    
    // ML specific
    landmarks: Joi.array().items(Joi.number()).length(63),
    frameCount: Joi.number().integer().min(10).max(60),
    predictions: Joi.array().items(Joi.number().min(0).max(1))
  }
};

// Export validation helpers
const validate = {
  // Quick validation helpers
  isValidImage: (file) => validateImageFile(file).isValid,
  isValidVideo: (file) => validateVideoFile(file).isValid,
  isValidAudio: (file) => validateAudioFile(file).isValid,
  
  // Schema validation
  validateSchema: (data, schema, options = {}) => {
    const { error, value } = schema.validate(data, {
      abortEarly: false,
      stripUnknown: true,
      ...options
    });
    
    if (error) {
      const message = error.details.map(detail => detail.message).join(', ');
      throw Boom.badRequest(`Validation failed: ${message}`);
    }
    
    return value;
  },

  // Sanitize input
  sanitize: {
    filename: (filename) => {
      return filename
        .replace(/[^a-zA-Z0-9._-]/g, '_')
        .replace(/_{2,}/g, '_')
        .substring(0, 255);
    },
    
    text: (text) => {
      return text
        .trim()
        .replace(/\s+/g, ' ')
        .substring(0, 1000);
    },
    
    search: (query) => {
      return query
        .trim()
        .toLowerCase()
        .replace(/[^a-zA-Z0-9\s]/g, '')
        .substring(0, 100);
    }
  }
};

module.exports = {
  validation,
  validate
};