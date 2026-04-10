import { useState, useEffect, useCallback, useRef } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Hook for debouncing functions
export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
  deps: any[] = []
): T {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [delay, ...deps]
  ) as T;
}

// Hook for debouncing with leading/trailing options
export function useAdvancedDebounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
  options: { leading?: boolean; trailing?: boolean } = {}
) {
  const { leading = false, trailing = true } = options;
  
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const lastArgsRef = useRef<Parameters<T> | undefined>(undefined);
  const lastCallTimeRef = useRef<number>(0);

  const debounced = useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();

      if (leading && now - lastCallTimeRef.current > delay) {
        callback(...args);
        lastCallTimeRef.current = now;
        return;
      }

      lastArgsRef.current = args;

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      if (trailing) {
        timeoutRef.current = setTimeout(() => {
          if (lastArgsRef.current) {
            callback(...lastArgsRef.current);
            lastCallTimeRef.current = Date.now();
          }
        }, delay);
      }
    },
    [callback, delay, leading, trailing]
  );

  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  const flush = useCallback(() => {
    if (timeoutRef.current && lastArgsRef.current) {
      clearTimeout(timeoutRef.current);
      callback(...lastArgsRef.current);
      lastCallTimeRef.current = Date.now();
    }
  }, [callback]);

  return { debounced, cancel, flush };
}