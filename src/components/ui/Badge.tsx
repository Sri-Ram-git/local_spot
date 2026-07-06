import React from 'react';
import { motion } from 'framer-motion';

type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger';
type BadgeSize = 'sm' | 'md';

interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  className?: string;
  children: React.ReactNode;
}

const variantStyles: Record<BadgeVariant, string> = {
  default:
    'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300',
  primary:
    'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900',
  success:
    'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  warning:
    'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  danger:
    'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-[11px]',
  md: 'px-2.5 py-1 text-xs',
};

const Badge: React.FC<BadgeProps> = ({ variant = 'default', size = 'md', className = '', children }) => {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`
        inline-flex items-center gap-1 rounded-full font-medium
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
    >
      {children}
    </motion.span>
  );
};

export default Badge;
