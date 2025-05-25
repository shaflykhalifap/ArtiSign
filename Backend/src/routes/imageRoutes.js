const Joi = require('joi');
const imageHandler = require('../handlers/imageHandler');

const imageRoutes = [
  {
    method: 'POST',
    path: '/api/image/predict',
    handler: imageHandler.predictImage,
    options: {
      description: 'Predict sign language from uploaded image',
      notes: 'Upload an image file to get sign language prediction',
      tags: ['api', 'Image'],
      payload: {
        output: 'stream',
        parse: true,
        allow: 'multipart/form-data',
        multipart: true,
        maxBytes: 5 * 1024 * 1024 // 5MB
      },
      validate: {
        payload: Joi.object({
          image: Joi.any()
            .meta({ swaggerType: 'file' })
            .required()
            .description('Image file (JPG, PNG, GIF, BMP)')
        })
      },
      response: {
        schema: Joi.object({
          success: Joi.boolean().required(),
          data: Joi.object({
            predicted_class: Joi.string().required(),
            confidence: Joi.number().min(0).max(1).required(),
            landmarks_detected: Joi.number().integer().min(0)
          }),
          timestamp: Joi.string().isoDate()
        }).label('ImagePredictionResponse')
      }
    }
  },
  {
    method: 'POST',
    path: '/api/image/predict/base64',
    handler: imageHandler.predictImageBase64,
    options: {
      description: 'Predict sign language from base64 image data',
      notes: 'Send base64 encoded image data to get sign language prediction',
      tags: ['api', 'Image'],
      validate: {
        payload: Joi.object({
          image_data: Joi.string()
            .required()
            .description('Base64 encoded image data with data URL prefix')
            .example('data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...')
        })
      },
      response: {
        schema: Joi.object({
          success: Joi.boolean().required(),
          data: Joi.object({
            predicted_class: Joi.string().required(),
            confidence: Joi.number().min(0).max(1).required(),
            landmarks_detected: Joi.number().integer().min(0)
          }),
          timestamp: Joi.string().isoDate()
        }).label('Base64ImagePredictionResponse')
      }
    }
  },
  {
    method: 'GET',
    path: '/api/image/info',
    handler: imageHandler.getImageInfo,
    options: {
      description: 'Get image processing information',
      notes: 'Returns supported formats, file size limits, and available endpoints',
      tags: ['api', 'Image'],
      response: {
        schema: Joi.object({
          success: Joi.boolean().required(),
          data: Joi.object({
            supported_formats: Joi.array().items(Joi.string()),
            max_file_size: Joi.number().integer(),
            max_file_size_mb: Joi.number().integer(),
            endpoints: Joi.object()
          })
        }).label('ImageInfoResponse')
      }
    }
  }
];

module.exports = imageRoutes;