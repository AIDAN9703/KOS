import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { ChevronLeftIcon, ChevronRightIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface ImageGalleryProps {
  images: string[];
  title: string;
}

export default function ImageGallery({ images, title }: ImageGalleryProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return;

    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePosition({ x, y });
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === 'ArrowRight') nextSlide();
    if (e.key === 'Escape') setIsFullscreen(false);
  };

  return (
    <>
      <div className="relative h-96 overflow-hidden rounded-lg shadow-lg">
        {/* Main Gallery */}
        <div className="relative h-full" onMouseMove={handleMouseMove}>
          {images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`${title} - Image ${index + 1}`}
              className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-300 
                ${index === currentSlide ? 'opacity-100' : 'opacity-0'}
                ${isZoomed ? 'cursor-zoom-out scale-150' : 'cursor-zoom-in'}
              `}
              style={isZoomed ? {
                transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`
              } : undefined}
              onClick={() => setIsZoomed(!isZoomed)}
            />
          ))}
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={prevSlide}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all"
        >
          <ChevronLeftIcon className="h-6 w-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all"
        >
          <ChevronRightIcon className="h-6 w-6" />
        </button>

        {/* Fullscreen Button */}
        <button
          onClick={() => setIsFullscreen(true)}
          className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all"
        >
          <MagnifyingGlassIcon className="h-6 w-6" />
        </button>
      </div>

      {/* Thumbnails */}
      <div className="flex space-x-2 overflow-x-auto py-2">
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`${title} - Thumbnail ${index + 1}`}
            className={`h-20 w-20 object-cover cursor-pointer rounded-md transition-all ${
              index === currentSlide ? 'border-2 border-blue-500 scale-110' : 'hover:scale-105'
            }`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>

      {/* Fullscreen Modal */}
      <Dialog
        open={isFullscreen}
        onClose={() => setIsFullscreen(false)}
        className="fixed inset-0 z-50"
        onKeyDown={handleKeyDown}
      >
        <div className="min-h-screen px-4 text-center">
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-90" />

          <div className="fixed inset-0 flex items-center justify-center">
            <button
              onClick={() => setIsFullscreen(false)}
              className="absolute top-4 right-4 text-white"
            >
              <XMarkIcon className="h-8 w-8" />
            </button>

            <div className="relative w-full max-w-7xl">
              <img
                src={images[currentSlide]}
                alt={`${title} - Fullscreen`}
                className="w-full h-auto max-h-[90vh] object-contain"
              />

              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all"
              >
                <ChevronLeftIcon className="h-8 w-8" />
              </button>

              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all"
              >
                <ChevronRightIcon className="h-8 w-8" />
              </button>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
} 