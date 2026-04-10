import type {  PaginationMeta,  UserRole } from './index';
//import type { User } from './user.types';

// ==============================================
// API REQUEST TYPES
// ==============================================

export interface ApiRequestOptions {
  baseURL?: string;
  headers?: Record<string, string>;
  params?: Record<string, any>;
  timeout?: number;
  withCredentials?: boolean;
  responseType?: 'json' | 'blob' | 'text' | 'arraybuffer' | 'document';
  onUploadProgress?: (progressEvent: any) => void;
  onDownloadProgress?: (progressEvent: any) => void;
  signal?: AbortSignal;
  cache?: RequestCache;
  mode?: RequestMode;
  credentials?: RequestCredentials;
}

export interface ApiRequestConfig extends ApiRequestOptions {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS';
  data?: any;
}

export interface ApiErrorResponse {
  status: 'error';
  code: string;
  message: string;
  details?: Record<string, any>;
  stack?: string;
  timestamp: string;
  path?: string;
  method?: string;
  requestId?: string;
}

export interface ApiValidationError {
  field: string;
  message: string;
  code?: string;
  value?: any;
  constraints?: Record<string, string>;
}

export interface ApiError extends Error {
  code?: string;
  status?: number;
  response?: ApiErrorResponse;
  validationErrors?: ApiValidationError[];
  config?: ApiRequestConfig;
  isAxiosError?: boolean;
  request?: any;
}

// ==============================================
// API ENDPOINT TYPES
// ==============================================

export interface ApiEndpoints {
  auth: {
    login: '/auth/login';
    register: '/auth/register';
    logout: '/auth/logout';
    refresh: '/auth/refresh';
    verifyEmail: '/auth/verify-email';
    forgotPassword: '/auth/forgot-password';
    resetPassword: '/auth/reset-password';
    changePassword: '/auth/change-password';
    me: '/auth/me';
  };
  users: {
    list: '/users';
    detail: (id: string | number) => `/users/${string | number}`;
    update: (id: string | number) => `/users/${string | number}`;
    delete: (id: string | number) => `/users/${string | number}`;
    profile: '/users/profile';
    settings: '/users/settings';
    activity: (id: string | number) => `/users/${string | number}/activity`;
  };
  students: {
    list: '/students';
    detail: (id: string | number) => `/students/${string | number}`;
    enrollments: (id: string | number) => `/students/${string | number}/enrollments`;
    grades: (id: string | number) => `/students/${string | number}/grades`;
    attendance: (id: string | number) => `/students/${string | number}/attendance`;
    progress: (id: string | number) => `/students/${string | number}/progress`;
  };
  tutors: {
    list: '/tutors';
    detail: (id: string | number) => `/tutors/${string | number}`;
    courses: (id: string | number) => `/tutors/${string | number}/courses`;
    earnings: (id: string | number) => `/tutors/${string | number}/earnings`;
    schedule: (id: string | number) => `/tutors/${string | number}/schedule`;
    availability: (id: string | number) => `/tutors/${string | number}/availability`;
  };
  parents: {
    list: '/parents';
    detail: (id: string | number) => `/parents/${string | number}`;
    children: (id: string | number) => `/parents/${string | number}/children`;
    payments: (id: string | number) => `/parents/${string | number}/payments`;
  };
  schools: {
    list: '/schools';
    detail: (id: string | number) => `/schools/${string | number}`;
    classes: (id: string | number) => `/schools/${string | number}/classes`;
    staff: (id: string | number) => `/schools/${string | number}/staff`;
    students: (id: string | number) => `/schools/${string | number}/students`;
    performance: (id: string | number) => `/schools/${string | number}/performance`;
    verification: (id: string | number) => `/schools/${string | number}/verification`;
  };
  ministry: {
    dashboard: '/ministry/dashboard';
    schools: '/ministry/schools';
    statistics: '/ministry/statistics';
    reports: '/ministry/reports';
    policies: '/ministry/policies';
    compliance: '/ministry/compliance';
  };
  courses: {
    list: '/courses';
    detail: (id: string | number) => `/courses/${string | number}`;
    lessons: (id: string | number) => `/courses/${string | number}/lessons`;
    enroll: (id: string | number) => `/courses/${string | number}/enroll`;
    progress: (id: string | number) => `/courses/${string | number}/progress`;
    reviews: (id: string | number) => `/courses/${string | number}/reviews`;
  };
  assessments: {
    assignments: '/assessments/assignments';
    quizzes: '/assessments/quizzes';
    exams: '/assessments/exams';
    submissions: '/assessments/submissions';
    grades: '/assessments/grades';
  };
  payments: {
    transactions: '/payments/transactions';
    invoices: '/payments/invoices';
    methods: '/payments/methods';
    scholarships: '/payments/scholarships';
    receipts: (id: string | number) => `/payments/receipts/${string | number}`;
  };
  ai: {
    chat: '/ai/chat';
    generateQuiz: '/ai/generate-quiz';
    summarize: '/ai/summarize';
    recommend: '/ai/recommend';
    predict: '/ai/predict';
  };
  video: {
    token: '/video/token';
    rooms: '/video/rooms';
    recordings: '/video/recordings';
  };
  communications: {
    messages: '/communications/messages';
    conversations: '/communications/conversations';
    announcements: '/communications/announcements';
    notifications: '/communications/notifications';
  };
  system: {
    health: '/system/health';
    metrics: '/system/metrics';
    logs: '/system/logs';
    config: '/system/config';
    backup: '/system/backup';
  };
}

