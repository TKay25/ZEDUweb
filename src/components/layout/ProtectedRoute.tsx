import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Spinner from '../ui/Spinner';
import Alert from '../ui/Alert';

interface ProtectedRouteProps {
  allowedRoles?: string[];
  redirectTo?: string;
  children?: React.ReactNode;
}

// Define role-specific dashboard routes
const ROLE_DASHBOARD = {
  student: '/student/dashboard',
  tutor: '/tutor/dashboard',
  parent: '/parent/dashboard',
  school_admin: '/school/dashboard',
  ministry_official: '/ministry/dashboard'
} as const;

// Define public paths (exact matches only, no wildcards to avoid conflicts)
const PUBLIC_PATHS = [
  '/',
  '/about',
  '/features',
  '/contact',
  '/pricing',
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/verify-email',
  '/unauthorized'
];

// Define auth-related paths
const AUTH_PATHS = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/verify-email'
];

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  allowedRoles = [],
  redirectTo = '/login',
  children 
}) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();
  const [showSessionAlert, setShowSessionAlert] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Check if current path is public
  const isPublicPath = PUBLIC_PATHS.includes(location.pathname);
  
  // Check if current path is auth-related
  const isAuthPath = AUTH_PATHS.includes(location.pathname);

  // Check for session expiration
  useEffect(() => {
    const checkTokenExpiration = () => {
      const token = localStorage.getItem('accessToken');
      if (token && isAuthenticated) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          const expirationTime = payload.exp * 1000;
          const currentTime = Date.now();
          
          if (currentTime >= expirationTime) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            setShowSessionAlert(true);
          }
        } catch (error) {
          console.error('Invalid token format:', error);
        }
      }
    };

    if (isAuthenticated) {
      checkTokenExpiration();
      const interval = setInterval(checkTokenExpiration, 60000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  // Debug logging
  useEffect(() => {
    console.log('ProtectedRoute Debug:', {
      isAuthenticated,
      isLoading,
      userRole: user?.role,
      currentPath: location.pathname,
      allowedRoles,
      isPublicPath,
      isRedirecting
    });
  }, [isAuthenticated, isLoading, user, location.pathname, allowedRoles, isPublicPath, isRedirecting]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Spinner size="lg" className="text-primary-600" />
        <p className="mt-4 text-gray-600 animate-pulse">
          Verifying your session...
        </p>
      </div>
    );
  }

  // Redirect authenticated users away from auth pages to their dashboard
  if (isAuthenticated && !showSessionAlert && isAuthPath) {
    const dashboardPath = user?.role ? ROLE_DASHBOARD[user.role as keyof typeof ROLE_DASHBOARD] : '/';
    console.log(`Authenticated user trying to access ${location.pathname}, redirecting to dashboard: ${dashboardPath}`);
    return <Navigate to={dashboardPath} replace />;
  }

  // Allow access to public paths for unauthenticated users
  if (isPublicPath && !isAuthenticated) {
    return children ? <>{children}</> : <Outlet />;
  }

  // Redirect to login if not authenticated and trying to access protected route
  if (!isAuthenticated && !isPublicPath) {
    console.log(`Unauthenticated access to ${location.pathname}, redirecting to login`);
    return (
      <Navigate 
        to={redirectTo} 
        state={{ from: location.pathname }}
        replace 
      />
    );
  }

  // Handle session expired
  if (showSessionAlert) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full">
          <Alert 
            variant="warning"
            title="Session Expired"
            message="Your session has expired. Please log in again to continue."
            dismissible={false}
          />
          <div className="mt-4 flex space-x-3 justify-center">
            <button
              onClick={() => window.location.href = '/login'}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go to Login
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Check role-based access for authenticated users
  if (isAuthenticated && user && !isPublicPath) {
    // If no roles specified, allow access
    if (allowedRoles.length === 0) {
      return children ? <>{children}</> : <Outlet />;
    }
    
    // Check if user has required role
    const hasRequiredRole = allowedRoles.includes(user.role);
    
    if (!hasRequiredRole) {
      console.warn(`Unauthorized: User role "${user.role}" attempted to access ${location.pathname}. Required roles: ${allowedRoles.join(', ')}`);
      
      // Redirect to user's appropriate dashboard
      const dashboardPath = ROLE_DASHBOARD[user.role as keyof typeof ROLE_DASHBOARD] || '/unauthorized';
      return (
        <Navigate 
          to={dashboardPath}
          state={{ 
            from: location.pathname,
            error: 'You do not have permission to access this page'
          }}
          replace 
        />
      );
    }
  }

  // Render protected content
  return children ? <>{children}</> : <Outlet />;
};

// Higher-order component for route protection
export const withProtection = (
  Component: React.ComponentType<any>,
  allowedRoles?: string[]
) => {
  return function ProtectedComponent(props: any) {
    return (
      <ProtectedRoute allowedRoles={allowedRoles}>
        <Component {...props} />
      </ProtectedRoute>
    );
  };
};

// Role-specific route components
export const StudentRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute allowedRoles={['student']}>
    {children}
  </ProtectedRoute>
);

export const TutorRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute allowedRoles={['tutor']}>
    {children}
  </ProtectedRoute>
);

export const ParentRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute allowedRoles={['parent']}>
    {children}
  </ProtectedRoute>
);

export const SchoolAdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute allowedRoles={['school_admin']}>
    {children}
  </ProtectedRoute>
);

export const MinistryRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute allowedRoles={['ministry_official']}>
    {children}
  </ProtectedRoute>
);

export const MultiRoleRoute: React.FC<{ 
  children: React.ReactNode;
  roles: string[];
}> = ({ children, roles }) => (
  <ProtectedRoute allowedRoles={roles}>
    {children}
  </ProtectedRoute>
);

export default ProtectedRoute;