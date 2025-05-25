const Joi = require('joi');
const audioHandler = require('../handlers/audioHandler');

const audioRoutes = [
  {
    method: 'POST',
    path: '/api/audio/tts',
    handler: audioHandler.textToSpeech,
    options: {
      description: 'Convert text to speech',
      notes: 'Send text to get audio speech output',
      tags: ['api', 'Audio'],
      validate: {
        payload: Joi.object({
          text: Joi.string()
            .required()
            .min(1)
            .max(1000)
            .description('Text to convert to speech'),
          language: Joi.string()
            .valid('id', 'en', 'ms', 'jv')
            .default('id')
            .description('Language code for speech synthesis'),
          voice_speed: Joi.number()
            .min(0.5)
            .max(2.0)
            .default(1.0)
            .description('Speech speed multiplier'),
          voice_type: Joi.string()
            .valid('male', 'female')
            .description('Voice type preference')
        })
      },
      response: {
        schema: Joi.object({
          success: Joi.boolean().required(),
          data: Joi.object({
            text: Joi.string().required(),
            language: Joi.string().required(),
            audio_data: Joi.string().required().description('Base64 encoded audio'),
            audio_format: Joi.string().default('mp3'),
            duration: Joi.number().allow(null),
            voice_speed: Joi.number()
          }),
          timestamp: Joi.string().isoDate()
        }).label('TextToSpeechResponse')
      }
    }
  },
  {
    method: 'POST',
    path: '/api/audio/stt',
    handler: audioHandler.speechToText,
    options: {
      description: 'Convert speech to text',
      notes: 'Upload an audio file to get text transcription',
      tags: ['api', 'Audio'],
      timeout: {
        socket: 60000, // 1 minute
        server: 60000
      },
      payload: {
        output: 'stream',
        parse: true,
        allow: 'multipart/form-data',
        multipart: true,
        maxBytes: 10 * 1024 * 1024 // 10MB
      },
      validate: {
        payload: Joi.object({
          audio: Joi.any()
            .meta({ swaggerType: 'file' })
            .required()
            .description('Audio file (WAV, MP3, OGG, M4A)'),
          language: Joi.string()
            .valid('id-ID', 'en-US', 'ms-MY')
            .default('id-ID')
            .description('Language code for speech recognition')
        })
      },
      response: {
        schema: Joi.object({
          success: Joi.boolean().required(),
          data: Joi.object({
            text: Joi.string().required(),
            language: Joi.string().required(),
            confidence: Joi.number().min(0).max(1).allow(null),
            duration: Joi.number().allow(null),
            words: Joi.array().items(Joi.object({
              word: Joi.string(),
              start_time: Joi.number(),
              end_time: Joi.number(),
              confidence: Joi.number()
            }))
          }),
          timestamp: Joi.string().isoDate()
        }).label('SpeechToTextResponse')
      }
    }
  },
  {
    method: 'POST',
    path: '/api/audio/stt/stream',
    handler: audioHandler.speechToTextStream,
    options: {
      description: 'Convert speech to text from stream (not implemented)',
      notes: 'Real-time speech recognition - placeholder for future implementation',
      tags: ['api', 'Audio'],
      validate: {
        payload: Joi.object({
          audio_chunk: Joi.any()
            .meta({ swaggerType: 'file' })
            .required()
            .description('Audio chunk data')
        })
      },
      response: {
        schema: Joi.object({
          success: Joi.boolean().required(),
          error: Joi.string(),
          message: Joi.string()
        }).label('StreamSTTResponse')
      }
    }
  },
  {
    method: 'GET',
    path: '/api/audio/formats',
    handler: audioHandler.getAudioFormats,
    options: {
      description: 'Get supported audio formats and languages',
      notes: 'Returns information about supported audio formats, languages, and limitations',
      tags: ['api', 'Audio'],
      response: {
        schema: Joi.object({
          success: Joi.boolean().required(),
          data: Joi.object({
            input_formats: Joi.array().items(Joi.string()),
            output_formats: Joi.array().items(Joi.string()),
            supported_languages: Joi.object({
              tts: Joi.array().items(Joi.string()),
              stt: Joi.array().items(Joi.string())
            }),
            voice_speeds: Joi.object({
              min: Joi.number(),
              max: Joi.number(),
              default: Joi.number()
            }),
            limitations: Joi.object({
              max_text_length: Joi.number().integer(),
              max_audio_size: Joi.number().integer(),
              max_audio_duration: Joi.number().integer()
            })
          })
        }).label('AudioFormatsResponse')
      }
    }
  },
  {
    method: 'GET',
    path: '/api/audio/info',
    handler: audioHandler.getAudioInfo,
    options: {
      description: 'Get audio processing information',
      notes: 'Returns audio processing capabilities and configuration',
      tags: ['api', 'Audio'],
      response: {
        schema: Joi.object({
          success: Joi.boolean().required(),
          data: Joi.object({
            supported_formats: Joi.array().items(Joi.string()),
            max_file_size: Joi.number().integer(),
            max_file_size_mb: Joi.number().integer(),
            speech_language: Joi.string(),
            tts_language: Joi.string(),
            endpoints: Joi.object()
          })
        }).label('AudioInfoResponse')
      }
    }
  }
];

module.exports = audioRoutes;