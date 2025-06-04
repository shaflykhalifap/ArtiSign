'use strict';

const Boom = require('@hapi/boom');
const config = require('../config');
const modelHandler = require('../handlers/modelHandler');
const logger = require('../utils/logger');

module.exports = [
  {
    method: 'POST',
    path: '/api/predict-dynamic-sign',
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
          
          // The frontend should send pre-processed landmark sequences
          if (!data.landmarkSequence) {
            return Boom.badRequest('No landmark sequence data provided');
          }
          
          // Get model choice: "lstm" or "transformer"
          const modelChoice = data.modelChoice || 'transformer';
          
          let landmarkSequence;
          try {
            landmarkSequence = JSON.parse(data.landmarkSequence);
          } catch (error) {
            return Boom.badRequest('Invalid landmark sequence data format. Expected JSON array.');
          }
          
          // Process the landmark sequence using the model handler
          const result = await modelHandler.predictDynamicSign(landmarkSequence, modelChoice);
          
          logger.info('Dynamic sign prediction', {
            class: result.class,
            confidence: result.confidence,
            modelUsed: result.modelUsed
          });
          
          return {
            success: true,
            result: result
          };
        } catch (error) {
          logger.error('Error in dynamic sign prediction', error);
          return Boom.badImplementation('Error processing the request');
        }
      }
    }
  },
  {
    method: 'GET',
    path: '/api/available-words',
    handler: (request, h) => {
      try {
        // Get available words from the model handler
        const availableWords = modelHandler.getAvailableWords();
        
        return {
          success: true,
          count: availableWords.length,
          words: availableWords
        };
      } catch (error) {
        logger.error('Error fetching available words', error);
        return Boom.badImplementation('Error processing the request');
      }
    }
  }
];