// ==============================================
// API FILTER TYPES
// ==============================================

export interface ApiFilter {
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  fields?: string[];
  include?: string[];
}

export interface DateRangeFilter {
  startDate?: string;
  endDate?: string;
}

export interface StatusFilter {
  status?: string | string[];
}

export interface UserFilter extends ApiFilter, DateRangeFilter, StatusFilter {
  role?: UserRole | UserRole[];
  isVerified?: boolean;
  isActive?: boolean;
}

export interface StudentFilter extends UserFilter {
  grade?: string | string[];
  class?: string | string[];
  schoolId?: string | number | (string | number)[];
  guardianId?: string | number | (string | number)[];
}

export interface TutorFilter extends UserFilter {
  subject?: string | string[];
  qualification?: string | string[];
  minRating?: number;
  isVerified?: boolean;
}

export interface SchoolFilter extends ApiFilter, StatusFilter {
  type?: string | string[];
  province?: string | string[];
  district?: string | string[];
  ownership?: string | string[];
  verificationStatus?: string | string[];
}

export interface CourseFilter extends ApiFilter, StatusFilter {
  subjectId?: string | number | (string | number)[];
  tutorId?: string | number | (string | number)[];
  level?: string | string[];
  difficulty?: string | string[];
  isFree?: boolean;
  minPrice?: number;
  maxPrice?: number;
  category?: string | string[];
}

export interface PaymentFilter extends ApiFilter, DateRangeFilter {
  studentId?: string | number | (string | number)[];
  schoolId?: string | number | (string | number)[];
  status?: string | string[];
  paymentMethod?: string | string[];
  minAmount?: number;
  maxAmount?: number;
}

// ==============================================
// API RESPONSE TYPES
// ==============================================

export interface ApiListResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface ApiDetailResponse<T> {
  data: T;
}

export interface ApiCreateResponse<T> {
  data: T;
  message: string;
}

export interface ApiUpdateResponse<T> {
  data: T;
  message: string;
}

export interface ApiDeleteResponse {
  message: string;
  id: string | number;
}

export interface ApiBulkResponse {
  success: (string | number)[];
  failed: Array<{ id: string | number; error: string }>;
  message: string;
}

export interface ApiImportResponse {
  imported: number;
  failed: number;
  errors: Array<{ row: number; error: string }>;
}

export interface ApiExportResponse {
  url: string;
  filename: string;
  format: 'csv' | 'excel' | 'pdf';
  size: number;
}

// ==============================================
// API WEBHOOK TYPES
// ==============================================

