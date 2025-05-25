require('dotenv').config();
const path = require('path');

/**
 * Main configuration file - No Database Version
 * Simplified configuration for ML-focused application
 */

const environment = process.env.NODE_ENV || 'development';

const config = {
  // Environment configuration
  environment,
  isProduction: environment === 'production',
  isDevelopment: environment === 'development',
  isTesting: environment === 'testing',

  // Server configuration
  server: {
    port: process.env.PORT || 3000,
    host: process.env.HOST || 'localhost',
    uploadsPath: path.join(__dirname, '../../uploads'),
    modelsPath: path.join(__dirname, '../../models'),
    maxPayloadSize: parseInt(process.env.MAX_PAYLOAD_SIZE) || 16 * 1024 * 1024, // 16MB
    environment
  },

  // ML Models configuration
  models: {
    imageModel: path.join(__dirname, '../../models/bisindo_image_model.h5'),
    landmarkModel: path.join(__dirname, '../../models/bisindo_landmark_model.h5'),
    videoModel: path.join(__dirname, '../../models/bisindo_video_model.h5'),
    imageClassMapping: path.join(__dirname, '../../models/image_class_mapping.json'),
    videoClassMapping: path.join(__dirname, '../../models/video_class_mapping.json')
  },

  // MediaPipe configuration
  mediaPipe: {
    minDetectionConfidence: parseFloat(process.env.MIN_DETECTION_CONFIDENCE) || 0.5,
    minTrackingConfidence: parseFloat(process.env.MIN_TRACKING_CONFIDENCE) || 0.5,
    maxNumHands: parseInt(process.env.MAX_NUM_HANDS) || 2,
    staticImageMode: true
  },

  // Audio configuration
  audio: {
    speechLanguage: process.env.SPEECH_LANGUAGE || 'id-ID',
    ttsLanguage: process.env.TTS_LANGUAGE || 'id',
    audioFormats: ['wav', 'mp3', 'ogg', 'm4a'],
    maxAudioSize: parseInt(process.env.MAX_AUDIO_SIZE) || 10 * 1024 * 1024 // 10MB
  },

  // File upload configuration
  upload: {
    imageFormats: ['jpg', 'jpeg', 'png', 'gif', 'bmp'],
    videoFormats: ['mp4', 'avi', 'mov', 'mkv', 'webm'],
    maxImageSize: parseInt(process.env.MAX_IMAGE_SIZE) || 5 * 1024 * 1024, // 5MB
    maxVideoSize: parseInt(process.env.MAX_VIDEO_SIZE) || 50 * 1024 * 1024, // 50MB
    tempDir: path.join(__dirname, '../../temp')
  },

  // Logging configuration
  logging: {
    level: process.env.LOG_LEVEL || (environment === 'production' ? 'warn' : 'info'),
    file: process.env.LOG_FILE || path.join(__dirname, '../../logs/app.log'),
    maxsize: parseInt(process.env.LOG_MAX_SIZE) || 10 * 1024 * 1024, // 10MB
    maxFiles: parseInt(process.env.LOG_MAX_FILES) || 5,
    console: environment !== 'production'
  },

  // CORS configuration
  cors: {
    origin: process.env.CORS_ORIGINS ? 
      process.env.CORS_ORIGINS.split(',') : 
      (environment === 'production' ? [] : ['*']),
    credentials: true
  },

  // Video processing configuration
  video: {
    defaultFrameCount: parseInt(process.env.DEFAULT_FRAME_COUNT) || 30,
    frameSize: {
      width: parseInt(process.env.FRAME_WIDTH) || 224,
      height: parseInt(process.env.FRAME_HEIGHT) || 224
    },
    maxVideoDuration: parseInt(process.env.MAX_VIDEO_DURATION) || 60 // seconds
  },

  // Rate limiting configuration (in-memory)
  rateLimit: {
    enabled: environment === 'production',
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW) || 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX) || 100, // limit each IP
    standardHeaders: true,
    legacyHeaders: false
  },

  // WebSocket configuration
  websocket: {
    enabled: process.env.WEBSOCKET_ENABLED !== 'false',
    port: parseInt(process.env.WEBSOCKET_PORT) || 8080,
    maxConnections: parseInt(process.env.WEBSOCKET_MAX_CONNECTIONS) || 100,
    heartbeatInterval: parseInt(process.env.WEBSOCKET_HEARTBEAT) || 30000 // 30 seconds
  },

  // Real-time processing configuration
  realtime: {
    enabled: process.env.REALTIME_ENABLED !== 'false',
    defaultConfidenceThreshold: parseFloat(process.env.CONFIDENCE_THRESHOLD) || 0.7,
    defaultPredictionInterval: parseInt(process.env.PREDICTION_INTERVAL) || 5, // frames
    maxFPS: parseInt(process.env.MAX_FPS) || 30,
    smoothingEnabled: process.env.SMOOTHING_ENABLED !== 'false'
  },

  // Monitoring and analytics (without database)
  monitoring: {
    enabled: process.env.MONITORING_ENABLED !== 'false',
    healthCheck: {
      interval: parseInt(process.env.HEALTH_CHECK_INTERVAL) || 30000, // 30 seconds
      timeout: parseInt(process.env.HEALTH_CHECK_TIMEOUT) || 5000 // 5 seconds
    },
    // In-memory metrics (will reset on restart)
    metrics: {
      retention: parseInt(process.env.METRICS_RETENTION) || 24 * 60 * 60 * 1000 // 24 hours
    }
  },

  // Security configuration
  security: {
    helmet: environment === 'production',
    rateLimitByIP: true,
    requestSizeLimit: '16mb',
    allowedOrigins: process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : ['*']
  },

  // API configuration
  api: {
    version: 'v1',
    prefix: '/api',
    documentation: {
      enabled: environment !== 'production',
      path: '/documentation',
      swaggerUI: true
    }
  },

  // Feature flags
  features: {
    realtime: process.env.FEATURE_REALTIME !== 'false',
    analytics: false, // Disabled without database
    monitoring: process.env.FEATURE_MONITORING !== 'false',
    websocket: process.env.FEATURE_WEBSOCKET !== 'false',
    fileUpload: true,
    mlPrediction: true
  },

  // Performance tuning
  performance: {
    compression: environment === 'production',
    etag: environment === 'production',
    clustering: environment === 'production' && process.env.CLUSTERING !== 'false',
    workers: parseInt(process.env.WORKERS) || require('os').cpus().length
  },

  // File cleanup configuration
  cleanup: {
    tempFiles: {
      enabled: true,
      maxAge: parseInt(process.env.TEMP_FILE_MAX_AGE) || 60 * 60 * 1000, // 1 hour
      interval: parseInt(process.env.CLEANUP_INTERVAL) || 10 * 60 * 1000 // 10 minutes
    },
    logs: {
      enabled: true,
      maxAge: parseInt(process.env.LOG_MAX_AGE) || 7 * 24 * 60 * 60 * 1000, // 7 days
      interval: parseInt(process.env.LOG_CLEANUP_INTERVAL) || 24 * 60 * 60 * 1000 // daily
    }
  }
};

