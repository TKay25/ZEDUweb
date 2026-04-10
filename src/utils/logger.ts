// ==============================================
// LOGGING UTILITIES
// ==============================================

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: any;
  userId?: string;
  sessionId?: string;
  url?: string;
}

class Logger {
  private static instance: Logger;
  private logs: LogEntry[] = [];
  private maxLogs: number = 1000;
  private isDevelopment: boolean;
  private remoteLoggingEnabled = false;
  private remoteLoggingUrl?: string;

  private constructor() {
    // For Vite - use import.meta.env.DEV
    this.isDevelopment = typeof import.meta !== 'undefined' && import.meta.env?.DEV === true;
  }

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  /**
   * Enable remote logging
   */
  enableRemoteLogging(url: string): void {
    this.remoteLoggingEnabled = true;
    this.remoteLoggingUrl = url;
  }

  /**
   * Disable remote logging
   */
  disableRemoteLogging(): void {
    this.remoteLoggingEnabled = false;
    this.remoteLoggingUrl = undefined;
  }

  /**
   * Set maximum number of logs to keep
   */
  setMaxLogs(max: number): void {
    this.maxLogs = max;
  }

  /**
   * Create a log entry
   */
  private log(level: LogLevel, message: string, data?: any): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
      url: typeof window !== 'undefined' ? window.location.href : undefined,
    };

    // Add to local logs
    this.logs.push(entry);
    
    // Trim logs if needed
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Console output
    this.consoleOutput(entry);

    // Remote logging
    if (this.remoteLoggingEnabled && level !== 'debug') {
      this.remoteLog(entry);
    }
  }

  /**
   * Output to console
   */
  private consoleOutput(entry: LogEntry): void {
    const { level, message, data } = entry;
    const timestamp = new Date(entry.timestamp).toLocaleTimeString();

    switch (level) {
      case 'debug':
        if (this.isDevelopment) {
          console.debug(`[${timestamp}] DEBUG: ${message}`, data || '');
        }
        break;
      case 'info':
        console.info(`[${timestamp}] INFO: ${message}`, data || '');
        break;
      case 'warn':
        console.warn(`[${timestamp}] WARN: ${message}`, data || '');
        break;
      case 'error':
        console.error(`[${timestamp}] ERROR: ${message}`, data || '');
        break;
    }
  }

  /**
   * Send log to remote server
   */
  private async remoteLog(entry: LogEntry): Promise<void> {
    if (!this.remoteLoggingUrl) return;

    try {
      const response = await fetch(this.remoteLoggingUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry),
        keepalive: true,
      });
      
      if (!response.ok) {
        console.error('Failed to send log to remote server:', response.statusText);
      }
    } catch (error) {
      // Silent fail - don't create infinite loops
    }
  }

  /**
   * Debug level log
   */
  debug(message: string, data?: any): void {
    this.log('debug', message, data);
  }

  /**
   * Info level log
   */
  info(message: string, data?: any): void {
    this.log('info', message, data);
  }

  /**
   * Warning level log
   */
  warn(message: string, data?: any): void {
    this.log('warn', message, data);
  }

  /**
   * Error level log
   */
  error(message: string, data?: any): void {
    this.log('error', message, data);
  }

  /**
   * Get all logs
   */
  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  /**
   * Get logs by level
   */
  getLogsByLevel(level: LogLevel): LogEntry[] {
    return this.logs.filter((log) => log.level === level);
  }

  /**
   * Get recent logs
   */
  getRecentLogs(count: number = 50): LogEntry[] {
    return this.logs.slice(-count);
  }

  /**
   * Clear all logs
   */
  clearLogs(): void {
    this.logs = [];
  }

  /**
   * Export logs as JSON
   */
  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  /**
   * Download logs as file
   */
  downloadLogs(): void {
    const blob = new Blob([this.exportLogs()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `logs-${new Date().toISOString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
}

// Export singleton instance
export const logger = Logger.getInstance();

/**
 * Performance logger
 */
export const perfLogger = {
  /**
   * Start a performance measurement
   */
  start(label: string): () => number {
    const start = performance.now();
    
    return (): number => {
      const duration = performance.now() - start;
      logger.debug(`Performance [${label}]`, { duration: `${duration.toFixed(2)}ms` });
      return duration;
    };
  },

  /**
   * Measure async function execution time
   */
  async measure<T>(label: string, fn: () => Promise<T>): Promise<T> {
    const end = this.start(label);
    try {
      const result = await fn();
      end();
      return result;
    } catch (error) {
      end();
      throw error;
    }
  },

  /**
   * Measure synchronous function execution time
   */
  measureSync<T>(label: string, fn: () => T): T {
    const end = this.start(label);
    try {
      const result = fn();
      end();
      return result;
    } catch (error) {
      end();
      throw error;
    }
  },
};

/**
 * API request logger
 */
export const apiLogger = {
  /**
   * Log API request
   */
  logRequest(method: string, url: string, data?: any): void {
    logger.debug(`API Request: ${method} ${url}`, { data });
  },

  /**
   * Log API response
   */
  logResponse(method: string, url: string, status: number, data?: any, duration?: number): void {
    const level = status >= 400 ? 'warn' : 'info';
    logger[level](`API Response: ${method} ${url} [${status}]${duration ? ` (${duration}ms)` : ''}`, { data });
  },

  /**
   * Log API error
   */
  logError(method: string, url: string, error: any): void {
    logger.error(`API Error: ${method} ${url}`, { error });
  },
};

/**
 * User action logger
 */
export const actionLogger = {
  /**
   * Log user action
   */
  logAction(action: string, userId?: string, data?: any): void {
    logger.info(`User Action: ${action}`, { userId, ...data });
  },

  /**
   * Log page view
   */
  logPageView(url: string, userId?: string): void {
    logger.info(`Page View: ${url}`, { userId });
  },

  /**
   * Log feature usage
   */
  logFeature(feature: string, userId?: string, data?: any): void {
    logger.info(`Feature Used: ${feature}`, { userId, ...data });
  },
};

// Note: No need to redeclare ImportMeta or ImportMetaEnv here
// Vite already provides these types. If you need to add custom environment variables,
// you can augment the ImportMetaEnv interface like this:

/**
 * Augment the Vite ImportMetaEnv interface with your custom environment variables
 * This is the correct way to add type definitions for custom env vars
 */
interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  readonly VITE_SOCKET_URL?: string;
  // Add any other custom environment variables here
  readonly DEV: boolean;
  readonly PROD: boolean;
  readonly MODE: string;
  readonly BASE_URL: string;
  readonly SSR: boolean;
}

// This augments the existing ImportMeta interface (don't redeclare it)
interface ImportMeta {
  readonly env: ImportMetaEnv;
}