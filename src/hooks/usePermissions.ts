import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';

interface Permission {
  id: string;
  name: string;
  description: string;
  resource: string;
  action: 'create' | 'read' | 'update' | 'delete' | 'manage';
  userId?: string; // Add optional userId property
}

// Remove unused Role interface
// interface Role {
//   id: string;
//   name: string;
//   permissions: string[];
// }

export function usePermissions() {
  const { user, hasPermission } = useAuth();

  const can = useCallback((permission: string): boolean => {
    return hasPermission(permission);
  }, [hasPermission]);

  const canAny = useCallback((permissions: string[]): boolean => {
    return permissions.some(p => hasPermission(p));
  }, [hasPermission]);

  const canAll = useCallback((permissions: string[]): boolean => {
    return permissions.every(p => hasPermission(p));
  }, [hasPermission]);

  const cannot = useCallback((permission: string): boolean => {
    return !hasPermission(permission);
  }, [hasPermission]);

  return {
    can,
    canAny,
    canAll,
    cannot,
    userPermissions: user?.permissions || []
  };
}

// Hook for checking role-based access
export function useRoles() {
  const { user, hasRole } = useAuth();

  const isStudent = hasRole('student');
  const isTutor = hasRole('tutor');
  const isParent = hasRole('parent');
  const isSchool = hasRole('school');
  const isMinistry = hasRole('ministry');
  const isAdmin = hasRole('super_admin');

  const hasAnyRole = useCallback((roles: string[]) => {
    return roles.some(r => hasRole(r));
  }, [hasRole]);

  const hasAllRoles = useCallback((roles: string[]) => {
    return roles.every(r => hasRole(r));
  }, [hasRole]);

  return {
    role: user?.role,
    isStudent,
    isTutor,
    isParent,
    isSchool,
    isMinistry,
    isAdmin,
    hasAnyRole,
    hasAllRoles
  };
}

// Hook for resource-based permissions
export function useResourcePermissions(resourceId: string, resourceType: string) {
  const { user } = useAuth();
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPermissions = async () => {
      try {
        // API call to get resource-specific permissions
        const response = await fetch(`/api/permissions/${resourceType}/${resourceId}`);
        const data = await response.json();
        setPermissions(data);
      } catch (error) {
        console.error('Failed to load permissions:', error);
      } finally {
        setLoading(false);
      }
    };

    if (resourceId && resourceType) {
      loadPermissions();
    }
  }, [resourceId, resourceType]);

  const canAccess = useCallback((action: string): boolean => {
    // Check if user is owner (manage permission)
    if (permissions.some(p => p.userId === user?.id && p.action === 'manage')) {
      return true;
    }

    // Check specific permission
    return permissions.some(p => 
      p.userId === user?.id && p.action === action
    );
  }, [permissions, user]);

  const isOwner = useCallback((): boolean => {
    return permissions.some(p => 
      p.userId === user?.id && p.action === 'manage'
    );
  }, [permissions, user]);

  return {
    loading,
    permissions,
    canAccess,
    isOwner
  };
}

// Hook for feature flags
export function useFeatureFlag(flagName: string) {
  const [isEnabled, setIsEnabled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkFeatureFlag = async () => {
      try {
        const response = await fetch(`/api/features/${flagName}`);
        const data = await response.json();
        setIsEnabled(data.enabled);
      } catch (error) {
        console.error('Failed to check feature flag:', error);
        setIsEnabled(false);
      } finally {
        setLoading(false);
      }
    };

    checkFeatureFlag();
  }, [flagName]);

  return { isEnabled, loading };
}