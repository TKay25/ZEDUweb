// ==============================================
// ZEDU PLATFORM - UTILITIES EXPORT INDEX
// ==============================================

/**
 * This file serves as the central export point for all utility functions
 * Import from this file to access any utility across the application
 * 
 * @example
 * import { cn, debounce, formatDate, storage } from '@/utils';
 */

// ==============================================
// CONSTANTS
// ==============================================
export * from './constants';

// ==============================================
// HELPER FUNCTIONS
// ==============================================
// Note: Some functions like isValidUrl might also exist in validators
// We'll export them from helpers but not from validators to avoid conflicts
export {
  cn,
  debounce,
  throttle,
  deepClone,
  deepMerge,
  generateId,
  truncate,
  capitalize,
  capitalizeWords,
  toCamelCase,
  toSnakeCase,
  toKebabCase,
  pluralize,
  maskString,
  maskEmail,
  getInitials,
  stringToColor,
  copyToClipboard,
  downloadFile,
  downloadAsFile,
  openInNewTab,
  scrollToElement,
  isMobile,
  isIOS,
  isAndroid,
  isDarkMode,
  sleep,
  retry,
  measureTime,
  memoize,
  groupBy,
  sortBy,
  searchBy,
  paginate,
  chunk,
  uniqueBy,
  flatten,
  zip,
  range,
  shuffle,
  sample,
  sum,
  average,
  median,
  mode,
  clamp,
  mapRange,
  round,
  isEmpty,
} from './helpers';

// ==============================================
// VALIDATION FUNCTIONS
// ==============================================
// Excluding isValidUrl if it exists in both helpers and validators
// Use the one from helpers above
export {
  isValidEmail,
  isValidPhone,
  isValidZimbabwePhone,
  isStrongPassword,
  isValidUsername,
  isValidName,
  isValidStudentNumber,
  isValidTutorNumber,
  isValidSchoolCode,
  // isValidUrl, // Commented out - using from helpers instead
  isValidIpAddress,
  isValidUuid,
  isValidHexColor,
  isValidISODate,
  isInRange,
  hasLength,
  isNotEmpty,
  isNumeric,
  isInteger,
  isPositive,
  matchesPattern,
  isEqual,
  isIn,
  isValidCreditCard,
  isValidCvv,
  isValidExpiryDate,
  isValidZimbabweId,
  isValidIban,
  isValidSwiftCode,
  isValidIsbn10,
  isValidIsbn13,
  getPasswordStrength,
  isImageFile,
  isVideoFile,
  isPdfFile,
  isValidFileSize,
  isValidFileType,
  isValidJson,
  isValidBase64,
  isValidCssColor,
} from './validators';

// ==============================================
// FORMATTER FUNCTIONS
// ==============================================
export {
  formatDate,
  formatDateTime,
  formatRelativeTime,
  //formatDistanceToNow,
  formatCalendar,
  formatTime,
  formatCurrency,
  formatNumber,
  formatPercentage,
  formatFileSize,
  formatPhoneNumber,
  formatCreditCard,
  formatZimbabweId,
  formatNameInitials,
  formatList,
  formatDuration,
  formatOrdinal,
  formatRomanNumeral,
  formatNumberToWords,
  formatCurrencyToWords,
  formatWithUnit,
  formatBoolean,
  formatEnum,
  formatAddress,
  formatFullName,
} from './formatters';

// ==============================================
// STORAGE UTILITIES
// ==============================================
export {
  storage,
  sessionStorage,
  cookies,
  cache,
  IndexedDBStorage,
  MemoryCache,
  tokenStorage,
  preferencesStorage,
} from './storage';

// ==============================================
// LOGGING UTILITIES
// ==============================================
export {
  logger,
  perfLogger,
  apiLogger,
  actionLogger,
} from './logger';

// ==============================================
// PERMISSION UTILITIES
// ==============================================
export {
  permissions,
  rolePermissions,
  getPermissionsForRole,
  can,
  canCreate,
  canRead,
  canUpdate,
  canDelete,
  canManage,
  requirePermission,
  requireRole,
  requireOwnership,
} from './permissions';

// ==============================================
// TYPE RE-EXPORTS (for convenience)
// ==============================================

// Fix: Use relative path instead of alias if alias isn't configured
// Option 1: Use relative path (recommended for now)
export type {
  UserRole,
  UserStatus,
  VerificationStatus,
  ID,
  DateTime,
  Email,
  PhoneNumber,
  URL,
  Currency,
  Language,
  ApiResponse,
  PaginatedResponse,
  PaginationMeta,
  BaseProps,
  WithChildren,
  WithLoading,
  WithError,
} from '../types';

