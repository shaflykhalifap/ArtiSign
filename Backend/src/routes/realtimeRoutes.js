const Joi = require('joi');
const realtimeHandler = require('../handlers/realtimeHandler');

const realtimeRoutes = [
  {
    method: 'GET',
    path: '/api/realtime/status',
    handler: realtimeHandler.getRealtimeStatus,
    options: {
      description: 'Get real-time processing status and statistics',
      notes: 'Returns WebSocket server status, active connections, and performance metrics',
      tags: ['api', 'Real-time'],
      response: {
        schema: Joi.object({
          success: Joi.boolean().required(),
          data: Joi.object({
            websocket_server: Joi.string().valid('running', 'stopped'),
            port: Joi.number().integer(),
            active_connections: Joi.number().integer(),
            total_predictions: Joi.number().integer(),
            average_fps: Joi.number(),
            capabilities: Joi.object({
              max_concurrent_connections: Joi.number().integer(),
              supported_formats: Joi.array().items(Joi.string()),
              min_confidence_threshold: Joi.number(),
              max_confidence_threshold: Joi.number(),
              frame_rate_limits: Joi.object({
                min_fps: Joi.number().integer(),
                max_fps: Joi.number().integer()
              })
            }),
            connections: Joi.array().items(Joi.object({
              connected: Joi.boolean(),
              prediction_count: Joi.number().integer(),
              settings: Joi.object()
            }))
          }),
          timestamp: Joi.string().isoDate()
        }).label('RealtimeStatusResponse')
      }
    }
  },
  {
    method: 'PUT',
    path: '/api/realtime/connections/{connectionId}/settings',
    handler: realtimeHandler.updateConnectionSettings,
    options: {
      description: 'Update real-time connection settings',
      notes: 'Modify processing parameters for a specific WebSocket connection',
      tags: ['api', 'Real-time'],
      validate: {
        params: Joi.object({
          connectionId: Joi.string().uuid().required().description('WebSocket connection ID')
        }),
        payload: Joi.object({
          confidence_threshold: Joi.number().min(0.1).max(1.0).description('Minimum confidence threshold'),
          prediction_interval: Joi.number().integer().min(1).max(30).description('Process every N frames'),
          smoothing_enabled: Joi.boolean().description('Enable prediction smoothing'),
          max_fps: Joi.number().integer().min(1).max(30).description('Maximum processing FPS')
        }).min(1)
      },
      response: {
        schema: Joi.object({
          success: Joi.boolean().required(),
          message: Joi.string(),
          connectionId: Joi.string(),
          settings: Joi.object()
        }).label('UpdateSettingsResponse')
      }
    }
  },
  {
    method: 'GET',
    path: '/api/realtime/documentation',
    handler: realtimeHandler.getRealtimeDocumentation,
    options: {
      description: 'Get real-time WebSocket API documentation',
      notes: 'Returns complete documentation for WebSocket integration',
      tags: ['api', 'Real-time'],
      response: {
        schema: Joi.object({
          success: Joi.boolean().required(),
          data: Joi.object({
            websocket_endpoint: Joi.string(),
            connection_flow: Joi.object(),
            message_formats: Joi.object(),
            settings: Joi.object(),
            javascript_example: Joi.string()
          })
        }).label('RealtimeDocumentationResponse')
      }
    }
  },
  {
    method: 'POST',
    path: '/api/realtime/test',
    handler: realtimeHandler.testRealtimeConnection,
    options: {
      description: 'Test real-time processing with a single frame',
      notes: 'Send a test frame to validate real-time processing pipeline',
      tags: ['api', 'Real-time'],
      validate: {
        payload: Joi.object({
          test_frame: Joi.string().required().description('Base64 encoded test image')
        })
      },
      response: {
        schema: Joi.object({
          success: Joi.boolean().required(),
          message: Joi.string(),
          data: Joi.object({
            processing_successful: Joi.boolean(),
            predicted_class: Joi.string().allow(null),
            confidence: Joi.number().min(0).max(1),
            processing_time: Joi.number().integer(),
            landmarks_detected: Joi.number().integer()
          }),
          timestamp: Joi.string().isoDate()
        }).label('RealtimeTestResponse')
      }
    }
  }
];

module.exports = realtimeRoutes;