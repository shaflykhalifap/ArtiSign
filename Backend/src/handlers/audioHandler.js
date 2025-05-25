const Boom = require('@hapi/boom');
const path = require('path');
const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');
const logger = require('../utils/logger');
const { validateAudioFile } = require('../utils/validator');
const audioService = require('../services/audioProcessingService');
const config = require('../config');

class AudioHandler {
  async textToSpeech(request, h) {
    try {
      const { text, language, voice_speed, voice_type } = request.payload;
      
      // Validate input
      if (!text || typeof text !== 'string' || text.trim().length === 0) {
        throw Boom.badRequest('Text is required and cannot be empty');
      }

      if (text.length > 1000) {
        throw Boom.badRequest('Text too long. Maximum 1000 characters allowed');
      }

      // Use provided language or default
      const ttsLanguage = language || config.audio.ttsLanguage;
      const speed = voice_speed || 1.0;

      // Generate speech
      const audioResult = await audioService.textToSpeech(text, ttsLanguage, speed, voice_type);

      if (!audioResult.success) {
        throw Boom.badRequest(audioResult.error);
      }

      // Log TTS request
      logger.info('TTS request completed', {
        text_length: text.length,
        language: ttsLanguage,
        voice_speed: speed,
        success: true
      });

      return h.response({
        success: true,
        data: {
          text: text,
          language: ttsLanguage,
          audio_data: audioResult.audioData,
          audio_format: audioResult.format || 'mp3',
          duration: audioResult.duration,
          voice_speed: speed
        },
        timestamp: new Date().toISOString()
      }).code(200);

    } catch (error) {
      logger.error('Error in text-to-speech:', error);
      
      if (Boom.isBoom(error)) {
        throw error;
      }
      
      throw Boom.internal('Internal server error during text-to-speech conversion');
    }
  }

  async speechToText(request, h) {
    try {
      const { payload } = request;
      
      // Validate request
      if (!payload || !payload.audio) {
        throw Boom.badRequest('No audio file provided');
      }

      // Validate file
      const validation = validateAudioFile(payload.audio);
      if (!validation.isValid) {
        throw Boom.badRequest(validation.error);
      }

      // Generate unique filename
      const filename = `${uuidv4()}_${payload.audio.hapi.filename}`;
      const filepath = path.join(config.server.uploadsPath, filename);

      // Save uploaded file
      await this.saveFile(payload.audio, filepath);

      try {
        // Get language from request or use default
        const language = payload.language || config.audio.speechLanguage;

        // Convert speech to text
        const sttResult = await audioService.speechToText(filepath, language);

        // Log STT request
        logger.info('STT request completed', {
          filename: payload.audio.hapi.filename,
          language: language,
          success: sttResult.success,
          text_length: sttResult.text ? sttResult.text.length : 0
        });

        // Clean up uploaded file
        await this.cleanupFile(filepath);

        if (!sttResult.success) {
          throw Boom.badRequest(sttResult.error);
        }

        return h.response({
          success: true,
          data: {
            text: sttResult.text,
            language: language,
            confidence: sttResult.confidence,
            duration: sttResult.duration,
            words: sttResult.words || []
          },
          timestamp: new Date().toISOString()
        }).code(200);

      } catch (sttError) {
        // Clean up file in case of STT error
        await this.cleanupFile(filepath);
        throw sttError;
      }

    } catch (error) {
      logger.error('Error in speech-to-text:', error);
      
      if (Boom.isBoom(error)) {
        throw error;
      }
      
      throw Boom.internal('Internal server error during speech-to-text conversion');
    }
  }

  async speechToTextStream(request, h) {
    try {
      // Placeholder for streaming STT implementation
      // This would require WebSocket or Server-Sent Events
      
      return h.response({
        success: false,
        error: 'Streaming speech-to-text not yet implemented',
        message: 'Please use the standard audio upload endpoint'
      }).code(501);

    } catch (error) {
      logger.error('Error in streaming STT:', error);
      throw Boom.internal('Error in streaming speech-to-text');
    }
  }

  async getAudioFormats(request, h) {
    try {
      const formats = {
        input_formats: config.audio.audioFormats,
        output_formats: ['mp3', 'wav'],
        supported_languages: {
          tts: ['id', 'en', 'ms', 'jv'],
          stt: ['id-ID', 'en-US', 'ms-MY']
        },
        voice_speeds: {
          min: 0.5,
          max: 2.0,
          default: 1.0
        },
        limitations: {
          max_text_length: 1000,
          max_audio_size: config.audio.maxAudioSize,
          max_audio_duration: 300 // 5 minutes
        }
      };

      return h.response({
        success: true,
        data: formats
      }).code(200);

    } catch (error) {
      logger.error('Error getting audio formats:', error);
      throw Boom.internal('Error retrieving audio format information');
    }
  }

  async saveFile(file, filepath) {
    try {
      const fileStream = fs.createWriteStream(filepath);
      
      return new Promise((resolve, reject) => {
        file.pipe(fileStream);
        
        file.on('error', (error) => {
          reject(error);
        });
        
        fileStream.on('error', (error) => {
          reject(error);
        });
        
        fileStream.on('finish', () => {
          resolve();
        });
      });
    } catch (error) {
      logger.error('Error saving audio file:', error);
      throw error;
    }
  }

  async cleanupFile(filepath) {
    try {
      await fs.unlink(filepath);
    } catch (error) {
      // Log but don't throw - cleanup is not critical
      logger.warn(`Failed to cleanup audio file ${filepath}:`, error);
    }
  }

  async getAudioInfo(request, h) {
    try {
      const info = {
        supported_formats: config.audio.audioFormats,
        max_file_size: config.audio.maxAudioSize,
        max_file_size_mb: Math.round(config.audio.maxAudioSize / 1024 / 1024),
        speech_language: config.audio.speechLanguage,
        tts_language: config.audio.ttsLanguage,
        endpoints: {
          text_to_speech: '/api/audio/tts',
          speech_to_text: '/api/audio/stt',
          formats: '/api/audio/formats',
          stream_stt: '/api/audio/stt/stream'
        }
      };

      return h.response({
        success: true,
        data: info
      }).code(200);

    } catch (error) {
      logger.error('Error getting audio info:', error);
      throw Boom.internal('Error retrieving audio information');
    }
  }
}

module.exports = new AudioHandler();