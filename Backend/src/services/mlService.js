const tf = require('@tensorflow/tfjs-node');
const fs = require('fs').promises;
const path = require('path');
const config = require('../config');
const logger = require('../utils/logger');
const { spawn } = require('child_process');

class MLService {
  constructor() {
    this.imageModel = null;
    this.landmarkModel = null;
    this.videoModel = null;
    this.imageClassMapping = {};
    this.videoClassMapping = {};
    this.isInitialized = false;
  }

  async initialize() {
    try {
      logger.info('Starting ML Service initialization...');

      // Load class mappings
      await this.loadClassMappings();

      // Load TensorFlow models
      await this.loadModels();

      this.isInitialized = true;
      logger.info('ML Service initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize ML Service:', error);
      throw error;
    }
  }

  async loadClassMappings() {
    try {
      // Load image class mapping
      if (await this.fileExists(config.models.imageClassMapping)) {
        const imageData = await fs.readFile(config.models.imageClassMapping, 'utf8');
        this.imageClassMapping = JSON.parse(imageData);
        logger.info(`Loaded ${Object.keys(this.imageClassMapping).length} image classes`);
      }

      // Load video class mapping
      if (await this.fileExists(config.models.videoClassMapping)) {
        const videoData = await fs.readFile(config.models.videoClassMapping, 'utf8');
        this.videoClassMapping = JSON.parse(videoData);
        logger.info(`Loaded ${Object.keys(this.videoClassMapping).length} video classes`);
      }
    } catch (error) {
      logger.error('Error loading class mappings:', error);
      throw error;
    }
  }

  async loadModels() {
    try {
      // Load image model
      if (await this.fileExists(config.models.imageModel)) {
        this.imageModel = await tf.loadLayersModel(`file://${config.models.imageModel}`);
        logger.info('Image model loaded successfully');
      }

      // Load landmark model
      if (await this.fileExists(config.models.landmarkModel)) {
        this.landmarkModel = await tf.loadLayersModel(`file://${config.models.landmarkModel}`);
        logger.info('Landmark model loaded successfully');
      }

      // Load video model
      if (await this.fileExists(config.models.videoModel)) {
        this.videoModel = await tf.loadLayersModel(`file://${config.models.videoModel}`);
        logger.info('Video model loaded successfully');
      }
    } catch (error) {
      logger.error('Error loading TensorFlow models:', error);
      throw error;
    }
  }

