// src/components/ui/Input.tsx
import React, { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';

export type InputSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type InputVariant = 'default' | 'filled' | 'outline' | 'ghost';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  hint?: string;
  size?: InputSize;
  variant?: InputVariant;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  icon?: React.ReactNode; // Alias for leftIcon
  isLoading?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  hint,
  size = 'md',
  variant = 'default',
  fullWidth = false,
  leftIcon,
  rightIcon,
  icon,
  isLoading = false,
  className = '',
  id,
  disabled,
  required,
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  onFocus,
  ...props
}, ref) => {
  const inputId = id || `input-${Math.random().toString(36).substring(2, 11)}`;
  
  // Use icon as leftIcon if provided
  const showLeftIcon = leftIcon || icon;
  const showRightIcon = rightIcon;

  // Size classes
  const sizeClasses = {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-5 py-3 text-lg',
    xl: 'px-6 py-4 text-xl'
  };

  // Variant classes
  const variantClasses = {
    default: 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 dark:focus:ring-blue-400/30 transition-all duration-250',
    filled: 'bg-gray-100 dark:bg-gray-700 border border-transparent focus:bg-white dark:focus:bg-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all duration-250',
    outline: 'bg-transparent border-2 border-blue-300 dark:border-blue-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 dark:focus:ring-blue-400/30 transition-all duration-250',
    ghost: 'bg-transparent border border-transparent hover:bg-gray-100 dark:hover:bg-gray-800 focus:bg-gray-100 dark:focus:bg-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all duration-250'
  };

  // Error classes
  const errorClasses = error 
    ? 'border-red-500 focus:border-red-500 focus:ring-red-500 dark:border-red-500' 
    : '';

  // Disabled classes
  const disabledClasses = disabled || isLoading
    ? 'opacity-50 cursor-not-allowed bg-gray-50 dark:bg-gray-900'
    : '';

  // Width class
  const widthClass = fullWidth ? 'w-full' : '';

  // Left icon padding
  const leftIconPadding = showLeftIcon ? 'pl-10' : '';
  
  // Right icon padding
  const rightIconPadding = showRightIcon ? 'pr-10' : '';

  // Spinner for loading state
  const Spinner = () => (
    <svg
      className="animate-spin h-4 w-4 text-gray-400"
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
  );

  return (
    <div className={`${widthClass} ${className}`}>
      {/* Label */}
      {label && (
        <label
          htmlFor={inputId}
          className={`
            block text-sm font-medium mb-1
            ${disabled ? 'text-gray-400 dark:text-gray-500' : 'text-gray-700 dark:text-gray-300'}
            ${required ? 'after:content-["*"] after:ml-0.5 after:text-red-500' : ''}
          `}
        >
          {label}
        </label>
      )}

      {/* Input wrapper */}
      <div className="relative">
        {/* Left Icon */}
        {showLeftIcon && !isLoading && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-400 dark:text-gray-500 text-sm">
              {showLeftIcon}
            </span>
          </div>
        )}

        {/* Loading Spinner */}
        {isLoading && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
            <Spinner />
          </div>
        )}

        {/* Input element */}
        <input
          ref={ref}
          id={inputId}
          type={type}
          disabled={disabled || isLoading}
          required={required}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          onFocus={onFocus}
          className={`
            block rounded-lg transition-all duration-200
            ${sizeClasses[size]}
            ${variantClasses[variant]}
            ${errorClasses}
            ${disabledClasses}
            ${leftIconPadding}
            ${rightIconPadding}
            ${widthClass}
            focus:outline-none focus:ring-2
          `}
          {...props}
        />

        {/* Right Icon */}
        {showRightIcon && !isLoading && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-gray-400 dark:text-gray-500 text-sm">
              {showRightIcon}
            </span>
          </div>
        )}

        {/* Clear button (for search inputs) */}
        {type === 'search' && value && !disabled && !isLoading && (
          <button
            type="button"
            onClick={() => {
              const syntheticEvent = {
                target: { value: '' }
              } as React.ChangeEvent<HTMLInputElement>;
              onChange?.(syntheticEvent);
            }}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <span className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer">
              ✕
            </span>
          </button>
        )}
      </div>

      {/* Error message */}
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400 animate-slide-down">
          {error}
        </p>
      )}

      {/* Hint message */}
      {hint && !error && (
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {hint}
        </p>
      )}

      {/* Character counter (for maxLength) */}
      {props.maxLength && value && typeof value === 'string' && (
        <div className="mt-1 text-right">
          <span className={`text-xs ${(value as string).length > props.maxLength ? 'text-red-500' : 'text-gray-400'}`}>
            {(value as string).length}/{props.maxLength}
          </span>
        </div>
      )}
    </div>
  );
});

Input.displayName = 'Input';

// Named export
export { Input };

// Default export
export default Input;