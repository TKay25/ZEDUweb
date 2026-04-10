import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authAPI from '../api/auth.api';
import { toast } from 'react-hot-toast';

// Define the API User type (what the API returns)
export interface APIUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'student' | 'tutor' | 'parent' | 'school' | 'ministry' | 'super_admin';
  avatar?: string;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

// Define the Context User type (extended with additional fields)
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'student' | 'tutor' | 'parent' | 'school' | 'ministry' | 'super_admin';
  avatar?: string;
  permissions: string[];
  emailVerified: boolean;
  phoneVerified: boolean;
  twoFactorEnabled: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  logout: () => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
  hasPermission: (permission: string) => boolean;
  hasRole: (roles: string | string[]) => boolean;
  refreshUser: () => Promise<void>;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'student' | 'tutor' | 'parent' | 'school' | 'ministry';
  phone?: string;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper function to get role from email (for demo purposes)
const getRoleFromEmail = (email: string): string => {
  const emailLower = email.toLowerCase();
  console.log('Detecting role from email:', emailLower);
  
  if (emailLower.includes('tutor') || emailLower.includes('teacher')) {
    console.log('Detected role: tutor');
    return 'tutor';
  }
  if (emailLower.includes('parent')) {
    console.log('Detected role: parent');
    return 'parent';
  }
  if (emailLower.includes('school') || emailLower.includes('admin')) {
    console.log('Detected role: school');
    return 'school';
  }
  if (emailLower.includes('ministry') || emailLower.includes('gov')) {
    console.log('Detected role: ministry');
    return 'ministry';
  }
  if (emailLower.includes('student')) {
    console.log('Detected role: student');
    return 'student';
  }
  
  console.log('No role detected, defaulting to student');
  return 'student';
};

// Helper function to get name from email (for demo purposes)
const getNameFromEmail = (email: string): { firstName: string; lastName: string } => {
  const emailLocal = email.split('@')[0];
  
  // Map common demo emails to proper names
  const nameMap: Record<string, { firstName: string; lastName: string }> = {
    'student': { firstName: 'John', lastName: 'Student' },
    'tutor': { firstName: 'Jane', lastName: 'Tutor' },
    'teacher': { firstName: 'Jane', lastName: 'Teacher' },
    'parent': { firstName: 'Mike', lastName: 'Parent' },
    'school': { firstName: 'Sarah', lastName: 'Admin' },
    'ministry': { firstName: 'David', lastName: 'Official' }
  };
  
  if (nameMap[emailLocal]) {
    return nameMap[emailLocal];
  }
  
  // Try to extract from email pattern like john.doe@example.com
  const parts = emailLocal.split('.');
  if (parts.length >= 2) {
    return {
      firstName: parts[0].charAt(0).toUpperCase() + parts[0].slice(1),
      lastName: parts[1].charAt(0).toUpperCase() + parts[1].slice(1)
    };
  }
  
  return { firstName: emailLocal, lastName: 'User' };
};

// Helper function to convert API user to Context user
const convertToContextUser = (apiUser: APIUser): User => {
  return {
    id: apiUser.id,
    email: apiUser.email,
    firstName: apiUser.firstName,
    lastName: apiUser.lastName,
    role: apiUser.role,
    avatar: apiUser.avatar,
    permissions: getPermissionsForRole(apiUser.role),
    emailVerified: apiUser.isEmailVerified,
    phoneVerified: false,
    twoFactorEnabled: false,
    lastLogin: undefined,
    createdAt: new Date(apiUser.createdAt),
    updatedAt: new Date(apiUser.updatedAt),
  };
};

