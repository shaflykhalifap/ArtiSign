const Joi = require('joi');
const healthHandler = require('../handlers/healthHandler');

const healthRoutes = [
  {
    method: 'GET',
    path: '/api/health',
    handler: healthHandler.basicHealthCheck,
    options: {
      description: 'Basic health check',
      notes: 'Returns basic server health status and model availability',
      tags: ['api', 'Health'],
      response: {
        schema: Joi.object({
          status: Joi.string().valid('healthy', 'unhealthy').required(),
          timestamp: Joi.string().isoDate().required(),
          models_loaded: Joi.object({
            image_model: Joi.boolean(),
            landmark_model: Joi.boolean(),
            video_model: Joi.boolean()
          }),
          server_info: Joi.object({
            uptime: Joi.number(),
            memory_usage: Joi.object(),
            version: Joi.string()
          })
        }).label('HealthCheckResponse')
      }
    }
  },
  {
    method: 'GET',
    path: '/api/health/detailed',
    handler: healthHandler.detailedHealthCheck,
    options: {
      description: 'Detailed health check',
      notes: 'Returns comprehensive server and system health information',
      tags: ['api', 'Health'],
      response: {
        schema: Joi.object({
          status: Joi.string().valid('healthy', 'degraded', 'unhealthy').required(),
          timestamp: Joi.string().isoDate().required(),
          server: Joi.object({
            uptime: Joi.number(),
            memory: Joi.object({
              used: Joi.number(),
              free: Joi.number(),
              total: Joi.number(),
              percentage: Joi.number()
            }),
            cpu_usage: Joi.number().allow(null),
            load_average: Joi.array().items(Joi.number()).allow(null)
          }),
          models: Joi.object({
            status: Joi.string(),
            image_model: Joi.object({
              loaded: Joi.boolean(),
              classes: Joi.number().integer(),
              last_prediction: Joi.string().isoDate().allow(null)
            }),
            landmark_model: Joi.object({
              loaded: Joi.boolean(),
              classes: Joi.number().integer(),
              last_prediction: Joi.string().isoDate().allow(null)
            }),
            video_model: Joi.object({
              loaded: Joi.boolean(),
              classes: Joi.number().integer(),
              last_prediction: Joi.string().isoDate().allow(null)
            })
          }),
          services: Joi.object({
            ml_service: Joi.string().valid('running', 'stopped', 'error'),
            audio_service: Joi.string().valid('running', 'stopped', 'error'),
            database: Joi.string().valid('connected', 'disconnected', 'error').allow(null)
          }),
          storage: Joi.object({
            uploads_directory: Joi.object({
              exists: Joi.boolean(),
              writable: Joi.boolean(),
              space_available: Joi.number().allow(null)
            }),
            models_directory: Joi.object({
              exists: Joi.boolean(),
              files_count: Joi.number().integer()
            })
          })
        }).label('DetailedHealthResponse')
      }
    }
  },
  {
    method: 'GET',
    path: '/api/health/models',
    handler: healthHandler.modelsHealthCheck,
    options: {
      description: 'Models health check',
      notes: 'Returns specific information about ML models status and performance',
      tags: ['api', 'Health'],
      response: {
        schema: Joi.object({
          status: Joi.string().valid('all_loaded', 'partial_loaded', 'none_loaded').required(),
          timestamp: Joi.string().isoDate().required(),
          models: Joi.object({
            image_model: Joi.object({
              path: Joi.string(),
              loaded: Joi.boolean(),
              size_mb: Joi.number().allow(null),
              classes_count: Joi.number().integer(),
              last_used: Joi.string().isoDate().allow(null),
              predictions_count: Joi.number().integer(),
              average_inference_time: Joi.number().allow(null)
            }),
            landmark_model: Joi.object({
              path: Joi.string(),
              loaded: Joi.boolean(),
              size_mb: Joi.number().allow(null),
              classes_count: Joi.number().integer(),
              last_used: Joi.string().isoDate().allow(null),
              predictions_count: Joi.number().integer(),
              average_inference_time: Joi.number().allow(null)
            }),
            video_model: Joi.object({
              path: Joi.string(),
              loaded: Joi.boolean(),
              size_mb: Joi.number().allow(null),
              classes_count: Joi.number().integer(),
              last_used: Joi.string().isoDate().allow(null),
              predictions_count: Joi.number().integer(),
              average_inference_time: Joi.number().allow(null)
            })
          }),
          performance_metrics: Joi.object({
            total_predictions: Joi.number().integer(),
            success_rate: Joi.number().min(0).max(1),
            average_confidence: Joi.number().min(0).max(1).allow(null),
            peak_memory_usage: Joi.number().allow(null)
          })
        }).label('ModelsHealthResponse')
      }
    }
  },
  {
    method: 'GET',
    path: '/api/health/ready',
    handler: healthHandler.readinessCheck,
    options: {
      description: 'Readiness check',
      notes: 'Returns whether the service is ready to accept requests',
      tags: ['api', 'Health'],
      response: {
        schema: Joi.object({
          ready: Joi.boolean().required(),
          timestamp: Joi.string().isoDate().required(),
          dependencies: Joi.object({
            models_initialized: Joi.boolean(),
            storage_accessible: Joi.boolean(),
            services_running: Joi.boolean()
          }),
          message: Joi.string().allow(null)
        }).label('ReadinessResponse')
      }
    }
  },
  {
    method: 'GET',
    path: '/api/health/live',
    handler: healthHandler.livenessCheck,
    options: {
      description: 'Liveness check',
      notes: 'Simple endpoint to check if the service is alive',
      tags: ['api', 'Health'],
      response: {
        schema: Joi.object({
          alive: Joi.boolean().required(),
          timestamp: Joi.string().isoDate().required(),
          uptime: Joi.number().required()
        }).label('LivenessResponse')
      }
    }
  },
  {
    method: 'GET',
    path: '/',
    handler: healthHandler.apiInfo,
    options: {
      description: 'API information',
      notes: 'Returns basic API information and available endpoints',
      tags: ['api', 'Health'],
      response: {
        schema: Joi.object({
          name: Joi.string().required(),
          version: Joi.string().required(),
          description: Joi.string().required(),
          endpoints: Joi.object({
            image: Joi.array().items(Joi.string()),
            video: Joi.array().items(Joi.string()),
            audio: Joi.array().items(Joi.string()),
            classes: Joi.array().items(Joi.string()),
            health: Joi.array().items(Joi.string())
          }),
          documentation: Joi.string(),
          timestamp: Joi.string().isoDate()
        }).label('ApiInfoResponse')
      }
    }
  }
];

module.exports = healthRoutes;