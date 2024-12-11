'use client'

import { useState, useEffect } from 'react';
import {
  HeroSection,
  FeaturesSection,
  BrandsCarousel,
  FeaturedYachts,
  ExperienceSection,
  TestimonialsSection,
  DestinationsSection,
  DarkModeToggle,
  BackToTop
} from '@/components/home';

export default function HomePageClient() {
  const [darkMode, setDarkMode] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Initialize Dark Mode based on localStorage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
  }, []);

  // Apply or remove 'dark' class on <html>
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  // Back to Top button visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 font-sans transition-colors duration-500">
      <DarkModeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <HeroSection toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
      <FeaturesSection />
      <BrandsCarousel />
      <FeaturedYachts />
      <ExperienceSection />
      <TestimonialsSection />
      <DestinationsSection />
      <BackToTop show={showBackToTop} />
    </div>
  );
} 