// Helper function to get permissions based on role
const getPermissionsForRole = (role: string): string[] => {
  const basePermissions = ['view_profile', 'edit_profile', 'view_notifications'];
  
  const rolePermissions: Record<string, string[]> = {
    student: [...basePermissions, 'view_courses', 'take_quizzes', 'submit_assignments', 'view_grades'],
    tutor: [...basePermissions, 'create_courses', 'grade_assignments', 'manage_students', 'view_analytics'],
    parent: [...basePermissions, 'view_children', 'track_progress', 'view_reports'],
    school: [...basePermissions, 'manage_staff', 'manage_classes', 'view_school_analytics', 'manage_admissions'],
    ministry: [...basePermissions, 'view_all_schools', 'manage_curriculum', 'view_national_stats', 'manage_verifications'],
    super_admin: [...basePermissions, '*']
  };
  
  return rolePermissions[role] || basePermissions;
};

// Helper function to convert login response user to Context user
const convertLoginUserToContextUser = (loginUser: any): User => {
  const email = loginUser.email || '';
  
  // FORCE role detection from email - completely override API role
  const detectedRole = getRoleFromEmail(email);
  
  // Get name from email if not provided
  let firstName = loginUser.firstName || loginUser.name?.split(' ')[0] || '';
  let lastName = loginUser.lastName || loginUser.name?.split(' ')[1] || '';
  
  if (!firstName && !lastName) {
    const nameFromEmail = getNameFromEmail(email);
    firstName = nameFromEmail.firstName;
    lastName = nameFromEmail.lastName;
    console.log(`Generated name from email: ${firstName} ${lastName}`);
  }
  
  console.log(`Final user object - Role: ${detectedRole}, Name: ${firstName} ${lastName}, Email: ${email}`);
  
  return {
    id: loginUser.id || `demo-${Date.now()}`,
    email: email,
    firstName: firstName,
    lastName: lastName,
    role: detectedRole as User['role'], // Use detected role instead of API role
    avatar: loginUser.avatar,
    permissions: getPermissionsForRole(detectedRole),
    emailVerified: loginUser.emailVerified || loginUser.isEmailVerified || true,
    phoneVerified: loginUser.phoneVerified || false,
    twoFactorEnabled: loginUser.twoFactorEnabled || false,
    lastLogin: loginUser.lastLogin ? new Date(loginUser.lastLogin) : new Date(),
    createdAt: loginUser.createdAt ? new Date(loginUser.createdAt) : new Date(),
    updatedAt: loginUser.updatedAt ? new Date(loginUser.updatedAt) : new Date(),
  };
};

