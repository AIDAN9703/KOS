import { motion } from 'framer-motion';
import Image from 'next/image';
import { FaAnchor, FaCompass, FaGlassMartini, FaStar } from 'react-icons/fa';

const features = [
  {
    icon: FaAnchor,
    title: 'Customized Itineraries',
    description: 'Tailored to your preferences'
  },
  {
    icon: FaStar,
    title: 'Professional Crew',
    description: 'Extensive maritime experience'
  },
  {
    icon: FaGlassMartini,
    title: 'Premium Amenities',
    description: 'Five-star service onboard'
  },
  {
    icon: FaCompass,
    title: 'Exclusive Access',
    description: 'Premium ports and destinations'
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5
    }
  }
};

export default function ExperienceSection() {
  return (
    <section className="relative py-24 bg-gray-50 dark:bg-gray-800 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Image Column */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative h-[600px] rounded-2xl overflow-hidden">
              <Image
                src="/images/boats/beach.jpg"
                alt="Luxury Experience"
                fill
                className="object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#21336a]/30 rounded-2xl" />
            </div>
            
            {/* Floating Stats Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="absolute -bottom-10 -right-10 bg-white dark:bg-gray-700 p-6 rounded-2xl shadow-xl"
            >
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#21336a] dark:text-white">98%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Satisfaction Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#21336a] dark:text-white">15+</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Years Experience</div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Content Column */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-4"
            >
              <h2 className="text-4xl font-bold text-[#21336a] dark:text-white">
                Discover the KOS Difference
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                From personalized itineraries to world-class service, every aspect
                of your journey is crafted to exceed expectations. Experience the
                freedom of luxury yachting with KOS.
              </p>
            </motion.div>

            <motion.ul
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-6"
            >
              {features.map((feature, index) => (
                <motion.li
                  key={feature.title}
                  variants={itemVariants}
                  className="flex items-center space-x-4 group"
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-[#21336a] dark:bg-gray-600 
                                flex items-center justify-center transform group-hover:scale-110 
                                transition-transform duration-300">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#21336a] dark:text-white mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {feature.description}
                    </p>
                  </div>
                </motion.li>
              ))}
            </motion.ul>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <button className="mt-8 px-8 py-4 bg-[#21336a] text-white rounded-lg 
                               hover:bg-[#2a4086] transition-all duration-300 transform 
                               hover:-translate-y-1 hover:shadow-xl">
                Start Your Journey
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
} 