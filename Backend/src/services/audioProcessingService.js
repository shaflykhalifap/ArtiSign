const fs = require('fs').promises;
const path = require('path');
const { spawn } = require('child_process');
const logger = require('../utils/logger');
const config = require('../config');

class AudioProcessingService {
  constructor() {
    this.supportedTTSLanguages = ['id', 'en', 'ms', 'jv'];
    this.supportedSTTLanguages = ['id-ID', 'en-US', 'ms-MY'];
  }

  async textToSpeech(text, language = 'id', speed = 1.0, voiceType = 'female') {
    try {
      // Validate input
      if (!text || typeof text !== 'string') {
        return { success: false, error: 'Invalid text input' };
      }

      if (!this.supportedTTSLanguages.includes(language)) {
        return { success: false, error: `Unsupported language: ${language}` };
      }

      // Use Python script for TTS (Google TTS)
      const result = await this.runTTSScript(text, language, speed, voiceType);
      
      if (result.success) {
        // Read the generated audio file
        const audioData = await fs.readFile(result.audioPath);
        const audioBase64 = audioData.toString('base64');
        
        // Clean up temporary file
        await this.cleanupFile(result.audioPath);
        
        return {
          success: true,
          audioData: audioBase64,
          format: 'mp3',
          duration: result.duration,
          language,
          speed
        };
      } else {
        return { success: false, error: result.error };
      }

    } catch (error) {
      logger.error('Error in text-to-speech:', error);
      return { success: false, error: 'TTS processing failed' };
    }
  }

  async speechToText(audioPath, language = 'id-ID') {
    try {
      // Validate language
      if (!this.supportedSTTLanguages.includes(language)) {
        return { success: false, error: `Unsupported language: ${language}` };
      }

      // Use Python script for STT (Google Speech Recognition)
      const result = await this.runSTTScript(audioPath, language);
      
      if (result.success) {
        return {
          success: true,
          text: result.text,
          confidence: result.confidence,
          duration: result.duration,
          words: result.words || [],
          language
        };
      } else {
        return { success: false, error: result.error };
      }

    } catch (error) {
      logger.error('Error in speech-to-text:', error);
      return { success: false, error: 'STT processing failed' };
    }
  }

  async runTTSScript(text, language, speed, voiceType) {
    return new Promise((resolve) => {
      const pythonScript = path.join(__dirname, '../utils/tts_processor.py');
      const outputPath = path.join(config.server.uploadsPath, `tts_${Date.now()}.mp3`);
      
      const python = spawn('python3', [
        pythonScript,
        '--text', text,
        '--language', language,
        '--speed', speed.toString(),
        '--voice-type', voiceType,
        '--output', outputPath
      ]);

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
            resolve({
              success: true,
              audioPath: outputPath,
              duration: result.duration
            });
          } catch (error) {
            resolve({
              success: false,
              error: 'Failed to parse TTS result'
            });
          }
        } else {
          logger.error('TTS Python script failed:', errorOutput);
          resolve({
            success: false,
            error: errorOutput || 'TTS processing failed'
          });
        }
      });
    });
  }

  async runSTTScript(audioPath, language) {
    return new Promise((resolve) => {
      const pythonScript = path.join(__dirname, '../utils/stt_processor.py');
      
      const python = spawn('python3', [
        pythonScript,
        '--audio', audioPath,
        '--language', language
      ]);

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
            resolve({
              success: true,
              text: result.text,
              confidence: result.confidence,
              duration: result.duration,
              words: result.words
            });
          } catch (error) {
            resolve({
              success: false,
              error: 'Failed to parse STT result'
            });
          }
        } else {
          logger.error('STT Python script failed:', errorOutput);
          resolve({
            success: false,
            error: errorOutput || 'STT processing failed'
          });
        }
      });
    });
  }

  async convertAudioFormat(inputPath, outputFormat = 'wav') {
    try {
      const outputPath = inputPath.replace(path.extname(inputPath), `.${outputFormat}`);
      
      // Use ffmpeg to convert audio format
      const result = await this.runFFmpeg([
        '-i', inputPath,
        '-acodec', outputFormat === 'wav' ? 'pcm_s16le' : 'mp3',
        '-ar', '16000', // 16kHz sample rate
        '-ac', '1', // mono channel
        outputPath
      ]);

      if (result.success) {
        return { success: true, outputPath };
      } else {
        return { success: false, error: result.error };
      }

    } catch (error) {
      logger.error('Error converting audio format:', error);
      return { success: false, error: 'Audio conversion failed' };
    }
  }

  async getAudioDuration(audioPath) {
    try {
      const result = await this.runFFmpeg([
        '-i', audioPath,
        '-f', 'null', '-'
      ]);

      if (result.success && result.output) {
        // Parse duration from ffmpeg output
        const durationMatch = result.output.match(/Duration: (\d{2}):(\d{2}):(\d{2}\.\d{2})/);
        if (durationMatch) {
          const hours = parseInt(durationMatch[1]);
          const minutes = parseInt(durationMatch[2]);
          const seconds = parseFloat(durationMatch[3]);
          return hours * 3600 + minutes * 60 + seconds;
        }
      }

      return null;
    } catch (error) {
      logger.error('Error getting audio duration:', error);
      return null;
    }
  }

  async runFFmpeg(args) {
    return new Promise((resolve) => {
      const ffmpeg = spawn('ffmpeg', args);
      
      let output = '';
      let errorOutput = '';

      ffmpeg.stdout.on('data', (data) => {
        output += data.toString();
      });

      ffmpeg.stderr.on('data', (data) => {
        errorOutput += data.toString();
      });

      ffmpeg.on('close', (code) => {
        if (code === 0) {
          resolve({ success: true, output: errorOutput }); // ffmpeg writes info to stderr
        } else {
          resolve({ success: false, error: errorOutput });
        }
      });
    });
  }

  async cleanupFile(filePath) {
    try {
      await fs.unlink(filePath);
    } catch (error) {
      logger.warn(`Failed to cleanup audio file ${filePath}:`, error);
    }
  }

  async validateAudioFile(filePath) {
    try {
      // Get audio info using ffmpeg
      const result = await this.runFFmpeg(['-i', filePath, '-f', 'null', '-']);
      
      if (result.success) {
        const duration = await this.getAudioDuration(filePath);
        return {
          valid: true,
          duration,
          format: path.extname(filePath).slice(1)
        };
      } else {
        return { valid: false, error: 'Invalid audio file' };
      }

    } catch (error) {
      return { valid: false, error: 'Audio validation failed' };
    }
  }

  getSupportedLanguages() {
    return {
      tts: this.supportedTTSLanguages,
      stt: this.supportedSTTLanguages
    };
  }

  getAudioLimitations() {
    return {
      maxFileSize: config.audio.maxAudioSize,
      maxDuration: 300, // 5 minutes
      supportedFormats: config.audio.audioFormats,
      maxTextLength: 1000
    };
  }
}

module.exports = new AudioProcessingService();