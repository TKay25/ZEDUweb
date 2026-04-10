import type { 
  UserRole, UserStatus, Gender,
  ID, Email, PhoneNumber, URL, DateTime, Address 
} from './index';

export interface User {
  id: ID;
  nationalId?: string;
  studentNumber?: string;
  tutorNumber?: string;
  employeeId?: string;
  
  firstName: string;
  lastName: string;
  fullName: string;
  email: Email;
  phone?: PhoneNumber;
  username?: string;
  
  role: UserRole;
  avatar?: URL;
  
  dateOfBirth?: DateTime;
  gender?: Gender;
  nationality?: string;
  
  address?: Address;
  
  isVerified: boolean;
  isActive: boolean;
  status: UserStatus;
  
  lastLogin?: DateTime;
  loginCount?: number;
  
  createdAt: DateTime;
  updatedAt: DateTime;
}

export interface UserPreferences {
  language: string;
  theme: 'light' | 'dark' | 'system';
  timezone: string;
  dateFormat: string;
  timeFormat: '12h' | '24h';
  currency: string;
  notifications: NotificationPreferences;
  privacy: PrivacySettings;
  accessibility: AccessibilitySettings;
}

export interface NotificationPreferences {
  email: {
    marketing: boolean;
    security: boolean;
    updates: boolean;
    newsletter: boolean;
  };
  push: {
    messages: boolean;
    mentions: boolean;
    comments: boolean;
    reminders: boolean;
  };
  sms: {
    alerts: boolean;
    verification: boolean;
    promotions: boolean;
  };
  inApp: {
    messages: boolean;
    notifications: boolean;
    announcements: boolean;
  };
  frequency: 'immediate' | 'daily' | 'weekly' | 'never';
  quietHours?: {
    enabled: boolean;
    start: string;
    end: string;
  };
}

export interface PrivacySettings {
  profileVisibility: 'public' | 'contacts' | 'private';
  showEmail: boolean;
  showPhone: boolean;
  showLocation: boolean;
  showActivity: boolean;
  allowTagging: boolean;
  allowMessaging: 'everyone' | 'contacts' | 'none';
  dataSharing: boolean;
}

export interface AccessibilitySettings {
  highContrast: boolean;
  fontSize: 'small' | 'medium' | 'large';
  reduceMotion: boolean;
  screenReader: boolean;
  keyboardNavigation: boolean;
}

export interface UserSession {
  id: ID;
  userId: ID;
  device: string;
  browser: string;
  os: string;
  ip: string;
  location?: string;
  lastActive: DateTime;
  createdAt: DateTime;
  isCurrent: boolean;
}

export interface UserActivity {
  id: ID;
  userId: ID;
  action: string;
  resourceType: string;
  resourceId?: ID;
  details?: Record<string, any>;
  ip?: string;
  userAgent?: string;
  timestamp: DateTime;
}

export interface UserStats {
  totalLogins: number;
  totalSessions: number;
  lastLogin: DateTime;
  accountAge: number;
  activitiesCount: number;
  notificationsCount: number;
  unreadNotifications: number;
}

export interface Permission {
  id: ID;
  name: string;
  description: string;
  resource: string;
  action: 'create' | 'read' | 'update' | 'delete' | 'manage';
  conditions?: Record<string, any>;
}

export interface Role {
  id: ID;
  name: string;
  description: string;
  permissions: string[];
  isSystem: boolean;
  createdAt: DateTime;
  updatedAt: DateTime;
}

export interface UserPermission {
  userId: ID;
  permissions: Permission[];
  roles: Role[];
  effectivePermissions: string[];
}

export interface UserFilter {
  role?: UserRole;
  status?: UserStatus;
  search?: string;
  dateFrom?: DateTime;
  dateTo?: DateTime;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface UserSummary {
  id: ID;
  fullName: string;
  email: Email;
  role: UserRole;
  avatar?: URL;
  status: UserStatus;
  lastActive?: DateTime;
}