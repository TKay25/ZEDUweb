// src/components/ui/Button.tsx
import React, { forwardRef } from 'react';
import type { ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  loading?: boolean; // Add alias for isLoading
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  icon?: React.ReactNode; // Add icon prop for compatibility
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  loading,
  fullWidth = false,
  leftIcon,
  rightIcon,
  icon,
  className = '',
  disabled,
  type = 'button',
  ...props
}, ref) => {
  // Use loading prop as alias for isLoading
  const isLoadingEffective = isLoading || loading || false;
  
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95';
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 focus:ring-blue-500 shadow-lg hover:shadow-xl',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600',
    outline: 'border-2 border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800',
    ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500 dark:text-gray-300 dark:hover:bg-gray-800',
    danger: 'bg-gradient-to-r from-red-600 to-pink-600 text-white hover:from-red-700 hover:to-pink-700 focus:ring-red-500 shadow-lg hover:shadow-xl',
    success: 'bg-gradient-to-r from-green-600 to-teal-600 text-white hover:from-green-700 hover:to-teal-700 focus:ring-green-500 shadow-lg hover:shadow-xl',
  };

  const sizeClasses = {
    xs: 'px-2.5 py-1.5 text-xs space-x-1',
    sm: 'px-3 py-2 text-sm space-x-1.5',
    md: 'px-4 py-2.5 text-sm space-x-2',
    lg: 'px-6 py-3 text-base space-x-2',
    xl: 'px-8 py-4 text-lg space-x-3',
  };

  const spinnerSizes = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-7 h-7',
  };

  // Determine which icon to show (icon prop takes precedence)
  const showLeftIcon = leftIcon || icon;
  const showRightIcon = rightIcon;

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || isLoadingEffective}
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {isLoadingEffective && (
        <svg
          className={`animate-spin ${spinnerSizes[size]} text-current`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {!isLoadingEffective && showLeftIcon && <span className="inline-flex">{showLeftIcon}</span>}
      <span>{children}</span>
      {!isLoadingEffective && showRightIcon && <span className="inline-flex">{showRightIcon}</span>}
    </button>
  );
});

Button.displayName = 'Button';

// Add named export
export { Button };

// Keep default export
export default Button;