// src/components/ui/Badge.tsx
import React from 'react';
// Define BadgeVariant and BadgeSize here if not exported from ui.types
//type BadgeVariant = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
//type BadgeSize = 'sm' | 'md' | 'lg';
// import { BadgeVariant, BadgeSize } from './types/ui.types';

export type BadgeVariant = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
export type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
}) => {
  const variantClasses = {
    default: 'bg-gradient-to-r from-gray-100 to-gray-50 text-gray-800 border border-gray-200 dark:from-gray-700 dark:to-gray-600 dark:text-gray-300 dark:border-gray-600',
    primary: 'bg-gradient-to-r from-blue-100 to-blue-50 text-blue-800 border border-blue-300 dark:from-blue-900 dark:to-blue-800 dark:text-blue-200 dark:border-blue-700',
    secondary: 'bg-gradient-to-r from-purple-100 to-purple-50 text-purple-800 border border-purple-300 dark:from-purple-900 dark:to-purple-800 dark:text-purple-200 dark:border-purple-700',
    success: 'bg-gradient-to-r from-green-100 to-green-50 text-green-800 border border-green-300 dark:from-green-900 dark:to-green-800 dark:text-green-200 dark:border-green-700',
    warning: 'bg-gradient-to-r from-yellow-100 to-yellow-50 text-yellow-800 border border-yellow-300 dark:from-yellow-900 dark:to-yellow-800 dark:text-yellow-200 dark:border-yellow-700',
    danger: 'bg-gradient-to-r from-red-100 to-red-50 text-red-800 border border-red-300 dark:from-red-900 dark:to-red-800 dark:text-red-200 dark:border-red-700',
    info: 'bg-gradient-to-r from-cyan-100 to-cyan-50 text-cyan-800 border border-cyan-300 dark:from-cyan-900 dark:to-cyan-800 dark:text-cyan-200 dark:border-cyan-700',
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  };

  return (
    <span
      className={`
        inline-flex items-center font-medium rounded-full
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {children}
    </span>
  );
};

// Export both named and default
export { Badge };
export default Badge;