// ==============================================
// FORMATTER FUNCTIONS
// ==============================================

import { format, formatDistance as dateFnsFormatDistance, formatRelative, formatDistanceToNow } from 'date-fns';
import { DATE_FORMATS, CURRENCIES } from './constants';

// Re-export formatDistance with a different name to avoid conflict with our local function
export { dateFnsFormatDistance };

/**
 * Formats a date
 */
export function formatDate(
  date: Date | string | number,
  formatStr: string = DATE_FORMATS.DISPLAY
): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return format(d, formatStr);
}

/**
 * Formats a date with time
 */
export function formatDateTime(
  date: Date | string | number,
  formatStr: string = DATE_FORMATS.DISPLAY_TIME
): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return format(d, formatStr);
}

/**
 * Formats a date relative to now (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: Date | string | number): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return formatDistanceToNow(d, { addSuffix: true });
}

/**
 * Formats a date relative to another date
 */
export function formatDistanceBetween(
  date: Date | string | number,
  baseDate: Date | string | number = new Date()
): string {
  const d1 = typeof date === 'string' ? new Date(date) : date;
  const d2 = typeof baseDate === 'string' ? new Date(baseDate) : baseDate;
  return dateFnsFormatDistance(d1, d2, { addSuffix: true });
}

/**
 * Formats a date in a calendar format
 */
export function formatCalendar(
  date: Date | string | number,
  baseDate: Date | string | number = new Date()
): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const b = typeof baseDate === 'string' ? new Date(baseDate) : baseDate;
  return formatRelative(d, b);
}

/**
 * Formats a time
 */
export function formatTime(
  date: Date | string | number,
  formatStr: string = DATE_FORMATS.TIME
): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return format(d, formatStr);
}

/**
 * Formats a currency amount
 */
export function formatCurrency(
  amount: number,
  currency: keyof typeof CURRENCIES = 'USD',
  locale: string = 'en-US'
): string {
  const currencyInfo = CURRENCIES[currency];
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyInfo.code,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Formats a number with thousand separators
 */
export function formatNumber(
  value: number,
  options: {
    decimals?: number;
    thousandSeparator?: boolean;
    prefix?: string;
    suffix?: string;
    locale?: string;
  } = {}
): string {
  const {
    decimals,
    thousandSeparator = true,
    prefix = '',
    suffix = '',
    locale = 'en-US',
  } = options;
  
  let formatted = value.toString();
  
  if (decimals !== undefined) {
    formatted = value.toFixed(decimals);
  }
  
  if (thousandSeparator) {
    formatted = new Intl.NumberFormat(locale).format(Number(formatted));
  }
  
  return `${prefix}${formatted}${suffix}`;
}

/**
 * Formats a percentage
 */
export function formatPercentage(
  value: number,
  decimals: number = 0,
  includeSymbol: boolean = true
): string {
  const formatted = (value * 100).toFixed(decimals);
  return includeSymbol ? `${formatted}%` : formatted;
}

/**
 * Formats a file size
 */
export function formatFileSize(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
}

/**
 * Formats a phone number
 */
export function formatPhoneNumber(phone: string, country: 'ZW' | 'US' | 'UK' = 'ZW'): string {
  const cleaned = phone.replace(/\D/g, '');
  
  if (country === 'ZW') {
    if (cleaned.startsWith('263')) {
      return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '+$1 $2 $3');
    }
    if (cleaned.startsWith('0')) {
      return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '+263 $2 $3');
    }
  }
  
  return phone; // Return original if no match
}

/**
 * Formats a credit card number
 */
export function formatCreditCard(cardNumber: string): string {
  const cleaned = cardNumber.replace(/\D/g, '');
  const groups = cleaned.match(/.{1,4}/g) || [];
  return groups.join(' ');
}

/**
 * Formats a national ID (Zimbabwe)
 */
export function formatZimbabweId(id: string): string {
  const cleaned = id.replace(/\D/g, '');
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{2})(\d{7})(\d{2})/, '$1-$2-$3');
  }
  return id;
}

/**
 * Formats a name (e.g., "John Doe" -> "J. Doe")
 */
