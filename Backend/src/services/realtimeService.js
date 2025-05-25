const WebSocket = require('ws');
const mlService = require('./mlService');
const logger = require('../utils/logger');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');

class RealtimeService {
  constructor() {
    this.activeConnections = new Map();
    this.predictionBuffer = new Map(); // Buffer untuk smoothing predictions
    this.lastPredictions = new Map(); // Track last predictions per connection
    this.wss = null;
  }

  initialize(server) {
    // Create WebSocket server
    this.wss = new WebSocket.Server({ 
      port: 8080,
      perMessageDeflate: false // Disable compression for lower latency
    });

    this.wss.on('connection', (ws, request) => {
      const connectionId = uuidv4();
      
      logger.info('Real-time connection established', { 
        connectionId,
        ip: request.socket.remoteAddress 
      });

      // Initialize connection state
      this.activeConnections.set(connectionId, {
        ws,
        connected: true,
        lastSeen: Date.now(),
        predictionCount: 0,
        settings: {
          confidence_threshold: 0.7,
          prediction_interval: 5, // Every 5 frames
          smoothing_enabled: true,
          max_fps: 15
        }
      });

      // Handle incoming frames
      ws.on('message', async (data) => {
        try {
          await this.handleRealtimeFrame(connectionId, data);
        } catch (error) {
          logger.error('Error processing real-time frame:', error);
          this.sendError(connectionId, 'Processing error');
        }
      });

      // Handle connection close
      ws.on('close', () => {
        this.cleanup(connectionId);
        logger.info('Real-time connection closed', { connectionId });
      });

      // Handle errors
      ws.on('error', (error) => {
        logger.error('WebSocket error:', { connectionId, error });
        this.cleanup(connectionId);
      });

      // Send initial configuration
      this.sendMessage(connectionId, {
        type: 'connected',
        connectionId,
        settings: this.activeConnections.get(connectionId).settings
      });
    });

    logger.info('Real-time service initialized on port 8080');
  }

  async handleRealtimeFrame(connectionId, data) {
    const connection = this.activeConnections.get(connectionId);
    if (!connection || !connection.connected) return;

    try {
      // Parse incoming data
      const frameData = JSON.parse(data);
      const { frame, timestamp, frameNumber } = frameData;

      // Apply frame rate limiting
      const now = Date.now();
      const timeDiff = now - connection.lastSeen;
      const minInterval = 1000 / connection.settings.max_fps;
      
      if (timeDiff < minInterval) {
        return; // Skip frame for rate limiting
      }

      connection.lastSeen = now;

      // Check if we should process this frame based on interval
      if (frameNumber % connection.settings.prediction_interval !== 0) {
        return; // Skip frame based on prediction interval
      }

      // Process frame for gesture recognition
      const prediction = await this.processFrameForGesture(frame, connectionId);

      if (prediction.success) {
        // Apply smoothing if enabled
        const smoothedPrediction = connection.settings.smoothing_enabled 
          ? this.applySmoothingFilter(connectionId, prediction)
          : prediction;

        // Only send if confidence above threshold
        if (smoothedPrediction.confidence >= connection.settings.confidence_threshold) {
          connection.predictionCount++;
          
          // Send prediction back to client
          this.sendMessage(connectionId, {
            type: 'prediction',
            data: {
              predicted_class: smoothedPrediction.predicted_class,
              confidence: smoothedPrediction.confidence,
              landmarks_detected: smoothedPrediction.landmarks_detected,
              processing_time: smoothedPrediction.processing_time,
              frame_number: frameNumber,
              timestamp: now
            }
          });

          // Log for analytics
          logger.info('Real-time prediction', {
            connectionId,
            predicted_class: smoothedPrediction.predicted_class,
            confidence: smoothedPrediction.confidence,
            processing_time: smoothedPrediction.processing_time
          });
        }
      }

    } catch (error) {
      logger.error('Error handling real-time frame:', error);
      this.sendError(connectionId, 'Frame processing failed');
    }
  }

