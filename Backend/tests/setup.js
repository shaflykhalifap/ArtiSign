// Test setup file
const path = require('path');

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.PORT = 0; // Use random available port
process.env.LOG_LEVEL = 'error'; // Reduce log noise in tests
process.env.LOG_FILE = path.join(__dirname, '../logs/test.log');

// Mock external dependencies
jest.mock('../src/services/mlService', () => ({
  initialize: jest.fn().mockResolvedValue(true),
  predictImage: jest.fn().mockResolvedValue({
    success: true,
    predicted_class: 'test_class',
    confidence: 0.95,
    landmarks_detected: 1
  }),
  predictVideo: jest.fn().mockResolvedValue({
    success: true,
    predicted_class: 'test_video_class',
    confidence: 0.88,
    frames_processed: 30
  }),
  getImageClasses: jest.fn().mockReturnValue({
    classes: ['halo', 'terima_kasih', 'selamat_pagi'],
    total: 3
  }),
  getVideoClasses: jest.fn().mockReturnValue({
    classes: ['halo', 'terima_kasih', 'selamat_pagi'],
    total: 3
  }),
  getAllClasses: jest.fn().mockReturnValue({
    image_classes: ['halo', 'terima_kasih', 'selamat_pagi'],
    video_classes: ['halo', 'terima_kasih', 'selamat_pagi'],
    total_image_classes: 3,
    total_video_classes: 3
  }),
  getStatus: jest.fn().mockReturnValue({
    initialized: true,
    models_loaded: {
      image_model: true,
      landmark_model: true,
      video_model: true
    },
    classes_loaded: {
      image_classes: 3,
      video_classes: 3
    }
  })
}));

// Mock audio processing service
jest.mock('../src/services/audioProcessingService', () => ({
  textToSpeech: jest.fn().mockResolvedValue({
    success: true,
    audioData: 'base64-audio-data',
    format: 'mp3',
    duration: 2.5
  }),
  speechToText: jest.fn().mockResolvedValue({
    success: true,
    text: 'halo selamat datang',
    confidence: 0.92,
    duration: 2.0
  })
}));

// Mock file system operations for tests
const fs = require('fs');
const originalWriteFile = fs.writeFile;
const originalUnlink = fs.unlink;

fs.writeFile = jest.fn((path, data, callback) => {
  if (typeof callback === 'function') {
    callback(null);
  }
});

fs.unlink = jest.fn((path, callback) => {
  if (typeof callback === 'function') {
    callback(null);
  }
});

// Global test utilities
global.createMockFile = (filename = 'test.jpg', size = 1024) => ({
  hapi: {
    filename,
    headers: {
      'content-type': 'image/jpeg'
    }
  },
  _data: Buffer.alloc(size),
  pipe: jest.fn(),
  on: jest.fn((event, callback) => {
    if (event === 'end') {
      setTimeout(callback, 10);
    }
  })
});

global.createMockRequest = (payload = {}, params = {}, query = {}) => ({
  payload,
  params,
  query,
  info: {
    remoteAddress: '127.0.0.1'
  },
  headers: {
    'user-agent': 'Test Agent'
  },
  method: 'POST',
  path: '/test',
  events: {
    once: jest.fn()
  }
});

global.createMockResponse = () => ({
  response: jest.fn().mockReturnThis(),
  code: jest.fn().mockReturnThis(),
  type: jest.fn().mockReturnThis(),
  header: jest.fn().mockReturnThis()
});

// Cleanup after each test
afterEach(() => {
  jest.clearAllMocks();
});

// Global error handler for unhandled promises
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

console.log('Test setup completed');