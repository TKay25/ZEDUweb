// src/components/ui/Toast.tsx
import React, { useEffect, useState } from 'react';

// Define ToastType locally
export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose?: () => void;
  className?: string;
}

// Define type for style maps
type StyleMap = {
  [K in ToastType]: string;
};

type IconMap = {
  [K in ToastType]: string;
};

const Toast: React.FC<ToastProps> = ({
  message,
  type = 'info',
  duration = 3000,
  onClose,
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const startTime = Date.now();
    const endTime = startTime + duration;

    const updateProgress = () => {
      const now = Date.now();
      const remaining = Math.max(0, endTime - now);
      const newProgress = (remaining / duration) * 100;
      setProgress(newProgress);

      if (remaining > 0) {
        requestAnimationFrame(updateProgress);
      }
    };

    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, duration);

    requestAnimationFrame(updateProgress);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const typeStyles: StyleMap = {
    success: 'bg-gradient-to-r from-green-500 to-emerald-500 text-white',
    error: 'bg-gradient-to-r from-red-500 to-pink-500 text-white',
    info: 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white',
    warning: 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white',
  };

  const icons: IconMap = {
    success: '✅',
    error: '❌',
    info: 'ℹ️',
    warning: '⚠️',
  };

  if (!isVisible) return null;

  return (
    <div
      className={`
        fixed top-4 right-4 z-50 max-w-sm w-full
        rounded-lg shadow-2xl overflow-hidden
        transform transition-all duration-300 animate-slide-down
        ${typeStyles[type]}
        ${className}
      `}
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0 text-xl mr-3">
            {icons[type]}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">{message}</p>
          </div>
          <button
            onClick={() => {
              setIsVisible(false);
              onClose?.();
            }}
            className="flex-shrink-0 ml-3 text-lg hover:opacity-75 transition-opacity"
          >
            ✕
          </button>
        </div>
      </div>
      <div
        className="absolute bottom-0 left-0 h-1 bg-white/30"
        style={{ width: `${progress}%`, transition: 'width 0.1s linear' }}
      />
    </div>
  );
};

interface ToastContainerProps {
  toasts: Array<{
    id: string;
    message: string;
    type?: ToastType;
  }>;
  removeToast: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};

export default Toast;