// ==============================================
// VALIDATION FUNCTIONS
// ==============================================

import { REGEX } from './constants';

/**
 * Validates an email address
 */
export function isValidEmail(email: string): boolean {
  return REGEX.EMAIL.test(email);
}

/**
 * Validates a phone number
 */
export function isValidPhone(phone: string): boolean {
  return REGEX.PHONE.test(phone);
}

/**
 * Validates a Zimbabwean phone number
 */
export function isValidZimbabwePhone(phone: string): boolean {
  return REGEX.ZIMBABWE_PHONE.test(phone);
}

/**
 * Validates a password strength
 * Requires: 8+ chars, uppercase, lowercase, number, special char
 */
export function isStrongPassword(password: string): boolean {
  return REGEX.PASSWORD.test(password);
}

/**
 * Validates a username
 */
export function isValidUsername(username: string): boolean {
  return REGEX.USERNAME.test(username);
}

/**
 * Validates a name
 */
export function isValidName(name: string): boolean {
  return REGEX.NAME.test(name);
}

/**
 * Validates a student number
 */
export function isValidStudentNumber(studentNumber: string): boolean {
  return REGEX.STUDENT_NUMBER.test(studentNumber);
}

/**
 * Validates a tutor number
 */
export function isValidTutorNumber(tutorNumber: string): boolean {
  return REGEX.TUTOR_NUMBER.test(tutorNumber);
}

/**
 * Validates an employee ID
 */
export function isValidEmployeeId(employeeId: string): boolean {
  return REGEX.EMPLOYEE_ID.test(employeeId);
}

/**
 * Validates a school code
 */
export function isValidSchoolCode(schoolCode: string): boolean {
  return REGEX.SCHOOL_CODE.test(schoolCode);
}

/**
 * Validates a URL
 */
export function isValidUrl(url: string): boolean {
  return REGEX.URL.test(url);
}

/**
 * Validates an IP address
 */
export function isValidIpAddress(ip: string): boolean {
  return REGEX.IP_ADDRESS.test(ip);
}

/**
 * Validates a UUID
 */
export function isValidUuid(uuid: string): boolean {
  return REGEX.UUID.test(uuid);
}

/**
 * Validates a hex color
 */
export function isValidHexColor(color: string): boolean {
  return REGEX.HEX_COLOR.test(color);
}

/**
 * Validates an ISO date
 */
export function isValidISODate(date: string): boolean {
  return REGEX.DATE_ISO.test(date);
}

/**
 * Validates an ISO datetime
 */
export function isValidISODateTime(datetime: string): boolean {
  return REGEX.DATETIME_ISO.test(datetime);
}

/**
 * Validates a date
 */
export function isValidDate(date: any): boolean {
  const d = new Date(date);
  return d instanceof Date && !isNaN(d.getTime());
}

/**
 * Validates a number within a range
 */
export function isInRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max;
}

/**
 * Validates a string length
 */
export function hasLength(value: string, min: number, max?: number): boolean {
  if (max !== undefined) {
    return value.length >= min && value.length <= max;
  }
  return value.length >= min;
}

/**
 * Validates that a value is not empty
 */
export function isNotEmpty(value: any): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'object') return Object.keys(value).length > 0;
  return true;
}

/**
 * Validates that a value is a number
 */
export function isNumeric(value: any): boolean {
  return !isNaN(parseFloat(value)) && isFinite(value);
}

/**
 * Validates that a value is an integer
 */
export function isInteger(value: any): boolean {
  return Number.isInteger(Number(value));
}

/**
 * Validates that a value is positive
 */
export function isPositive(value: number): boolean {
  return value > 0;
}

/**
 * Validates that a value is negative
 */
export function isNegative(value: number): boolean {
  return value < 0;
}

/**
 * Validates that a value is zero or positive
 */
export function isNonNegative(value: number): boolean {
  return value >= 0;
}

/**
 * Validates that a value is zero or negative
 */
export function isNonPositive(value: number): boolean {
  return value <= 0;
}

/**
 * Validates that a value matches a pattern
 */
