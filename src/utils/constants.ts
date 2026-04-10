// ==============================================
// APPLICATION CONSTANTS
// ==============================================

export const APP_NAME = 'ZEDU';
export const APP_VERSION = '1.0.0';
export const APP_DESCRIPTION = 'Zimbabwe Educational Platform';

// ==============================================
// API CONSTANTS
// ==============================================

// Use import.meta.env for Vite instead of process.env
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    verifyEmail: '/auth/verify-email',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
    me: '/auth/me',
  },
  users: {
    list: '/users',
    detail: (id: string) => `/users/${id}`,
    profile: '/users/profile',
    settings: '/users/settings',
  },
  students: {
    list: '/students',
    detail: (id: string) => `/students/${id}`,
    enrollments: (id: string) => `/students/${id}/enrollments`,
    grades: (id: string) => `/students/${id}/grades`,
    attendance: (id: string) => `/students/${id}/attendance`,
  },
  tutors: {
    list: '/tutors',
    detail: (id: string) => `/tutors/${id}`,
    courses: (id: string) => `/tutors/${id}/courses`,
    earnings: (id: string) => `/tutors/${id}/earnings`,
  },
  parents: {
    list: '/parents',
    detail: (id: string) => `/parents/${id}`,
    children: (id: string) => `/parents/${id}/children`,
  },
  schools: {
    list: '/schools',
    detail: (id: string) => `/schools/${id}`,
    classes: (id: string) => `/schools/${id}/classes`,
    staff: (id: string) => `/schools/${id}/staff`,
    students: (id: string) => `/schools/${id}/students`,
  },
  ministry: {
    dashboard: '/ministry/dashboard',
    schools: '/ministry/schools',
    statistics: '/ministry/statistics',
    reports: '/ministry/reports',
  },
  courses: {
    list: '/courses',
    detail: (id: string) => `/courses/${id}`,
    lessons: (id: string) => `/courses/${id}/lessons`,
    enroll: (id: string) => `/courses/${id}/enroll`,
  },
  assessments: {
    assignments: '/assessments/assignments',
    quizzes: '/assessments/quizzes',
    submissions: '/assessments/submissions',
    grades: '/assessments/grades',
  },
  payments: {
    transactions: '/payments/transactions',
    invoices: '/payments/invoices',
    methods: '/payments/methods',
    receipts: (id: string) => `/payments/receipts/${id}`,
  },
  ai: {
    chat: '/ai/chat',
    generateQuiz: '/ai/generate-quiz',
    summarize: '/ai/summarize',
    recommend: '/ai/recommend',
  },
  communications: {
    messages: '/communications/messages',
    conversations: '/communications/conversations',
    announcements: '/communications/announcements',
    notifications: '/communications/notifications',
  },
};

// ==============================================
// HTTP STATUS CODES
// ==============================================

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
} as const;

// ==============================================
// ROUTE CONSTANTS
// ==============================================

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  VERIFY_EMAIL: '/verify-email',
  
  STUDENT: {
    DASHBOARD: '/student/dashboard',
    COURSES: '/student/courses',
    COURSE_DETAIL: (id: string) => `/student/courses/${id}`,
    ASSIGNMENTS: '/student/assignments',
    GRADES: '/student/grades',
    ATTENDANCE: '/student/attendance',
    PROFILE: '/student/profile',
    SETTINGS: '/student/settings',
  },
  
  TUTOR: {
    DASHBOARD: '/tutor/dashboard',
    COURSES: '/tutor/courses',
    COURSE_CREATE: '/tutor/courses/create',
    COURSE_EDIT: (id: string) => `/tutor/courses/${id}/edit`,
    STUDENTS: '/tutor/students',
    EARNINGS: '/tutor/earnings',
    SCHEDULE: '/tutor/schedule',
    PROFILE: '/tutor/profile',
    SETTINGS: '/tutor/settings',
  },
  
  PARENT: {
    DASHBOARD: '/parent/dashboard',
    CHILDREN: '/parent/children',
    CHILD_PROGRESS: (id: string) => `/parent/children/${id}/progress`,
    CHILD_GRADES: (id: string) => `/parent/children/${id}/grades`,
    CHILD_ATTENDANCE: (id: string) => `/parent/children/${id}/attendance`,
    PAYMENTS: '/parent/payments',
    MEETINGS: '/parent/meetings',
    PROFILE: '/parent/profile',
    SETTINGS: '/parent/settings',
  },
  
  SCHOOL: {
    DASHBOARD: '/school/dashboard',
    STUDENTS: '/school/students',
    STAFF: '/school/staff',
    CLASSES: '/school/classes',
    TIMETABLE: '/school/timetable',
    ATTENDANCE: '/school/attendance',
    EXAMS: '/school/exams',
    RESULTS: '/school/results',
    FEES: '/school/fees',
    PROFILE: '/school/profile',
    SETTINGS: '/school/settings',
  },
  
  MINISTRY: {
    DASHBOARD: '/ministry/dashboard',
    SCHOOLS: '/ministry/schools',
    SCHOOL_DETAIL: (id: string) => `/ministry/schools/${id}`,
    VERIFICATION: '/ministry/verification',
    STATISTICS: '/ministry/statistics',
    REPORTS: '/ministry/reports',
    POLICIES: '/ministry/policies',
    PROFILE: '/ministry/profile',
    SETTINGS: '/ministry/settings',
  },
  
  COMMON: {
    PROFILE: '/profile',
    SETTINGS: '/settings',
    NOTIFICATIONS: '/notifications',
    MESSAGES: '/messages',
    HELP: '/help',
    TERMS: '/terms',
    PRIVACY: '/privacy',
    NOT_FOUND: '/404',
    UNAUTHORIZED: '/403',
  },
} as const;

