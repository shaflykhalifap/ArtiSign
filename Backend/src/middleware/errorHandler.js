const Boom = require('@hapi/boom');
const logger = require('../utils/logger');

/**
 * Global error handler middleware for Hapi.js
 * Handles all uncaught errors and formats responses consistently
 */

const errorHandler = {
  name: 'errorHandler',
  version: '1.0.0',
  register: async function (server, options) {
    
    // Handle server errors (500, etc)
    server.ext('onPreResponse', (request, h) => {
      const response = request.response;

      // Skip if not an error response
      if (!response.isBoom) {
        return h.continue;
      }

      const error = response;
      const statusCode = error.output.statusCode;
      
      // Log error with request context
      const errorInfo = {
        statusCode,
        method: request.method,
        path: request.path,
        ip: request.info.remoteAddress,
        userAgent: request.headers['user-agent'],
        payload: request.payload,
        query: request.query,
        params: request.params,
        error: error.message,
        stack: error.stack
      };

      // Log different levels based on error type
      if (statusCode >= 500) {
        logger.error('Server Error:', errorInfo);
      } else if (statusCode >= 400) {
        logger.warn('Client Error:', errorInfo);
      } else {
        logger.info('Request Error:', errorInfo);
      }

      // Format error response consistently
      const errorResponse = {
        statusCode,
        error: error.output.payload.error,
        message: this.getErrorMessage(error, statusCode),
        timestamp: new Date().toISOString(),
        path: request.path,
        method: request.method
      };

      // Add additional info for development
      if (process.env.NODE_ENV === 'development') {
        errorResponse.details = {
          stack: error.stack,
          data: error.data
        };
      }

      // Add request ID if available
      if (request.info.id) {
        errorResponse.requestId = request.info.id;
      }

      return h.response(errorResponse).code(statusCode);
    });

    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      logger.error('Uncaught Exception:', {
        error: error.message,
        stack: error.stack
      });
      
      // Don't exit in development
      if (process.env.NODE_ENV === 'production') {
        process.exit(1);
      }
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason, promise) => {
      logger.error('Unhandled Rejection:', {
        reason: reason,
        promise: promise
      });
      
      // Don't exit in development
      if (process.env.NODE_ENV === 'production') {
        process.exit(1);
      }
    });
  },

  getErrorMessage(error, statusCode) {
    // Custom error messages based on status code
    const customMessages = {
      400: 'Invalid request data provided',
      401: 'Authentication required',
      403: 'Access forbidden',
      404: 'Resource not found',
      413: 'File too large',
      415: 'Unsupported media type',
      422: 'Unable to process request',
      429: 'Too many requests',
      500: 'Internal server error',
      502: 'Bad gateway',
      503: 'Service unavailable',
      504: 'Gateway timeout'
    };

    // Return original message if it's user-friendly, otherwise use custom
    if (error.message && !error.message.includes('ValidationError') && !error.message.includes('Error:')) {
      return error.message;
    }

    return customMessages[statusCode] || 'An error occurred';
  }
};

// Export error creation helpers
const createError = {
  badRequest: (message, data = null) => {
    const error = Boom.badRequest(message);
    if (data) error.output.payload.data = data;
    return error;
  },

  unauthorized: (message = 'Authentication required') => {
    return Boom.unauthorized(message);
  },

  forbidden: (message = 'Access forbidden') => {
    return Boom.forbidden(message);
  },

  notFound: (message = 'Resource not found') => {
    return Boom.notFound(message);
  },

  conflict: (message, data = null) => {
    const error = Boom.conflict(message);
    if (data) error.output.payload.data = data;
    return error;
  },

  tooLarge: (message = 'Payload too large') => {
    return Boom.entityTooLarge(message);
  },

  tooManyRequests: (message = 'Too many requests') => {
    return Boom.tooManyRequests(message);
  },

  internal: (message = 'Internal server error', data = null) => {
    const error = Boom.internal(message);
    if (data) error.output.payload.data = data;
    return error;
  },

  notImplemented: (message = 'Feature not implemented') => {
    return Boom.notImplemented(message);
  },

  serviceUnavailable: (message = 'Service temporarily unavailable') => {
    return Boom.serverUnavailable(message);
  }
};

module.exports = {
  errorHandler,
  createError
};