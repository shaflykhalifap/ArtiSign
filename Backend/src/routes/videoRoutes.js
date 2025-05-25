const Joi = require('joi');
const videoHandler = require('../handlers/videoHandler');

const videoRoutes = [
  {
    method: 'POST',
    path: '/api/video/predict',
    handler: videoHandler.predictVideo,
    options: {
      description: 'Predict sign language from uploaded video',
      notes: 'Upload a video file to get sign language prediction',
      tags: ['api', 'Video'],
      timeout: {
        socket: 120000, // 2 minutes
        server: 120000
      },
      payload: {
        output: 'stream',
        parse: true,
        allow: 'multipart/form-data',
        multipart: true,
        maxBytes: 50 * 1024 * 1024 // 50MB
      },
      validate: {
        payload: Joi.object({
          video: Joi.any()
            .meta({ swaggerType: 'file' })
            .required()
            .description('Video file (MP4, AVI, MOV, MKV, WEBM)'),
          frames: Joi.number()
            .integer()
            .min(10)
            .max(60)
            .default(30)
            .description('Number of frames to extract from video')
        })
      },
      response: {
        schema: Joi.object({
          success: Joi.boolean().required(),
          data: Joi.object({
            predicted_class: Joi.string().required(),
            confidence: Joi.number().min(0).max(1).required(),
            frames_processed: Joi.number().integer().min(0),
            video_duration: Joi.number().allow(null)
          }),
          timestamp: Joi.string().isoDate()
        }).label('VideoPredictionResponse')
      }
    }
  },
  {
    method: 'POST',
    path: '/api/video/predict/stream',
    handler: videoHandler.predictVideoStream,
    options: {
      description: 'Predict sign language from video stream (not implemented)',
      notes: 'Real-time video stream processing - placeholder for future implementation',
      tags: ['api', 'Video'],
      validate: {
        payload: Joi.object({
          video_chunk: Joi.any()
            .meta({ swaggerType: 'file' })
            .required()
            .description('Video chunk data')
        })
      },
      response: {
        schema: Joi.object({
          success: Joi.boolean().required(),
          error: Joi.string(),
          message: Joi.string()
        }).label('VideoStreamResponse')
      }
    }
  },
  {
    method: 'POST',
    path: '/api/video/frames',
    handler: videoHandler.extractFrames,
    options: {
      description: 'Extract frames from uploaded video',
      notes: 'Upload a video file to extract individual frames',
      tags: ['api', 'Video'],
      timeout: {
        socket: 60000, // 1 minute
        server: 60000
      },
      payload: {
        output: 'stream',
        parse: true,
        allow: 'multipart/form-data',
        multipart: true,
        maxBytes: 50 * 1024 * 1024 // 50MB
      },
      validate: {
        payload: Joi.object({
          video: Joi.any()
            .meta({ swaggerType: 'file' })
            .required()
            .description('Video file (MP4, AVI, MOV, MKV, WEBM)'),
          frame_count: Joi.number()
            .integer()
            .min(1)
            .max(100)
            .default(10)
            .description('Number of frames to extract'),
          start_time: Joi.number()
            .min(0)
            .description('Start time in seconds'),
          end_time: Joi.number()
            .min(0)
            .description('End time in seconds')
        })
      },
      response: {
        schema: Joi.object({
          success: Joi.boolean().required(),
          data: Joi.object({
            frames_extracted: Joi.number().integer(),
            frames: Joi.array().items(Joi.string())
          }),
          timestamp: Joi.string().isoDate()
        }).label('VideoFramesResponse')
      }
    }
  },
  {
    method: 'GET',
    path: '/api/video/info',
    handler: videoHandler.getVideoInfo,
    options: {
      description: 'Get video processing information',
      notes: 'Returns supported formats, file size limits, and processing parameters',
      tags: ['api', 'Video'],
      response: {
        schema: Joi.object({
          success: Joi.boolean().required(),
          data: Joi.object({
            supported_formats: Joi.array().items(Joi.string()),
            max_file_size: Joi.number().integer(),
            max_file_size_mb: Joi.number().integer(),
            max_duration_seconds: Joi.number().integer(),
            default_frame_count: Joi.number().integer(),
            frame_size: Joi.object({
              width: Joi.number().integer(),
              height: Joi.number().integer()
            }),
            endpoints: Joi.object()
          })
        }).label('VideoInfoResponse')
      }
    }
  }
];

module.exports = videoRoutes;