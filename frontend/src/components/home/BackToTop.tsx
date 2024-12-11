import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowUp } from 'react-icons/fi';

interface BackToTopProps {
  show: boolean;
}

export default function BackToTop({ show }: BackToTopProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          onClick={scrollToTop}
          className="fixed bottom-4 right-4 bg-[#21336a] text-white p-3 rounded-full 
                   shadow-lg hover:bg-[#2a4086] transition-colors duration-300 z-50 
                   dark:bg-gray-700 dark:hover:bg-gray-600"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Back to Top"
        >
          <FiArrowUp className="w-6 h-6" />
        </motion.button>
      )}
    </AnimatePresence>
  );
} 