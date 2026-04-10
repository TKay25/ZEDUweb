import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title?: string;
  message: string;
  duration?: number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
}

interface ToastContextType {
  toasts: Toast[];
  showToast: (toast: Omit<Toast, 'id'>) => string;
  dismissToast: (id: string) => void;
  dismissAllToasts: () => void;
  success: (message: string, title?: string, options?: Partial<Toast>) => string;
  error: (message: string, title?: string, options?: Partial<Toast>) => string;
  info: (message: string, title?: string, options?: Partial<Toast>) => string;
  warning: (message: string, title?: string, options?: Partial<Toast>) => string;
}

export const ToastContext = createContext<ToastContextType | undefined>(undefined);

const ToastIcon = ({ type }: { type: Toast['type'] }) => {
  switch (type) {
    case 'success':
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    case 'error':
      return <AlertCircle className="w-5 h-5 text-red-500" />;
    case 'warning':
      return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
    case 'info':
    default:
      return <Info className="w-5 h-5 text-blue-500" />;
  }
};

const ToastContainer: React.FC<{ toasts: Toast[]; onDismiss: (id: string) => void }> = ({ toasts, onDismiss }) => {
  const getPositionClasses = (position: Toast['position'] = 'top-right') => {
    switch (position) {
      case 'top-left':
        return 'top-4 left-4';
      case 'top-center':
        return 'top-4 left-1/2 -translate-x-1/2';
      case 'bottom-right':
        return 'bottom-4 right-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'bottom-center':
        return 'bottom-4 left-1/2 -translate-x-1/2';
      case 'top-right':
      default:
        return 'top-4 right-4';
    }
  };

  // Group toasts by position
  const groupedToasts = toasts.reduce((acc, toast) => {
    const position = toast.position || 'top-right';
    if (!acc[position]) {
      acc[position] = [];
    }
    acc[position].push(toast);
    return acc;
  }, {} as Record<string, Toast[]>);

  return (
    <>
      {Object.entries(groupedToasts).map(([position, positionToasts]) => (
        <div
          key={position}
          className={`fixed z-50 space-y-2 ${getPositionClasses(position as Toast['position'])}`}
        >
          {positionToasts.map(toast => (
            <div
              key={toast.id}
              className={`
                flex items-start p-4 rounded-lg shadow-lg border-l-4 max-w-md
                animate-slide-in-right
                ${toast.type === 'success' && 'bg-green-50 border-green-500'}
                ${toast.type === 'error' && 'bg-red-50 border-red-500'}
                ${toast.type === 'warning' && 'bg-yellow-50 border-yellow-500'}
                ${toast.type === 'info' && 'bg-blue-50 border-blue-500'}
              `}
              role="alert"
            >
              <div className="flex-shrink-0 mr-3">
                <ToastIcon type={toast.type} />
              </div>
              <div className="flex-1">
                {toast.title && (
                  <h3 className={`font-medium mb-1
                    ${toast.type === 'success' && 'text-green-800'}
                    ${toast.type === 'error' && 'text-red-800'}
                    ${toast.type === 'warning' && 'text-yellow-800'}
                    ${toast.type === 'info' && 'text-blue-800'}
                  `}>
                    {toast.title}
                  </h3>
                )}
                <p className={`text-sm
                  ${toast.type === 'success' && 'text-green-700'}
                  ${toast.type === 'error' && 'text-red-700'}
                  ${toast.type === 'warning' && 'text-yellow-700'}
                  ${toast.type === 'info' && 'text-blue-700'}
                `}>
                  {toast.message}
                </p>
              </div>
              <button
                onClick={() => onDismiss(toast.id)}
                className={`flex-shrink-0 ml-3 p-1 rounded-full hover:bg-opacity-20
                  ${toast.type === 'success' && 'hover:bg-green-500 text-green-700'}
                  ${toast.type === 'error' && 'hover:bg-red-500 text-red-700'}
                  ${toast.type === 'warning' && 'hover:bg-yellow-500 text-yellow-700'}
                  ${toast.type === 'info' && 'hover:bg-blue-500 text-blue-700'}
                `}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      ))}
    </>
  );
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const dismissAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  const showToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const duration = toast.duration || 5000;
    
    setToasts(prev => [...prev, { ...toast, id }]);

    if (duration > 0) {
      setTimeout(() => {
        dismissToast(id);
      }, duration);
    }

    return id;
  }, [dismissToast]);

  const success = useCallback((message: string, title?: string, options?: Partial<Toast>) => {
    return showToast({ type: 'success', message, title, ...options });
  }, [showToast]);

  const error = useCallback((message: string, title?: string, options?: Partial<Toast>) => {
    return showToast({ type: 'error', message, title, ...options });
  }, [showToast]);

  const info = useCallback((message: string, title?: string, options?: Partial<Toast>) => {
    return showToast({ type: 'info', message, title, ...options });
  }, [showToast]);

  const warning = useCallback((message: string, title?: string, options?: Partial<Toast>) => {
    return showToast({ type: 'warning', message, title, ...options });
  }, [showToast]);

  const value = {
    toasts,
    showToast,
    dismissToast,
    dismissAllToasts,
    success,
    error,
    info,
    warning
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};