const Boom = require('@hapi/boom');
const mlService = require('../services/mlService');
const logger = require('../utils/logger');

class ClassHandler {
  async getAllClasses(request, h) {
    try {
      const classes = mlService.getAllClasses();
      
      return h.response({
        success: true,
        data: classes,
        timestamp: new Date().toISOString()
      }).code(200);

    } catch (error) {
      logger.error('Error getting all classes:', error);
      throw Boom.internal('Error retrieving class information');
    }
  }

  async getImageClasses(request, h) {
    try {
      const classes = mlService.getImageClasses();
      
      return h.response({
        success: true,
        data: {
          ...classes,
          model_type: 'image'
        },
        timestamp: new Date().toISOString()
      }).code(200);

    } catch (error) {
      logger.error('Error getting image classes:', error);
      throw Boom.internal('Error retrieving image class information');
    }
  }

  async getVideoClasses(request, h) {
    try {
      const classes = mlService.getVideoClasses();
      
      return h.response({
        success: true,
        data: {
          ...classes,
          model_type: 'video'
        },
        timestamp: new Date().toISOString()
      }).code(200);

    } catch (error) {
      logger.error('Error getting video classes:', error);
      throw Boom.internal('Error retrieving video class information');
    }
  }

  async searchClasses(request, h) {
    try {
      const { q: query, type = 'all', limit = 10 } = request.query;
      
      const allClasses = mlService.getAllClasses();
      let searchPool = [];

      // Build search pool based on type
      if (type === 'image' || type === 'all') {
        searchPool.push(...allClasses.image_classes.map(cls => ({ 
          class_name: cls, 
          type: 'image' 
        })));
      }
      
      if (type === 'video' || type === 'all') {
        searchPool.push(...allClasses.video_classes.map(cls => ({ 
          class_name: cls, 
          type: 'video' 
        })));
      }

      // Simple search implementation
      const results = searchPool
        .filter(item => 
          item.class_name.toLowerCase().includes(query.toLowerCase())
        )
        .map(item => ({
          ...item,
          relevance: this.calculateRelevance(item.class_name, query)
        }))
        .sort((a, b) => b.relevance - a.relevance)
        .slice(0, limit);

      return h.response({
        success: true,
        data: {
          query,
          results,
          total_found: results.length,
          search_type: type
        },
        timestamp: new Date().toISOString()
      }).code(200);

    } catch (error) {
      logger.error('Error searching classes:', error);
      throw Boom.internal('Error searching class information');
    }
  }

  async getClassDetails(request, h) {
    try {
      const { className } = request.params;
      const allClasses = mlService.getAllClasses();
      
      // Check if class exists
      const availableIn = [];
      if (allClasses.image_classes.includes(className)) {
        availableIn.push('image');
      }
      if (allClasses.video_classes.includes(className)) {
        availableIn.push('video');
      }

      if (availableIn.length === 0) {
        throw Boom.notFound(`Class '${className}' not found`);
      }

      // Generate class details (this would ideally come from a database)
      const details = {
        class_name: className,
        available_in: availableIn,
        description: this.getClassDescription(className),
        examples: this.getClassExamples(className),
        difficulty: this.getClassDifficulty(className),
        category: this.getClassCategory(className),
        related_classes: this.getRelatedClasses(className, allClasses)
      };

      return h.response({
        success: true,
        data: details,
        timestamp: new Date().toISOString()
      }).code(200);

    } catch (error) {
      logger.error('Error getting class details:', error);
      
      if (Boom.isBoom(error)) {
        throw error;
      }
      
      throw Boom.internal('Error retrieving class details');
    }
  }

  async getClassCategories(request, h) {
    try {
      const allClasses = mlService.getAllClasses();
      const categories = this.organizeClassesByCategory(allClasses);

      return h.response({
        success: true,
        data: {
          categories,
          total_categories: categories.length
        },
        timestamp: new Date().toISOString()
      }).code(200);

    } catch (error) {
      logger.error('Error getting class categories:', error);
      throw Boom.internal('Error retrieving class categories');
    }
  }

