'use client'

import { useState, useEffect } from 'react';
import Image from 'next/image';

const testimonials = [
  {
    id: 1,
    quote: "The most luxurious yachting experience I've ever had. Impeccable service!",
    author: "Emma Thompson",
    title: "CEO, Global Enterprises",
    image: "/logo.png"
  },
  {
    id: 2,
    quote: "KOS Yachts made our family vacation truly unforgettable. We'll definitely be back!",
    author: "Michael Chen",
    title: "Tech Entrepreneur",
    image: "/logo.png"
  },
  {
    id: 3,
    quote: "Top-notch yachts and a crew that goes above and beyond. Highly recommended!",
    author: "Sophia Rodriguez",
    title: "Travel Blogger",
    image: "/logo.png"
  }
];

export default function Testimonials() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    const handleScroll = () => {
      const element = document.getElementById('testimonials');
      if (element) {
        const rect = element.getBoundingClientRect();
        setIsVisible(rect.top < window.innerHeight && rect.bottom >= 0);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => {
      clearInterval(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <section id="testimonials" className={`bg-gray-100 py-16 transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-12">What Our Clients Say</h2>
        <div className="relative h-[300px] md:h-[250px]"> {/* Adjust height as needed */}
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-500 ${
                index === currentTestimonial ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              <div className="text-center max-w-2xl mx-auto">
                <p className="text-lg md:text-xl text-gray-600 mb-6">"{testimonial.quote}"</p>
                <div className="flex items-center justify-center">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.author}
                    width={48}
                    height={48}
                    className="rounded-full object-cover"
                  />
                  <div className="ml-4 text-left">
                    <p className="text-base md:text-lg font-semibold text-gray-900">{testimonial.author}</p>
                    <p className="text-sm md:text-base text-gray-600">{testimonial.title}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
