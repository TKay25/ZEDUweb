// ==============================================
// GENERAL HELPER FUNCTIONS
// ==============================================

import { clsx, type ClassValue } from 'clsx';
// Remove tailwind-merge import if not installed, or install it first
// For now, we'll use clsx directly without tailwind-merge
// import { twMerge } from 'tailwind-merge';

/**
 * Combines class names with Tailwind CSS support
 * Note: Install tailwind-merge for full Tailwind support: npm install tailwind-merge
 */
export function cn(...inputs: ClassValue[]) {
  // If tailwind-merge is not available, just use clsx
  return clsx(inputs);
  // To use tailwind-merge: return twMerge(clsx(inputs));
}

/**
 * Debounces a function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return function(...args: Parameters<T>) {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Throttles a function
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return function(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Deep clones an object
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Deep merges two objects
 */
export function deepMerge<T extends Record<string, any>, U extends Record<string, any>>(
  target: T,
  source: U
): T & U {
  const output = { ...target } as any;
  
  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      if (
        isObject(source[key]) &&
        isObject(target[key as keyof T])
      ) {
        output[key] = deepMerge(target[key as keyof T] as any, source[key]);
      } else {
        output[key] = source[key];
      }
    }
  }
  
  return output;
}

/**
 * Checks if value is an object
 */
export function isObject(value: any): value is object {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

/**
 * Checks if value is empty (null, undefined, empty string, empty array, empty object)
 */
export function isEmpty(value: any): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (isObject(value)) return Object.keys(value).length === 0;
  return false;
}

/**
 * Generates a unique ID
 */
