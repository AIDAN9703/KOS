import axios from 'axios';

export interface UploadResponse {
  urls: string[];
  error?: string;
}

class ImageUploadService {
  private readonly MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  private readonly ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

  validateFile(file: File): string | null {
    if (file.size > this.MAX_FILE_SIZE) {
      return 'File size must be less than 5MB';
    }
    
    if (!this.ALLOWED_TYPES.includes(file.type)) {
      return 'Only JPEG, PNG and WebP images are allowed';
    }

    return null;
  }

  async uploadImages(files: File[]): Promise<UploadResponse> {
    try {
      const formData = new FormData();
      
      // Validate each file before upload
      for (const file of files) {
        const error = this.validateFile(file);
        if (error) {
          return { urls: [], error };
        }
        formData.append('images', file);
      }

      const response = await axios.post('/api/upload/images', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      return { urls: response.data.urls };
    } catch (error: any) {
      return {
        urls: [],
        error: error.response?.data?.message || 'Failed to upload images'
      };
    }
  }

  async deleteImage(url: string): Promise<boolean> {
    try {
      await axios.delete('/api/upload/images', {
        data: { url }
      });
      return true;
    } catch (error) {
      console.error('Failed to delete image:', error);
      return false;
    }
  }
}

export const imageUploadService = new ImageUploadService(); 