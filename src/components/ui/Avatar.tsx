// src/components/ui/Avatar.tsx
import React from 'react';
export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: AvatarSize;
  shape?: 'circle' | 'square';
  status?: 'online' | 'offline' | 'away' | 'busy';
  className?: string;
  onClick?: () => void;
}

const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = 'Avatar',
  name,
  size = 'md',
  shape = 'circle',
  status,
  className = '',
  onClick,
}) => {
  const sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-2xl',
  };

  const shapeClasses = {
    circle: 'rounded-full',
    square: 'rounded-lg',
  };

  const statusClasses = {
    online: 'bg-green-500',
    offline: 'bg-gray-400',
    away: 'bg-yellow-500',
    busy: 'bg-red-500',
  };

  const statusSizes = {
    xs: 'w-1.5 h-1.5',
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
    xl: 'w-4 h-4',
  };

  const getInitials = () => {
    if (!name) return '';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div
      className={`
        relative inline-flex
        ${sizeClasses[size]}
        ${shapeClasses[shape]}
        ${onClick ? 'cursor-pointer transform hover:scale-105 transition-transform' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          className={`
            w-full h-full object-cover
            ${shapeClasses[shape]}
          `}
        />
      ) : name ? (
        <div
          className={`
            w-full h-full flex items-center justify-center
            bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold
            ${shapeClasses[shape]}
          `}
        >
          {getInitials()}
        </div>
      ) : (
        <div
          className={`
            w-full h-full flex items-center justify-center
            bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300
            ${shapeClasses[shape]}
          `}
        >
          <svg
            className="w-1/2 h-1/2"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      )}

      {status && (
        <span
          className={`
            absolute bottom-0 right-0 block
            ${statusSizes[size]}
            ${statusClasses[status]}
            rounded-full ring-2 ring-white dark:ring-gray-900
          `}
        />
      )}
    </div>
  );
};

interface AvatarGroupProps {
  children: React.ReactNode;
  max?: number;
  size?: AvatarSize;
  className?: string;
}

export const AvatarGroup: React.FC<AvatarGroupProps> = ({
  children,
  max = 5,
  size = 'md',
  className = '',
}) => {
  const childrenArray = React.Children.toArray(children);
  const visibleAvatars = childrenArray.slice(0, max);
  const remaining = childrenArray.length - max;

  return (
    <div className={`flex -space-x-2 ${className}`}>
      {visibleAvatars.map((avatar, index) => (
        <div key={index} className="ring-2 ring-white dark:ring-gray-900 rounded-full">
          {avatar}
        </div>
      ))}
      {remaining > 0 && (
        <div
          className={`
            ring-2 ring-white dark:ring-gray-900 rounded-full
            bg-gray-100 dark:bg-gray-800
            flex items-center justify-center
            font-medium text-gray-600 dark:text-gray-300
            ${size === 'xs' && 'w-6 h-6 text-xs'}
            ${size === 'sm' && 'w-8 h-8 text-sm'}
            ${size === 'md' && 'w-10 h-10 text-base'}
            ${size === 'lg' && 'w-12 h-12 text-lg'}
            ${size === 'xl' && 'w-16 h-16 text-xl'}
          `}
        >
          +{remaining}
        </div>
      )}
    </div>
  );
};

// Export both named and default
export { Avatar };
export default Avatar;