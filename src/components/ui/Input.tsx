import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className = '', id, ...props }, ref) => {
    const [focused, setFocused] = useState(false);
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        {label && (
          <motion.label
            htmlFor={inputId}
            animate={{ color: error ? '#ef4444' : focused ? '#18181b' : '#71717a' }}
            className="block text-sm font-medium mb-1.5 dark:text-zinc-300"
          >
            {label}
          </motion.label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500 pointer-events-none">
              {icon}
            </div>
          )}
          <motion.div
            animate={{
              boxShadow: focused
                ? '0 0 0 2px #18181b, 0 0 0 4px rgba(24,24,27,0.1)'
                : error
                ? '0 0 0 2px #ef4444'
                : '0 0 0 0px rgba(0,0,0,0)',
            }}
            transition={{ duration: 0.2 }}
            className="rounded-lg"
          >
            <input
              ref={ref}
              id={inputId}
              onFocus={(e) => {
                setFocused(true);
                props.onFocus?.(e);
              }}
              onBlur={(e) => {
                setFocused(false);
                props.onBlur?.(e);
              }}
              className={`
                w-full rounded-lg border bg-white dark:bg-zinc-900 px-3 py-2 text-sm
                text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500
                transition-colors
                ${icon ? 'pl-10' : ''}
                ${error ? 'border-red-500 pr-10' : 'border-zinc-300 dark:border-zinc-700'}
                focus:border-transparent focus:outline-none
                disabled:cursor-not-allowed disabled:opacity-50
                ${className}
              `}
              aria-invalid={!!error}
              aria-describedby={error ? `${inputId}-error` : undefined}
              {...props}
            />
          </motion.div>
          {error && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500">
              <AlertCircle className="h-4 w-4" />
            </div>
          )}
        </div>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            id={`${inputId}-error`}
            role="alert"
            className="mt-1.5 text-xs text-red-500 flex items-center gap-1"
          >
            {error}
          </motion.p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
