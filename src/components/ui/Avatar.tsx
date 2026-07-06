import React from 'react';
import { motion } from 'framer-motion';

type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

interface AvatarProps {
  size?: AvatarSize;
  src?: string;
  alt?: string;
  fallback?: string;
  showOnline?: boolean;
  className?: string;
}

const sizeMap: Record<AvatarSize, { dims: string; text: string }> = {
  sm: { dims: 'h-8 w-8', text: 'text-xs' },
  md: { dims: 'h-10 w-10', text: 'text-sm' },
  lg: { dims: 'h-14 w-14', text: 'text-lg' },
  xl: { dims: 'h-20 w-20', text: 'text-2xl' },
};

const dotSizeMap: Record<AvatarSize, string> = {
  sm: 'h-2.5 w-2.5 ring-1',
  md: 'h-3 w-3 ring-2',
  lg: 'h-3.5 w-3.5 ring-2',
  xl: 'h-4 w-4 ring-2',
};

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

const Avatar: React.FC<AvatarProps> = ({
  size = 'md',
  src,
  alt = '',
  fallback,
  showOnline = false,
  className = '',
}) => {
  const { dims, text } = sizeMap[size];
  const [imgError, setImgError] = React.useState(false);

  const initials = fallback || getInitials(alt);

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      className={`relative inline-flex shrink-0 ${className}`}
    >
      <div className={`relative ${dims} rounded-full overflow-hidden`}>
        {src && !imgError ? (
          <img
            src={src}
            alt={alt}
            onError={() => setImgError(true)}
            className="h-full w-full object-cover"
          />
        ) : (
          <div
            className={`h-full w-full flex items-center justify-center bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300 font-semibold ${text}`}
          >
            {initials}
          </div>
        )}
      </div>
      {showOnline && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
          className={`absolute bottom-0 right-0 ${dotSizeMap[size]} rounded-full bg-emerald-500 ring-white dark:ring-zinc-900`}
        />
      )}
    </motion.div>
  );
};

export default Avatar;
