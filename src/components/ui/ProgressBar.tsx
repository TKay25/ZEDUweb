// src/components/ui/ProgressBar.tsx
import React from 'react';

export interface ProgressBarProps {
  value: number;
  max?: number;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'indigo';
  showLabel?: boolean;
  labelPosition?: 'inside' | 'outside' | 'none';
  animated?: boolean;
  striped?: boolean;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  size = 'md',
  color = 'blue',
  showLabel = false,
  labelPosition = 'outside',
  animated = false,
  striped = false,
  className = '',
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const sizeClasses = {
    xs: 'h-1',
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  };

  const colorClasses = {
    blue: 'bg-gradient-to-r from-blue-600 to-blue-500 shadow-lg shadow-blue-500/30',
    green: 'bg-gradient-to-r from-green-600 to-green-500 shadow-lg shadow-green-500/30',
    red: 'bg-gradient-to-r from-red-600 to-red-500 shadow-lg shadow-red-500/30',
    yellow: 'bg-gradient-to-r from-yellow-600 to-yellow-500 shadow-lg shadow-yellow-500/30',
    purple: 'bg-gradient-to-r from-purple-600 to-purple-500 shadow-lg shadow-purple-500/30',
    indigo: 'bg-gradient-to-r from-indigo-600 to-indigo-500 shadow-lg shadow-indigo-500/30',
  };

  const labelColors = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    red: 'text-red-600',
    yellow: 'text-yellow-600',
    purple: 'text-purple-600',
    indigo: 'text-indigo-600',
  };

  const stripedStyles = striped
    ? 'bg-gradient-to-r from-transparent via-white/25 to-transparent bg-[length:1rem_1rem] animate-shimmer'
    : '';

  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center">
        {showLabel && labelPosition === 'outside' && (
          <span className={`text-sm font-medium mr-2 ${labelColors[color]}`}>
            {Math.round(percentage)}%
          </span>
        )}
        
        <div className={`flex-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden ${sizeClasses[size]}`}>
          <div
            className={`
              ${colorClasses[color]} h-full rounded-full
              ${animated ? 'animate-progress' : ''}
              ${striped ? stripedStyles : ''}
              transition-all duration-300
            `}
            style={{ width: `${percentage}%` }}
          >
            {showLabel && labelPosition === 'inside' && percentage >= 20 && (
              <span className="text-xs font-medium text-white px-2">
                {Math.round(percentage)}%
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;