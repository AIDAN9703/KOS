'use client'

import { useEffect } from 'react';
import Hero from "./components/Hero";
import FeaturedYachts from "./components/FeaturedYachts";
import Testimonials from "./components/Testimonials";
import OwnerCTA from "./components/OwnerCTA";

export default function Home() {
  useEffect(() => {
    const handleScroll = () => {
      const elements = document.querySelectorAll('.scroll-animate');
      elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom >= 0;
        if (isVisible) {
          el.classList.add('animate-in');
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check on initial load

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div>
      <Hero />
      <div className="scroll-animate">
        <FeaturedYachts />
      </div>
      <div className="scroll-animate">
        <Testimonials />
      </div>
      <div className="scroll-animate">
        <OwnerCTA />
      </div>
    </div>
  );
}
