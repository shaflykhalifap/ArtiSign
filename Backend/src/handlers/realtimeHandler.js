const Boom = require('@hapi/boom');
const realtimeService = require('../services/realtimeService');
const logger = require('../utils/logger');

class RealtimeHandler {
  async getRealtimeStatus(request, h) {
    try {
      const stats = realtimeService.getRealtimeStats();
      
      return h.response({
        success: true,
        data: {
          websocket_server: 'running',
          port: 8080,
          ...stats,
          capabilities: {
            max_concurrent_connections: 100,
            supported_formats: ['base64_jpeg', 'base64_png'],
            min_confidence_threshold: 0.1,
            max_confidence_threshold: 1.0,
            frame_rate_limits: {
              min_fps: 1,
              max_fps: 30
            }
          }
        },
        timestamp: new Date().toISOString()
      }).code(200);

    } catch (error) {
      logger.error('Error getting real-time status:', error);
      throw Boom.internal('Error retrieving real-time status');
    }
  }

  async updateConnectionSettings(request, h) {
    try {
      const { connectionId } = request.params;
      const settings = request.payload;

      // Validate settings
      if (settings.confidence_threshold !== undefined) {
        if (settings.confidence_threshold < 0.1 || settings.confidence_threshold > 1.0) {
          throw Boom.badRequest('Confidence threshold must be between 0.1 and 1.0');
        }
      }

      if (settings.max_fps !== undefined) {
        if (settings.max_fps < 1 || settings.max_fps > 30) {
          throw Boom.badRequest('Max FPS must be between 1 and 30');
        }
      }

      if (settings.prediction_interval !== undefined) {
        if (settings.prediction_interval < 1 || settings.prediction_interval > 30) {
          throw Boom.badRequest('Prediction interval must be between 1 and 30 frames');
        }
      }

      // Update connection settings
      realtimeService.updateConnectionSettings(connectionId, settings);

      return h.response({
        success: true,
        message: 'Settings updated successfully',
        connectionId,
        settings
      }).code(200);

    } catch (error) {
      logger.error('Error updating connection settings:', error);
      
      if (Boom.isBoom(error)) {
        throw error;
      }
      
      throw Boom.internal('Error updating connection settings');
    }
  }

  async getRealtimeDocumentation(request, h) {
    try {
      const documentation = {
        websocket_endpoint: 'ws://localhost:8080',
        connection_flow: {
          step1: 'Connect to WebSocket server',
          step2: 'Receive connection confirmation with settings',
          step3: 'Send video frames as base64 JSON messages',
          step4: 'Receive real-time predictions',
          step5: 'Handle errors and connection management'
        },
        message_formats: {
          incoming_frame: {
            frame: 'base64_encoded_image_data',
            timestamp: 1640995200000,
            frameNumber: 123
          },
          outgoing_prediction: {
            type: 'prediction',
            data: {
              predicted_class: 'halo',
              confidence: 0.95,
              landmarks_detected: 1,
              processing_time: 45,
              frame_number: 123,
              timestamp: 1640995200000
            }
          },
          outgoing_error: {
            type: 'error',
            error: 'Processing error message',
            timestamp: 1640995200000
          }
        },
        settings: {
          confidence_threshold: {
            description: 'Minimum confidence to send prediction',
            default: 0.7,
            range: '0.1 - 1.0'
          },
          prediction_interval: {
            description: 'Process every N frames',
            default: 5,
            range: '1 - 30 frames'
          },
          smoothing_enabled: {
            description: 'Enable prediction smoothing',
            default: true,
            type: 'boolean'
          },
          max_fps: {
            description: 'Maximum frames per second to process',
            default: 15,
            range: '1 - 30 FPS'
          }
        },
        javascript_example: `
// Connect to WebSocket
const ws = new WebSocket('ws://localhost:8080');

// Handle connection
ws.onopen = () => {
  console.log('Connected to real-time gesture recognition');
};

// Handle predictions
ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  
  if (message.type === 'prediction') {
    console.log('Gesture:', message.data.predicted_class);
    console.log('Confidence:', message.data.confidence);
    // Update UI with gesture
    displayGesture(message.data.predicted_class);
  }
};

// Send video frame
function sendFrame(videoElement) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  canvas.width = videoElement.videoWidth;
  canvas.height = videoElement.videoHeight;
  ctx.drawImage(videoElement, 0, 0);
  
  const frameData = canvas.toDataURL('image/jpeg', 0.8).split(',')[1];
  
  ws.send(JSON.stringify({
    frame: frameData,
    timestamp: Date.now(),
    frameNumber: frameCounter++
  }));
}

// Capture frames from webcam
navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => {
    const video = document.getElementById('webcam');
    video.srcObject = stream;
    
    // Send frame every 100ms (10 FPS)
    setInterval(() => sendFrame(video), 100);
  });
        `
      };

      return h.response({
        success: true,
        data: documentation
      }).code(200);

    } catch (error) {
      logger.error('Error getting real-time documentation:', error);
      throw Boom.internal('Error retrieving documentation');
    }
  }

  async testRealtimeConnection(request, h) {
    try {
      const { test_frame } = request.payload;
      
      if (!test_frame) {
        throw Boom.badRequest('test_frame (base64) is required');
      }

      // Process test frame
      const result = await realtimeService.processFrameForGesture(test_frame, 'test_connection');

      return h.response({
        success: true,
        message: 'Real-time processing test completed',
        data: {
          processing_successful: result.success,
          predicted_class: result.predicted_class || null,
          confidence: result.confidence || 0,
          processing_time: result.processing_time,
          landmarks_detected: result.landmarks_detected || 0
        },
        timestamp: new Date().toISOString()
      }).code(200);

    } catch (error) {
      logger.error('Error testing real-time connection:', error);
      
      if (Boom.isBoom(error)) {
        throw error;
      }
      
      throw Boom.internal('Real-time connection test failed');
    }
  }
}

module.exports = new RealtimeHandler();