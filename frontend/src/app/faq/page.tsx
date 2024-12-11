'use client'

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDownIcon,
  ChevronUpIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  TicketIcon,
  QuestionMarkCircleIcon,
  ShieldCheckIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';

interface FAQItem {
  question: string;
  answer: string;
  category: 'destinations' | 'booking' | 'yachts' | 'experience' | 'safety' | 'payment';
  relatedLinks?: Array<{
    text: string;
    url: string;
  }>;
  tips?: string[];
}

const faqItems: FAQItem[] = [
  // Destinations Category
  {
    category: 'destinations',
    question: "What's the best time to visit different Greek islands?",
    answer: "The ideal visiting times vary by island. Peak season (July-August) offers vibrant nightlife and perfect beach weather, but with larger crowds. May-June and September-October provide pleasant weather and fewer tourists. Some specific recommendations:",
    tips: [
      "Kos: Best from May to October, with July being perfect for windsurfing",
      "Nisyros: Spring for volcano hiking, summer for beach activities",
      "Kalymnos: April-May and September-October for rock climbing"
    ]
  },
  {
    category: 'destinations',
    question: "Which Greek islands can we visit from Kos?",
    answer: "From Kos, you can explore numerous beautiful islands including Kalymnos, Pserimos, Nisyros, and Astypalaia. Each island offers unique experiences - from Nisyros's active volcano to Kalymnos's famous rock climbing spots. Our skippers can help plan the perfect island-hopping itinerary based on your interests."
  },
  {
    category: 'destinations',
    question: "What are the best swimming spots around Kos?",
    answer: "Kos offers numerous pristine swimming locations. Paradise Beach and Bubble Beach are famous for their crystal-clear waters. We also know several secluded coves accessible only by boat, where you can enjoy private swimming and snorkeling experiences away from the crowds."
  },
  {
    category: 'destinations',
    question: "Can we visit Turkey during our yacht trip?",
    answer: "Yes! Bodrum, Turkey is just a short sail from Kos. We can arrange the necessary permits for cross-border travel. Many of our guests enjoy visiting both Greek and Turkish waters, experiencing the unique culture and cuisine of both countries."
  },
  // Booking Category
  {
    category: 'booking',
    question: "How far in advance should I book my yacht experience?",
    answer: "We recommend booking at least 2-3 weeks in advance during regular season and 1-2 months ahead for peak season (July-August). However, we can sometimes accommodate last-minute bookings based on availability."
  },
  {
    category: 'booking',
    question: "What happens if there's bad weather on my booking date?",
    answer: "Your safety is our priority. If weather conditions are unsuitable for sailing, we'll work with you to reschedule your trip or provide a full refund. We monitor weather conditions closely and will notify you 24-48 hours before your scheduled departure."
  },
  // Yachts Category
  {
    category: 'yachts',
    question: "What water toys and equipment are available?",
    answer: "Our yachts can be equipped with snorkeling gear, paddleboards, sea scooters, and inflatable water toys. Premium vessels also offer jet skis, seabobs, and diving equipment (certification required). Let us know your preferences, and we'll ensure your yacht is properly equipped."
  },
  {
    category: 'yachts',
    question: "What amenities are included on the yachts?",
    answer: "Our yachts come fully equipped with essential amenities including kitchen facilities, bathroom facilities, safety equipment, and basic entertainment systems. Premium yachts feature additional amenities like air conditioning, water toys, and advanced entertainment systems."
  },
  {
    category: 'yachts',
    question: "What's included in the premium yacht packages?",
    answer: "Our premium packages offer an elevated sailing experience with:",
    tips: [
      "Professional crew including chef and hostess",
      "Premium water toys and equipment",
      "Champagne welcome package",
      "Customized itinerary planning",
      "Access to exclusive beach clubs"
    ],
    relatedLinks: [
      {
        text: "View Premium Yachts",
        url: "/yachts/premium"
      }
    ]
  },
  // Experience Category
  {
    category: 'experience',
    question: "What local experiences can we enjoy?",
    answer: "We can arrange various traditional experiences during your yacht journey:",
    tips: [
      "Traditional Greek dance lessons on deck",
      "Visit to local olive oil producers",
      "Participation in seasonal fishing traditions",
      "Greek cooking classes with local chefs"
    ],
    relatedLinks: [
      {
        text: "View Our Cultural Experiences",
        url: "/experiences/cultural"
      }
    ]
  },
  {
    category: 'experience',
    question: "Can I customize my sailing route?",
    answer: "Absolutely! While we offer suggested routes to the best spots around Kos, you can work with your skipper to create a custom itinerary based on your preferences, weather conditions, and time constraints."
  },
  {
    category: 'experience',
    question: "Are there special sunset cruises available?",
    answer: "Yes! Our sunset cruises are very popular. We offer evening trips with traditional Greek mezedes (appetizers), local wine, and stunning views of the sun setting over the Aegean Sea. Some trips include live bouzouki music for an authentic Greek experience."
  },
  // Safety Category
  {
    category: 'safety',
    question: "What safety measures are in place?",
    answer: "All our yachts are equipped with required safety equipment including life jackets, flares, first aid kits, and VHF radios. Our vessels undergo regular maintenance and safety checks, and our skippers are certified professionals with extensive local experience."
  },
  {
    category: 'safety',
    question: "What about COVID-19 safety measures?",
    answer: "We follow all current health guidelines, including thorough sanitization between charters. Our crews are regularly tested, and we provide hand sanitizer and masks onboard. We can also arrange private COVID-19 testing for guests if required for travel."
  },
  // Payment Category
  {
    category: 'payment',
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards, bank transfers, and PayPal. A 50% deposit is required to confirm your booking, with the remaining balance due 30 days before departure."
  }
];

