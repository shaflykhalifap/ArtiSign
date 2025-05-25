const path = require('path');
const config = require('../config');

class Validator {
  validateImageFile(file) {
    try {
      if (!file) {
        return { isValid: false, error: 'No file provided' };
      }

      // Check file size
      if (file._data && file._data.length > config.upload.maxImageSize) {
        return { 
          isValid: false, 
          error: `File too large. Maximum size: ${Math.round(config.upload.maxImageSize / 1024 / 1024)}MB` 
        };
      }

      // Check file extension
      const filename = file.hapi ? file.hapi.filename : file.filename;
      if (!filename) {
        return { isValid: false, error: 'Invalid filename' };
      }

      const ext = path.extname(filename).toLowerCase().slice(1);
      if (!config.upload.imageFormats.includes(ext)) {
        return { 
          isValid: false, 
          error: `Unsupported image format. Supported: ${config.upload.imageFormats.join(', ')}` 
        };
      }

      // Check MIME type if available
      const mimeType = file.hapi ? file.hapi.headers['content-type'] : file.mimetype;
      if (mimeType && !this.isValidImageMimeType(mimeType)) {
        return { isValid: false, error: 'Invalid image MIME type' };
      }

      return { isValid: true };

    } catch (error) {
      return { isValid: false, error: 'File validation failed' };
    }
  }

  validateVideoFile(file) {
    try {
      if (!file) {
        return { isValid: false, error: 'No file provided' };
      }

      // Check file size
      if (file._data && file._data.length > config.upload.maxVideoSize) {
        return { 
          isValid: false, 
          error: `File too large. Maximum size: ${Math.round(config.upload.maxVideoSize / 1024 / 1024)}MB` 
        };
      }

      // Check file extension
      const filename = file.hapi ? file.hapi.filename : file.filename;
      if (!filename) {
        return { isValid: false, error: 'Invalid filename' };
      }

      const ext = path.extname(filename).toLowerCase().slice(1);
      if (!config.upload.videoFormats.includes(ext)) {
        return { 
          isValid: false, 
          error: `Unsupported video format. Supported: ${config.upload.videoFormats.join(', ')}` 
        };
      }

      // Check MIME type if available
      const mimeType = file.hapi ? file.hapi.headers['content-type'] : file.mimetype;
      if (mimeType && !this.isValidVideoMimeType(mimeType)) {
        return { isValid: false, error: 'Invalid video MIME type' };
      }

      return { isValid: true };

    } catch (error) {
      return { isValid: false, error: 'File validation failed' };
    }
  }

  validateAudioFile(file) {
    try {
      if (!file) {
        return { isValid: false, error: 'No file provided' };
      }

      // Check file size
      if (file._data && file._data.length > config.audio.maxAudioSize) {
        return { 
          isValid: false, 
          error: `File too large. Maximum size: ${Math.round(config.audio.maxAudioSize / 1024 / 1024)}MB` 
        };
      }

      // Check file extension
      const filename = file.hapi ? file.hapi.filename : file.filename;
      if (!filename) {
        return { isValid: false, error: 'Invalid filename' };
      }

      const ext = path.extname(filename).toLowerCase().slice(1);
      if (!config.audio.audioFormats.includes(ext)) {
        return { 
          isValid: false, 
          error: `Unsupported audio format. Supported: ${config.audio.audioFormats.join(', ')}` 
        };
      }

      // Check MIME type if available
      const mimeType = file.hapi ? file.hapi.headers['content-type'] : file.mimetype;
      if (mimeType && !this.isValidAudioMimeType(mimeType)) {
        return { isValid: false, error: 'Invalid audio MIME type' };
      }

      return { isValid: true };

    } catch (error) {
      return { isValid: false, error: 'File validation failed' };
    }
  }

  validateBase64Image(base64String) {
    try {
      if (!base64String || typeof base64String !== 'string') {
        return { isValid: false, error: 'Invalid base64 string' };
      }

      // Check if it's a valid data URL
      if (!base64String.startsWith('data:image/')) {
        return { isValid: false, error: 'Invalid image data URL format' };
      }

      // Extract MIME type
      const mimeMatch = base64String.match(/data:([^;]+);base64,/);
      if (!mimeMatch) {
        return { isValid: false, error: 'Invalid data URL format' };
      }

      const mimeType = mimeMatch[1];
      if (!this.isValidImageMimeType(mimeType)) {
        return { isValid: false, error: 'Unsupported image type' };
      }

      // Extract base64 data
      const base64Data = base64String.split(',')[1];
      if (!base64Data) {
        return { isValid: false, error: 'No base64 data found' };
      }

      // Validate base64 format
      if (!/^[A-Za-z0-9+/]*={0,2}$/.test(base64Data)) {
        return { isValid: false, error: 'Invalid base64 format' };
      }

      // Check approximate file size (base64 is ~33% larger than original)
      const approximateSize = (base64Data.length * 3) / 4;
      if (approximateSize > config.upload.maxImageSize) {
        return { 
          isValid: false, 
          error: `Image too large. Maximum size: ${Math.round(config.upload.maxImageSize / 1024 / 1024)}MB` 
        };
      }

      return { isValid: true, mimeType, size: approximateSize };

    } catch (error) {
      return { isValid: false, error: 'Base64 validation failed' };
    }
  }