// Option 2: If you have a tsconfig.json path alias configured, use:
// export type { ... } from '@/types';

// ==============================================
// UTILITY FUNCTION OVERVIEW (for documentation)
// ==============================================

/**
 * Available Utilities by Category:
 * 
 * ─────────────────────────────────────────────
 * CONSTANTS
 * ─────────────────────────────────────────────
 * APP_NAME, APP_VERSION
 * API_ENDPOINTS, HTTP_STATUS
 * ROUTES, STORAGE_KEYS
 * REGEX patterns
 * ERROR_MESSAGES, SUCCESS_MESSAGES
 * PAGINATION, DATE_FORMATS
 * FILE constraints
 * CURRENCIES, LANGUAGES
 * ROLES, PERMISSIONS
 * BREAKPOINTS, Z_INDEX
 * GRADE_LEVELS, SUBJECTS, TERMS
 * ASSESSMENT_TYPES, QUESTION_TYPES
 * PAYMENT_METHODS, SORT_OPTIONS
 * 
 * ─────────────────────────────────────────────
 * HELPERS
 * ─────────────────────────────────────────────
 * cn()                 - Merge Tailwind classes
 * debounce()           - Debounce function calls
 * throttle()           - Throttle function calls
 * deepClone()          - Deep clone objects
 * deepMerge()          - Deep merge objects
 * isEmpty()            - Check if value is empty
 * generateId()         - Generate unique ID
 * truncate()           - Truncate text
 * capitalize()         - Capitalize first letter
 * capitalizeWords()    - Capitalize each word
 * toCamelCase()        - Convert to camelCase
 * toSnakeCase()        - Convert to snake_case
 * toKebabCase()        - Convert to kebab-case
 * pluralize()          - Pluralize words
 * maskString()         - Mask strings (credit cards)
 * maskEmail()          - Mask email addresses
 * getInitials()        - Get initials from name
 * stringToColor()      - Generate color from string
 * copyToClipboard()    - Copy text to clipboard
 * downloadFile()       - Download file from URL
 * downloadAsFile()     - Download content as file
 * openInNewTab()       - Open URL in new tab
 * scrollToElement()    - Scroll to element
 * isMobile()           - Check if mobile device
 * isIOS()              - Check if iOS
 * isAndroid()          - Check if Android
 * isDarkMode()         - Check if dark mode
 * sleep()              - Delay execution
 * retry()              - Retry with backoff
 * measureTime()        - Measure execution time
 * memoize()            - Memoize functions
 * groupBy()            - Group array by key
 * sortBy()             - Sort array by key
 * searchBy()           - Search array by keys
 * paginate()           - Paginate array
 * chunk()              - Split array into chunks
 * uniqueBy()           - Remove duplicates
 * flatten()            - Flatten nested arrays
 * zip()                - Zip arrays together
 * range()              - Generate number range
 * shuffle()            - Shuffle array
 * sample()             - Get random element
 * sum()                - Sum numbers
 * average()            - Calculate average
 * median()             - Calculate median
 * mode()               - Find mode
 * clamp()              - Clamp number
 * mapRange()           - Map between ranges
 * round()              - Round number
 * 
 * ─────────────────────────────────────────────
 * VALIDATORS
 * ─────────────────────────────────────────────
 * isValidEmail()              - Validate email
 * isValidPhone()              - Validate phone
 * isValidZimbabwePhone()      - Validate Zim phone
 * isStrongPassword()          - Check password strength
 * isValidUsername()           - Validate username
 * isValidName()               - Validate name
 * isValidStudentNumber()      - Validate student number
 * isValidTutorNumber()        - Validate tutor number
 * isValidSchoolCode()         - Validate school code
 * isValidUrl()                - Validate URL (from helpers)
 * isValidIpAddress()          - Validate IP
 * isValidUuid()               - Validate UUID
 * isValidHexColor()           - Validate hex color
 * isValidISODate()            - Validate ISO date
 * isInRange()                 - Check number range
 * hasLength()                 - Check string length
 * isNotEmpty()                - Check if not empty
 * isNumeric()                 - Check if numeric
 * isInteger()                 - Check if integer
 * isPositive()                - Check if positive
 * matchesPattern()            - Check regex pattern
 * isEqual()                   - Check equality
 * isIn()                      - Check value in array
 * isValidCreditCard()         - Validate credit card
 * isValidCvv()                - Validate CVV
 * isValidExpiryDate()         - Validate expiry
 * isValidZimbabweId()         - Validate Zim ID
 * isValidIban()               - Validate IBAN
 * isValidSwiftCode()          - Validate SWIFT
 * isValidIsbn10()             - Validate ISBN-10
 * isValidIsbn13()             - Validate ISBN-13
 * getPasswordStrength()       - Get password strength
 * isImageFile()               - Check if image file
 * isVideoFile()               - Check if video file
 * isPdfFile()                 - Check if PDF
 * isValidFileSize()           - Check file size
 * isValidFileType()           - Check file type
 * isValidJson()               - Check if valid JSON
 * isValidBase64()             - Check if valid base64
 * isValidCssColor()           - Check if valid CSS color
 * 
 * ─────────────────────────────────────────────
 * FORMATTERS
 * ─────────────────────────────────────────────
 * formatDate()            - Format date
 * formatDateTime()        - Format date and time
 * formatRelativeTime()    - Format relative time
 * formatDistance()        - Format distance
 * formatCalendar()        - Format calendar date
 * formatTime()            - Format time
 * formatCurrency()        - Format currency
 * formatNumber()          - Format number
 * formatPercentage()      - Format percentage
 * formatFileSize()        - Format file size
 * formatPhoneNumber()     - Format phone number
 * formatCreditCard()      - Format credit card
 * formatZimbabweId()      - Format Zimbabwe ID
 * formatNameInitials()    - Format name initials
 * formatList()            - Format list with conjunction
 * formatDuration()        - Format duration
 * formatOrdinal()         - Format ordinal (1st, 2nd)
 * formatRomanNumeral()    - Format Roman numeral
 * formatNumberToWords()   - Convert number to words
 * formatCurrencyToWords() - Convert currency to words
 * formatWithUnit()        - Format with unit
 * formatBoolean()         - Format boolean as Yes/No
 * formatEnum()            - Format enum value
 * formatAddress()         - Format address
 * formatFullName()        - Format full name
 * 
 * ─────────────────────────────────────────────
 * STORAGE
 * ─────────────────────────────────────────────
 * storage                  - LocalStorage wrapper
 * sessionStorage           - SessionStorage wrapper
 * cookies                  - Cookie utilities
 * cache                    - Cache with expiration
 * IndexedDBStorage         - IndexedDB wrapper
 * MemoryCache              - In-memory cache
 * tokenStorage             - Auth token storage
 * preferencesStorage       - User preferences
 * 
 * ─────────────────────────────────────────────
 * LOGGER
 * ─────────────────────────────────────────────
 * logger.debug()           - Debug level log
 * logger.info()            - Info level log
 * logger.warn()            - Warning level log
 * logger.error()           - Error level log
 * perfLogger.start()       - Start performance measurement
 * perfLogger.measure()     - Measure async function
 * apiLogger.logRequest()   - Log API request
 * apiLogger.logResponse()  - Log API response
 * actionLogger.logAction() - Log user action
 * 
 * ─────────────────────────────────────────────
 * PERMISSIONS
 * ─────────────────────────────────────────────
 * permissions.hasPermission()     - Check permission
 * permissions.hasAnyPermission()  - Check any permission
 * permissions.hasAllPermissions() - Check all permissions
 * permissions.isOwner()           - Check ownership
 * permissions.canAccess()         - Check access
 * rolePermissions                 - Role permission maps
 * getPermissionsForRole()         - Get permissions for role
 * can()                           - Check action on resource
 * canCreate()                     - Check create permission
 * canRead()                       - Check read permission
 * canUpdate()                     - Check update permission
 * canDelete()                     - Check delete permission
 * canManage()                     - Check manage permission
 * requirePermission()             - Permission middleware
 * requireRole()                   - Role middleware
 * requireOwnership()              - Ownership middleware
 */

// ==============================================
// DEFAULT EXPORT (optional - consider removing for better tree-shaking)
// ==============================================

import * as constants from './constants';
import * as helpers from './helpers';
import * as validators from './validators';
import * as formatters from './formatters';
import * as storage from './storage';
import * as logger from './logger';
import * as permissions from './permissions';

export default {
  ...constants,
  ...helpers,
  ...validators,
  ...formatters,
  ...storage,
  ...logger,
  ...permissions,
};