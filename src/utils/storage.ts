// ==============================================
// STORAGE UTILITIES
// ==============================================

import { STORAGE_KEYS } from './constants';

/**
 * Local storage wrapper with type safety
 */
export const storage = {
  /**
   * Set an item in localStorage
   */
  set: <T>(key: string, value: T): void => {
    try {
      const serialized = JSON.stringify(value);
      localStorage.setItem(key, serialized);
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  },

  /**
   * Get an item from localStorage
   */
  get: <T>(key: string, defaultValue?: T): T | undefined => {
    try {
      const item = localStorage.getItem(key);
      if (item === null) return defaultValue;
      return JSON.parse(item) as T;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return defaultValue;
    }
  },

  /**
   * Remove an item from localStorage
   */
  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  },

  /**
   * Clear all items from localStorage
   */
  clear: (): void => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  },

  /**
   * Check if an item exists in localStorage
   */
  has: (key: string): boolean => {
    return localStorage.getItem(key) !== null;
  },

  /**
   * Get all keys in localStorage
   */
  keys: (): string[] => {
    return Object.keys(localStorage);
  },

  /**
   * Get the size of localStorage in bytes
   */
  size: (): number => {
    let total = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const value = localStorage.getItem(key);
        if (value) {
          total += value.length * 2; // Approximate size in bytes (UTF-16)
        }
      }
    }
    return total;
  },
};

/**
 * Session storage wrapper with type safety
 */
export const sessionStorage = {
  set: <T>(key: string, value: T): void => {
    try {
      const serialized = JSON.stringify(value);
      window.sessionStorage.setItem(key, serialized);
    } catch (error) {
      console.error('Error saving to sessionStorage:', error);
    }
  },

  get: <T>(key: string, defaultValue?: T): T | undefined => {
    try {
      const item = window.sessionStorage.getItem(key);
      if (item === null) return defaultValue;
      return JSON.parse(item) as T;
    } catch (error) {
      console.error('Error reading from sessionStorage:', error);
      return defaultValue;
    }
  },

  remove: (key: string): void => {
    try {
      window.sessionStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from sessionStorage:', error);
    }
  },

  clear: (): void => {
    try {
      window.sessionStorage.clear();
    } catch (error) {
      console.error('Error clearing sessionStorage:', error);
    }
  },

  has: (key: string): boolean => {
    return window.sessionStorage.getItem(key) !== null;
  },
};

/**
 * Cookie utilities
 */
export const cookies = {
  /**
   * Set a cookie
   */
  set: (
    name: string,
    value: string,
    options: {
      expires?: number | Date;
      path?: string;
      domain?: string;
      secure?: boolean;
      sameSite?: 'strict' | 'lax' | 'none';
    } = {}
  ): void => {
    let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;
    
    if (options.expires) {
      if (typeof options.expires === 'number') {
        const date = new Date();
        date.setTime(date.getTime() + options.expires * 24 * 60 * 60 * 1000);
        cookieString += `; expires=${date.toUTCString()}`;
      } else {
        cookieString += `; expires=${options.expires.toUTCString()}`;
      }
    }
    
    if (options.path) {
      cookieString += `; path=${options.path}`;
    }
    
    if (options.domain) {
      cookieString += `; domain=${options.domain}`;
    }
    
    if (options.secure) {
      cookieString += '; secure';
    }
    
    if (options.sameSite) {
      cookieString += `; samesite=${options.sameSite}`;
    }
    
    document.cookie = cookieString;
  },

  /**
   * Get a cookie value
   */
  get: (name: string): string | null => {
    const cookies = document.cookie.split('; ');
    const cookie = cookies.find((c) => c.startsWith(`${name}=`));
    if (!cookie) return null;
    return decodeURIComponent(cookie.split('=')[1]);
  },

  /**
   * Remove a cookie
   */
  remove: (name: string, options: { path?: string; domain?: string } = {}): void => {
    cookies.set(name, '', { ...options, expires: new Date(0) });
  },

  /**
   * Check if a cookie exists
   */
  has: (name: string): boolean => {
    return cookies.get(name) !== null;
  },

  /**
   * Get all cookies
   */
  getAll: (): Record<string, string> => {
    return document.cookie.split('; ').reduce((acc, cookie) => {
      const [key, value] = cookie.split('=');
      if (key && value) {
        acc[decodeURIComponent(key)] = decodeURIComponent(value);
      }
      return acc;
    }, {} as Record<string, string>);
  },
};

