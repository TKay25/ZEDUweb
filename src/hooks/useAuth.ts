import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Extended auth hook with role-specific helpers
export const useAuthWithRole = () => {
  const auth = useAuth();

  const isStudent = auth.user?.role === 'student';
  const isTutor = auth.user?.role === 'tutor';
  const isParent = auth.user?.role === 'parent';
  const isSchool = auth.user?.role === 'school';
  const isMinistry = auth.user?.role === 'ministry';
  const isAdmin = auth.user?.role === 'super_admin';

  const hasAnyRole = (roles: string[]) => {
    return auth.user ? roles.includes(auth.user.role) : false;
  };

  const hasAllRoles = (roles: string[]) => {
    return auth.user ? roles.every(role => role === auth.user?.role) : false;
  };

  return {
    ...auth,
    isStudent,
    isTutor,
    isParent,
    isSchool,
    isMinistry,
    isAdmin,
    hasAnyRole,
    hasAllRoles
  };
};