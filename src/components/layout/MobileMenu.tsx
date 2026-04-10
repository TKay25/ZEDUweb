// src/components/layout/MobileMenu.tsx
import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const location = useLocation();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    onClose();
  }, [location]);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Courses', path: '/courses' },
    { label: 'For Students', path: '/students' },
    { label: 'For Tutors', path: '/tutors' },
    { label: 'For Schools', path: '/schools' },
    { label: 'Pricing', path: '/pricing' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
    { label: 'Blog', path: '/blog' },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Menu panel */}
      <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-white shadow-xl transform transition-transform duration-300 ease-in-out">
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
                onClick={onClose}
                className="text-white hover:text-gray-200 p-2"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* User quick actions */}
            <div className="mt-6 flex space-x-3">
              <Link
                to="/login"
                className="flex-1 px-4 py-2 bg-white/20 backdrop-blur-sm text-white text-center rounded-lg text-sm font-medium hover:bg-white/30 transition-colors duration-200"
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="flex-1 px-4 py-2 bg-white text-blue-600 text-center rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors duration-200"
              >
                Sign up
              </Link>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-6">
            <div className="px-4 space-y-1">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`
                      block px-4 py-3 rounded-lg text-base font-medium
                      transition-all duration-200
                      ${isActive
                        ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                      }
                    `}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            {/* Divider */}
            <div className="my-6 border-t border-gray-200" />

            {/* Additional links */}
            <div className="px-4 space-y-1">
              <Link
                to="/help"
                className="block px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors duration-200"
              >
                Help Center
              </Link>
              <Link
                to="/support"
                className="block px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors duration-200"
              >
                Support
              </Link>
            </div>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex justify-center space-x-6">
              <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors duration-200">
                <span className="sr-only">Facebook</span>
                <span className="text-xl">📘</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors duration-200">
                <span className="sr-only">Twitter</span>
                <span className="text-xl">🐦</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors duration-200">
                <span className="sr-only">Instagram</span>
                <span className="text-xl">📷</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors duration-200">
                <span className="sr-only">LinkedIn</span>
                <span className="text-xl">💼</span>
              </a>
            </div>
            <p className="mt-4 text-center text-xs text-gray-500">
              © 2024 ZEDU. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;