// ==============================================
// LOCAL STORAGE KEYS
// ==============================================

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'user',
  THEME: 'theme',
  LANGUAGE: 'language',
  NOTIFICATIONS: 'notifications',
  CART: 'cart',
  DRAFT: 'draft',
  PREFERENCES: 'preferences',
  RECENT_SEARCHES: 'recent_searches',
  BOOKMARKS: 'bookmarks',
} as const;

// ==============================================
// COOKIE KEYS
// ==============================================

export const COOKIE_KEYS = {
  SESSION: 'session_id',
  CSRF_TOKEN: 'csrf_token',
  CONSENT: 'cookie_consent',
} as const;

// ==============================================
// REGEX PATTERNS
// ==============================================

export const REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^(\+263|0)[0-9]{9}$/,
  ZIMBABWE_PHONE: /^(\+263|0)[0-9]{9}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  USERNAME: /^[a-zA-Z0-9_]{3,20}$/,
  NAME: /^[a-zA-Z\s]{2,50}$/,
  STUDENT_NUMBER: /^[A-Z0-9]{6,10}$/,
  TUTOR_NUMBER: /^[A-Z0-9]{6,10}$/,
  EMPLOYEE_ID: /^[A-Z0-9]{6,10}$/,
  SCHOOL_CODE: /^[A-Z0-9]{4,8}$/,
  URL: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
  IP_ADDRESS: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
  UUID: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
  HEX_COLOR: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
  DATE_ISO: /^\d{4}-\d{2}-\d{2}$/,
  DATETIME_ISO: /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/,
} as const;

// ==============================================
// PAGINATION DEFAULTS
// ==============================================

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  DEFAULT_LIMITS: [10, 20, 50, 100],
  MAX_LIMIT: 100,
} as const;

// ==============================================
// DATE FORMATS
// ==============================================

export const DATE_FORMATS = {
  DISPLAY: 'MMM d, yyyy',
  DISPLAY_TIME: 'MMM d, yyyy h:mm a',
  DISPLAY_SHORT: 'MM/dd/yyyy',
  DISPLAY_LONG: 'EEEE, MMMM d, yyyy',
  ISO: 'yyyy-MM-dd',
  ISO_TIME: 'yyyy-MM-dd\'T\'HH:mm:ss',
  TIME: 'h:mm a',
  TIME_24: 'HH:mm',
  MONTH_YEAR: 'MMMM yyyy',
  YEAR: 'yyyy',
  API: 'yyyy-MM-dd',
  API_TIME: 'yyyy-MM-dd HH:mm:ss',
} as const;

// ==============================================
// FILE CONSTANTS
// ==============================================

export const FILE = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_SIZE_IMAGE: 5 * 1024 * 1024, // 5MB
  MAX_SIZE_VIDEO: 100 * 1024 * 1024, // 100MB
  MAX_SIZE_DOCUMENT: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  ALLOWED_DOCUMENTS: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  ALLOWED_VIDEOS: ['video/mp4', 'video/webm', 'video/ogg'],
  ALLOWED_AUDIO: ['audio/mpeg', 'audio/ogg', 'audio/wav'],
} as const;

// ==============================================
// CURRENCY CONSTANTS
// ==============================================