  async processFrameForGesture(frameBase64, connectionId) {
    const startTime = Date.now();
    
    try {
      // Save frame temporarily
      const frameBuffer = Buffer.from(frameBase64, 'base64');
      const tempPath = path.join(__dirname, '../../temp', `realtime_${connectionId}_${Date.now()}.jpg`);
      
      await fs.writeFile(tempPath, frameBuffer);

      // Process with Python script for real-time landmark extraction
      const landmarkResult = await this.extractLandmarksRealtime(tempPath);

      // Clean up temp file
      await this.cleanupFile(tempPath);

      if (!landmarkResult.success || landmarkResult.landmarks.length === 0) {
        return {
          success: false,
          error: 'No hand detected',
          processing_time: Date.now() - startTime
        };
      }

      // Use landmark model for fast prediction
      const prediction = await mlService.predictLandmarks(landmarkResult.landmarks[0]);
      
      return {
        success: true,
        predicted_class: prediction.predicted_class,
        confidence: prediction.confidence,
        landmarks_detected: landmarkResult.landmarks.length,
        processing_time: Date.now() - startTime
      };

    } catch (error) {
      logger.error('Error processing frame for gesture:', error);
      return {
        success: false,
        error: error.message,
        processing_time: Date.now() - startTime
      };
    }
  }

  async extractLandmarksRealtime(imagePath) {
    return new Promise((resolve) => {
      const pythonScript = path.join(__dirname, '../utils/realtime_landmarks.py');
      const python = spawn('python3', [pythonScript, imagePath]);

      let output = '';
      let errorOutput = '';

      python.stdout.on('data', (data) => {
        output += data.toString();
      });

      python.stderr.on('data', (data) => {
        errorOutput += data.toString();
      });

      python.on('close', (code) => {
        if (code === 0) {
          try {
            const result = JSON.parse(output);
            resolve(result);
          } catch (error) {
            resolve({ success: false, error: 'Failed to parse landmarks' });
          }
        } else {
          resolve({ success: false, error: errorOutput || 'Landmark extraction failed' });
        }
      });
    });
  }

  applySmoothingFilter(connectionId, currentPrediction) {
    const buffer = this.predictionBuffer.get(connectionId) || [];
    
    // Add current prediction to buffer
    buffer.push(currentPrediction);
    
    // Keep only last 5 predictions for smoothing
    if (buffer.length > 5) {
      buffer.shift();
    }
    
    this.predictionBuffer.set(connectionId, buffer);

    // If we have multiple predictions, apply smoothing
    if (buffer.length >= 3) {
      // Find most common prediction in buffer
      const classCounts = {};
      let totalConfidence = 0;
      
      buffer.forEach(pred => {
        classCounts[pred.predicted_class] = (classCounts[pred.predicted_class] || 0) + 1;
        totalConfidence += pred.confidence;
      });

      // Get most frequent class
      const mostFrequentClass = Object.keys(classCounts).reduce((a, b) => 
        classCounts[a] > classCounts[b] ? a : b
      );

      // Calculate average confidence for smoothed class
      const avgConfidence = totalConfidence / buffer.length;

      return {
        ...currentPrediction,
        predicted_class: mostFrequentClass,
        confidence: avgConfidence,
        smoothed: true
      };
    }

    return currentPrediction;
  }

  sendMessage(connectionId, message) {
    const connection = this.activeConnections.get(connectionId);
    if (connection && connection.connected && connection.ws.readyState === WebSocket.OPEN) {
      connection.ws.send(JSON.stringify(message));
    }
  }

  sendError(connectionId, error) {
    this.sendMessage(connectionId, {
      type: 'error',
      error,
      timestamp: Date.now()
    });
  }

  updateConnectionSettings(connectionId, settings) {
    const connection = this.activeConnections.get(connectionId);
    if (connection) {
      connection.settings = { ...connection.settings, ...settings };
      this.sendMessage(connectionId, {
        type: 'settings_updated',
        settings: connection.settings
      });
    }
  }

  cleanup(connectionId) {
    this.activeConnections.delete(connectionId);
    this.predictionBuffer.delete(connectionId);
    this.lastPredictions.delete(connectionId);
  }

  async cleanupFile(filePath) {
    try {
      await fs.unlink(filePath);
    } catch (error) {
      logger.warn(`Failed to cleanup file ${filePath}:`, error);
    }
  }

  getRealtimeStats() {
    const connections = Array.from(this.activeConnections.values());
    
    return {
      active_connections: connections.length,
      total_predictions: connections.reduce((sum, conn) => sum + conn.predictionCount, 0),
      average_fps: connections.length > 0 
        ? connections.reduce((sum, conn) => sum + (1000 / conn.settings.max_fps), 0) / connections.length 
        : 0,
      connections: connections.map(conn => ({
        connected: conn.connected,
        prediction_count: conn.predictionCount,
        settings: conn.settings
      }))
    };
  }
}

module.exports = new RealtimeService();