  validateTextInput(text, maxLength = 1000) {
    try {
      if (!text || typeof text !== 'string') {
        return { isValid: false, error: 'Text is required and must be a string' };
      }

      if (text.trim().length === 0) {
        return { isValid: false, error: 'Text cannot be empty' };
      }

      if (text.length > maxLength) {
        return { isValid: false, error: `Text too long. Maximum length: ${maxLength} characters` };
      }

      // Check for potentially harmful content (basic)
      if (this.containsHarmfulContent(text)) {
        return { isValid: false, error: 'Text contains inappropriate content' };
      }

      return { isValid: true, length: text.length };

    } catch (error) {
      return { isValid: false, error: 'Text validation failed' };
    }
  }

  validateLanguageCode(languageCode, supportedLanguages) {
    try {
      if (!languageCode || typeof languageCode !== 'string') {
        return { isValid: false, error: 'Language code is required' };
      }

      if (!supportedLanguages.includes(languageCode)) {
        return { 
          isValid: false, 
          error: `Unsupported language. Supported: ${supportedLanguages.join(', ')}` 
        };
      }

      return { isValid: true };

    } catch (error) {
      return { isValid: false, error: 'Language validation failed' };
    }
  }

  validateNumericRange(value, min, max, name = 'value') {
    try {
      if (value === undefined || value === null) {
        return { isValid: false, error: `${name} is required` };
      }

      const numValue = Number(value);
      if (isNaN(numValue)) {
        return { isValid: false, error: `${name} must be a number` };
      }

      if (numValue < min || numValue > max) {
        return { isValid: false, error: `${name} must be between ${min} and ${max}` };
      }

      return { isValid: true, value: numValue };

    } catch (error) {
      return { isValid: false, error: 'Numeric validation failed' };
    }
  }

  // Helper methods
  isValidImageMimeType(mimeType) {
    const validMimeTypes = [
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'image/gif',
      'image/bmp',
      'image/webp'
    ];
    return validMimeTypes.includes(mimeType.toLowerCase());
  }

  isValidVideoMimeType(mimeType) {
    const validMimeTypes = [
      'video/mp4',
      'video/avi',
      'video/mov',
      'video/quicktime',
      'video/x-msvideo',
      'video/mkv',
      'video/webm'
    ];
    return validMimeTypes.includes(mimeType.toLowerCase());
  }

  isValidAudioMimeType(mimeType) {
    const validMimeTypes = [
      'audio/wav',
      'audio/wave',
      'audio/x-wav',
      'audio/mpeg',
      'audio/mp3',
      'audio/ogg',
      'audio/mp4',
      'audio/m4a'
    ];
    return validMimeTypes.includes(mimeType.toLowerCase());
  }

  containsHarmfulContent(text) {
    // Basic harmful content detection
    // In production, you'd use more sophisticated content filtering
    const harmfulPatterns = [
      /\b(hate|violence|harmful)\b/gi,
      // Add more patterns as needed
    ];

    return harmfulPatterns.some(pattern => pattern.test(text));
  }

  sanitizeFilename(filename) {
    // Remove potentially harmful characters from filename
    return filename
      .replace(/[^a-zA-Z0-9._-]/g, '_')
      .replace(/_{2,}/g, '_')
      .substring(0, 255);
  }

  validateRequestRate(ip, requestCount, timeWindow, maxRequests) {
    // Simple rate limiting validation
    if (requestCount > maxRequests) {
      return {
        isValid: false,
        error: `Too many requests. Maximum ${maxRequests} requests per ${timeWindow}ms`
      };
    }

    return { isValid: true };
  }

  validateFileUploadLimits(files) {
    try {
      if (!files || !Array.isArray(files)) {
        return { isValid: true }; // No files to validate
      }

      const maxFiles = 10; // Maximum files per request
      if (files.length > maxFiles) {
        return {
          isValid: false,
          error: `Too many files. Maximum ${maxFiles} files per request`
        };
      }

      let totalSize = 0;
      const maxTotalSize = 100 * 1024 * 1024; // 100MB total

      for (const file of files) {
        if (file._data) {
          totalSize += file._data.length;
        }
      }

      if (totalSize > maxTotalSize) {
        return {
          isValid: false,
          error: `Total file size too large. Maximum ${Math.round(maxTotalSize / 1024 / 1024)}MB`
        };
      }

      return { isValid: true, totalSize, fileCount: files.length };

    } catch (error) {
      return { isValid: false, error: 'File upload validation failed' };
    }
  }
}

module.exports = new Validator();