// Validation function
const validateConfig = () => {
  const errors = [];

  // Required directories
  const requiredDirs = [
    config.server.uploadsPath,
    config.server.modelsPath,
    config.upload.tempDir,
    path.dirname(config.logging.file)
  ];

  requiredDirs.forEach(dir => {
    try {
      require('fs').mkdirSync(dir, { recursive: true });
    } catch (error) {
      errors.push(`Cannot create directory: ${dir}`);
    }
  });

  // Production validations
  if (config.isProduction) {
    if (!process.env.CORS_ORIGINS) {
      console.warn('⚠️  CORS_ORIGINS not set in production - using empty array');
    }
  }

  if (errors.length > 0) {
    throw new Error(`Configuration validation failed:\n${errors.join('\n')}`);
  }
};

// Helper functions
config.get = (path, defaultValue) => {
  return path.split('.').reduce((obj, key) => obj?.[key], config) ?? defaultValue;
};

config.set = (path, value) => {
  const keys = path.split('.');
  const lastKey = keys.pop();
  const target = keys.reduce((obj, key) => obj[key] = obj[key] || {}, config);
  target[lastKey] = value;
};

config.validate = validateConfig;

// Auto-validate in non-testing environments
if (!config.isTesting) {
  try {
    validateConfig();
  } catch (error) {
    console.error('❌ Configuration validation failed:', error.message);
    if (config.isProduction) {
      process.exit(1);
    }
  }
}

module.exports = config;