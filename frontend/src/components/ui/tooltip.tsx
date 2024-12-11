import { motion, AnimatePresence } from 'framer-motion';

interface TooltipProps {
  content: string;
  position: { x: number; y: number };
}

export function Tooltip({ content, position }: TooltipProps) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        style={{
          position: 'fixed',
          left: position.x,
          top: position.y,
          transform: 'translate(-50%, -100%)',
          zIndex: 50
        }}
        className="px-2 py-1 text-xs text-white bg-gray-900 rounded shadow-lg pointer-events-none"
      >
        {content}
      </motion.div>
    </AnimatePresence>
  );
} 