  async fileExists(filePath) {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  async extractHandLandmarks(imagePath) {
    return new Promise((resolve, reject) => {
      // Use Python script to extract landmarks using MediaPipe
      const pythonScript = path.join(__dirname, '../utils/extract_landmarks.py');
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
            reject(new Error(`Failed to parse landmarks: ${error.message}`));
          }
        } else {
          reject(new Error(`Python script failed: ${errorOutput}`));
        }
      });
    });
  }

  async predictImage(imagePath) {
    try {
      if (!this.isInitialized) {
        throw new Error('ML Service not initialized');
      }

      // Extract hand landmarks
      const landmarksResult = await this.extractHandLandmarks(imagePath);
      
      if (!landmarksResult.success || landmarksResult.landmarks.length === 0) {
        return {
          success: false,
          error: 'No hand detected in image',
          confidence: 0.0
        };
      }

      // Use landmark model for prediction
      if (this.landmarkModel) {
        const landmarks = tf.tensor2d([landmarksResult.landmarks[0]]);
        const prediction = this.landmarkModel.predict(landmarks);
        const probabilities = await prediction.data();
        
        const maxIndex = probabilities.indexOf(Math.max(...probabilities));
        const confidence = probabilities[maxIndex];
        const predictedClass = this.imageClassMapping[maxIndex.toString()] || 'Unknown';

        // Clean up tensors
        landmarks.dispose();
        prediction.dispose();

        return {
          success: true,
          predicted_class: predictedClass,
          confidence: confidence,
          landmarks_detected: landmarksResult.landmarks.length
        };
      }

      // Fallback to image model if landmark model not available
      if (this.imageModel) {
        // Load and preprocess image
        const imageBuffer = await fs.readFile(imagePath);
        const imageTensor = tf.node.decodeImage(imageBuffer, 3)
          .resizeNearestNeighbor([224, 224])
          .expandDims(0)
          .div(255.0);

        const prediction = this.imageModel.predict(imageTensor);
        const probabilities = await prediction.data();
        
        const maxIndex = probabilities.indexOf(Math.max(...probabilities));
        const confidence = probabilities[maxIndex];
        const predictedClass = this.imageClassMapping[maxIndex.toString()] || 'Unknown';

        // Clean up tensors
        imageTensor.dispose();
        prediction.dispose();

        return {
          success: true,
          predicted_class: predictedClass,
          confidence: confidence,
          landmarks_detected: landmarksResult.landmarks.length
        };
      }

      throw new Error('No suitable model available for image prediction');

    } catch (error) {
      logger.error('Error in image prediction:', error);
      return {
        success: false,
        error: error.message,
        confidence: 0.0
      };
    }
  }

  async predictVideo(videoPath, numFrames = 30) {
    try {
      if (!this.isInitialized || !this.videoModel) {
        throw new Error('Video model not available');
      }

      // Extract landmarks sequence from video
      const landmarksResult = await this.extractVideoLandmarks(videoPath, numFrames);
      
      if (!landmarksResult.success) {
        return {
          success: false,
          error: landmarksResult.error,
          confidence: 0.0
        };
      }

      // Prepare sequence for model
      const sequence = tf.tensor3d([landmarksResult.sequence]);
      const prediction = this.videoModel.predict(sequence);
      const probabilities = await prediction.data();
      
      const maxIndex = probabilities.indexOf(Math.max(...probabilities));
      const confidence = probabilities[maxIndex];
      const predictedClass = this.videoClassMapping[maxIndex.toString()] || 'Unknown';

      // Clean up tensors
      sequence.dispose();
      prediction.dispose();

      return {
        success: true,
        predicted_class: predictedClass,
        confidence: confidence,
        frames_processed: landmarksResult.framesProcessed
      };

    } catch (error) {
      logger.error('Error in video prediction:', error);
      return {
        success: false,
        error: error.message,
        confidence: 0.0
      };
    }
  }

  async extractVideoLandmarks(videoPath, numFrames) {
    return new Promise((resolve, reject) => {
      // Use Python script to extract video landmarks
      const pythonScript = path.join(__dirname, '../utils/extract_video_landmarks.py');
      const python = spawn('python3', [pythonScript, videoPath, numFrames.toString()]);

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
            reject(new Error(`Failed to parse video landmarks: ${error.message}`));
          }
        } else {
          reject(new Error(`Python script failed: ${errorOutput}`));
        }
      });
    });
  }

  async predictLandmarks(landmarks) {
    try {
      if (!this.landmarkModel) {
        throw new Error('Landmark model not available');
      }

      // Prepare landmarks for prediction
      const X = tf.tensor2d([landmarks]);
      const prediction = this.landmarkModel.predict(X);
      const probabilities = await prediction.data();
      
      const maxIndex = probabilities.indexOf(Math.max(...probabilities));
      const confidence = probabilities[maxIndex];
      const predictedClass = this.imageClassMapping[maxIndex.toString()] || 'Unknown';

      // Clean up tensors
      X.dispose();
      prediction.dispose();

      return {
        success: true,
        predicted_class: predictedClass,
        confidence: confidence
      };

    } catch (error) {
      logger.error('Error in landmark prediction:', error);
      return {
        success: false,
        error: error.message,
        confidence: 0.0
      };
    }
  }

  getImageClasses() {
    return {
      classes: Object.values(this.imageClassMapping),
      total: Object.keys(this.imageClassMapping).length
    };
  }

  getVideoClasses() {
    return {
      classes: Object.values(this.videoClassMapping),
      total: Object.keys(this.videoClassMapping).length
    };
  }

  getAllClasses() {
    return {
      image_classes: this.getImageClasses().classes,
      video_classes: this.getVideoClasses().classes,
      total_image_classes: this.getImageClasses().total,
      total_video_classes: this.getVideoClasses().total
    };
  }

  getStatus() {
    return {
      initialized: this.isInitialized,
      models_loaded: {
        image_model: this.imageModel !== null,
        landmark_model: this.landmarkModel !== null,
        video_model: this.videoModel !== null
      },
      classes_loaded: {
        image_classes: Object.keys(this.imageClassMapping).length,
        video_classes: Object.keys(this.videoClassMapping).length
      }
    };
  }
}

// Create singleton instance
const mlService = new MLService();

module.exports = mlService;