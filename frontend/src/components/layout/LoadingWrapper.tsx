'use client'

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const LoadingAnimation = dynamic(() => import('./LoadingAnimation'), { ssr: false });

interface LoadingWrapperProps {
  children: React.ReactNode;
}

const LoadingWrapper: React.FC<LoadingWrapperProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time (you can replace this with actual loading logic)
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Adjust this time as needed

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingAnimation />;
  }

  return <>{children}</>;
};

export default LoadingWrapper;
