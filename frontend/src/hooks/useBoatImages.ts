import { useState } from 'react';
import { imageUploadService } from '@/services/imageUpload';

interface UseBoatImagesReturn {
  images: string[];
  newImageFiles: File[];
  removedImages: string[];
  handleImageAdd: (files: FileList) => void;
  handleImageRemove: (imageUrl: string) => void;
  handleNewImageRemove: (index: number) => void;
  resetImages: () => void;
  uploadNewImages: () => Promise<string[]>;
  deleteRemovedImages: () => Promise<void>;
}

export function useBoatImages(initialImages: string[] = []): UseBoatImagesReturn {
  const [images, setImages] = useState<string[]>(initialImages);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [removedImages, setRemovedImages] = useState<string[]>([]);

  const handleImageAdd = (files: FileList) => {
    setNewImageFiles(prev => [...prev, ...Array.from(files)]);
  };

  const handleImageRemove = (imageUrl: string) => {
    setImages(prev => prev.filter(url => url !== imageUrl));
    setRemovedImages(prev => [...prev, imageUrl]);
  };

  const handleNewImageRemove = (index: number) => {
    setNewImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  const resetImages = () => {
    setImages(initialImages);
    setNewImageFiles([]);
    setRemovedImages([]);
  };

  const uploadNewImages = async (): Promise<string[]> => {
    if (newImageFiles.length === 0) return [];
    
    const result = await imageUploadService.uploadImages(newImageFiles);
    if (result.error) {
      throw new Error(result.error);
    }
    return result.urls;
  };

  const deleteRemovedImages = async (): Promise<void> => {
    await Promise.all(
      removedImages.map(url => imageUploadService.deleteImage(url))
    );
  };

  return {
    images,
    newImageFiles,
    removedImages,
    handleImageAdd,
    handleImageRemove,
    handleNewImageRemove,
    resetImages,
    uploadNewImages,
    deleteRemovedImages
  };
} 