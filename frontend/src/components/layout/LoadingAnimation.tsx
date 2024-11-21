import React from 'react';
import Lottie from 'lottie-react';
import loadingAnimation from '@/../../public/animations/loading.json';

const LoadingAnimation: React.FC = () => {
  if (typeof window === 'undefined') {
    return null; // Return null on the server-side
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
      <Lottie animationData={loadingAnimation} loop={true} style={{ width: 200, height: 200 }} />
    </div>
  );
};

export default LoadingAnimation;
