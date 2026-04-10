// ==============================================
// PERMISSION UTILITIES
// ==============================================

import type { UserRole } from '../types';
import { PERMISSIONS } from './constants';

/**
 * Permission checker
 */
export const permissions = {
  /**
   * Check if user has a specific permission
   */
  hasPermission: (userPermissions: string[], permission: string): boolean => {
    return userPermissions.includes(permission) || userPermissions.includes('*');
  },

  /**
   * Check if user has any of the given permissions
   */
  hasAnyPermission: (userPermissions: string[], permissions: string[]): boolean => {
    return permissions.some((p) => userPermissions.includes(p) || userPermissions.includes('*'));
  },

  /**
   * Check if user has all of the given permissions
   */
  hasAllPermissions: (userPermissions: string[], permissions: string[]): boolean => {
    return permissions.every((p) => userPermissions.includes(p) || userPermissions.includes('*'));
  },

  /**
   * Check if user has role-based permission
   */
  hasRolePermission: (userRole: UserRole, requiredRole: UserRole | UserRole[]): boolean => {
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    return roles.includes(userRole);
  },

  /**
   * Check if user has resource ownership
   */
  isOwner: (userId: string | undefined, resourceUserId: string): boolean => {
    return userId === resourceUserId;
  },

  /**
   * Check if user can access resource based on ownership and permissions
   */
  canAccess: (
    userId: string | undefined,
    resourceUserId: string,
    userPermissions: string[],
    requiredPermission: string
  ): boolean => {
    return permissions.isOwner(userId, resourceUserId) || 
           permissions.hasPermission(userPermissions, requiredPermission);
  },
};

/**
 * Role-based permission maps
 */
export const rolePermissions: Record<UserRole, string[]> = {
  student: [
    PERMISSIONS.USER_VIEW,
    PERMISSIONS.USER_UPDATE,
    PERMISSIONS.COURSE_VIEW,
    PERMISSIONS.COURSE_ENROLL,
    PERMISSIONS.ASSESSMENT_VIEW,
    PERMISSIONS.ASSESSMENT_CREATE,
  ],
  
  tutor: [
    PERMISSIONS.USER_VIEW,
    PERMISSIONS.USER_UPDATE,
    PERMISSIONS.STUDENT_VIEW,
    PERMISSIONS.COURSE_VIEW,
    PERMISSIONS.COURSE_CREATE,
    PERMISSIONS.COURSE_UPDATE,
    PERMISSIONS.ASSESSMENT_VIEW,
    PERMISSIONS.ASSESSMENT_CREATE,
    PERMISSIONS.ASSESSMENT_UPDATE,
    PERMISSIONS.ASSESSMENT_GRADE,
  ],
  
  parent: [
    PERMISSIONS.USER_VIEW,
    PERMISSIONS.USER_UPDATE,
    PERMISSIONS.STUDENT_VIEW,
    PERMISSIONS.PAYMENT_VIEW,
    PERMISSIONS.PAYMENT_CREATE,
  ],
  
  school_admin: [
    PERMISSIONS.USER_VIEW,
    PERMISSIONS.USER_CREATE,
    PERMISSIONS.USER_UPDATE,
    PERMISSIONS.USER_DELETE,
    PERMISSIONS.STUDENT_VIEW,
    PERMISSIONS.STUDENT_CREATE,
    PERMISSIONS.STUDENT_UPDATE,
    PERMISSIONS.STUDENT_DELETE,
    PERMISSIONS.STUDENT_ENROLL,
    PERMISSIONS.TUTOR_VIEW,
    PERMISSIONS.TUTOR_CREATE,
    PERMISSIONS.TUTOR_UPDATE,
    PERMISSIONS.TUTOR_DELETE,
    PERMISSIONS.COURSE_VIEW,
    PERMISSIONS.COURSE_CREATE,
    PERMISSIONS.COURSE_UPDATE,
    PERMISSIONS.COURSE_DELETE,
    PERMISSIONS.ASSESSMENT_VIEW,
    PERMISSIONS.ASSESSMENT_CREATE,
    PERMISSIONS.ASSESSMENT_UPDATE,
    PERMISSIONS.ASSESSMENT_DELETE,
    PERMISSIONS.ASSESSMENT_GRADE,
    PERMISSIONS.PAYMENT_VIEW,
    PERMISSIONS.PAYMENT_CREATE,
    PERMISSIONS.PAYMENT_UPDATE,
    PERMISSIONS.SCHOOL_VIEW,
    PERMISSIONS.SCHOOL_UPDATE,
  ],
  
  ministry: [
    PERMISSIONS.USER_VIEW,
    PERMISSIONS.STUDENT_VIEW,
    PERMISSIONS.TUTOR_VIEW,
    PERMISSIONS.SCHOOL_VIEW,
    PERMISSIONS.SCHOOL_VERIFY,
    PERMISSIONS.MINISTRY_VIEW,
    PERMISSIONS.MINISTRY_CREATE,
    PERMISSIONS.MINISTRY_UPDATE,
    PERMISSIONS.SYSTEM_VIEW,
    PERMISSIONS.SYSTEM_LOGS,
  ],
  
  super_admin: ['*'], // All permissions
};