export interface WebhookPayload<T = any> {
  event: string;
  timestamp: string;
  data: T;
  signature?: string;
  version?: string;
}

export interface PaymentWebhookPayload {
  transactionId: string;
  status: string;
  amount: number;
  currency: string;
  payerId: string;
  payeeId: string;
  paymentMethod: string;
  metadata?: Record<string, any>;
}

export interface VideoWebhookPayload {
  roomId: string;
  event: 'recording-ready' | 'transcription-ready' | 'participant-joined' | 'participant-left';
  data: any;
}

export interface AIWebhookPayload {
  jobId: string;
  status: 'completed' | 'failed' | 'processing';
  result?: any;
  error?: string;
}

// ==============================================
// API HEALTH TYPES
// ==============================================

export interface ApiHealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  version: string;
  uptime: number;
  timestamp: string;
  services: Record<string, ServiceHealth>;
  dependencies: Record<string, DependencyHealth>;
}

export interface ServiceHealth {
  status: 'up' | 'down' | 'degraded';
  latency: number;
  lastCheck: string;
  message?: string;
}

export interface DependencyHealth {
  name: string;
  status: 'connected' | 'disconnected' | 'error';
  latency?: number;
  error?: string;
}

// ==============================================
// API RATE LIMIT TYPES
// ==============================================

export interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: number;
  retryAfter?: number;
}

export interface RateLimitConfig {
  windowMs: number;
  max: number;
  message?: string;
  statusCode?: number;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
}

// ==============================================
// API CACHE TYPES
// ==============================================

export interface CacheConfig {
  ttl: number;
  key?: string;
  staleWhileRevalidate?: boolean;
  tags?: string[];
}

export interface CacheStats {
  hits: number;
  misses: number;
  keys: number;
  size: number;
  hitRate: number;
}

// ==============================================
// API VERSION TYPES
// ==============================================

export interface ApiVersion {
  current: string;
  latest: string;
  deprecated: string[];
  sunset?: string;
  changelog: ApiChangelog[];
}

export interface ApiChangelog {
  version: string;
  date: string;
  changes: string[];
  breaking: boolean;
}

// ==============================================
// API DOCUMENTATION TYPES
// ==============================================

export interface ApiEndpoint {
  path: string;
  method: string;
  description: string;
  tags: string[];
  parameters: ApiParameter[];
  requestBody?: ApiRequestBody;
  responses: Record<string, ApiResponseDoc>;
  security?: ApiSecurity[];
  deprecated?: boolean;
}

export interface ApiParameter {
  name: string;
  in: 'query' | 'path' | 'header' | 'cookie';
  required?: boolean;
  schema: ApiSchema;
  description?: string;
  example?: any;
}

export interface ApiRequestBody {
  required?: boolean;
  content: Record<string, ApiMediaType>;
  description?: string;
}

export interface ApiResponseDoc {
  description: string;
  content?: Record<string, ApiMediaType>;
}

export interface ApiMediaType {
  schema: ApiSchema;
  example?: any;
  examples?: Record<string, ApiExample>;
}

export interface ApiSchema {
  type?: string;
  properties?: Record<string, ApiSchema>;
  items?: ApiSchema;
  required?: string[];
  enum?: any[];
  format?: string;
  pattern?: string;
  minimum?: number;
  maximum?: number;
  minLength?: number;
  maxLength?: number;
}

export interface ApiExample {
  summary?: string;
  description?: string;
  value: any;
}

export interface ApiSecurity {
  [key: string]: string[];
}

export interface ApiInfo {
  title: string;
  description: string;
  version: string;
  contact?: ApiContact;
  license?: ApiLicense;
}

export interface ApiContact {
  name?: string;
  email?: string;
  url?: string;
}

export interface ApiLicense {
  name: string;
  url?: string;
}

export interface ApiServer {
  url: string;
  description?: string;
  variables?: Record<string, ApiServerVariable>;
}

export interface ApiServerVariable {
  enum?: string[];
  default: string;
  description?: string;
}