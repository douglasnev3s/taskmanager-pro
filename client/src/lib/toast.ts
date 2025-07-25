import toast, { ToastOptions } from 'react-hot-toast';

import { ApiError } from '@/types/task';

const defaultOptions: ToastOptions = {
  duration: 4000,
  position: 'top-right',
};

export const showToast = {
  success: (message: string, options?: ToastOptions) => {
    toast.success(message, { ...defaultOptions, ...options });
  },

  error: (message: string, options?: ToastOptions) => {
    toast.error(message, { ...defaultOptions, ...options });
  },

  loading: (message: string, options?: ToastOptions) => {
    return toast.loading(message, { ...defaultOptions, ...options });
  },

  promise: <T>(
    promise: Promise<T>,
    {
      loading,
      success,
      error,
    }: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: any) => string);
    },
    options?: ToastOptions
  ) => {
    return toast.promise(
      promise,
      {
        loading,
        success,
        error,
      },
      { ...defaultOptions, ...options }
    );
  },

  dismiss: (toastId?: string) => {
    if (toastId) {
      toast.dismiss(toastId);
    } else {
      toast.dismiss();
    }
  },
};

// Helper to format API errors for user-friendly messages
export const formatApiError = (error: ApiError): string => {
  if (error.isNetworkError) {
    return 'Network error. Please check your connection and try again.';
  }
  
  if (error.isTimeoutError) {
    return 'Request timed out. Please try again.';
  }
  
  if (error.status === 400) {
    return error.data?.error || 'Invalid request. Please check your input.';
  }
  
  if (error.status === 404) {
    return 'Resource not found.';
  }
  
  if (error.status === 500) {
    return 'Server error. Please try again later.';
  }
  
  return error.message || 'An unexpected error occurred.';
};

export default showToast;