const winston = require('winston');
const path = require('path');
const config = require('../config');

// Create logs directory if it doesn't exist
const fs = require('fs');
const logsDir = path.dirname(config.logging.file);
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Custom format for log messages
const logFormat = winston.format.combine(
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss'
  }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.prettyPrint()
);

// Console format for development
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({
    format: 'HH:mm:ss'
  }),
  winston.format.printf(({ level, message, timestamp, ...meta }) => {
    let log = `${timestamp} [${level}]: ${message}`;
    
    // Add metadata if present
    if (Object.keys(meta).length > 0) {
      log += ` ${JSON.stringify(meta, null, 2)}`;
    }
    
    return log;
  })
);

// Create logger instance
const logger = winston.createLogger({
  level: config.logging.level,
  format: logFormat,
  defaultMeta: {
    service: 'bisindo-api',
    version: require('../../package.json').version
  },
  transports: [
    // File transport for all logs
    new winston.transports.File({
      filename: config.logging.file,
      maxsize: config.logging.maxsize,
      maxFiles: config.logging.maxFiles,
      tailable: true
    }),
    
    // Separate file for errors
    new winston.transports.File({
      filename: path.join(path.dirname(config.logging.file), 'error.log'),
      level: 'error',
      maxsize: config.logging.maxsize,
      maxFiles: config.logging.maxFiles,
      tailable: true
    })
  ],
  
  // Handle uncaught exceptions and unhandled rejections
  exceptionHandlers: [
    new winston.transports.File({
      filename: path.join(path.dirname(config.logging.file), 'exceptions.log')
    })
  ],
  
  rejectionHandlers: [
    new winston.transports.File({
      filename: path.join(path.dirname(config.logging.file), 'rejections.log')
    })
  ]
});

// Add console transport for development
if (config.server.environment === 'development') {
  logger.add(new winston.transports.Console({
    format: consoleFormat,
    level: 'debug'
  }));
}

// Custom logging methods for specific use cases
logger.apiRequest = (method, path, statusCode, duration, meta = {}) => {
  logger.info('API Request', {
    type: 'api_request',
    method,
    path,
    statusCode,
    duration,
    ...meta
  });
};

logger.mlPrediction = (modelType, success, confidence, duration, meta = {}) => {
  logger.info('ML Prediction', {
    type: 'ml_prediction',
    modelType,
    success,
    confidence,
    duration,
    ...meta
  });
};

logger.fileUpload = (filename, size, type, success, meta = {}) => {
  logger.info('File Upload', {
    type: 'file_upload',
    filename,
    size,
    fileType: type,
    success,
    ...meta
  });
};

logger.security = (event, ip, userAgent, meta = {}) => {
  logger.warn('Security Event', {
    type: 'security',
    event,
    ip,
    userAgent,
    timestamp: new Date().toISOString(),
    ...meta
  });
};

logger.performance = (operation, duration, memoryUsage, meta = {}) => {
  logger.info('Performance Metric', {
    type: 'performance',
    operation,
    duration,
    memoryUsage,
    ...meta
  });
};

logger.modelLoad = (modelName, success, size, loadTime, meta = {}) => {
  logger.info('Model Load', {
    type: 'model_load',
    modelName,
    success,
    size,
    loadTime,
    ...meta
  });
};

// Error categorization
logger.criticalError = (message, error, meta = {}) => {
  logger.error('CRITICAL: ' + message, {
    type: 'critical_error',
    error: error.message,
    stack: error.stack,
    ...meta
  });
};

logger.businessError = (message, meta = {}) => {
  logger.error('BUSINESS: ' + message, {
    type: 'business_error',
    ...meta
  });
};

logger.technicalError = (message, error, meta = {}) => {
  logger.error('TECHNICAL: ' + message, {
    type: 'technical_error',
    error: error.message,
    stack: error.stack,
    ...meta
  });
};

// Log levels helper
logger.levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  verbose: 4,
  debug: 5,
  silly: 6
};

// Utility function to safely log objects
logger.safeLog = (level, message, obj) => {
  try {
    logger[level](message, obj);
  } catch (error) {
    logger.error('Logging error:', { 
      originalMessage: message,
      error: error.message 
    });
  }
};

// Request logging middleware helper
logger.createRequestLogger = () => {
  return (request, h) => {
    const start = Date.now();
    
    // Log request start
    logger.debug('Request started', {
      method: request.method,
      path: request.path,
      ip: request.info.remoteAddress,
      userAgent: request.headers['user-agent']
    });

    // Log response when finished
    request.events.once('response', (response) => {
      const duration = Date.now() - start;
      const statusCode = response.statusCode;
      
      logger.apiRequest(
        request.method,
        request.path,
        statusCode,
        duration,
        {
          ip: request.info.remoteAddress,
          userAgent: request.headers['user-agent'],
          payloadSize: request.payload ? JSON.stringify(request.payload).length : 0
        }
      );
    });

    return h.continue;
  };
};

// Health check for logging system
logger.healthCheck = () => {
  try {
    logger.info('Logger health check');
    return { healthy: true, timestamp: new Date().toISOString() };
  } catch (error) {
    return { 
      healthy: false, 
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
};

// Cleanup old log files
logger.cleanup = async (daysToKeep = 30) => {
  try {
    const fs = require('fs').promises;
    const logsPath = path.dirname(config.logging.file);
    const files = await fs.readdir(logsPath);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    for (const file of files) {
      if (file.endsWith('.log')) {
        const filePath = path.join(logsPath, file);
        const stats = await fs.stat(filePath);
        
        if (stats.mtime < cutoffDate) {
          await fs.unlink(filePath);
          logger.info(`Cleaned up old log file: ${file}`);
        }
      }
    }
  } catch (error) {
    logger.error('Error cleaning up log files:', error);
  }
};

module.exports = logger;