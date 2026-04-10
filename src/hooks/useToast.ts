import { useContext, useCallback } from 'react';
import { ToastContext } from '../context/ToastContext';

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// Extended toast hook with predefined messages
export const useToastWithPresets = () => {
  const toast = useToast();

  const showSuccess = useCallback((message: string, title?: string) => {
    toast.success(message, title);
  }, [toast]);

  const showError = useCallback((message: string, title?: string) => {
    toast.error(message, title);
  }, [toast]);

  const showInfo = useCallback((message: string, title?: string) => {
    toast.info(message, title);
  }, [toast]);

  const showWarning = useCallback((message: string, title?: string) => {
    toast.warning(message, title);
  }, [toast]);

  const showApiError = useCallback((error: any) => {
    const message = error.response?.data?.message || error.message || 'An error occurred';
    toast.error(message, 'Error');
  }, [toast]);

  const showFormErrors = useCallback((errors: Record<string, string>) => {
    Object.values(errors).forEach(error => {
      toast.error(error, 'Validation Error');
    });
  }, [toast]);

  return {
    ...toast,
    showSuccess,
    showError,
    showInfo,
    showWarning,
    showApiError,
    showFormErrors
  };
};

// Hook for loading states with toast
export const useLoadingToast = () => {
  const toast = useToast();

  const withLoading = useCallback(async <T,>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string;
      error: string;
    }
  ): Promise<T> => {
    const toastId = toast.showToast({
      type: 'info',
      message: messages.loading,
      duration: 0 // Don't auto-dismiss
    });

    try {
      const result = await promise;
      toast.dismissToast(toastId);
      toast.success(messages.success);
      return result;
    } catch (error) {
      toast.dismissToast(toastId);
      toast.error(messages.error);
      throw error;
    }
  }, [toast]);

  return { withLoading };
};