/**
 * Get permissions for a role
 */
export function getPermissionsForRole(role: UserRole): string[] {
  return rolePermissions[role] || [];
}

/**
 * Check if user has permission for an action on a resource
 */
export function can(
  _userRole: UserRole,  // Added underscore to indicate intentionally unused
  userPermissions: string[],
  action: string,
  resource: string
): boolean {
  const permission = `${resource}:${action}`;
  return permissions.hasPermission(userPermissions, permission);
}

/**
 * Check if user can create a resource
 */
export function canCreate(
  userRole: UserRole, 
  userPermissions: string[], 
  resource: string
): boolean {
  return can(userRole, userPermissions, 'create', resource);
}

/**
 * Check if user can read a resource
 */
export function canRead(
  userRole: UserRole, 
  userPermissions: string[], 
  resource: string
): boolean {
  return can(userRole, userPermissions, 'view', resource) ||
         can(userRole, userPermissions, 'read', resource);
}

/**
 * Check if user can update a resource
 */
export function canUpdate(
  userRole: UserRole, 
  userPermissions: string[], 
  resource: string
): boolean {
  return can(userRole, userPermissions, 'update', resource);
}

/**
 * Check if user can delete a resource
 */
export function canDelete(
  userRole: UserRole, 
  userPermissions: string[], 
  resource: string
): boolean {
  return can(userRole, userPermissions, 'delete', resource);
}

/**
 * Check if user can manage a resource (all actions)
 */
export function canManage(
  userRole: UserRole, 
  userPermissions: string[], 
  resource: string
): boolean {
  return can(userRole, userPermissions, 'manage', resource) ||
         (canCreate(userRole, userPermissions, resource) &&
          canRead(userRole, userPermissions, resource) &&
          canUpdate(userRole, userPermissions, resource) &&
          canDelete(userRole, userPermissions, resource));
}

/**
 * Get allowed resources based on permissions
 */
export function getAllowedResources(
  userRole: UserRole,
  userPermissions: string[],
  resources: string[],
  action: string
): string[] {
  return resources.filter((resource) => can(userRole, userPermissions, action, resource));
}

/**
 * Permission middleware for routes
 */
export function requirePermission(permission: string) {
  return (userPermissions: string[]): boolean => {
    return permissions.hasPermission(userPermissions, permission);
  };
}

/**
 * Permission middleware for roles
 */
export function requireRole(roles: UserRole | UserRole[]) {
  return (userRole: UserRole): boolean => {
    return permissions.hasRolePermission(userRole, roles);
  };
}

/**
 * Permission middleware for ownership
 */
export function requireOwnership(resourceUserId: string) {
  return (userId: string | undefined): boolean => {
    return permissions.isOwner(userId, resourceUserId);
  };
}

/**
 * Combine permission checks
 */
export function and(...checks: ((...args: any[]) => boolean)[]) {
  return (...args: any[]): boolean => {
    return checks.every((check) => check(...args));
  };
}

/**
 * Combine permission checks with OR
 */
export function or(...checks: ((...args: any[]) => boolean)[]) {
  return (...args: any[]): boolean => {
    return checks.some((check) => check(...args));
  };
}

/**
 * Check if user can access a feature
 */
export function canAccessFeature(
  userRole: UserRole,
  feature: string,
  featureRoles: Record<string, UserRole[]>
): boolean {
  const allowedRoles = featureRoles[feature] || [];
  return allowedRoles.includes(userRole);
}

/**
 * Get visible menu items based on permissions
 */
export function getVisibleMenuItems<T extends { permissions?: string[]; roles?: UserRole[] }>(
  items: T[],
  userRole: UserRole,
  userPermissions: string[]
): T[] {
  return items.filter((item) => {
    if (item.roles && !item.roles.includes(userRole)) return false;
    if (item.permissions && !permissions.hasAnyPermission(userPermissions, item.permissions)) return false;
    return true;
  });
}

/**
 * Check if user can perform bulk operations
 */
export function canBulkOperation(
  userIds: string[],
  currentUserId: string | undefined,
  userRole: UserRole,
  userPermissions: string[],
  requiredPermission: string
): boolean {
  // Super admin can do anything
  if (userRole === 'super_admin') return true;
  
  // Check if user has bulk permission
  if (!permissions.hasPermission(userPermissions, requiredPermission)) return false;
  
  // If user is not admin, they can only operate on their own records
  if (userRole !== 'school_admin' && userRole !== 'ministry') {
    return userIds.length === 1 && userIds[0] === currentUserId;
  }
  
  return true;
}