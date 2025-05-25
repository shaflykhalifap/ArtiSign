const Boom = require('@hapi/boom');
const logger = require('../utils/logger');

/**
 * Rate limiting middleware for Hapi.js
 * Protects API from abuse and ensures fair usage
 */

class RateLimiter {
  constructor(options = {}) {
    this.clients = new Map(); // Store client request data
    this.config = {
      windowMs: options.windowMs || 15 * 60 * 1000, // 15 minutes
      max: options.max || 100, // requests per window
      standardHeaders: options.standardHeaders !== false,
      legacyHeaders: options.legacyHeaders !== false,
      keyGenerator: options.keyGenerator || this.defaultKeyGenerator,
      skipSuccessfulRequests: options.skipSuccessfulRequests || false,
      skipFailedRequests: options.skipFailedRequests || false,
      onLimitReached: options.onLimitReached || this.defaultOnLimitReached
    };
    
    // Cleanup old entries periodically
    setInterval(() => this.cleanup(), this.config.windowMs);
  }

  defaultKeyGenerator(request) {
    // Generate key based on IP and endpoint
    const ip = request.info.remoteAddress;
    const endpoint = request.route?.path || request.path;
    return `${ip}:${endpoint}`;
  }

  defaultOnLimitReached(request, clientData) {
    logger.warn('Rate limit exceeded:', {
      ip: request.info.remoteAddress,
      path: request.path,
      userAgent: request.headers['user-agent'],
      requestCount: clientData.count,
      limit: this.config.max
    });
  }

  getClientData(key) {
    const now = Date.now();
    let clientData = this.clients.get(key);

    if (!clientData || (now - clientData.resetTime) >= this.config.windowMs) {
      // Create new or reset expired client data
      clientData = {
        count: 0,
        resetTime: now + this.config.windowMs,
        firstRequest: now
      };
      this.clients.set(key, clientData);
    }

    return clientData;
  }

  shouldSkip(request, statusCode) {
    if (this.config.skipSuccessfulRequests && statusCode < 400) {
      return true;
    }
    
    if (this.config.skipFailedRequests && statusCode >= 400) {
      return true;
    }
    
    return false;
  }

  addHeaders(response, clientData) {
    const now = Date.now();
    const remaining = Math.max(0, this.config.max - clientData.count);
    const resetTime = Math.ceil(clientData.resetTime / 1000);

    if (this.config.standardHeaders) {
      response.header('RateLimit-Limit', this.config.max);
      response.header('RateLimit-Remaining', remaining);
      response.header('RateLimit-Reset', resetTime);
    }

    if (this.config.legacyHeaders) {
      response.header('X-RateLimit-Limit', this.config.max);
      response.header('X-RateLimit-Remaining', remaining);
      response.header('X-RateLimit-Reset', resetTime);
    }
  }

  cleanup() {
    const now = Date.now();
    let cleaned = 0;

    for (const [key, clientData] of this.clients.entries()) {
      if ((now - clientData.resetTime) >= this.config.windowMs) {
        this.clients.delete(key);
        cleaned++;
      }
    }

    if (cleaned > 0) {
      logger.debug(`Rate limiter cleaned up ${cleaned} expired entries`);
    }
  }

  async middleware(request, h) {
    const key = this.config.keyGenerator(request);
    const clientData = this.getClientData(key);

    // Increment request count
    clientData.count++;

    // Check if limit exceeded
    if (clientData.count > this.config.max) {
      this.config.onLimitReached(request, clientData);
      
      const error = Boom.tooManyRequests('Too many requests');
      error.output.headers = {};
      
      if (this.config.standardHeaders) {
        error.output.headers['RateLimit-Limit'] = this.config.max;
        error.output.headers['RateLimit-Remaining'] = 0;
        error.output.headers['RateLimit-Reset'] = Math.ceil(clientData.resetTime / 1000);
      }
      
      throw error;
    }

    // Add rate limit headers to successful responses
    request.app.rateLimitData = clientData;
    
    return h.continue;
  }
}

// Different rate limit configurations for different endpoints
const rateLimitConfigs = {
  // General API endpoints
  general: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // requests per window per IP
  },

  // ML prediction endpoints (more restrictive)
  prediction: {
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 20 // requests per minute per IP
  },

  // File upload endpoints (very restrictive)
  upload: {
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 10 // uploads per minute per IP
  },

  // Audio processing (moderate)
  audio: {
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 30 // requests per 5 minutes per IP
  },

  // Health checks (very permissive)
  health: {
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 100 // requests per minute per IP
  }
};

// Create rate limiters
const rateLimiters = {
  general: new RateLimiter(rateLimitConfigs.general),
  prediction: new RateLimiter(rateLimitConfigs.prediction),
  upload: new RateLimiter(rateLimitConfigs.upload),
  audio: new RateLimiter(rateLimitConfigs.audio),
  health: new RateLimiter(rateLimitConfigs.health)
};

// Hapi plugin
const rateLimitingPlugin = {
  name: 'rateLimiting',
  version: '1.0.0',
  register: async function (server, options) {
    
    // Add rate limiting to all routes
    server.ext('onPostAuth', async (request, h) => {
      // Skip if rate limiting disabled
      if (process.env.NODE_ENV === 'test' || !options.enabled) {
        return h.continue;
      }

      // Determine which rate limiter to use based on path
      let limiter = rateLimiters.general;
      
      if (request.path.includes('/predict') || request.path.includes('/realtime')) {
        limiter = rateLimiters.prediction;
      } else if (request.path.includes('/upload') || request.method === 'POST') {
        limiter = rateLimiters.upload;
      } else if (request.path.includes('/audio')) {
        limiter = rateLimiters.audio;
      } else if (request.path.includes('/health')) {
        limiter = rateLimiters.health;
      }

      return limiter.middleware(request, h);
    });

    // Add headers to responses
    server.ext('onPreResponse', (request, h) => {
      const response = request.response;
      
      // Skip for errors or if no rate limit data
      if (response.isBoom || !request.app.rateLimitData) {
        return h.continue;
      }

      // Add rate limit headers
      const clientData = request.app.rateLimitData;
      const remaining = Math.max(0, rateLimitConfigs.general.max - clientData.count);
      const resetTime = Math.ceil(clientData.resetTime / 1000);

      if (typeof response.header === 'function') {
        response.header('X-RateLimit-Limit', rateLimitConfigs.general.max);
        response.header('X-RateLimit-Remaining', remaining);
        response.header('X-RateLimit-Reset', resetTime);
      }

      return h.continue;
    });
  }
};

// Helper functions for manual rate limiting
const checkRateLimit = {
  // Check if IP is rate limited for specific action
  isLimited: (ip, action = 'general') => {
    const limiter = rateLimiters[action] || rateLimiters.general;
    const clientData = limiter.getClientData(ip);
    return clientData.count >= limiter.config.max;
  },

  // Get remaining requests for IP
  getRemaining: (ip, action = 'general') => {
    const limiter = rateLimiters[action] || rateLimiters.general;
    const clientData = limiter.getClientData(ip);
    return Math.max(0, limiter.config.max - clientData.count);
  },

  // Reset rate limit for IP (admin use)
  reset: (ip, action = 'general') => {
    const limiter = rateLimiters[action] || rateLimiters.general;
    limiter.clients.delete(ip);
  }
};

module.exports = {
  rateLimitingPlugin,
  rateLimiters,
  checkRateLimit,
  RateLimiter
};