// src/types/auth.types.ts
import type { ID, Email, DateTime } from './index';

export type UserRole = 'student' | 'tutor' | 'parent' | 'school' | 'ministry';
// Form-specific types for LoginForm
export interface LoginFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface ValidationErrors {
  [key: string]: string;
}

// Re-export UserRole if it's not already exported from index
// If UserRole is not exported from './index', uncomment the line below:
// export type UserRole = 'student' | 'tutor' | 'parent' | 'school' | 'ministry';

export interface LoginCredentials {
  identifier: string;
  password: string;
  remember?: boolean;
}

export interface RegisterData {
  role: UserRole;
  
  // Common fields
  firstName: string;
  lastName: string;
  email: Email;
  phone?: string;
  username?: string;
  password: string;
  passwordConfirm: string;
  
  // Student specific
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  nationality?: string;
  educationLevel?: string;
  subjects?: string;
  
  // Tutor specific
  qualifications?: string;
  teachingLevels?: string[];
  teachingSubjects?: string;
  yearsOfExperience?: number;
  
  // Parent specific
  relationship?: string;
  linkedStudentId?: string;
  
  // School Admin specific
  school_name?: string;
  type?: string;
  school_code?: string;
  ministry_reg_no?: string;
  location?: string;
  contact_details?: string;
  head_first_name?: string;
  head_last_name?: string;
  head_role?: string;
  
  // Ministry specific
  institution_name?: string;
  department?: string;
  role_title?: string;
  officer_first_name?: string;
  officer_last_name?: string;
}

export interface AuthResponse {
  status: 'success' | 'error';
  token: string;
  refreshToken?: string;
  data: {
    user: any; // User type from user.types
  };
}

export interface TokenPayload {
  sub: ID;
  email: Email;
  role: UserRole;
  permissions: string[];
  iat: number;
  exp: number;
}

export interface RefreshTokenData {
  refreshToken: string;
}

export interface PasswordResetRequest {
  email: Email;
}

export interface PasswordResetConfirm {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface EmailVerificationRequest {
  token: string;
}

export interface TwoFactorSetup {
  secret: string;
  qrCode: string;
  backupCodes: string[];
}

export interface TwoFactorVerify {
  code: string;
  method?: 'app' | 'sms' | 'email';
}

export interface TwoFactorDisable {
  password: string;
  code?: string;
}

export interface AuthError {
  code: string;
  message: string;
  field?: string;
}

export interface SessionInfo {
  id: ID;
  userId: ID;
  device: string;
  browser: string;
  os: string;
  ip: string;
  location?: string;
  lastActive: DateTime;
  createdAt: DateTime;
  expiresAt: DateTime;
}

export interface LoginHistory {
  id: ID;
  userId: ID;
  timestamp: DateTime;
  ip: string;
  device: string;
  browser: string;
  os: string;
  location?: string;
  success: boolean;
  failureReason?: string;
}

export interface MfaMethod {
  type: 'app' | 'sms' | 'email';
  enabled: boolean;
  verified: boolean;
  phoneNumber?: string;
  email?: string;
}

export interface SecuritySettings {
  twoFactorEnabled: boolean;
  mfaMethods: MfaMethod[];
  loginAlerts: boolean;
  sessionTimeout: number;
  trustedDevices: TrustedDevice[];
  passwordLastChanged: DateTime;
  passwordExpiresIn?: number;
}

export interface TrustedDevice {
  id: ID;
  name: string;
  deviceId: string;
  lastUsed: DateTime;
  location?: string;
}

export interface AuthState {
  user: any | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: AuthError | null;
  session: SessionInfo | null;
}

export interface OAuthProvider {
  provider: 'google' | 'facebook' | 'microsoft' | 'github';
  clientId: string;
  redirectUri: string;
  scope?: string[];
}

export interface OAuthCallbackData {
  code: string;
  state?: string;
  provider: string;
}

export interface ImpersonateData {
  userId: ID;
  reason?: string;
  duration?: number;
}

export interface ImpersonateSession {
  originalUser: any;
  impersonatedUser: any;
  expiresAt: DateTime;
  token: string;
}