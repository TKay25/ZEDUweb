// src/components/ui/Select.tsx
import { forwardRef } from 'react';

// Define Option interface locally
interface Option {
  value: string;
  label: string;
  disabled?: boolean;
}

// Define InputSize type locally
type InputSize = 'sm' | 'md' | 'lg';

// Define SelectProps interface (don't extend SelectHTMLAttributes to avoid size conflict)
interface SelectProps {
  label?: string;
  error?: string;
  hint?: string;
  options: Option[];
  size?: InputSize;
  fullWidth?: boolean;
  placeholder?: string;
  disabled?: boolean;
  value?: string | string[];
  defaultValue?: string | string[];
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLSelectElement>) => void;
  className?: string;
  id?: string;
  name?: string;
  required?: boolean;
  multiple?: boolean;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(({
  label,
  error,
  hint,
  options,
  size = 'md',
  fullWidth = true,
  placeholder,
  className = '',
  id,
  disabled,
  value,
  defaultValue,
  onChange,
  onBlur,
  name,
  required,
  multiple,
  ...props
}, ref) => {
  const selectId = id || `select-${Math.random().toString(36).substring(2, 11)}`;

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-5 py-4 text-lg',
  };

  return (
    <div className={`${fullWidth ? 'w-full' : ''} ${className}`}>
      {label && (
        <label
          htmlFor={selectId}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        <select
          ref={ref}
          id={selectId}
          disabled={disabled}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          onBlur={onBlur}
          name={name}
          required={required}
          multiple={multiple}
          className={`
            w-full appearance-none rounded-lg bg-white dark:bg-gray-800
            border ${error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}
            ${sizeClasses[size]}
            pr-10
            disabled:opacity-50 disabled:cursor-not-allowed
            disabled:bg-gray-50 dark:disabled:bg-gray-900
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            transition-all duration-200
            ${multiple ? 'h-auto min-h-[100px]' : ''}
          `}
          {...props}
        >
          {placeholder && !multiple && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>

        {!multiple && (
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <svg
              className="w-5 h-5 text-gray-400 dark:text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
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

Select.displayName = 'Select';

// Export both named and default
export { Select };
export default Select;