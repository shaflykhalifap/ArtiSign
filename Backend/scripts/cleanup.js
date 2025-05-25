#!/usr/bin/env node

/**
 * File cleanup script for BISINDO Backend
 * Cleans up temporary files, old logs, and unused uploads
 * Run: npm run cleanup
 */

const fs = require('fs').promises;
const path = require('path');
const config = require('../src/config');

class FileCleanup {
  constructor() {
    this.stats = {
      tempFiles: { deleted: 0, size: 0 },
      logs: { deleted: 0, size: 0 },
      uploads: { deleted: 0, size: 0 },
      total: { deleted: 0, size: 0 }
    };
  }

  async run() {
    console.log('🧹 Starting file cleanup...');
    console.log('⏰ Timestamp:', new Date().toISOString());
    
    try {
      // Clean temporary files
      await this.cleanTempFiles();
      
      // Clean old logs
      await this.cleanOldLogs();
      
      // Clean old uploads (older than 24 hours)
      await this.cleanOldUploads();
      
      // Print summary
      this.printSummary();
      
    } catch (error) {
      console.error('❌ Cleanup failed:', error);
      process.exit(1);
    }
  }

  async cleanTempFiles() {
    console.log('\n📁 Cleaning temporary files...');
    
    const tempDir = config.upload.tempDir;
    const maxAge = config.cleanup?.tempFiles?.maxAge || 60 * 60 * 1000; // 1 hour
    
    try {
      await this.cleanDirectory(tempDir, maxAge, this.stats.tempFiles);
      console.log(`✅ Temp files: ${this.stats.tempFiles.deleted} files deleted (${this.formatSize(this.stats.tempFiles.size)})`);
    } catch (error) {
      console.log('⚠️  Temp directory not found or empty');
    }
  }

  async cleanOldLogs() {
    console.log('\n📄 Cleaning old log files...');
    
    const logsDir = path.dirname(config.logging.file);
    const maxAge = config.cleanup?.logs?.maxAge || 7 * 24 * 60 * 60 * 1000; // 7 days
    
    try {
      await this.cleanDirectory(logsDir, maxAge, this.stats.logs, /\.log$/);
      console.log(`✅ Log files: ${this.stats.logs.deleted} files deleted (${this.formatSize(this.stats.logs.size)})`);
    } catch (error) {
      console.log('⚠️  Logs directory not found or empty');
    }
  }

  async cleanOldUploads() {
    console.log('\n📤 Cleaning old upload files...');
    
    const uploadsDir = config.server.uploadsPath;
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours for uploads
    
    try {
      await this.cleanDirectory(uploadsDir, maxAge, this.stats.uploads);
      console.log(`✅ Upload files: ${this.stats.uploads.deleted} files deleted (${this.formatSize(this.stats.uploads.size)})`);
    } catch (error) {
      console.log('⚠️  Uploads directory not found or empty');
    }
  }

  async cleanDirectory(dirPath, maxAge, stats, filePattern = null) {
    try {
      await fs.access(dirPath);
    } catch {
      return; // Directory doesn't exist
    }

    const files = await fs.readdir(dirPath);
    const now = Date.now();

    for (const file of files) {
      const filePath = path.join(dirPath, file);
      
      try {
        const stat = await fs.stat(filePath);
        
        // Skip if it's a directory
        if (stat.isDirectory()) continue;
        
        // Skip if file pattern doesn't match
        if (filePattern && !filePattern.test(file)) continue;
        
        // Check if file is older than maxAge
        const fileAge = now - stat.mtime.getTime();
        
        if (fileAge > maxAge) {
          await fs.unlink(filePath);
          stats.deleted++;
          stats.size += stat.size;
          
          console.log(`  🗑️  Deleted: ${file} (${this.formatSize(stat.size)}, ${this.formatAge(fileAge)} old)`);
        }
      } catch (error) {
        console.log(`  ⚠️  Could not process ${file}:`, error.message);
      }
    }
  }

  formatSize(bytes) {
    if (bytes === 0) return '0 B';
    
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  formatAge(milliseconds) {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ${hours % 24}h`;
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  }

  printSummary() {
    // Calculate totals
    this.stats.total.deleted = 
      this.stats.tempFiles.deleted + 
      this.stats.logs.deleted + 
      this.stats.uploads.deleted;
    
    this.stats.total.size = 
      this.stats.tempFiles.size + 
      this.stats.logs.size + 
      this.stats.uploads.size;

    console.log('\n📊 Cleanup Summary:');
    console.log('═'.repeat(50));
    console.log(`🗑️  Total files deleted: ${this.stats.total.deleted}`);
    console.log(`💾 Total space freed: ${this.formatSize(this.stats.total.size)}`);
    console.log(`⏰ Cleanup completed: ${new Date().toISOString()}`);
    
    if (this.stats.total.deleted === 0) {
      console.log('✨ No files needed cleanup - system is clean!');
    } else {
      console.log('✅ Cleanup completed successfully!');
    }
  }
}

// Run cleanup if called directly
if (require.main === module) {
  const cleanup = new FileCleanup();
  cleanup.run();
}

module.exports = FileCleanup;