// src/components/ui/Checkbox.tsx
import React, { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
  hint?: string;
  indeterminate?: boolean;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(({
  label,
  error,
  hint,
  indeterminate,
  className = '',
  id,
  disabled,
  checked,
  ...props
}, ref) => {
  const checkboxId = id || `checkbox-${Math.random().toString(36).substring(2, 11)}`;

  React.useEffect(() => {
    if (ref && 'current' in ref && ref.current) {
      ref.current.indeterminate = indeterminate || false;
    }
  }, [indeterminate, ref]);

  return (
    <div className={`${className}`}>
      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            ref={ref}
            type="checkbox"
            id={checkboxId}
            disabled={disabled}
            checked={checked}
            className={`
              w-4 h-4 rounded border-gray-300 dark:border-gray-600
              text-blue-600 dark:text-blue-400
              focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-colors duration-200
              ${error ? 'border-red-500' : ''}
            `}
            {...props}
          />
        </div>
        {label && (
          <label
            htmlFor={checkboxId}
            className={`
              ml-2 block text-sm
              ${disabled ? 'text-gray-400 dark:text-gray-500' : 'text-gray-700 dark:text-gray-300'}
            `}
          >
            {label}
          </label>
        )}
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
      
      {hint && !error && (
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{hint}</p>
      )}
    </div>
  );
});

Checkbox.displayName = 'Checkbox';

export default Checkbox;