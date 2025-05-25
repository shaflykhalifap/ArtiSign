const imageHandler = require('../../src/handlers/imageHandler');
const mlService = require('../../src/services/mlService');

describe('Image Handler', () => {
  let mockRequest;
  let mockResponse;

  beforeEach(() => {
    mockResponse = createMockResponse();
  });

  describe('predictImage', () => {
    it('should successfully predict image from uploaded file', async () => {
      // Arrange
      const mockFile = createMockFile('test-image.jpg', 2048);
      mockRequest = createMockRequest({ image: mockFile });

      // Act
      const result = await imageHandler.predictImage(mockRequest, mockResponse);

      // Assert
      expect(mlService.predictImage).toHaveBeenCalled();
      expect(mockResponse.response).toHaveBeenCalledWith({
        success: true,
        data: {
          predicted_class: 'test_class',
          confidence: 0.95,
          landmarks_detected: 1
        },
        timestamp: expect.any(String)
      });
      expect(mockResponse.code).toHaveBeenCalledWith(200);
    });

    it('should return error when no image file provided', async () => {
      // Arrange
      mockRequest = createMockRequest({});

      // Act & Assert
      await expect(imageHandler.predictImage(mockRequest, mockResponse))
        .rejects.toThrow('No image file provided');
    });

    it('should return error when image file is too large', async () => {
      // Arrange
      const mockFile = createMockFile('large-image.jpg', 10 * 1024 * 1024); // 10MB
      mockRequest = createMockRequest({ image: mockFile });

      // Act & Assert
      await expect(imageHandler.predictImage(mockRequest, mockResponse))
        .rejects.toThrow();
    });

    it('should return error when unsupported image format', async () => {
      // Arrange
      const mockFile = createMockFile('test.txt', 1024);
      mockRequest = createMockRequest({ image: mockFile });

      // Act & Assert
      await expect(imageHandler.predictImage(mockRequest, mockResponse))
        .rejects.toThrow();
    });
  });

  describe('predictImageBase64', () => {
    it('should successfully predict image from base64 data', async () => {
      // Arrange
      const base64Data = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD//gA7Q1JFQVRPUjogZ2QtanBlZyB2MS4wICh1c2luZyBJSkcgSlBFRyB2NjIpLCBxdWFsaXR5ID0gODAK/9sAQwAGBAUGBQQGBgUGBwcGCAoQCgoJCQoUDg0NDhQUExMTExQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQU';
      mockRequest = createMockRequest({ image_data: base64Data });

      // Act
      await imageHandler.predictImageBase64(mockRequest, mockResponse);

      // Assert
      expect(mlService.predictImage).toHaveBeenCalled();
      expect(mockResponse.response).toHaveBeenCalledWith({
        success: true,
        data: {
          predicted_class: 'test_class',
          confidence: 0.95,
          landmarks_detected: 1
        },
        timestamp: expect.any(String)
      });
      expect(mockResponse.code).toHaveBeenCalledWith(200);
    });

    it('should return error when no base64 data provided', async () => {
      // Arrange
      mockRequest = createMockRequest({});

      // Act & Assert
      await expect(imageHandler.predictImageBase64(mockRequest, mockResponse))
        .rejects.toThrow('No image data provided');
    });

    it('should return error when invalid base64 format', async () => {
      // Arrange
      mockRequest = createMockRequest({ image_data: 'invalid-base64' });

      // Act & Assert
      await expect(imageHandler.predictImageBase64(mockRequest, mockResponse))
        .rejects.toThrow('Invalid image data format');
    });
  });

  describe('getImageInfo', () => {
    it('should return image processing information', async () => {
      // Arrange
      mockRequest = createMockRequest();

      // Act
      await imageHandler.getImageInfo(mockRequest, mockResponse);

      // Assert
      expect(mockResponse.response).toHaveBeenCalledWith({
        success: true,
        data: {
          supported_formats: expect.any(Array),
          max_file_size: expect.any(Number),
          max_file_size_mb: expect.any(Number),
          endpoints: expect.any(Object)
        }
      });
      expect(mockResponse.code).toHaveBeenCalledWith(200);
    });
  });
});

describe('Image Handler Integration', () => {
  it('should handle complete image prediction workflow', async () => {
    // Arrange
    const mockFile = createMockFile('workflow-test.jpg', 1024);
    const mockRequest = createMockRequest({ image: mockFile });
    const mockResponse = createMockResponse();

    // Act
    await imageHandler.predictImage(mockRequest, mockResponse);

    // Assert - Check complete workflow
    expect(mlService.predictImage).toHaveBeenCalledWith(expect.any(String));
    expect(mockResponse.response).toHaveBeenCalled();
    expect(mockResponse.code).toHaveBeenCalledWith(200);
  });
});