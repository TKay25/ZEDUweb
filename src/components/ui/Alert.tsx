// src/components/ui/Alert.tsx
import React, { useState } from 'react';
// Define AlertVariant type locally if not exported from './types/ui.types'
type AlertVariant = 'info' | 'success' | 'warning' | 'error';

interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  message: string;
  icon?: React.ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
}

const Alert: React.FC<AlertProps> = ({
  variant = 'info',
  title,
  message,
  icon,
  dismissible = false,
  onDismiss,
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(true);

  const variantClasses = {
    info: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      border: 'border-blue-200 dark:border-blue-800',
      text: 'text-blue-800 dark:text-blue-200',
      icon: '🔵',
    },
    success: {
      bg: 'bg-green-50 dark:bg-green-900/20',
      border: 'border-green-200 dark:border-green-800',
      text: 'text-green-800 dark:text-green-200',
      icon: '✅',
    },
    warning: {
      bg: 'bg-yellow-50 dark:bg-yellow-900/20',
      border: 'border-yellow-200 dark:border-yellow-800',
      text: 'text-yellow-800 dark:text-yellow-200',
      icon: '⚠️',
    },
    error: {
      bg: 'bg-red-50 dark:bg-red-900/20',
      border: 'border-red-200 dark:border-red-800',
      text: 'text-red-800 dark:text-red-200',
      icon: '❌',
    },
  };

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  if (!isVisible) return null;

  return (
    <div
      className={`
        flex items-start p-4 rounded-lg border
        ${variantClasses[variant].bg}
        ${variantClasses[variant].border}
        ${className}
        animate-slide-down
      `}
      role="alert"
    >
      <div className="flex-shrink-0 mr-3 text-lg">
        {icon || variantClasses[variant].icon}
      </div>

      <div className="flex-1">
        {title && (
          <h3 className={`text-sm font-semibold mb-1 ${variantClasses[variant].text}`}>
            {title}
          </h3>
        )}
        <p className={`text-sm ${variantClasses[variant].text}`}>{message}</p>
      </div>

      {dismissible && (
        <button
          onClick={handleDismiss}
          className={`
            flex-shrink-0 ml-3 text-lg
            ${variantClasses[variant].text}
            hover:opacity-75 transition-opacity
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
          `}
          aria-label="Dismiss"
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default Alert;