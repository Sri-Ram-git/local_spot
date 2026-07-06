import React from 'react';
import { motion } from 'framer-motion';

type CardVariant = 'default' | 'interactive' | 'glass';

interface CardProps {
  variant?: CardVariant;
  className?: string;
  children: React.ReactNode;
}

const variantStyles: Record<CardVariant, string> = {
  default:
    'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm',
  interactive:
    'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm cursor-pointer',
  glass:
    'bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl border border-white/20 dark:border-zinc-800/50 shadow-lg',
};

const Card: React.FC<CardProps> = ({ variant = 'default', className = '', children }) => {
  const isInteractive = variant === 'interactive';

  return (
    <motion.div
      whileHover={isInteractive ? { y: -4, boxShadow: '0 12px 40px rgba(0,0,0,0.12)' } : undefined}
      whileTap={isInteractive ? { scale: 0.98 } : undefined}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      className={`
        rounded-xl p-6
        ${variantStyles[variant]}
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
};

export default Card;
