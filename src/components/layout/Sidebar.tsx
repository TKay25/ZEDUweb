// src/components/layout/Sidebar.tsx
import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

// Define NavItem interface
interface NavItem {
  id: string;
  label: string;
  path: string;
  icon: React.ReactNode;
  badge?: number;
  children?: NavItem[];
}

// Define User interface
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

interface SidebarProps {
  navItems: NavItem[];
  isCollapsed: boolean;
  isMobileOpen: boolean;
  onToggleCollapse: () => void;
  onMobileClose: () => void;
  user?: User | null;
}

const Sidebar: React.FC<SidebarProps> = ({
  navItems,
  isCollapsed,
  isMobileOpen,
  onToggleCollapse,
  onMobileClose,
  user
}) => {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const location = useLocation();

  const toggleExpand = (itemId: string) => {
    setExpandedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const isActive = (path: string) => location.pathname === path;

  const renderNavItem = (item: NavItem, depth: number = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.id);
    const active = isActive(item.path);

    return (
      <div key={item.id} className="mb-1">
        <div
          className={`
            flex items-center px-3 py-2 rounded-lg cursor-pointer
            transition-all duration-200 group
            ${active 
              ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md' 
              : 'text-gray-700 hover:bg-gray-100'
            }
            ${isCollapsed ? 'justify-center' : 'justify-between'}
          `}
          style={{ paddingLeft: isCollapsed ? '0.75rem' : `${1 + depth * 0.5}rem` }}
          onClick={() => hasChildren ? toggleExpand(item.id) : undefined}
        >
          {!isCollapsed ? (
            <>
              <NavLink
                to={item.path}
                className="flex items-center space-x-3 flex-1"
                onClick={hasChildren ? (e) => e.preventDefault() : undefined}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="text-sm font-medium">{item.label}</span>
                {item.badge && (
                  <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {item.badge}
                  </span>
                )}
              </NavLink>
              {hasChildren && (
                <button
                  onClick={() => toggleExpand(item.id)}
                  className="p-1 hover:bg-gray-200 rounded"
                  aria-label="Toggle submenu"
                >
                  <svg
                    className={`w-4 h-4 transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              )}
            </>
          ) : (
            <NavLink
              to={item.path}
              className="relative group"
              title={item.label}
            >
              <span className="text-2xl">{item.icon}</span>
              {item.badge && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                  {item.badge}
                </span>
              )}
              {/* Tooltip */}
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap">
                {item.label}
              </div>
            </NavLink>
          )}
        </div>

        {/* Children items */}
        {hasChildren && isExpanded && !isCollapsed && (
          <div className="ml-4 mt-1">
            {item.children?.map((child: NavItem) => renderNavItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  // Mobile sidebar
  if (isMobileOpen) {
    return (
      <div className="fixed inset-0 z-50 lg:hidden">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity"
          onClick={onMobileClose}
        />

        {/* Sidebar panel */}
        <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-white shadow-xl transform transition-transform duration-300 ease-in-out">
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="px-4 py-6 bg-gradient-to-r from-blue-600 to-indigo-600">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                    <span className="text-2xl font-bold text-blue-600">Z</span>
                  </div>
                  <span className="text-xl font-bold text-white">EDU</span>
                </div>
                <button
                  onClick={onMobileClose}
                  className="text-white hover:text-gray-200"
                  aria-label="Close menu"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* User info */}
              {user && (
                <div className="mt-4 flex items-center space-x-3">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" />
                  ) : (
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-xl text-white">{user.name?.charAt(0) || 'U'}</span>
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-white">{user.name}</p>
                    <p className="text-xs text-white/80">{user.role}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto p-4">
              {navItems.map((item: NavItem) => renderNavItem(item))}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200">
              <button
                onClick={() => {
                  localStorage.clear();
                  window.location.href = '/';
                }}
                className="flex items-center space-x-3 text-gray-700 hover:text-red-600 w-full px-3 py-2 rounded-lg hover:bg-gray-100"
              >
                <span className="text-xl">🚪</span>
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Desktop sidebar
  return (
    <div
      className={`
        fixed left-0 top-0 h-full bg-white shadow-xl z-40
        transition-all duration-300 hidden lg:block
        ${isCollapsed ? 'w-20' : 'w-64'}
      `}
    >
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className={`
          px-4 py-6 bg-gradient-to-r from-blue-600 to-indigo-600
          ${isCollapsed ? 'px-2' : 'px-4'}
        `}>
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
            {!isCollapsed && (
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <span className="text-xl font-bold text-blue-600">Z</span>
                </div>
                <span className="text-lg font-bold text-white">EDU</span>
              </div>
            )}
            {isCollapsed && (
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                <span className="text-2xl font-bold text-blue-600">Z</span>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          {navItems.map((item: NavItem) => renderNavItem(item))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          {/* Collapse toggle */}
          <button
            onClick={onToggleCollapse}
            className="w-full flex items-center justify-center p-2 text-gray-500 hover:text-blue-600 hover:bg-gray-100 rounded-lg mb-2"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <svg
              className={`w-5 h-5 transform transition-transform duration-200 ${isCollapsed ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
            {!isCollapsed && <span className="ml-2 text-sm">Collapse</span>}
          </button>

          {/* Logout button */}
          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = '/';
            }}
            className={`
              flex items-center text-gray-700 hover:text-red-600 hover:bg-gray-100 rounded-lg
              ${isCollapsed ? 'justify-center p-2' : 'space-x-3 px-3 py-2 w-full'}
            `}
          >
            <span className="text-xl">🚪</span>
            {!isCollapsed && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;