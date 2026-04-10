// src/components/layout/Header.tsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface HeaderProps {
  isScrolled: boolean;
  onMobileMenuToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ isScrolled, onMobileMenuToggle }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    setIsLoggedIn(!!token);
  }, [location]);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Courses', path: '/courses' },
    { label: 'For Students', path: '/students' },
    { label: 'For Tutors', path: '/tutors' },
    { label: 'Pricing', path: '/pricing' },
    { label: 'About', path: '/about' },
  ];

  return (
    <header className={`
      fixed top-0 left-0 right-0 z-50 transition-all duration-300
      ${isScrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-lg py-2' 
        : 'bg-transparent py-4'
      }
    `}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className={`
              w-10 h-10 rounded-xl flex items-center justify-center 
              transition-all duration-300 transform group-hover:rotate-6
              ${isScrolled 
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600' 
                : 'bg-white/20 backdrop-blur-sm'
              }
            `}>
              <span className="text-2xl text-white font-bold">Z</span>
            </div>
            <span className={`
              text-2xl font-bold transition-colors duration-300
              ${isScrolled ? 'text-gray-900' : 'text-white'}
            `}>
              EDU
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`
                  text-sm font-medium transition-all duration-200
                  hover:scale-105
                  ${isScrolled 
                    ? 'text-gray-700 hover:text-blue-600' 
                    : 'text-white/90 hover:text-white'
                  }
                  ${location.pathname === link.path ? 'font-bold' : ''}
                `}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side buttons */}
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <Link
                to="/dashboard"
                className={`
                  px-4 py-2 rounded-lg text-sm font-semibold
                  transition-all duration-200 transform hover:scale-105
                  ${isScrolled
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg'
                    : 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30'
                  }
                `}
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`
                    px-4 py-2 rounded-lg text-sm font-semibold
                    transition-all duration-200
                    ${isScrolled
                      ? 'text-gray-700 hover:text-blue-600'
                      : 'text-white hover:text-white/80'
                    }
                  `}
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className={`
                    px-4 py-2 rounded-lg text-sm font-semibold
                    transition-all duration-200 transform hover:scale-105
                    ${isScrolled
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg'
                      : 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30'
                    }
                  `}
                >
                  Sign up
                </Link>
              </>
            )}

            {/* Mobile menu button */}
            <button
              onClick={onMobileMenuToggle}
              className="md:hidden p-2 rounded-lg focus:outline-none"
              aria-label="Toggle menu"
            >
              <div className="w-6 h-5 flex flex-col justify-between">
                <span className={`
                  w-full h-0.5 transition-all duration-300
                  ${isScrolled ? 'bg-gray-900' : 'bg-white'}
                `} />
                <span className={`
                  w-full h-0.5 transition-all duration-300
                  ${isScrolled ? 'bg-gray-900' : 'bg-white'}
                `} />
                <span className={`
                  w-full h-0.5 transition-all duration-300
                  ${isScrolled ? 'bg-gray-900' : 'bg-white'}
                `} />
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;