  // Helper methods
  calculateRelevance(className, query) {
    const queryLower = query.toLowerCase();
    const classLower = className.toLowerCase();
    
    // Exact match gets highest score
    if (classLower === queryLower) return 1.0;
    
    // Starts with query gets high score
    if (classLower.startsWith(queryLower)) return 0.8;
    
    // Contains query gets medium score
    if (classLower.includes(queryLower)) return 0.6;
    
    // Fuzzy matching could be implemented here
    return 0.3;
  }

  getClassDescription(className) {
    // This would ideally come from a database
    const descriptions = {
      'halo': 'Sapaan umum yang digunakan untuk menyapa seseorang',
      'terima kasih': 'Ungkapan rasa syukur atau penghargaan',
      'selamat pagi': 'Sapaan yang digunakan di pagi hari',
      'nama saya': 'Cara memperkenalkan diri',
      'apa kabar': 'Menanyakan keadaan seseorang'
    };
    
    return descriptions[className] || 'Deskripsi tidak tersedia';
  }

  getClassExamples(className) {
    // This would ideally come from a database with actual example images/videos
    return [
      `Contoh gerakan ${className} - variasi 1`,
      `Contoh gerakan ${className} - variasi 2`
    ];
  }

  getClassDifficulty(className) {
    // Simple heuristic based on class name length and complexity
    if (className.split(' ').length === 1) return 'easy';
    if (className.split(' ').length <= 2) return 'medium';
    return 'hard';
  }

  getClassCategory(className) {
    // Categorize based on keywords
    const categories = {
      'sapaan': ['halo', 'selamat pagi', 'selamat siang', 'selamat malam'],
      'perkenalan': ['nama saya', 'umur saya', 'asal saya'],
      'pertanyaan': ['apa kabar', 'dimana', 'kapan', 'mengapa'],
      'sopan_santun': ['terima kasih', 'maaf', 'permisi'],
      'keluarga': ['ayah', 'ibu', 'kakak', 'adik'],
      'angka': ['satu', 'dua', 'tiga', 'empat', 'lima']
    };

    for (const [category, words] of Object.entries(categories)) {
      if (words.includes(className)) {
        return category;
      }
    }

    return 'umum';
  }

  getRelatedClasses(className, allClasses) {
    const category = this.getClassCategory(className);
    const allClassNames = [
      ...allClasses.image_classes,
      ...allClasses.video_classes
    ];

    return allClassNames
      .filter(cls => cls !== className && this.getClassCategory(cls) === category)
      .slice(0, 5); // Return max 5 related classes
  }

  organizeClassesByCategory(allClasses) {
    const allClassNames = [
      ...new Set([...allClasses.image_classes, ...allClasses.video_classes])
    ];

    const categoryMap = {};

    allClassNames.forEach(className => {
      const category = this.getClassCategory(className);
      if (!categoryMap[category]) {
        categoryMap[category] = [];
      }
      categoryMap[category].push(className);
    });

    return Object.entries(categoryMap).map(([name, classes]) => ({
      name,
      classes,
      count: classes.length,
      description: this.getCategoryDescription(name)
    }));
  }

  getCategoryDescription(categoryName) {
    const descriptions = {
      'sapaan': 'Kata-kata untuk menyapa dan berinteraksi sosial',
      'perkenalan': 'Kata-kata untuk memperkenalkan diri',
      'pertanyaan': 'Kata-kata untuk menanyakan sesuatu',
      'sopan_santun': 'Kata-kata kesopanan dalam komunikasi',
      'keluarga': 'Kata-kata yang berkaitan dengan anggota keluarga',
      'angka': 'Representasi angka dalam bahasa isyarat',
      'umum': 'Kata-kata umum dalam bahasa isyarat'
    };

    return descriptions[categoryName] || 'Kategori bahasa isyarat';
  }
}

module.exports = new ClassHandler();