export const CURRENCIES = {
  USD: { code: 'USD', symbol: '$', name: 'US Dollar' },
  ZWL: { code: 'ZWL', symbol: 'Z$', name: 'Zimbabwean Dollar' },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro' },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound' },
  ZAR: { code: 'ZAR', symbol: 'R', name: 'South African Rand' },
} as const;

// ==============================================
// LANGUAGE CONSTANTS
// ==============================================

export const LANGUAGES = {
  en: { code: 'en', name: 'English', native: 'English' },
  sn: { code: 'sn', name: 'Shona', native: 'chiShona' },
  nd: { code: 'nd', name: 'Ndebele', native: 'isiNdebele' },
  fr: { code: 'fr', name: 'French', native: 'Français' },
  sw: { code: 'sw', name: 'Swahili', native: 'Kiswahili' },
  pt: { code: 'pt', name: 'Portuguese', native: 'Português' },
} as const;

// ==============================================
// THEME CONSTANTS
// ==============================================

export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
} as const;

// ==============================================
// ROLE CONSTANTS
// ==============================================

export const ROLES = {
  STUDENT: 'student',
  TUTOR: 'tutor',
  PARENT: 'parent',
  SCHOOL_ADMIN: 'school_admin',
  MINISTRY: 'ministry',
  SUPER_ADMIN: 'super_admin',
} as const;

export const ROLE_LABELS: Record<keyof typeof ROLES, string> = {
  STUDENT: 'Student',
  TUTOR: 'Tutor',
  PARENT: 'Parent',
  SCHOOL_ADMIN: 'School Administrator',
  MINISTRY: 'Ministry Official',
  SUPER_ADMIN: 'Super Administrator',
};

// ==============================================
// PERMISSION CONSTANTS
// ==============================================

export const PERMISSIONS = {
  // User permissions
  USER_VIEW: 'user:view',
  USER_CREATE: 'user:create',
  USER_UPDATE: 'user:update',
  USER_DELETE: 'user:delete',
  
  // Student permissions
  STUDENT_VIEW: 'student:view',
  STUDENT_CREATE: 'student:create',
  STUDENT_UPDATE: 'student:update',
  STUDENT_DELETE: 'student:delete',
  STUDENT_ENROLL: 'student:enroll',
  
  // Tutor permissions
  TUTOR_VIEW: 'tutor:view',
  TUTOR_CREATE: 'tutor:create',
  TUTOR_UPDATE: 'tutor:update',
  TUTOR_DELETE: 'tutor:delete',
  
  // Course permissions
  COURSE_VIEW: 'course:view',
  COURSE_CREATE: 'course:create',
  COURSE_UPDATE: 'course:update',
  COURSE_DELETE: 'course:delete',
  COURSE_ENROLL: 'course:enroll',
  
  // Assessment permissions
  ASSESSMENT_VIEW: 'assessment:view',
  ASSESSMENT_CREATE: 'assessment:create',
  ASSESSMENT_UPDATE: 'assessment:update',
  ASSESSMENT_DELETE: 'assessment:delete',
  ASSESSMENT_GRADE: 'assessment:grade',
  
  // Payment permissions
  PAYMENT_VIEW: 'payment:view',
  PAYMENT_CREATE: 'payment:create',
  PAYMENT_UPDATE: 'payment:update',
  PAYMENT_DELETE: 'payment:delete',
  PAYMENT_REFUND: 'payment:refund',
  
  // School permissions
  SCHOOL_VIEW: 'school:view',
  SCHOOL_CREATE: 'school:create',
  SCHOOL_UPDATE: 'school:update',
  SCHOOL_DELETE: 'school:delete',
  SCHOOL_VERIFY: 'school:verify',
  
  // Ministry permissions
  MINISTRY_VIEW: 'ministry:view',
  MINISTRY_CREATE: 'ministry:create',
  MINISTRY_UPDATE: 'ministry:update',
  MINISTRY_DELETE: 'ministry:delete',
  MINISTRY_VERIFY: 'ministry:verify',
  
  // System permissions
  SYSTEM_VIEW: 'system:view',
  SYSTEM_CONFIG: 'system:config',
  SYSTEM_BACKUP: 'system:backup',
  SYSTEM_RESTORE: 'system:restore',
  SYSTEM_LOGS: 'system:logs',
} as const;

// ==============================================
// ERROR MESSAGES
// ==============================================