export function generateId(prefix: string = ''): string {
  return `${prefix}${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}

/**
 * Truncates text to a specified length
 */
export function truncate(text: string, length: number, suffix: string = '...'): string {
  if (text.length <= length) return text;
  return text.substring(0, length) + suffix;
}

/**
 * Capitalizes the first letter of a string
 */
export function capitalize(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Capitalizes each word in a string
 */
export function capitalizeWords(str: string): string {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
}

/**
 * Converts a string to title case
 */
export function toTitleCase(str: string): string {
  return str.replace(
    /\w\S*/g,
    (word) => word.charAt(0).toUpperCase() + word.substring(1).toLowerCase()
  );
}

/**
 * Converts a string to camelCase
 */
export function toCamelCase(str: string): string {
  return str
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
    .replace(/^[A-Z]/, (chr) => chr.toLowerCase());
}

/**
 * Converts a string to snake_case
 */
export function toSnakeCase(str: string): string {
  return str
    .replace(/([A-Z])/g, '_$1')
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .replace(/^_|_$/g, '');
}

/**
 * Converts a string to kebab-case
 */
export function toKebabCase(str: string): string {
  return str
    .replace(/([A-Z])/g, '-$1')
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Pluralizes a word based on count
 */
export function pluralize(count: number, singular: string, plural?: string): string {
  if (count === 1) return singular;
  return plural || `${singular}s`;
}

/**
 * Masks a string (e.g., for credit cards, emails)
 */
export function maskString(
  str: string,
  visibleChars: number = 4,
  maskChar: string = '*'
): string {
  if (str.length <= visibleChars) return str;
  const visible = str.slice(-visibleChars);
  const masked = maskChar.repeat(str.length - visibleChars);
  return masked + visible;
}

/**
 * Masks an email address
 */
export function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  const maskedLocal = local.charAt(0) + '*'.repeat(local.length - 2) + local.charAt(local.length - 1);
  return `${maskedLocal}@${domain}`;
}

/**
 * Extracts initials from a name
 */
export function getInitials(name: string, max: number = 2): string {
  return name
    .split(' ')
    .map((n) => n.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, max);
}

/**
 * Generates a random color based on a string
 */
export function stringToColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = hash % 360;
  return `hsl(${hue}, 70%, 50%)`;
}

/**
 * Checks if a value is a valid URL
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Extracts domain from a URL
 */
export function getDomainFromUrl(url: string): string {
  try {
    const { hostname } = new URL(url);
    return hostname.replace('www.', '');
  } catch {
    return url;
  }
}

/**
 * Creates a query string from an object
 */
export function createQueryString(params: Record<string, any>): string {
  const searchParams = new URLSearchParams();
  
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value)) {
        value.forEach((v) => searchParams.append(key, v));
      } else {
        searchParams.append(key, value);
      }
    }
  }
  
  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
}

/**
 * Parses a query string into an object
 */
export function parseQueryString(queryString: string): Record<string, any> {
  const params = new URLSearchParams(queryString);
  const result: Record<string, any> = {};
  
  for (const [key, value] of params.entries()) {
    if (Object.prototype.hasOwnProperty.call(result, key)) {
      if (!Array.isArray(result[key])) {
        result[key] = [result[key]];
      }
      result[key].push(value);
    } else {
      result[key] = value;
    }
  }
  
  return result;
}

/**
 * Copies text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for older browsers
    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      return true;
    } catch {
      return false;
    }
  }
}

/**
 * Downloads a file from a URL
 */
export function downloadFile(url: string, filename?: string): void {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename || url.split('/').pop() || 'download';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Downloads content as a file
 */
export function downloadAsFile(content: string | Blob, filename: string): void {
  const blob = typeof content === 'string' ? new Blob([content]) : content;
  const url = URL.createObjectURL(blob);
  downloadFile(url, filename);
  URL.revokeObjectURL(url);
}

/**
 * Opens a URL in a new tab
 */
export function openInNewTab(url: string): void {
  window.open(url, '_blank', 'noopener,noreferrer');
}

/**
 * Scrolls to an element
 */
export function scrollToElement(elementId: string, offset: number = 0): void {
  const element = document.getElementById(elementId);
  if (element) {
    const y = element.getBoundingClientRect().top + window.pageYOffset + offset;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }
}

/**
 * Detects if the device is mobile
 */
export function isMobile(): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

/**
 * Detects if the device is iOS
 */
export function isIOS(): boolean {
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
}

/**
 * Detects if the device is Android
 */
export function isAndroid(): boolean {
  return /Android/.test(navigator.userAgent);
}

/**
 * Detects if the browser is Safari
 */
export function isSafari(): boolean {
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
}

/**
 * Detects if the browser is in dark mode
 */
export function isDarkMode(): boolean {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

/**
 * Detects if the browser supports touch
 */
export function isTouchDevice(): boolean {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

/**
 * Gets the browser language
 */
export function getBrowserLanguage(): string {
  return navigator.language.split('-')[0];
}

/**
 * Waits for a specified time
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Retries a function with exponential backoff
 */
export async function retry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      const delay = baseDelay * Math.pow(2, i);
      await sleep(delay);
    }
  }
  
  throw lastError!;
}

/**
 * Measures the execution time of a function
 */
export async function measureTime<T>(
  fn: () => Promise<T>,
  label: string = 'Execution time'
): Promise<T> {
  const start = performance.now();
  const result = await fn();
  const end = performance.now();
  console.log(`${label}: ${(end - start).toFixed(2)}ms`);
  return result;
}

/**
 * Creates a memoized version of a function
 */
export function memoize<T extends (...args: any[]) => any>(
  fn: T,
  keyGenerator?: (...args: Parameters<T>) => string
): T {
  const cache = new Map<string, ReturnType<T>>();
  
  return ((...args: Parameters<T>) => {
    const key = keyGenerator ? keyGenerator(...args) : JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
}

/**
 * Groups an array of objects by a key
 */
export function groupBy<T>(
  array: T[],
  key: keyof T | ((item: T) => string)
): Record<string, T[]> {
  return array.reduce((groups, item) => {
    const groupKey = typeof key === 'function' ? key(item) : String(item[key]);
    groups[groupKey] = groups[groupKey] || [];
    groups[groupKey].push(item);
    return groups;
  }, {} as Record<string, T[]>);
}

/**
 * Sorts an array of objects by a key
 */
export function sortBy<T>(
  array: T[],
  key: keyof T | ((item: T) => any),
  direction: 'asc' | 'desc' = 'asc'
): T[] {
  const sorted = [...array].sort((a, b) => {
    const aValue = typeof key === 'function' ? key(a) : a[key];
    const bValue = typeof key === 'function' ? key(b) : b[key];
    
    if (direction === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return bValue < aValue ? -1 : bValue > aValue ? 1 : 0;
    }
  });
  
  return sorted;
}

/**
 * Filters an array of objects by a search term
 */
export function searchBy<T>(
  array: T[],
  searchTerm: string,
  keys: (keyof T)[]
): T[] {
  const term = searchTerm.toLowerCase();
  
  return array.filter((item) =>
    keys.some((key) =>
      String(item[key]).toLowerCase().includes(term)
    )
  );
}

/**
 * Paginates an array
 */
export function paginate<T>(
  array: T[],
  page: number,
  perPage: number
): { items: T[]; total: number; totalPages: number } {
  const start = (page - 1) * perPage;
  const end = start + perPage;
  const items = array.slice(start, end);
  const total = array.length;
  const totalPages = Math.ceil(total / perPage);
  
  return { items, total, totalPages };
}

/**
 * Chunks an array into smaller arrays
 */
export function chunk<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  
  return chunks;
}

/**
 * Removes duplicates from an array
 */
export function uniqueBy<T>(
  array: T[],
  key: keyof T | ((item: T) => any)
): T[] {
  const seen = new Set();
  
  return array.filter((item) => {
    const value = typeof key === 'function' ? key(item) : item[key];
    if (seen.has(value)) return false;
    seen.add(value);
    return true;
  });
}

/**
 * Flattens a nested array
 */
export function flatten<T>(array: any[]): T[] {
  return array.reduce((acc, val) => 
    Array.isArray(val) ? acc.concat(flatten(val)) : acc.concat(val), []
  );
}

/**
 * Zips multiple arrays together
 */
export function zip<T>(...arrays: T[][]): T[][] {
  const length = Math.min(...arrays.map((arr) => arr.length));
  const result: T[][] = [];
  
  for (let i = 0; i < length; i++) {
    result.push(arrays.map((arr) => arr[i]));
  }
  
  return result;
}

/**
 * Creates a range of numbers
 */
export function range(start: number, end: number, step: number = 1): number[] {
  const result: number[] = [];
  
  for (let i = start; i <= end; i += step) {
    result.push(i);
  }
  
  return result;
}

/**
 * Shuffles an array (Fisher-Yates algorithm)
 */
export function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  return shuffled;
}

/**
 * Samples a random element from an array
 */
export function sample<T>(array: T[]): T | undefined {
  if (array.length === 0) return undefined;
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Samples multiple random elements from an array
 */
export function sampleSize<T>(array: T[], size: number): T[] {
  const shuffled = shuffle(array);
  return shuffled.slice(0, Math.min(size, array.length));
}

/**
 * Sums an array of numbers
 */
export function sum(array: number[]): number {
  return array.reduce((acc, val) => acc + val, 0);
}

/**
 * Averages an array of numbers
 */
export function average(array: number[]): number {
  if (array.length === 0) return 0;
  return sum(array) / array.length;
}

/**
 * Finds the median of an array of numbers
 */
export function median(array: number[]): number {
  if (array.length === 0) return 0;
  
  const sorted = [...array].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  
  if (sorted.length % 2 === 0) {
    return (sorted[middle - 1] + sorted[middle]) / 2;
  }
  
  return sorted[middle];
}

/**
 * Finds the mode of an array
 */
export function mode<T>(array: T[]): T | undefined {
  const counts = new Map<T, number>();
  let maxCount = 0;
  let mode: T | undefined;
  
  for (const item of array) {
    const count = (counts.get(item) || 0) + 1;
    counts.set(item, count);
    
    if (count > maxCount) {
      maxCount = count;
      mode = item;
    }
  }
  
  return mode;
}

/**
 * Calculates the standard deviation of an array of numbers
 */
export function standardDeviation(array: number[]): number {
  if (array.length === 0) return 0;
  
  const avg = average(array);
  const squareDiffs = array.map((value) => Math.pow(value - avg, 2));
  const avgSquareDiff = average(squareDiffs);
  
  return Math.sqrt(avgSquareDiff);
}

/**
 * Checks if a number is between two values
 */
export function isBetween(value: number, min: number, max: number, inclusive: boolean = true): boolean {
  if (inclusive) {
    return value >= min && value <= max;
  }
  return value > min && value < max;
}

/**
 * Clamps a number between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Maps a value from one range to another
 */
export function mapRange(
  value: number,
  fromMin: number,
  fromMax: number,
  toMin: number,
  toMax: number
): number {
  return ((value - fromMin) * (toMax - toMin)) / (fromMax - fromMin) + toMin;
}

/**
 * Rounds a number to a specified number of decimal places
 */
export function round(value: number, decimals: number = 0): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

/**
 * Formats a number with thousand separators
 */
export function formatNumber(value: number, locale: string = 'en-US'): string {
  return new Intl.NumberFormat(locale).format(value);
}

/**
 * Formats a percentage
 */
export function formatPercentage(value: number, decimals: number = 0): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

/**
 * Calculates the percentage of a value
 */
export function percentage(value: number, total: number): number {
  if (total === 0) return 0;
  return (value / total) * 100;
}

/**
 * Calculates the difference between two numbers as a percentage
 */
export function percentChange(oldValue: number, newValue: number): number {
  if (oldValue === 0) return newValue > 0 ? 100 : 0;
  return ((newValue - oldValue) / oldValue) * 100;
}

/**
 * Checks if a value is a number
 */
export function isNumber(value: any): value is number {
  return typeof value === 'number' && !isNaN(value);
}

/**
 * Checks if a value is a string
 */
export function isString(value: any): value is string {
  return typeof value === 'string';
}

/**
 * Checks if a value is a boolean
 */
export function isBoolean(value: any): value is boolean {
  return typeof value === 'boolean';
}

/**
 * Checks if a value is a function
 */
export function isFunction(value: any): value is Function {
  return typeof value === 'function';
}

/**
 * Checks if a value is a promise
 */
export function isPromise(value: any): value is Promise<any> {
  return value && typeof value.then === 'function';
}

/**
 * Checks if a value is a date
 */
export function isDate(value: any): value is Date {
  return value instanceof Date && !isNaN(value.getTime());
}

/**
 * Checks if a value is an array
 */
export function isArray(value: any): value is any[] {
  return Array.isArray(value);
}

/**
 * Checks if a value is a regular expression
 */
export function isRegExp(value: any): value is RegExp {
  return value instanceof RegExp;
}

/**
 * Checks if a value is an error
 */
export function isError(value: any): value is Error {
  return value instanceof Error;
}

/**
 * Gets the type of a value
 */
export function getType(value: any): string {
  if (value === null) return 'null';
  if (value === undefined) return 'undefined';
  if (isArray(value)) return 'array';
  if (isDate(value)) return 'date';
  if (isRegExp(value)) return 'regexp';
  if (isError(value)) return 'error';
  if (isPromise(value)) return 'promise';
  return typeof value;
}