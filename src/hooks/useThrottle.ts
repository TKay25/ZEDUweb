import { useState, useEffect, useCallback, useRef } from 'react';

export function useThrottle<T>(value: T, limit: number): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastRan = useRef(Date.now());

  useEffect(() => {
    const handler = setTimeout(() => {
      if (Date.now() - lastRan.current >= limit) {
        setThrottledValue(value);
        lastRan.current = Date.now();
      }
    }, limit - (Date.now() - lastRan.current));

    return () => {
      clearTimeout(handler);
    };
  }, [value, limit]);

  return throttledValue;
}

// Hook for throttling functions
export function useThrottledCallback<T extends (...args: any[]) => any>(
  callback: T,
  limit: number,
  options: { leading?: boolean; trailing?: boolean } = {}
): T {
  const { leading = true, trailing = true } = options;
  
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const lastArgsRef = useRef<Parameters<T> | undefined>(undefined);
  const lastRanRef = useRef<number>(0);

  const throttled = useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();

      if (leading && now - lastRanRef.current >= limit) {
        callback(...args);
        lastRanRef.current = now;
      } else {
        lastArgsRef.current = args;
      }

      if (trailing && !timeoutRef.current) {
        timeoutRef.current = setTimeout(() => {
          if (lastArgsRef.current) {
            callback(...lastArgsRef.current);
            lastRanRef.current = Date.now();
            lastArgsRef.current = undefined;
          }
          timeoutRef.current = undefined;
        }, limit - (now - lastRanRef.current));
      }
    },
    [callback, limit, leading, trailing]
  );

  // Remove unused cancel function
  // const cancel = useCallback(() => {
  //   if (timeoutRef.current) {
  //     clearTimeout(timeoutRef.current);
  //     timeoutRef.current = undefined;
  //   }
  // }, []);

  return throttled as T;
}

// Hook for throttling with max wait
export function useMaxWaitThrottle<T extends (...args: any[]) => any>(
  callback: T,
  limit: number,
  maxWait: number
): T {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const lastArgsRef = useRef<Parameters<T> | undefined>(undefined);
  const lastRanRef = useRef<number>(0);
  const firstCallRef = useRef<number>(0);

  const throttled = useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();

      if (!firstCallRef.current) {
        firstCallRef.current = now;
      }

      if (now - lastRanRef.current >= limit) {
        callback(...args);
        lastRanRef.current = now;
        firstCallRef.current = 0;
      } else {
        lastArgsRef.current = args;
      }

      if (!timeoutRef.current) {
        const timeSinceFirstCall = now - firstCallRef.current;
        const timeSinceLastRun = now - lastRanRef.current;
        const waitTime = Math.min(limit - timeSinceLastRun, maxWait - timeSinceFirstCall);

        if (waitTime > 0) {
          timeoutRef.current = setTimeout(() => {
            if (lastArgsRef.current) {
              callback(...lastArgsRef.current);
              lastRanRef.current = Date.now();
              firstCallRef.current = 0;
              lastArgsRef.current = undefined;
            }
            timeoutRef.current = undefined;
          }, waitTime);
        }
      }
    },
    [callback, limit, maxWait]
  );

  // Remove unused cancel function
  // const cancel = useCallback(() => {
  //   if (timeoutRef.current) {
  //     clearTimeout(timeoutRef.current);
  //     timeoutRef.current = undefined;
  //   }
  //   firstCallRef.current = 0;
  // }, []);

  return throttled as T;
}