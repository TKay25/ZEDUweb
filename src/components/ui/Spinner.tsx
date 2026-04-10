// src/components/ui/Spinner.tsx
import React from 'react';

// Define SpinnerSize locally
type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface SpinnerProps {
  size?: SpinnerSize;
  color?: 'primary' | 'secondary' | 'white' | 'gray';
  className?: string;
}

const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  color = 'primary',
  className = '',
}) => {
  const sizeClasses = {
    xs: 'w-3 h-3 border-2',
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-3',
    lg: 'w-8 h-8 border-4',
    xl: 'w-12 h-12 border-4',
  };

  const colorClasses = {
    primary: 'border-blue-600 border-t-transparent',
    secondary: 'border-purple-600 border-t-transparent',
    white: 'border-white border-t-transparent',
    gray: 'border-gray-400 border-t-transparent',
  };

  return (
    <div className={`inline-flex ${className}`} role="status">
      <div
        className={`
          animate-spin rounded-full
          ${sizeClasses[size]}
          ${colorClasses[color]}
        `}
      />
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default Spinner;