/**
 * Cache utilities with expiration
 */
export const cache = {
  /**
   * Set a cached item with expiration
   */
  set: <T>(key: string, value: T, ttlMs: number = 5 * 60 * 1000): void => {
    const item = {
      value,
      expires: Date.now() + ttlMs,
    };
    storage.set(key, item);
  },

  /**
   * Get a cached item if not expired
   */
  get: <T>(key: string): T | null => {
    const item = storage.get<{ value: T; expires: number }>(key);
    
    if (!item) return null;
    
    if (Date.now() > item.expires) {
      storage.remove(key);
      return null;
    }
    
    return item.value;
  },

  /**
   * Remove a cached item
   */
  remove: (key: string): void => {
    storage.remove(key);
  },

  /**
   * Clear all cached items
   */
  clear: (): void => {
    storage.clear();
  },

  /**
   * Get all cached items (including expired)
   */
  getAll: <T>(): Record<string, T> => {
    const items: Record<string, T> = {};
    
    for (const key of storage.keys()) {
      const item = cache.get<T>(key);
      if (item !== null) {
        items[key] = item;
      }
    }
    
    return items;
  },

  /**
   * Remove expired items
   */
  cleanup: (): void => {
    for (const key of storage.keys()) {
      const item = storage.get<{ value: any; expires: number }>(key);
      if (item && Date.now() > item.expires) {
        storage.remove(key);
      }
    }
  },
};

/**
 * IndexedDB wrapper for larger storage
 */
export class IndexedDBStorage {
  private dbName: string;
  private storeName: string;
  private db: IDBDatabase | null = null;

  constructor(dbName: string, storeName: string = 'default') {
    this.dbName = dbName;
    this.storeName = storeName;
  }

  /**
   * Initialize the database
   */
  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName, { keyPath: 'id' });
        }
      };
    });
  }

  /**
   * Set an item
   */
  async set<T>(id: string, value: T): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.put({ id, value });

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  /**
   * Get an item
   */
  async get<T>(id: string): Promise<T | null> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.get(id);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        resolve(request.result?.value || null);
      };
    });
  }

  /**
   * Remove an item
   */
  async remove(id: string): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.delete(id);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  /**
   * Clear all items
   */
  async clear(): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.clear();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  /**
   * Get all items
   */
  async getAll<T>(): Promise<Map<string, T>> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.getAll();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const items = new Map<string, T>();
        request.result.forEach((item: { id: string; value: T }) => {
          items.set(item.id, item.value);
        });
        resolve(items);
      };
    });
  }

  /**
   * Get multiple items by ids
   */
  async getMany<T>(ids: string[]): Promise<Map<string, T>> {
    const items = new Map<string, T>();
    
    for (const id of ids) {
      const item = await this.get<T>(id);
      if (item !== null) {
        items.set(id, item);
      }
    }
    
    return items;
  }

  /**
   * Set multiple items
   */
  async setMany<T>(items: Map<string, T>): Promise<void> {
    for (const [id, value] of items) {
      await this.set(id, value);
    }
  }

  /**
   * Remove multiple items
   */
  async removeMany(ids: string[]): Promise<void> {
    for (const id of ids) {
      await this.remove(id);
    }
  }

  /**
   * Check if an item exists
   */
  async has(id: string): Promise<boolean> {
    const item = await this.get(id);
    return item !== null;
  }

  /**
   * Get the number of items
   */
  async count(): Promise<number> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.count();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }
}

/**
 * Memory cache for temporary storage
 */
export class MemoryCache<T = any> {
  private cache: Map<string, { value: T; expires: number }> = new Map();

  /**
   * Set a value with optional TTL
   */
  set(key: string, value: T, ttlMs?: number): void {
    this.cache.set(key, {
      value,
      expires: ttlMs ? Date.now() + ttlMs : Infinity,
    });
  }

  /**
   * Get a value
   */
  get(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) return null;
    
    if (item.expires < Date.now()) {
      this.cache.delete(key);
      return null;
    }
    