const categories = ['destinations', 'booking', 'yachts', 'experience', 'safety', 'payment'];

export default function FAQ() {
  const [activeCategory, setActiveCategory] = useState<string>('destinations');
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Parallax effect for decorative elements
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const compass = document.getElementById('compass-rose');
      const waves = document.getElementById('waves');
      
      if (compass) {
        compass.style.transform = `rotate(${scrolled * 0.1}deg)`;
      }
      if (waves) {
        waves.style.transform = `translateY(${scrolled * 0.2}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const filteredItems = faqItems.filter(item => 
    item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-white to-blue-50">
      {/* Background Images */}
      <div className="fixed inset-0 z-0">
        <Image
          src="/images/kos-map.jpg"
          alt="Map of Kos"
          fill
          className="object-cover opacity-10"
        />
      </div>

      {/* Decorative Compass Rose */}
      <div id="compass-rose" className="absolute top-10 left-10 w-24 h-24 opacity-20">
        <Image
          src="/images/compass-rose.png"
          alt="Compass Rose"
          width={96}
          height={96}
        />
      </div>

      {/* Animated Waves */}
      <div id="waves" className="absolute bottom-0 left-0 w-full h-32 opacity-10 pointer-events-none">
        <Image
          src="/images/waves.svg"
          alt="Waves"
          fill
          className="object-cover"
        />
      </div>

      <div className="relative z-10 pt-20">
        <div className="max-w-5xl mx-auto px-4 py-16">
          {/* Header Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-[#21336a] mb-4 relative inline-block">
              Frequently Asked Questions
              <span className="absolute -top-6 right-0 text-6xl opacity-10">⛵️</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Everything you need to know about your Mediterranean adventure
            </p>

            {/* Search Bar */}
            <div className="relative max-w-lg mx-auto">
              <input
                type="text"
                placeholder="Search questions..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setIsSearching(e.target.value !== '');
                }}
                className="w-full px-6 py-3 rounded-full border-2 border-[#21336a]/20 focus:border-[#21336a] outline-none transition-all duration-300 shadow-md"
              />
              <MagnifyingGlassIcon className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
          </div>

          {/* Category Tabs */}
          {!isSearching && (
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`
                    flex items-center gap-2 px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300
                    ${activeCategory === category 
                      ? 'bg-[#21336a] text-white shadow-lg transform -translate-y-1' 
                      : 'bg-white text-[#21336a] hover:bg-[#21336a] hover:text-white'}
                    shadow-md border border-[#21336a]/10
                  `}
                >
                  {getCategoryIcon(category)}
                  {capitalizeFirstLetter(category)}
                </button>
              ))}
            </div>
          )}

          {/* FAQ Items */}
          <div className="space-y-6">
            {(isSearching ? filteredItems : faqItems.filter(item => item.category === activeCategory))
              .map((item, index) => (
                <motion.div
                  key={index}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <button
                    onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                    className="w-full px-6 py-4 text-left flex justify-between items-center bg-gray-100 hover:bg-gray-200 transition-colors duration-300 focus:outline-none"
                    aria-expanded={activeIndex === index}
                    aria-controls={`faq-content-${index}`}
                  >
                    <span className="font-semibold text-[#21336a]">{item.question}</span>
                    {activeIndex === index ? <ChevronUpIcon className="w-5 h-5 text-[#21336a]" /> : <ChevronDownIcon className="w-5 h-5 text-[#21336a]" />}
                  </button>
                  <AnimatePresence>
                    {activeIndex === index && (
                      <motion.div
                        id={`faq-content-${index}`}
                        className="px-6 py-4 bg-gray-50"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <p className="text-gray-600 mb-4">{item.answer}</p>
                        
                        {/* Tips Section */}
                        {item.tips && (
                          <div className="mt-4 space-y-2">
                            <h4 className="font-semibold text-[#21336a]">Quick Tips:</h4>
                            <ul className="list-disc list-inside space-y-1">
                              {item.tips.map((tip, i) => (
                                <li key={i} className="text-gray-600">{tip}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Related Links */}
                        {item.relatedLinks && (
                          <div className="mt-4 flex flex-wrap gap-2">
                            {item.relatedLinks.map((link, i) => (
                              <Link
                                key={i}
                                href={link.url}
                                className="text-[#21336a] hover:text-[#b3a57c] transition-colors duration-300 flex items-center gap-1"
                              >
                                {link.text}
                                <ChevronRightIcon className="w-4 h-4" />
                              </Link>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
          </div>

          {/* Contact Section */}
          <div className="mt-16 text-center bg-white/80 rounded-2xl p-8 shadow-lg border border-[#21336a]/10">
            <h3 className="text-2xl font-semibold text-[#21336a] mb-4">
              Still Have Questions?
            </h3>
            <p className="text-gray-600 mb-6">
              Our experienced team is here to help plan your perfect Mediterranean getaway
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                href="/contact"
                className="px-8 py-3 bg-[#21336a] text-white rounded-full hover:bg-opacity-90 transition-all duration-300 flex items-center justify-center"
              >
                Contact Us
              </Link>
              <Link 
                href="/live-chat"
                className="px-8 py-3 border-2 border-[#21336a] text-[#21336a] rounded-full hover:bg-[#21336a] hover:text-white transition-all duration-300 flex items-center justify-center"
              >
                Live Chat
              </Link>
            </div>
          </div>

          {/* Trust Badges Section */}
          <div className="mt-16 text-center">
            <h2 className="text-3xl font-bold text-[#21336a] mb-4">Trusted by Thousands</h2>
            <p className="text-gray-600 mb-8">We are committed to providing the best yacht experience in the Mediterranean.</p>
            <div className="flex flex-wrap justify-center gap-6">
              {/* Replace these with actual trust badges */}
              <Image src="/images/trustbadge1.png" alt="Trust Badge 1" width={100} height={100} />
              <Image src="/images/trustbadge2.png" alt="Trust Badge 2" width={100} height={100} />
              <Image src="/images/trustbadge3.png" alt="Trust Badge 3" width={100} height={100} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper functions
function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function getCategoryIcon(category: string) {
  switch(category) {
    case 'destinations':
      return <MapPinIcon className="w-5 h-5 text-[#21336a]" />;
    case 'booking':
      return <TicketIcon className="w-5 h-5 text-[#21336a]" />;
    case 'yachts':
      return <QuestionMarkCircleIcon className="w-5 h-5 text-[#21336a]" />; // You can replace with a relevant Heroicon or use an Image if available
    case 'experience':
      return <QuestionMarkCircleIcon className="w-5 h-5 text-[#21336a]" />;
    case 'safety':
      return <ShieldCheckIcon className="w-5 h-5 text-[#21336a]" />;
    case 'payment':
      return <CurrencyDollarIcon className="w-5 h-5 text-[#21336a]" />;
    default:
      return <QuestionMarkCircleIcon className="w-5 h-5 text-[#21336a]" />;
  }
}