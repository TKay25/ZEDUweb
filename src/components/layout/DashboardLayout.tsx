import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

// Define missing types locally
interface LayoutProps {
  children?: React.ReactNode;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

interface NavItem {
  id: string;
  label: string;
  path: string;
  icon: React.ReactNode;
  badge?: number;
}

// Icons
const Icons = {
  dashboard: <span>📊</span>,
  courses: <span>📚</span>,
  assignments: <span>📝</span>,
  quizzes: <span>❓</span>,
  students: <span>👥</span>,
  analytics: <span>📈</span>,
  messages: <span>💬</span>,
  settings: <span>⚙️</span>,
  calendar: <span>📅</span>,
  grades: <span>⭐</span>,
  materials: <span>📦</span>,
  discussions: <span>💭</span>,
  live: <span>🎥</span>,
  reports: <span>📑</span>,
  payments: <span>💰</span>,
  notifications: <span>🔔</span>,
};

interface DashboardLayoutProps extends LayoutProps {
  user?: User | null; // Allow user to be User, null, or undefined
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, user = null }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(user !== undefined ? user : null);
  const location = useLocation();

  useEffect(() => {
    if (!currentUser) {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          setCurrentUser(JSON.parse(userStr));
        } catch (error) {
          console.error('Failed to parse user from localStorage:', error);
        }
      }
    }
  }, [currentUser]);

  const shouldShowWelcome = location.pathname === '/profile' || 
                           location.pathname === '/settings' || 
                           location.pathname === '/notifications' || 
                           location.pathname === '/messages' || 
                           location.pathname === '/help' ||
                           location.pathname === '/dashboard';

  const getNavItems = (role?: string): NavItem[] => {
    const commonItems: NavItem[] = [
      {
        id: 'dashboard',
        label: 'Dashboard',
        path: '/dashboard',
        icon: Icons.dashboard,
      },
      {
        id: 'calendar',
        label: 'Calendar',
        path: '/calendar',
        icon: Icons.calendar,
      },
      {
        id: 'messages',
        label: 'Messages',
        path: '/messages',
        icon: Icons.messages,
        badge: 3,
      },
    ];

    const roleSpecificItems: Record<string, NavItem[]> = {
      student: [
        { id: 'courses', label: 'My Courses', path: '/dashboard/courses', icon: Icons.courses },
        { id: 'assignments', label: 'Assignments', path: '/dashboard/assignments', icon: Icons.assignments, badge: 5 },
        { id: 'quizzes', label: 'Quizzes', path: '/dashboard/quizzes', icon: Icons.quizzes },
        { id: 'grades', label: 'Grades', path: '/dashboard/grades', icon: Icons.grades },
        { id: 'materials', label: 'Study Materials', path: '/dashboard/materials', icon: Icons.materials },
        { id: 'discussions', label: 'Discussions', path: '/dashboard/discussions', icon: Icons.discussions },
        { id: 'live', label: 'Live Sessions', path: '/dashboard/live', icon: Icons.live },
      ],
      tutor: [
        { id: 'courses', label: 'My Courses', path: '/dashboard/courses', icon: Icons.courses },
        { id: 'students', label: 'My Students', path: '/dashboard/students', icon: Icons.students },
        { id: 'assignments', label: 'Assignments', path: '/dashboard/assignments', icon: Icons.assignments },
        { id: 'analytics', label: 'Analytics', path: '/dashboard/analytics', icon: Icons.analytics },
      ],
      parent: [
        { id: 'children', label: 'My Children', path: '/dashboard/children', icon: Icons.students },
        { id: 'progress', label: 'Progress', path: '/dashboard/progress', icon: Icons.analytics },
        { id: 'payments', label: 'Payments', path: '/dashboard/payments', icon: Icons.payments },
        { id: 'reports', label: 'Reports', path: '/dashboard/reports', icon: Icons.reports },
      ],
      school_admin: [
        { id: 'teachers', label: 'Teachers', path: '/dashboard/teachers', icon: Icons.students },
        { id: 'students', label: 'Students', path: '/dashboard/students', icon: Icons.students },
        { id: 'classes', label: 'Classes', path: '/dashboard/classes', icon: Icons.courses },
        { id: 'analytics', label: 'Analytics', path: '/dashboard/analytics', icon: Icons.analytics },
        { id: 'reports', label: 'Reports', path: '/dashboard/reports', icon: Icons.reports },
      ],
      ministry: [
        { id: 'schools', label: 'Schools', path: '/dashboard/schools', icon: Icons.students },
        { id: 'statistics', label: 'Statistics', path: '/dashboard/statistics', icon: Icons.analytics },
        { id: 'curriculum', label: 'Curriculum', path: '/dashboard/curriculum', icon: Icons.courses },
        { id: 'reports', label: 'Reports', path: '/dashboard/reports', icon: Icons.reports },
      ],
    };

    const items = [...commonItems];
    if (role && roleSpecificItems[role]) {
      items.push(...roleSpecificItems[role]);
    }

    items.push({
      id: 'settings',
      label: 'Settings',
      path: '/dashboard/settings',
      icon: Icons.settings,
    });

    return items;
  };

  const getUserName = () => {
    if (!currentUser) return 'User';
    return currentUser.name?.split(' ')[0] || currentUser.name || 'User';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Sidebar
        navItems={getNavItems(currentUser?.role)}
        isCollapsed={isSidebarCollapsed}
        isMobileOpen={isMobileSidebarOpen}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        onMobileClose={() => setIsMobileSidebarOpen(false)}
        user={currentUser} // Pass currentUser directly (User | null)
      />

      <div className={`transition-all duration-300 ${isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        <Navbar
          user={currentUser} // Pass currentUser directly (User | null)
          onMobileMenuToggle={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          onSidebarToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />

        <main className="p-4 sm:p-6 lg:p-8 mt-16">
          <div className="max-w-7xl mx-auto">
            {shouldShowWelcome && (
              <>
                <div className="mb-8 animate-slide-down">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    Welcome back, {getUserName()}! 👋
                  </h1>
                  <p className="text-gray-600 mt-2">
                    Here's what's happening with your learning journey today.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  <StatCard title="Courses" value="8" change="+2" icon="📚" color="blue" />
                  <StatCard title="Hours Spent" value="24.5" change="+3.2" icon="⏰" color="green" />
                  <StatCard title="Assignments" value="5" change="-2" icon="📝" color="yellow" />
                  <StatCard title="Achievements" value="12" change="+1" icon="🏆" color="purple" />
                </div>
              </>
            )}

            <div className={`bg-white rounded-2xl shadow-sm p-6 animate-fade-in ${!shouldShowWelcome ? 'mt-0' : ''}`}>
              {children ? children : <Outlet />}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  icon: string;
  color: 'blue' | 'green' | 'yellow' | 'purple' | 'red';
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon, color }) => {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    yellow: 'from-yellow-500 to-yellow-600',
    purple: 'from-purple-500 to-purple-600',
    red: 'from-red-500 to-red-600',
  };

  const isPositive = change.startsWith('+');

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorClasses[color]} bg-opacity-10 flex items-center justify-center`}>
          <span className="text-2xl">{icon}</span>
        </div>
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
          isPositive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
        }`}>
          {change}
        </span>
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-1">{value}</h3>
      <p className="text-sm text-gray-600">{title}</p>
    </div>
  );
};

export default DashboardLayout;