    return item.value;
  }

  /**
   * Check if a key exists and is not expired
   */
  has(key: string): boolean {
    const item = this.cache.get(key);
    if (!item) return false;
    if (item.expires < Date.now()) {
      this.cache.delete(key);
      return false;
    }
    return true;
  }

  /**
   * Remove a value
   */
  remove(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Clear all values
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get all keys
   */
  keys(): string[] {
    return Array.from(this.cache.keys());
  }

  /**
   * Get all values
   */
  values(): T[] {
    return Array.from(this.cache.values())
      .filter((item) => item.expires >= Date.now())
      .map((item) => item.value);
  }

  /**
   * Get the number of items
   */
  size(): number {
    return this.values().length;
  }

  /**
   * Remove expired items
   */
  cleanup(): void {
    for (const [key, item] of this.cache.entries()) {
      if (item.expires < Date.now()) {
        this.cache.delete(key);
      }
    }
  }
}

/**
 * Auth token storage
 */
export const tokenStorage = {
  /**
   * Set access token
   */
  setAccessToken: (token: string, remember: boolean = false): void => {
    if (remember) {
      storage.set(STORAGE_KEYS.ACCESS_TOKEN, token);
    } else {
      sessionStorage.set(STORAGE_KEYS.ACCESS_TOKEN, token);
    }
  },

  /**
   * Get access token
   */
  getAccessToken: (): string | null => {
    return storage.get<string>(STORAGE_KEYS.ACCESS_TOKEN) ||
           sessionStorage.get<string>(STORAGE_KEYS.ACCESS_TOKEN) ||
           null;
  },

  /**
   * Remove access token
   */
  removeAccessToken: (): void => {
    storage.remove(STORAGE_KEYS.ACCESS_TOKEN);
    sessionStorage.remove(STORAGE_KEYS.ACCESS_TOKEN);
  },

  /**
   * Set refresh token
   */
  setRefreshToken: (token: string, remember: boolean = false): void => {
    if (remember) {
      storage.set(STORAGE_KEYS.REFRESH_TOKEN, token);
    } else {
      sessionStorage.set(STORAGE_KEYS.REFRESH_TOKEN, token);
    }
  },

  /**
   * Get refresh token
   */
  getRefreshToken: (): string | null => {
    return storage.get<string>(STORAGE_KEYS.REFRESH_TOKEN) ||
           sessionStorage.get<string>(STORAGE_KEYS.REFRESH_TOKEN) ||
           null;
  },

  /**
   * Remove refresh token
   */
  removeRefreshToken: (): void => {
    storage.remove(STORAGE_KEYS.REFRESH_TOKEN);
    sessionStorage.remove(STORAGE_KEYS.REFRESH_TOKEN);
  },

  /**
   * Clear all auth tokens
   */
  clear: (): void => {
    tokenStorage.removeAccessToken();
    tokenStorage.removeRefreshToken();
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: (): boolean => {
    return tokenStorage.getAccessToken() !== null;
  },
};

/**
 * User preferences storage
 */
export const preferencesStorage = {
  /**
   * Set a preference
   */
  set: <T>(key: string, value: T): void => {
    const prefs = storage.get<Record<string, any>>(STORAGE_KEYS.PREFERENCES, {}) || {};
    prefs[key] = value;
    storage.set(STORAGE_KEYS.PREFERENCES, prefs);
  },

  /**
   * Get a preference
   */
  get: <T>(key: string, defaultValue?: T): T | undefined => {
    const prefs = storage.get<Record<string, any>>(STORAGE_KEYS.PREFERENCES, {}) || {};
    return prefs[key] !== undefined ? prefs[key] as T : defaultValue;
  },

  /**
   * Get all preferences
   */
  getAll: <T>(): T => {
    const prefs = storage.get<T>(STORAGE_KEYS.PREFERENCES, {} as T);
    return prefs || ({} as T);
  },

  /**
   * Remove a preference
   */
  remove: (key: string): void => {
    const prefs = storage.get<Record<string, any>>(STORAGE_KEYS.PREFERENCES, {}) || {};
    delete prefs[key];
    storage.set(STORAGE_KEYS.PREFERENCES, prefs);
  },

  /**
   * Clear all preferences
   */
  clear: (): void => {
    storage.remove(STORAGE_KEYS.PREFERENCES);
  },
};