export const ERROR_MESSAGES = {
  // Auth errors
  AUTH_INVALID_CREDENTIALS: 'Invalid email or password',
  AUTH_EMAIL_NOT_VERIFIED: 'Please verify your email address',
  AUTH_ACCOUNT_LOCKED: 'Account locked. Please contact support',
  AUTH_TOKEN_EXPIRED: 'Session expired. Please login again',
  AUTH_UNAUTHORIZED: 'You are not authorized to perform this action',
  AUTH_FORBIDDEN: 'Access denied',
  
  // Validation errors
  VALIDATION_REQUIRED: 'This field is required',
  VALIDATION_EMAIL: 'Please enter a valid email address',
  VALIDATION_PHONE: 'Please enter a valid phone number',
  VALIDATION_PASSWORD: 'Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character',
  VALIDATION_PASSWORD_MISMATCH: 'Passwords do not match',
  VALIDATION_MIN_LENGTH: (field: string, length: number) => `${field} must be at least ${length} characters`,
  VALIDATION_MAX_LENGTH: (field: string, length: number) => `${field} must not exceed ${length} characters`,
  VALIDATION_MIN_VALUE: (field: string, value: number) => `${field} must be at least ${value}`,
  VALIDATION_MAX_VALUE: (field: string, value: number) => `${field} must not exceed ${value}`,
  
  // Resource errors
  RESOURCE_NOT_FOUND: (resource: string) => `${resource} not found`,
  RESOURCE_ALREADY_EXISTS: (resource: string) => `${resource} already exists`,
  RESOURCE_CONFLICT: 'Resource conflict occurred',
  
  // Network errors
  NETWORK_ERROR: 'Network error. Please check your connection',
  NETWORK_TIMEOUT: 'Request timed out. Please try again',
  SERVER_ERROR: 'Server error. Please try again later',
  
  // File errors
  FILE_TOO_LARGE: (maxSize: string) => `File size must not exceed ${maxSize}`,
  FILE_TYPE_NOT_ALLOWED: 'File type not allowed',
  FILE_UPLOAD_FAILED: 'File upload failed',
  
  // Payment errors
  PAYMENT_FAILED: 'Payment failed. Please try again',
  PAYMENT_INSUFFICIENT_FUNDS: 'Insufficient funds',
  PAYMENT_METHOD_INVALID: 'Invalid payment method',
  
  // General errors
  UNKNOWN_ERROR: 'An unknown error occurred',
  OPERATION_FAILED: 'Operation failed. Please try again',
  FORM_INVALID: 'Please fix the errors in the form',
} as const;

// ==============================================
// SUCCESS MESSAGES
// ==============================================

export const SUCCESS_MESSAGES = {
  // Auth success
  AUTH_LOGIN_SUCCESS: 'Login successful',
  AUTH_REGISTER_SUCCESS: 'Registration successful. Please check your email to verify your account',
  AUTH_LOGOUT_SUCCESS: 'Logout successful',
  AUTH_EMAIL_VERIFIED: 'Email verified successfully',
  AUTH_PASSWORD_RESET: 'Password reset successful',
  AUTH_PASSWORD_CHANGED: 'Password changed successfully',
  
  // Resource success
  RESOURCE_CREATED: (resource: string) => `${resource} created successfully`,
  RESOURCE_UPDATED: (resource: string) => `${resource} updated successfully`,
  RESOURCE_DELETED: (resource: string) => `${resource} deleted successfully`,
  
  // File success
  FILE_UPLOADED: 'File uploaded successfully',
  FILE_DELETED: 'File deleted successfully',
  
  // Payment success
  PAYMENT_SUCCESS: 'Payment successful',
  PAYMENT_REFUNDED: 'Payment refunded successfully',
  
  // General success
  OPERATION_SUCCESS: 'Operation completed successfully',
  SAVE_SUCCESS: 'Changes saved successfully',
} as const;

// ==============================================
// TOAST DURATIONS
// ==============================================

export const TOAST_DURATION = {
  SHORT: 2000,
  MEDIUM: 4000,
  LONG: 6000,
  VERY_LONG: 8000,
  INFINITE: 0,
} as const;

// ==============================================
// ANIMATION DURATIONS
// ==============================================

export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
  VERY_SLOW: 1000,
} as const;

// ==============================================
// BREAKPOINTS (in pixels)
// ==============================================

export const BREAKPOINTS = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
  '3xl': 1920,
  '4xl': 2560,
} as const;

// ==============================================
// Z-INDEX VALUES
// ==============================================

