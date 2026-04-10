// src/components/layout/types/layout.types.ts
import { ReactNode } from 'react';

export type UserRole = 'student' | 'tutor' | 'parent' | 'school' | 'ministry' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  notifications?: number;
}

export interface NavItem {
  id: string;
  label: string;
  path: string;
  icon: ReactNode;
  roles?: UserRole[];
  children?: NavItem[];
  badge?: number;
}

export interface BreadcrumbItem {
  label: string;
  path: string;
  icon?: ReactNode;
}

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  link?: string;
}

// Make children optional to support both patterns
export interface LayoutProps {
  children?: ReactNode;
}