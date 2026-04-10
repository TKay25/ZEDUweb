import React, { useEffect, useState } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';

// Define the props interface locally since we're not using the imported one
interface LayoutProps {
  children?: React.ReactNode;
}

const AuthLayout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const [backgroundIndex, setBackgroundIndex] = useState(0);
  
  const backgrounds = [
    'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    'https://images.unsplash.com/photo-1501504905252-473c47e087f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
  ];

  const quotes = [
    { text: "Education is the most powerful weapon which you can use to change the world.", author: "Nelson Mandela" },
    { text: "The beautiful thing about learning is that no one can take it away from you.", author: "B.B. King" },
    { text: "Education is not preparation for life; education is life itself.", author: "John Dewey" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setBackgroundIndex((prev) => (prev + 1) % backgrounds.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [backgrounds.length]);

  // Get the current path to determine which page we're on
  const currentPath = location.pathname;
  
  // You can use these variables later if needed, or remove them
  // If you plan to use them, uncomment and use them in the UI
  // const isLoginPage = currentPath === '/login';
  // const isRegisterPage = currentPath === '/register';
  
  // If you want to use the path to customize the layout, you can do:
  const getPageTitle = () => {
    if (currentPath === '/login') return 'Welcome Back';
    if (currentPath === '/register') return 'Create Account';
    if (currentPath === '/forgot-password') return 'Reset Password';
    return '';
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-md w-full mx-auto">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center space-x-2 group">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center transform group-hover:rotate-6 transition-all duration-300">
                <span className="text-2xl text-white font-bold">Z</span>
              </div>
              <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                EDU
              </span>
            </Link>
          </div>

          {/* Page Title (optional) */}
          {getPageTitle() && (
            <h1 className="text-2xl font-bold text-center text-gray-900 mb-6">
              {getPageTitle()}
            </h1>
          )}

          {/* Auth forms - Render either children or Outlet for nested routes */}
          <div className="animate-slide-up">
            {children ? children : <Outlet />}
          </div>

          {/* Footer links */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              © {new Date().getFullYear()} ZEDU. All rights reserved.
            </p>
            <div className="mt-2 space-x-4">
              <Link to="/terms" className="text-xs text-gray-500 hover:text-gray-700">
                Terms
              </Link>
              <Link to="/privacy" className="text-xs text-gray-500 hover:text-gray-700">
                Privacy
              </Link>
              <Link to="/contact" className="text-xs text-gray-500 hover:text-gray-700">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Image and Quote */}
      <div className="hidden lg:block lg:flex-1 relative overflow-hidden">
        {/* Background Image with transition */}
        <div className="absolute inset-0">
          {backgrounds.map((bg, index) => (
            <div
              key={bg}
              className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
                index === backgroundIndex ? 'opacity-100' : 'opacity-0'
              }`}
              style={{ backgroundImage: `url(${bg})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 to-indigo-900/90" />
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="relative h-full flex flex-col items-center justify-center text-white p-12">
          {/* Quote */}
          <div className="max-w-lg text-center animate-fade-in">
            <p className="text-2xl font-light italic mb-4">
              "{quotes[backgroundIndex].text}"
            </p>
            <p className="text-lg font-semibold">
              — {quotes[backgroundIndex].author}
            </p>
          </div>

          {/* Features */}
          <div className="absolute bottom-12 left-12 right-12">
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-2xl">🎓</span>
                </div>
                <p className="text-sm">Quality Education</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-2xl">🤖</span>
                </div>
                <p className="text-sm">AI-Powered Learning</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-2xl">🌍</span>
                </div>
                <p className="text-sm">Global Community</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;