export const Z_INDEX = {
  HIDDEN: -1,
  BASE: 0,
  DROPDOWN: 1000,
  STICKY: 1100,
  HEADER: 1200,
  OVERLAY: 1300,
  MODAL: 1400,
  POPOVER: 1500,
  TOOLTIP: 1600,
  TOAST: 1700,
  LOADING: 1800,
  MAX: 9999,
} as const;

// ==============================================
// GRADE LEVELS
// ==============================================

export const GRADE_LEVELS = {
  ECD: 'ECD',
  PRIMARY_1: 'Grade 1',
  PRIMARY_2: 'Grade 2',
  PRIMARY_3: 'Grade 3',
  PRIMARY_4: 'Grade 4',
  PRIMARY_5: 'Grade 5',
  PRIMARY_6: 'Grade 6',
  PRIMARY_7: 'Grade 7',
  FORM_1: 'Form 1',
  FORM_2: 'Form 2',
  FORM_3: 'Form 3',
  FORM_4: 'Form 4',
  FORM_5: 'Form 5',
  FORM_6: 'Form 6',
} as const;

// ==============================================
// SUBJECTS
// ==============================================

export const SUBJECTS = {
  MATHEMATICS: 'Mathematics',
  ENGLISH: 'English',
  SCIENCE: 'Science',
  HISTORY: 'History',
  GEOGRAPHY: 'Geography',
  SHONA: 'Shona',
  NDEBELE: 'Ndebele',
  PHYSICS: 'Physics',
  CHEMISTRY: 'Chemistry',
  BIOLOGY: 'Biology',
  ACCOUNTING: 'Accounting',
  BUSINESS_STUDIES: 'Business Studies',
  ECONOMICS: 'Economics',
  AGRICULTURE: 'Agriculture',
  COMPUTER_SCIENCE: 'Computer Science',
  ART: 'Art',
  MUSIC: 'Music',
  PHYSICAL_EDUCATION: 'Physical Education',
} as const;

// ==============================================
// TERMS
// ==============================================

export const TERMS = {
  TERM_1: 'Term 1',
  TERM_2: 'Term 2',
  TERM_3: 'Term 3',
} as const;

// ==============================================
// ASSESSMENT TYPES
// ==============================================

export const ASSESSMENT_TYPES = {
  QUIZ: 'quiz',
  TEST: 'test',
  EXAM: 'exam',
  ASSIGNMENT: 'assignment',
  PROJECT: 'project',
  PRACTICAL: 'practical',
} as const;

// ==============================================
// QUESTION TYPES
// ==============================================

export const QUESTION_TYPES = {
  MULTIPLE_CHOICE: 'multiple_choice',
  TRUE_FALSE: 'true_false',
  SHORT_ANSWER: 'short_answer',
  ESSAY: 'essay',
  MATCHING: 'matching',
  FILL_BLANK: 'fill_blank',
  NUMERICAL: 'numerical',
} as const;

// ==============================================
// PAYMENT METHODS
// ==============================================

export const PAYMENT_METHODS = {
  ECOCASH: 'ecocash',
  PAYNOW: 'paynow',
  STRIPE: 'stripe',
  CREDIT_CARD: 'credit_card',
  DEBIT_CARD: 'debit_card',
  BANK_TRANSFER: 'bank_transfer',
  CASH: 'cash',
  MOBILE_MONEY: 'mobile_money',
  ZIMSWITCH: 'zimswitch',
} as const;

// ==============================================
// SORT OPTIONS
// ==============================================

export const SORT_OPTIONS = {
  NEWEST: { value: 'createdAt_desc', label: 'Newest First' },
  OLDEST: { value: 'createdAt_asc', label: 'Oldest First' },
  NAME_ASC: { value: 'name_asc', label: 'Name (A-Z)' },
  NAME_DESC: { value: 'name_desc', label: 'Name (Z-A)' },
  PRICE_ASC: { value: 'price_asc', label: 'Price: Low to High' },
  PRICE_DESC: { value: 'price_desc', label: 'Price: High to Low' },
  RATING_DESC: { value: 'rating_desc', label: 'Highest Rated' },
  POPULARITY_DESC: { value: 'enrollmentCount_desc', label: 'Most Popular' },
} as const;

// ==============================================
// NOTE: No need to declare ImportMeta or ImportMetaEnv here
// Vite already provides these types. The code above works because:
// 1. import.meta.env is provided by Vite at runtime
// 2. TypeScript understands it through Vite's built-in type definitions
// 3. Adding custom declarations would conflict with Vite's types
// ==============================================