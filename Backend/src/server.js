const Hapi = require('@hapi/hapi');
const config = require('./config');
const logger = require('./utils/logger');

// Routes
const imageRoutes = require('./routes/imageRoutes');
const videoRoutes = require('./routes/videoRoutes');
const audioRoutes = require('./routes/audioRoutes');
const classRoutes = require('./routes/classRoutes');
const healthRoutes = require('./routes/healthRoutes');
const realtimeRoutes = require('./routes/realtimeRoutes');

// Services
const mlService = require('./services/mlService');
const realtimeService = require('./services/realtimeService');

// Middleware
const { errorHandler } = require('./middleware/errorHandler');
const { validation } = require('./middleware/validation');
const { rateLimitingPlugin } = require('./middleware/rateLimiting');

const init = async () => {
  // Create server
  const server = Hapi.server({
    port: config.server.port,
    host: config.server.host,
    routes: {
      cors: {
        origin: config.cors.origin,
        credentials: config.cors.credentials
      },
      files: {
        relativeTo: config.server.uploadsPath
      },
      payload: {
        maxBytes: config.server.maxPayloadSize,
        multipart: true,
        output: 'stream',
        parse: true,
        allow: 'multipart/form-data'
      },
      validate: {
        failAction: async (request, h, err) => {
          // Custom validation error handling
          logger.warn('Validation failed:', {
            path: request.path,
            method: request.method,
            error: err.message
          });
          
          throw err;
        }
      }
    }
  });

  // Register core plugins first
  await server.register([
    require('@hapi/inert'),
    require('@hapi/vision')
  ]);

  // Register custom middleware
  await server.register([
    {
      plugin: errorHandler,
      options: {}
    },
    {
      plugin: validation,
      options: {}
    },
    {
      plugin: rateLimitingPlugin,
      options: {
        enabled: config.rateLimit?.enabled !== false
      }
    }
  ]);

  // Register Swagger documentation
  await server.register({
    plugin: require('hapi-swagger'),
    options: {
      info: {
        title: 'BISINDO API Documentation',
        version: require('../package.json').version,
        description: 'RESTful API untuk BISINDO Sign Language Translator'
      },
      tags: [
        { name: 'Image', description: 'Image prediction endpoints' },
        { name: 'Video', description: 'Video prediction endpoints' },
        { name: 'Audio', description: 'Audio processing endpoints' },
        { name: 'Classes', description: 'Sign language classes endpoints' },
        { name: 'Real-time', description: 'Real-time processing endpoints' },
        { name: 'Health', description: 'Health monitoring endpoints' }
      ],
      grouping: 'tags',
      sortTags: 'name',
      documentationPath: '/documentation',
      swaggerUI: config.api?.documentation?.swaggerUI !== false,
      jsonPath: '/swagger.json',
      schemes: config.server.ssl?.enabled ? ['https'] : ['http'],
      host: config.isProduction ? undefined : `${config.server.host}:${config.server.port}`
    }
  });

  // Register routes
  server.route([
    ...imageRoutes,
    ...videoRoutes,
    ...audioRoutes,
    ...classRoutes,
    ...healthRoutes,
    ...realtimeRoutes
  ]);

  // Add request logging
  server.ext('onRequest', (request, h) => {
    request.info.startTime = Date.now();
    
    logger.debug('Request started:', {
      method: request.method,
      path: request.path,
      ip: request.info.remoteAddress,
      userAgent: request.headers['user-agent']
    });

    return h.continue;
  });

  // Add response logging
  server.ext('onPreResponse', (request, h) => {
    const response = request.response;
    const duration = Date.now() - request.info.startTime;
    const statusCode = response.isBoom ? response.output.statusCode : response.statusCode;

    // Log API request completion
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

    return h.continue;
  });

  // Initialize ML models
  try {
    logger.info('Initializing ML models...');
    await mlService.initialize();
    logger.info('ML models initialized successfully');
  } catch (error) {
    logger.error('Failed to initialize ML models:', error);
    // Don't exit, allow server to start without models for development
    if (config.isProduction) {
      logger.error('ML models are required in production. Exiting...');
      process.exit(1);
    }
  }

  // Initialize real-time service
  try {
    logger.info('Initializing real-time WebSocket service...');
    realtimeService.initialize(server);
    logger.info('Real-time service initialized on port 8080');
  } catch (error) {
    logger.error('Failed to initialize real-time service:', error);
    // Continue without real-time service
  }

  // Add graceful shutdown handling
  const gracefulShutdown = async (signal) => {
    logger.info(`Received ${signal}. Starting graceful shutdown...`);
    
    try {
      // Stop accepting new connections
      await server.stop({ timeout: 10000 });
      logger.info('HTTP server stopped');
      
      // Cleanup resources
      if (realtimeService.wss) {
        realtimeService.wss.close();
        logger.info('WebSocket server stopped');
      }
      
      logger.info('Graceful shutdown completed');
      process.exit(0);
    } catch (error) {
      logger.error('Error during graceful shutdown:', error);
      process.exit(1);
    }
  };

  // Register shutdown handlers
  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  // Start server
  await server.start();
  
  logger.info('🚀 BISINDO Backend started successfully!');
  logger.info(`📡 HTTP Server: ${server.info.uri}`);
  logger.info(`🔌 WebSocket Server: ws://${config.server.host}:${config.websocket.port}`);
  logger.info(`📖 API Documentation: ${server.info.uri}/documentation`);
  logger.info(`🏥 Health Check: ${server.info.uri}/api/health`);
  logger.info(`🌍 Environment: ${config.environment}`);
  
  // Log enabled features
  const enabledFeatures = Object.entries(config.features || {})
    .filter(([key, value]) => value)
    .map(([key]) => key);
  
  if (enabledFeatures.length > 0) {
    logger.info(`✨ Enabled features: ${enabledFeatures.join(', ')}`);
  }

  return server;
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('Unhandled rejection:', err);
  if (config.isProduction) {
    process.exit(1);
  }
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('Uncaught exception:', err);
  if (config.isProduction) {
    process.exit(1);
  }
});

// Start server if this file is run directly
if (require.main === module) {
  init().catch((err) => {
    logger.error('Server failed to start:', err);
    process.exit(1);
  });
}

module.exports = { init };