export function matchesPattern(value: string, pattern: RegExp): boolean {
  return pattern.test(value);
}

/**
 * Validates that two values are equal
 */
export function isEqual(value1: any, value2: any): boolean {
  return value1 === value2;
}

/**
 * Validates that a value is in an array of allowed values
 */
export function isIn(value: any, allowedValues: any[]): boolean {
  return allowedValues.includes(value);
}

/**
 * Validates that a value is not in an array of forbidden values
 */
export function isNotIn(value: any, forbiddenValues: any[]): boolean {
  return !forbiddenValues.includes(value);
}

/**
 * Validates that a value is a valid credit card number (Luhn algorithm)
 */
export function isValidCreditCard(cardNumber: string): boolean {
  const sanitized = cardNumber.replace(/\D/g, '');
  
  if (sanitized.length < 13 || sanitized.length > 19) return false;
  
  let sum = 0;
  let double = false;
  
  for (let i = sanitized.length - 1; i >= 0; i--) {
    let digit = parseInt(sanitized.charAt(i), 10);
    
    if (double) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    
    sum += digit;
    double = !double;
  }
  
  return sum % 10 === 0;
}

/**
 * Validates that a value is a valid credit card CVV
 */
export function isValidCvv(cvv: string): boolean {
  return /^\d{3,4}$/.test(cvv);
}

/**
 * Validates that a value is a valid credit card expiry date
 */
export function isValidExpiryDate(month: number, year: number): boolean {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  
  if (year < currentYear || year > currentYear + 20) return false;
  if (year === currentYear && month < currentMonth) return false;
  
  return month >= 1 && month <= 12;
}

/**
 * Validates that a value is a valid ID number
 * (Zimbabwe National ID format: XX-XXXXXXX-X-XX)
 */
export function isValidZimbabweId(id: string): boolean {
  return /^[0-9]{2}-[0-9]{6,7}-[A-Z]-[0-9]{2}$/.test(id);
}

/**
 * Validates that a value is a valid passport number
 */
export function isValidPassportNumber(passport: string): boolean {
  return /^[A-Z0-9]{6,9}$/.test(passport);
}

/**
 * Validates that a value is a valid IBAN
 */
export function isValidIban(iban: string): boolean {
  const sanitized = iban.replace(/\s/g, '').toUpperCase();
  
  if (sanitized.length < 15 || sanitized.length > 34) return false;
  
  const rearranged = sanitized.slice(4) + sanitized.slice(0, 4);
  const numeric = rearranged.split('').map((char) => {
    const code = char.charCodeAt(0);
    return code >= 65 ? code - 55 : char;
  }).join('');
  
  let remainder = 0;
  for (let i = 0; i < numeric.length; i++) {
    remainder = (remainder * 10 + parseInt(numeric[i], 10)) % 97;
  }
  
  return remainder === 1;
}

/**
 * Validates that a value is a valid SWIFT/BIC code
 */
export function isValidSwiftCode(swift: string): boolean {
  return /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/.test(swift);
}

/**
 * Validates that a value is a valid ISBN-10
 */
export function isValidIsbn10(isbn: string): boolean {
  const sanitized = isbn.replace(/[-\s]/g, '');
  
  if (sanitized.length !== 10) return false;
  
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    const digit = parseInt(sanitized[i], 10);
    if (isNaN(digit)) return false;
    sum += digit * (10 - i);
  }
  
  const check = sanitized[9];
  if (check === 'X' || check === 'x') {
    sum += 10;
  } else {
    const digit = parseInt(check, 10);
    if (isNaN(digit)) return false;
    sum += digit;
  }
  
  return sum % 11 === 0;
}

/**
 * Validates that a value is a valid ISBN-13
 */
export function isValidIsbn13(isbn: string): boolean {
  const sanitized = isbn.replace(/[-\s]/g, '');
  
  if (sanitized.length !== 13) return false;
  
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    const digit = parseInt(sanitized[i], 10);
    if (isNaN(digit)) return false;
    sum += digit * (i % 2 === 0 ? 1 : 3);
  }
  
  const check = (10 - (sum % 10)) % 10;
  const lastDigit = parseInt(sanitized[12], 10);
  
  return check === lastDigit;
}

