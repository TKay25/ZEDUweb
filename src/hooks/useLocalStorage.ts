import { useState, useEffect, useCallback } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  // Get from local storage then parse stored json or return initialValue
  const readValue = useCallback((): T => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  }, [initialValue, key]);

  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(readValue);

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = useCallback((value: T | ((val: T) => T)) => {
    if (typeof window === 'undefined') {
      console.warn(`Tried setting localStorage key "${key}" even though environment is not a client`);
    }

    try {
      // Allow value to be a function so we have same API as useState
      const newValue = value instanceof Function ? value(storedValue) : value;

      // Save to local storage
      window.localStorage.setItem(key, JSON.stringify(newValue));

      // Save state
      setStoredValue(newValue);

      // Dispatch a custom event so other tabs can update
      window.dispatchEvent(new Event('local-storage'));
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  // Listen for changes to this localStorage key in other tabs/windows
  useEffect(() => {
    const handleStorageChange = () => {
      setStoredValue(readValue());
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('local-storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('local-storage', handleStorageChange);
    };
  }, [readValue]);

  return [storedValue, setValue] as const;
}

// Hook for managing multiple related localStorage items
export function useLocalStorageObject<T extends Record<string, any>>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useLocalStorage(key, initialValue);

  const updateValue = useCallback(<K extends keyof T>(field: K, value: T[K]) => {
    setStoredValue(prev => ({ ...prev, [field]: value }));
  }, [setStoredValue]);

  const updateMultiple = useCallback((values: Partial<T>) => {
    setStoredValue(prev => ({ ...prev, ...values }));
  }, [setStoredValue]);

  const resetValue = useCallback(() => {
    setStoredValue(initialValue);
  }, [setStoredValue, initialValue]);

  return {
    value: storedValue,
    updateValue,
    updateMultiple,
    resetValue,
    setStoredValue
  };
}

// Hook for managing localStorage with expiration
export function useLocalStorageWithExpiry<T>(key: string, initialValue: T, expiryMs: number) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue;

    try {
      const item = window.localStorage.getItem(key);
      if (!item) return initialValue;

      const { value, expiry } = JSON.parse(item);
      if (expiry && Date.now() > expiry) {
        window.localStorage.removeItem(key);
        return initialValue;
      }

      return value as T;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const newValue = value instanceof Function ? value(storedValue) : value;
      const expiry = Date.now() + expiryMs;

      window.localStorage.setItem(key, JSON.stringify({ value: newValue, expiry }));
      setStoredValue(newValue);
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue, expiryMs]);

  return [storedValue, setValue] as const;
}