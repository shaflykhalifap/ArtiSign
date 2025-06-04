'use strict';

const Boom = require('@hapi/boom');
const config = require('../config');
const modelHandler = require('../handlers/modelHandler');
const logger = require('../utils/logger');

module.exports = [
  {
    method: 'POST',
    path: '/api/predict-static-sign',
    options: {
      payload: {
        output: 'stream',
        parse: true,
        allow: 'multipart/form-data',
        multipart: true,
        maxBytes: config.uploads.maxFileSize
      },
      handler: async (request, h) => {
        try {
          const data = request.payload;
          
          // The frontend should send pre-processed landmarks
          if (!data.landmarks) {
            return Boom.badRequest('No landmarks data provided');
          }
          
          let landmarks;
          try {
            landmarks = JSON.parse(data.landmarks);
          } catch (error) {
            return Boom.badRequest('Invalid landmarks data format. Expected JSON array.');
          }
          
          // Process the landmarks using the model handler
          const result = await modelHandler.predictStaticSign(landmarks);
          
          logger.info('Static sign prediction', {
            class: result.class,
            confidence: result.confidence
          });
          
          return {
            success: true,
            result: result
          };
        } catch (error) {
          logger.error('Error in static sign prediction', error);
          return Boom.badImplementation('Error processing the request');
        }
      }
    }
  },
  {
    method: 'GET',
    path: '/api/available-letters',
    handler: (request, h) => {
      try {
        // Get available letters from the model handler
        const availableLetters = modelHandler.getAvailableLetters();
        
        return {
          success: true,
          count: availableLetters.length,
          letters: availableLetters
        };
      } catch (error) {
        logger.error('Error fetching available letters', error);
        return Boom.badImplementation('Error processing the request');
      }
    }
  }
];