// Helper function to get dashboard path based on role
const getDashboardPath = (role: string): string => {
  const dashboardPaths: Record<string, string> = {
    student: '/student/dashboard',
    tutor: '/tutor/dashboard',
    parent: '/parent/dashboard',
    school: '/school/dashboard',
    ministry: '/ministry/dashboard',
    super_admin: '/admin/dashboard'
  };
  const path = dashboardPaths[role] || '/student/dashboard';
  console.log(`Dashboard path for role "${role}": ${path}`);
  return path;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authInitialized, setAuthInitialized] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
    const cleanup = setupTokenRefresh();
    return cleanup;
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
      
      console.log('Checking auth, token exists:', !!token);
      
      if (!token) {
        setIsLoading(false);
        setAuthInitialized(true);
        return;
      }

      const apiUser = await authAPI.getCurrentUser();
      console.log('Current user from API:', apiUser);
      
      if (apiUser) {
        const contextUser = convertToContextUser(apiUser as APIUser);
        setUser(contextUser);
        setIsAuthenticated(true);
        console.log('User authenticated with role:', contextUser.role);
      } else {
        throw new Error('No user data returned');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      // Token invalid or expired
      localStorage.removeItem('accessToken');
      sessionStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      sessionStorage.removeItem('refreshToken');
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
      setAuthInitialized(true);
    }
  };

  const setupTokenRefresh = () => {
    const interval = setInterval(async () => {
      const refreshToken = localStorage.getItem('refreshToken') || sessionStorage.getItem('refreshToken');
      if (refreshToken && isAuthenticated) {
        try {
          const response = await authAPI.refreshToken();
          const storage = localStorage.getItem('accessToken') ? localStorage : sessionStorage;
          storage.setItem('accessToken', response.accessToken);
          console.log('Token refreshed successfully');
        } catch (error) {
          console.error('Token refresh failed:', error);
          if (isAuthenticated) {
            await logout();
          }
        }
      }
    }, 50 * 60 * 1000);

    return () => clearInterval(interval);
  };

  const login = async (email: string, password: string, rememberMe = false): Promise<void> => {
    try {
      setIsLoading(true);
      console.log('========== LOGIN ATTEMPT ==========');
      console.log('Email:', email);
      
      const response = await authAPI.login({ email, password });
      console.log('Login API response received');
      
      const { user: loginUser, accessToken, refreshToken } = response;
      
      console.log('Raw user from API:', loginUser);
      console.log('API returned role:', loginUser.role);
      
      // Convert the user with email-based role detection
      const contextUser = convertLoginUserToContextUser(loginUser);
      console.log('========== FINAL USER ==========');
      console.log('Final role:', contextUser.role);
      console.log('Final name:', contextUser.firstName, contextUser.lastName);
      console.log('Final email:', contextUser.email);
      
      // Store tokens
      if (rememberMe) {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
      } else {
        sessionStorage.setItem('accessToken', accessToken);
        sessionStorage.setItem('refreshToken', refreshToken);
      }

      setUser(contextUser);
      setIsAuthenticated(true);
      
      toast.success(`Welcome back, ${contextUser.firstName}!`);
      
      // Redirect based on role
      const dashboardPath = getDashboardPath(contextUser.role);
      console.log(`========== REDIRECTING TO: ${dashboardPath} ==========`);
      navigate(dashboardPath, { replace: true });
      
      return;
    } catch (error: any) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      sessionStorage.removeItem('accessToken');
      sessionStorage.removeItem('refreshToken');
      setUser(null);
      setIsAuthenticated(false);
      navigate('/login', { replace: true });
      toast.success('Logged out successfully');
    }
  };

  const register = async (userData: RegisterData): Promise<void> => {
    try {
      setIsLoading(true);
      await authAPI.register(userData);
      
      toast.success('Registration successful! Please check your email to verify your account.');
      navigate('/login');
    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error(error.response?.data?.message || 'Registration failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyEmail = async (token: string): Promise<void> => {
    try {
      setIsLoading(true);
      await authAPI.verifyEmail(token);
      toast.success('Email verified successfully! You can now log in.');
      navigate('/login');
    } catch (error: any) {
      console.error('Email verification error:', error);
      toast.error(error.response?.data?.message || 'Email verification failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const forgotPassword = async (email: string): Promise<void> => {
    try {
      setIsLoading(true);
      await authAPI.requestPasswordReset({ email });
      toast.success('Password reset instructions sent to your email');
    } catch (error: any) {
      console.error('Forgot password error:', error);
      toast.error(error.response?.data?.message || 'Failed to send reset email');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (token: string, password: string): Promise<void> => {
    try {
      setIsLoading(true);
      await authAPI.resetPassword({ token, newPassword: password });
      toast.success('Password reset successfully! You can now log in.');
      navigate('/login');
    } catch (error: any) {
      console.error('Password reset error:', error);
      toast.error(error.response?.data?.message || 'Password reset failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = (userData: Partial<User>): void => {
    setUser(prev => prev ? { ...prev, ...userData } : null);
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    if (user.permissions.includes('*')) return true;
    return user.permissions.includes(permission);
  };

  const hasRole = (roles: string | string[]): boolean => {
    if (!user) return false;
    const roleArray = Array.isArray(roles) ? roles : [roles];
    return roleArray.includes(user.role);
  };

  const refreshUser = async (): Promise<void> => {
    try {
      const apiUser = await authAPI.getCurrentUser();
      if (apiUser) {
        const contextUser = convertToContextUser(apiUser as APIUser);
        setUser(contextUser);
        console.log('User refreshed:', contextUser);
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    register,
    verifyEmail,
    forgotPassword,
    resetPassword,
    updateUser,
    hasPermission,
    hasRole,
    refreshUser
  };

  // Don't render children until auth is initialized
  if (!authInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};