/**
 * Validates that a value is a valid email domain
 */
export async function isValidEmailDomain(email: string): Promise<boolean> {
  const domain = email.split('@')[1];
  
  try {
    const response = await fetch(`https://dns.google/resolve?name=${domain}&type=MX`);
    const data = await response.json();
    return data.Answer && data.Answer.length > 0;
  } catch {
    return true; // Assume valid if DNS check fails
  }
}

/**
 * Validates that a password meets minimum requirements
 */
export function getPasswordStrength(password: string): {
  score: number; // 0-4
  feedback: string[];
} {
  const feedback: string[] = [];
  let score = 0;
  
  if (password.length >= 8) {
    score++;
  } else {
    feedback.push('Password should be at least 8 characters long');
  }
  
  if (/[a-z]/.test(password)) {
    score++;
  } else {
    feedback.push('Password should contain at least one lowercase letter');
  }
  
  if (/[A-Z]/.test(password)) {
    score++;
  } else {
    feedback.push('Password should contain at least one uppercase letter');
  }
  
  if (/[0-9]/.test(password)) {
    score++;
  } else {
    feedback.push('Password should contain at least one number');
  }
  
  if (/[^a-zA-Z0-9]/.test(password)) {
    score++;
  } else {
    feedback.push('Password should contain at least one special character');
  }
  
  return { score, feedback };
}

/**
 * Validates that a file is an image
 */
export function isImageFile(file: File): boolean {
  return file.type.startsWith('image/');
}

/**
 * Validates that a file is a video
 */
export function isVideoFile(file: File): boolean {
  return file.type.startsWith('video/');
}

/**
 * Validates that a file is an audio file
 */
export function isAudioFile(file: File): boolean {
  return file.type.startsWith('audio/');
}

/**
 * Validates that a file is a PDF
 */
export function isPdfFile(file: File): boolean {
  return file.type === 'application/pdf';
}

/**
 * Validates that a file size is within limits
 */
export function isValidFileSize(file: File, maxSize: number): boolean {
  return file.size <= maxSize;
}

/**
 * Validates that a file type is allowed
 */
export function isValidFileType(file: File, allowedTypes: string[]): boolean {
  return allowedTypes.includes(file.type);
}

/**
 * Validates that an object has all required fields
 */
export function hasRequiredFields<T extends object>(
  obj: T,
  requiredFields: (keyof T)[]
): boolean {
  return requiredFields.every((field) => obj[field] !== undefined && obj[field] !== null);
}

/**
 * Validates that an object has no extra fields
 */
export function hasOnlyAllowedFields<T extends object>(
  obj: T,
  allowedFields: (keyof T)[]
): boolean {
  return Object.keys(obj).every((key) => allowedFields.includes(key as keyof T));
}

/**
 * Validates that a value is a valid JSON string
 */
export function isValidJson(str: string): boolean {
  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validates that a value is a valid base64 string
 */
export function isValidBase64(str: string): boolean {
  try {
    return btoa(atob(str)) === str;
  } catch {
    return false;
  }
}

/**
 * Validates that a value is a valid hex string
 */
export function isValidHex(str: string): boolean {
  return /^[0-9A-Fa-f]+$/.test(str);
}

/**
 * Validates that a value is a valid color name
 */
export function isValidColorName(color: string): boolean {
  const s = new Option().style;
  s.color = color;
  return s.color !== '';
}

/**
 * Validates that a value is a valid CSS color
 */
export function isValidCssColor(color: string): boolean {
  return isValidHexColor(color) || isValidColorName(color) || 
         /^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/.test(color) ||
         /^rgba\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3}),\s*(0|1|0?\.\d+)\)$/.test(color) ||
         /^hsl\((\d{1,3}),\s*(\d{1,3})%,\s*(\d{1,3})%\)$/.test(color) ||
         /^hsla\((\d{1,3}),\s*(\d{1,3})%,\s*(\d{1,3})%,\s*(0|1|0?\.\d+)\)$/.test(color);
}