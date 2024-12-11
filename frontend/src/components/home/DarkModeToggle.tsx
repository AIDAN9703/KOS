import { motion } from 'framer-motion';
import { FiSun, FiMoon } from 'react-icons/fi';

interface DarkModeToggleProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export default function DarkModeToggle({ darkMode, toggleDarkMode }: DarkModeToggleProps) {
  return (
    <motion.button
      onClick={toggleDarkMode}
      className="fixed bottom-4 left-4 bg-[#21336a] text-white p-3 rounded-full shadow-lg 
                hover:bg-[#2a4086] transition-colors duration-300 z-50 
                dark:bg-gray-700 dark:hover:bg-gray-600"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      aria-label="Toggle Dark Mode"
    >
      <motion.div
        initial={false}
        animate={{ rotate: darkMode ? 180 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {darkMode ? (
          <FiSun className="w-6 h-6" />
        ) : (
          <FiMoon className="w-6 h-6" />
        )}
      </motion.div>
    </motion.button>
  );
} 