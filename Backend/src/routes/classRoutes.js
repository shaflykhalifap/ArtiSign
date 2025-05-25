const Joi = require('joi');
const classHandler = require('../handlers/classHandler');

const classRoutes = [
  {
    method: 'GET',
    path: '/api/classes',
    handler: classHandler.getAllClasses,
    options: {
      description: 'Get all available sign language classes',
      notes: 'Returns list of all sign language classes supported by the models',
      tags: ['api', 'Classes'],
      response: {
        schema: Joi.object({
          success: Joi.boolean().required(),
          data: Joi.object({
            image_classes: Joi.array().items(Joi.string()),
            video_classes: Joi.array().items(Joi.string()),
            total_image_classes: Joi.number().integer(),
            total_video_classes: Joi.number().integer()
          }),
          timestamp: Joi.string().isoDate()
        }).label('AllClassesResponse')
      }
    }
  },
  {
    method: 'GET',
    path: '/api/classes/image',
    handler: classHandler.getImageClasses,
    options: {
      description: 'Get available image classification classes',
      notes: 'Returns list of sign language classes for image prediction',
      tags: ['api', 'Classes'],
      response: {
        schema: Joi.object({
          success: Joi.boolean().required(),
          data: Joi.object({
            classes: Joi.array().items(Joi.string()),
            total: Joi.number().integer(),
            model_type: Joi.string().default('image')
          }),
          timestamp: Joi.string().isoDate()
        }).label('ImageClassesResponse')
      }
    }
  },
  {
    method: 'GET',
    path: '/api/classes/video',
    handler: classHandler.getVideoClasses,
    options: {
      description: 'Get available video classification classes',
      notes: 'Returns list of sign language classes for video prediction',
      tags: ['api', 'Classes'],
      response: {
        schema: Joi.object({
          success: Joi.boolean().required(),
          data: Joi.object({
            classes: Joi.array().items(Joi.string()),
            total: Joi.number().integer(),
            model_type: Joi.string().default('video')
          }),
          timestamp: Joi.string().isoDate()
        }).label('VideoClassesResponse')
      }
    }
  },
  {
    method: 'GET',
    path: '/api/classes/search',
    handler: classHandler.searchClasses,
    options: {
      description: 'Search for specific sign language classes',
      notes: 'Search through available classes using query string',
      tags: ['api', 'Classes'],
      validate: {
        query: Joi.object({
          q: Joi.string()
            .required()
            .min(1)
            .description('Search query'),
          type: Joi.string()
            .valid('image', 'video', 'all')
            .default('all')
            .description('Type of classes to search'),
          limit: Joi.number()
            .integer()
            .min(1)
            .max(50)
            .default(10)
            .description('Maximum number of results')
        })
      },
      response: {
        schema: Joi.object({
          success: Joi.boolean().required(),
          data: Joi.object({
            query: Joi.string(),
            results: Joi.array().items(Joi.object({
              class_name: Joi.string(),
              type: Joi.string().valid('image', 'video'),
              relevance: Joi.number().min(0).max(1)
            })),
            total_found: Joi.number().integer(),
            search_type: Joi.string()
          }),
          timestamp: Joi.string().isoDate()
        }).label('SearchClassesResponse')
      }
    }
  },
  {
    method: 'GET',
    path: '/api/classes/{className}',
    handler: classHandler.getClassDetails,
    options: {
      description: 'Get details about a specific class',
      notes: 'Returns detailed information about a specific sign language class',
      tags: ['api', 'Classes'],
      validate: {
        params: Joi.object({
          className: Joi.string()
            .required()
            .description('Name of the class to get details for')
        })
      },
      response: {
        schema: Joi.object({
          success: Joi.boolean().required(),
          data: Joi.object({
            class_name: Joi.string(),
            available_in: Joi.array().items(Joi.string().valid('image', 'video')),
            description: Joi.string().allow(null),
            examples: Joi.array().items(Joi.string()),
            difficulty: Joi.string().valid('easy', 'medium', 'hard').allow(null),
            category: Joi.string().allow(null),
            related_classes: Joi.array().items(Joi.string())
          }),
          timestamp: Joi.string().isoDate()
        }).label('ClassDetailsResponse')
      }
    }
  },
  {
    method: 'GET',
    path: '/api/classes/categories',
    handler: classHandler.getClassCategories,
    options: {
      description: 'Get sign language class categories',
      notes: 'Returns organized categories of sign language classes',
      tags: ['api', 'Classes'],
      response: {
        schema: Joi.object({
          success: Joi.boolean().required(),
          data: Joi.object({
            categories: Joi.array().items(Joi.object({
              name: Joi.string(),
              classes: Joi.array().items(Joi.string()),
              count: Joi.number().integer(),
              description: Joi.string().allow(null)
            })),
            total_categories: Joi.number().integer()
          }),
          timestamp: Joi.string().isoDate()
        }).label('ClassCategoriesResponse')
      }
    }
  }
];

module.exports = classRoutes;