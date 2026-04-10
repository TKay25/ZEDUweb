// src/components/ui/Textarea.tsx
import { forwardRef } from 'react';
import type { TextareaHTMLAttributes } from 'react';

// Define InputSize type locally
type InputSize = 'sm' | 'md' | 'lg';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  size?: InputSize;
  fullWidth?: boolean;
  resize?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({
  label,
  error,
  hint,
  size = 'md',
  fullWidth = true,
  resize = true,
  className = '',
  id,
  disabled,
  rows = 4,
  ...props
}, ref) => {
  const textareaId = id || `textarea-${Math.random().toString(36).substring(2, 11)}`;

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-5 py-4 text-lg',
  };

  // Type-safe size access
  const sizeClass = sizeClasses[size as keyof typeof sizeClasses] || sizeClasses.md;

  return (
    <div className={`${fullWidth ? 'w-full' : ''} ${className}`}>
      {label && (
        <label
          htmlFor={textareaId}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          {label}
        </label>
      )}

      <textarea
        ref={ref}
        id={textareaId}
        disabled={disabled}
        rows={rows}
        className={`
          w-full rounded-lg bg-white dark:bg-gray-800
          border ${error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}
          ${sizeClass}
          ${!resize ? 'resize-none' : 'resize-y'}
          disabled:opacity-50 disabled:cursor-not-allowed
          disabled:bg-gray-50 dark:disabled:bg-gray-900
          placeholder:text-gray-400 dark:placeholder:text-gray-500
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          transition-all duration-200
        `}
        {...props}
      />

      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
      
      {hint && !error && (
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{hint}</p>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';

export default Textarea;