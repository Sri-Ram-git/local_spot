import React from 'react';

type SkeletonVariant = 'text' | 'circular' | 'rectangular';

interface SkeletonProps {
  variant?: SkeletonVariant;
  width?: string | number;
  height?: string | number;
  className?: string;
}

const variantStyles: Record<SkeletonVariant, string> = {
  text: 'h-4 w-full rounded-md',
  circular: 'rounded-full',
  rectangular: 'rounded-lg',
};

const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'text',
  width,
  height,
  className = '',
}) => {
  const style: React.CSSProperties = {};
  if (width !== undefined) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height !== undefined) style.height = typeof height === 'number' ? `${height}px` : height;
  if (variant === 'circular') {
    style.width = style.width || '40px';
    style.height = style.height || style.width;
  }

  return (
    <div
      aria-hidden="true"
      style={style}
      className={`
        relative overflow-hidden bg-zinc-200 dark:bg-zinc-800
        ${variantStyles[variant]}
        ${className}
      `}
    >
      <div
        className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 dark:via-white/10 to-transparent"
      />
      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 1.5s infinite;
        }
      `}</style>
    </div>
  );
};

export default Skeleton;
