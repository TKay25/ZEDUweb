// src/components/ui/Radio.tsx
import React, { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(({
  label,
  error,
  hint,
  className = '',
  id,
  disabled,
  checked,
  value,
  name,
  ...props
}, ref) => {
  const radioId = id || `radio-${Math.random().toString(36).substring(2, 11)}`;

  return (
    <div className={`${className}`}>
      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            ref={ref}
            type="radio"
            id={radioId}
            name={name}
            value={value}
            disabled={disabled}
            checked={checked}
            className={`
              w-4 h-4 border-gray-300 dark:border-gray-600
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
            htmlFor={radioId}
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

Radio.displayName = 'Radio';

export interface RadioGroupProps {
  name: string;
  value?: string | number;
  onChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

// Define the props that Radio component accepts for type safety
interface RadioComponentProps {
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  checked?: boolean;
  name?: string;
  label?: string;
  disabled?: boolean;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  name,
  value,
  onChange,
  children,
  className = '',
}) => {
  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child) && child.type === Radio) {
      // Type-safe access to child props
      const childProps = child.props as RadioComponentProps;
      return React.cloneElement(child, {
        name,
        checked: childProps.value === value,
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
          onChange?.(e.target.value);
          childProps.onChange?.(e);
        },
      } as RadioProps);
    }
    return child;
  });

  return <div className={`space-y-2 ${className}`}>{childrenWithProps}</div>;
};

export default Radio;