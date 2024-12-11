import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { 
  RiAnchorLine, RiStarLine, RiTeamLine, 
  RiShipLine, RiCompassDiscoverLine, RiCustomerService2Line 
} from 'react-icons/ri';

const features = [
  {
    icon: RiShipLine,
    title: 'Premium Fleet',
    description: 'Access to an exclusive collection of luxury yachts, each meticulously maintained.',
    color: 'from-blue-500 to-blue-600',
    delay: 0
  },
  {
    icon: RiCustomerService2Line,
    title: 'Concierge Service',
    description: 'Personalized attention to every detail of your journey, available 24/7.',
    color: 'from-purple-500 to-purple-600',
    delay: 0.2
  },
  {
    icon: RiTeamLine,
    title: 'Expert Crew',
    description: 'Professional and experienced crew members dedicated to your comfort.',
    color: 'from-emerald-500 to-emerald-600',
    delay: 0.4
  },
  {
    icon: RiCompassDiscoverLine,
    title: 'Custom Itineraries',
    description: 'Tailored routes and experiences designed around your preferences.',
    color: 'from-amber-500 to-amber-600',
    delay: 0.6
  },
  {
    icon: RiStarLine,
    title: 'Luxury Experience',
    description: 'Five-star amenities and service throughout your journey.',
    color: 'from-rose-500 to-rose-600',
    delay: 0.8
  },
  {
    icon: RiAnchorLine,
    title: 'Safety First',
    description: 'Top-tier safety measures and fully insured vessels for peace of mind.',
    color: 'from-cyan-500 to-cyan-600',
    delay: 1
  }
];

export default function FeaturesSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [100, 0, 0, -100]);

  return (
    <section ref={containerRef} className="relative py-24 bg-white dark:bg-gray-900 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[url('/patterns/grid.svg')] opacity-5" />
      <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white dark:from-gray-900 dark:to-gray-900" />

      <motion.div
        style={{ opacity, y }}
        className="relative z-10 max-w-7xl mx-auto px-4"
      >
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-[#21336a] dark:text-blue-400 text-sm font-semibold tracking-wider uppercase"
          >
            Why Choose KOS
          </motion.span>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 text-4xl font-bold text-gray-900 dark:text-white"
          >
            Crafting Unforgettable
            <span className="block text-[#21336a] dark:text-blue-400">Maritime Experiences</span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-6 text-lg text-gray-600 dark:text-gray-300"
          >
            Experience luxury yachting like never before with our premium services and dedicated team.
          </motion.p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: feature.delay }}
              whileHover={{ scale: 1.05, translateY: -5 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 
                            rounded-2xl transform -rotate-1 group-hover:rotate-1 transition-transform duration-300" />
              
              <div className="relative p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg 
                            border border-gray-100 dark:border-gray-700">
                <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${feature.color} 
                               transform group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                
                <h3 className="mt-6 text-xl font-semibold text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                
                <p className="mt-4 text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>

                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent 
                              via-[#21336a] to-transparent opacity-0 group-hover:opacity-100 
                              transition-opacity duration-300" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 bg-[#21336a] rounded-2xl p-8 text-white"
        >
          {[
            { value: '50+', label: 'Luxury Yachts' },
            { value: '1000+', label: 'Happy Clients' },
            { value: '15+', label: 'Destinations' },
            { value: '24/7', label: 'Support' }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="text-center"
            >
              <div className="text-4xl font-bold mb-2">{stat.value}</div>
              <div className="text-sm text-blue-200">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
} 