export function formatNameInitials(name: string): string {
  const parts = name.split(' ');
  if (parts.length === 1) return parts[0];
  const lastName = parts.pop() || '';
  const initials = parts.map((p) => p.charAt(0).toUpperCase() + '.').join(' ');
  return `${initials} ${lastName}`;
}

/**
 * Formats a list of items with a conjunction
 */
export function formatList(items: string[], conjunction: string = 'and'): string {
  if (items.length === 0) return '';
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} ${conjunction} ${items[1]}`;
  
  const itemsCopy = [...items];
  const last = itemsCopy.pop();
  return `${itemsCopy.join(', ')}, ${conjunction} ${last}`;
}

/**
 * Formats a duration in seconds to a human-readable string
 */
export function formatDuration(seconds: number, format: 'short' | 'long' = 'short'): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (format === 'short') {
    const parts = [];
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    if (secs > 0) parts.push(`${secs}s`);
    return parts.join(' ');
  }
  
  const parts = [];
  if (hours > 0) parts.push(`${hours} hour${hours !== 1 ? 's' : ''}`);
  if (minutes > 0) parts.push(`${minutes} minute${minutes !== 1 ? 's' : ''}`);
  if (secs > 0) parts.push(`${secs} second${secs !== 1 ? 's' : ''}`);
  return parts.join(' ');
}

/**
 * Formats a distance in meters to a human-readable string
 * Renamed to avoid conflict with date-fns formatDistance
 */
export function formatDistanceMetric(meters: number, format: 'metric' | 'imperial' = 'metric'): string {
  if (format === 'metric') {
    if (meters < 1000) {
      return `${Math.round(meters)} m`;
    }
    return `${(meters / 1000).toFixed(1)} km`;
  } else {
    const feet = meters * 3.28084;
    if (feet < 5280) {
      return `${Math.round(feet)} ft`;
    }
    return `${(feet / 5280).toFixed(1)} mi`;
  }
}

/**
 * Formats a temperature
 */
export function formatTemperature(
  celsius: number,
  format: 'celsius' | 'fahrenheit' = 'celsius'
): string {
  if (format === 'celsius') {
    return `${Math.round(celsius)}°C`;
  }
  const fahrenheit = (celsius * 9/5) + 32;
  return `${Math.round(fahrenheit)}°F`;
}

/**
 * Formats a number as ordinal (1st, 2nd, 3rd, etc.)
 */
export function formatOrdinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

/**
 * Formats a number as a Roman numeral
 */
export function formatRomanNumeral(n: number): string {
  if (n < 1 || n > 3999) return n.toString();
  
  const romanNumerals: [string, number][] = [
    ['M', 1000], ['CM', 900], ['D', 500], ['CD', 400],
    ['C', 100], ['XC', 90], ['L', 50], ['XL', 40],
    ['X', 10], ['IX', 9], ['V', 5], ['IV', 4], ['I', 1]
  ];
  
  let result = '';
  let remaining = n;
  
  for (const [numeral, value] of romanNumerals) {
    while (remaining >= value) {
      result += numeral;
      remaining -= value;
    }
  }
  
  return result;
}

/**
 * Formats a number as words (e.g., 123 -> "one hundred twenty-three")
 */
export function formatNumberToWords(n: number): string {
  const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
    'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen',
    'seventeen', 'eighteen', 'nineteen'];
  const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
  
  if (n === 0) return 'zero';
  
  function convert(num: number): string {
    if (num < 20) return ones[num];
    if (num < 100) {
      const ten = Math.floor(num / 10);
      const one = num % 10;
      return tens[ten] + (one ? '-' + ones[one] : '');
    }
    if (num < 1000) {
      const hundred = Math.floor(num / 100);
      const remainder = num % 100;
      return ones[hundred] + ' hundred' + (remainder ? ' ' + convert(remainder) : '');
    }
    if (num < 1000000) {
      const thousand = Math.floor(num / 1000);
      const remainder = num % 1000;
      return convert(thousand) + ' thousand' + (remainder ? ' ' + convert(remainder) : '');
    }
    if (num < 1000000000) {
      const million = Math.floor(num / 1000000);
      const remainder = num % 1000000;
      return convert(million) + ' million' + (remainder ? ' ' + convert(remainder) : '');
    }
    const billion = Math.floor(num / 1000000000);
    const remainder = num % 1000000000;
    return convert(billion) + ' billion' + (remainder ? ' ' + convert(remainder) : '');
  }
  
  return convert(n);
}

/**
 * Formats a number as a currency in words (e.g., "$123.45" -> "one hundred twenty-three dollars and forty-five cents")
 */
export function formatCurrencyToWords(amount: number, currency: string = 'USD'): string {
  const dollars = Math.floor(amount);
  const cents = Math.round((amount - dollars) * 100);
  
  const dollarWords = dollars === 0 ? 'zero' : formatNumberToWords(dollars);
  const centWords = cents === 0 ? '' : formatNumberToWords(cents);
  
  const currencyName = currency === 'USD' ? 'dollar' : currency.toLowerCase();
  const currencyPlural = currency === 'USD' ? 'dollars' : currency.toLowerCase() + 's';
  
  const dollarPart = dollars === 1 ? `${dollarWords} ${currencyName}` : `${dollarWords} ${currencyPlural}`;
  
  if (cents === 0) {
    return dollarPart;
  }
  
  const centPart = cents === 1 ? `${centWords} cent` : `${centWords} cents`;
  return `${dollarPart} and ${centPart}`;
}

/**
 * Formats a number with units
 */
export function formatWithUnit(
  value: number,
  unit: string,
  options: {
    decimals?: number;
    space?: boolean;
    singular?: string;
    plural?: string;
  } = {}
): string {
  const {
    decimals = 0,
    space = true,
    singular,
    plural,
  } = options;
  
  const formatted = value.toFixed(decimals);
  const separator = space ? ' ' : '';
  
  if (singular && value === 1) {
    return `${formatted}${separator}${singular}`;
  }
  
  if (plural) {
    return `${formatted}${separator}${plural}`;
  }
  
  return `${formatted}${separator}${unit}`;
}

/**
 * Formats a boolean as Yes/No
 */
export function formatBoolean(value: boolean, options: { trueValue?: string; falseValue?: string } = {}): string {
  const { trueValue = 'Yes', falseValue = 'No' } = options;
  return value ? trueValue : falseValue;
}

/**
 * Formats an enum value for display
 */
export function formatEnum(value: string, enumMap: Record<string, string>): string {
  return enumMap[value] || value;
}

/**
 * Formats a string by capitalizing and replacing underscores with spaces
 */
export function formatEnumValue(value: string): string {
  return value
    .toLowerCase()
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Formats a phone number for international dialing
 */
export function formatInternationalPhone(phone: string, countryCode: string = '263'): string {
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.startsWith('0')) {
    return `+${countryCode}${cleaned.slice(1)}`;
  }
  
  if (cleaned.startsWith(countryCode)) {
    return `+${cleaned}`;
  }
  
  return `+${countryCode}${cleaned}`;
}

/**
 * Formats an address
 */
export function formatAddress(address: {
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}): string {
  const parts = [
    address.street,
    address.city,
    address.state,
    address.postalCode,
    address.country,
  ].filter(Boolean);
  
  return parts.join(', ');
}

/**
 * Formats a person's full name
 */
export function formatFullName(
  person: {
    firstName: string;
    lastName: string;
    middleName?: string;
    title?: string;
    suffix?: string;
  },
  options: {
    lastNameFirst?: boolean;
    includeTitle?: boolean;
    includeSuffix?: boolean;
  } = {}
): string {
  const {
    lastNameFirst = false,
    includeTitle = false,
    includeSuffix = false,
  } = options;
  
  const parts = [];
  
  if (includeTitle && person.title) {
    parts.push(person.title);
  }
  
  if (lastNameFirst) {
    parts.push(person.lastName);
    if (person.firstName) {
      parts.push(person.firstName);
    }
  } else {
    if (person.firstName) {
      parts.push(person.firstName);
    }
    if (person.middleName) {
      parts.push(person.middleName);
    }
    parts.push(person.lastName);
  }
  
  if (includeSuffix && person.suffix) {
    parts.push(person.suffix);
  }
  
  return parts.join(' ');
}