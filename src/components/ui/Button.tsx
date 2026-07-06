import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 shadow-lg shadow-zinc-900/20 dark:shadow-white/20',
  secondary:
    'bg-zinc-100 text-zinc-900 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700',
  ghost:
    'text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800',
  outline:
    'border border-zinc-300 text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs gap-1.5',
  md: 'px-4 py-2 text-sm gap-2',
  lg: 'px-6 py-3 text-base gap-2.5',
};

const Ripple: React.FC<{ x: number; y: number; size: number }> = ({ x, y, size }) => (
  <motion.span
    initial={{ scale: 0, opacity: 0.5 }}
    animate={{ scale: 3, opacity: 0 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.6, ease: 'easeOut' }}
    style={{ left: x - size / 2, top: y - size / 2, width: size, height: size }}
    className="absolute rounded-full bg-white/30 dark:bg-black/20 pointer-events-none"
  />
);

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading = false, disabled, children, className = '', onClick, ...props }, ref) => {
    const [ripples, setRipples] = useState<{ x: number; y: number; size: number; id: number }[]>([]);

    const handleClick = useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        if (loading || disabled) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const id = Date.now();
        setRipples((prev) => [...prev, { x, y, size, id }]);
        setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 600);
        onClick?.(e);
      },
      [loading, disabled, onClick]
    );

    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: 0.97 }}
        disabled={disabled || loading}
        onClick={handleClick}
        className={`
          relative inline-flex items-center justify-center overflow-hidden rounded-lg font-medium
          transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2
          focus-visible:ring-zinc-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-900
          disabled:pointer-events-none disabled:opacity-50
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${className}
        `}
        {...props}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {children}
        {ripples.map((r) => (
          <Ripple key={r.id} x={r.x} y={r.y} size={r.size} />
        ))}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
