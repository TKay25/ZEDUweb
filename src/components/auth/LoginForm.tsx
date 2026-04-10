 // src/components/auth/LoginForm.tsx
import React, { useState } from 'react';
import type { LoginFormData, ValidationErrors, UserRole } from '../../types/auth.types';

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => Promise<void>;
  onForgotPassword: () => void;
  onRegister: () => void;
  loading?: boolean;
  error?: string;
  initialRole?: UserRole;
}

const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  onForgotPassword,
  onRegister,
  loading = false,
  error,
  initialRole
}) => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    rememberMe: false
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState<Set<string>>(new Set());

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'email':
        if (!value) return 'Email is required';
        if (!/\S+@\S+\.\S+/.test(value)) return 'Email is invalid';
        break;
      case 'password':
        if (!value) return 'Password is required';
        if (value.length < 6) return 'Password must be at least 6 characters';
        break;
    }
    return '';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData((prev: LoginFormData) => ({ ...prev, [name]: newValue }));

    if (touched.has(name)) {
      const error = validateField(name, value);
      setErrors((prev: ValidationErrors) => error ? { ...prev, [name]: error } : { ...prev, [name]: '' });
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched((prev: Set<string>) => new Set(prev).add(name));
    
    const error = validateField(name, value);
    setErrors((prev: ValidationErrors) => error ? { ...prev, [name]: error } : { ...prev, [name]: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors: ValidationErrors = {};
    Object.keys(formData).forEach(key => {
      if (key !== 'rememberMe') {
        const error = validateField(key, formData[key as keyof LoginFormData] as string);
        if (error) newErrors[key] = error;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    await onSubmit(formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-2xl">
        <div>
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300">
              <span className="text-4xl text-white">ZEDU</span>
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Welcome Back
          </h2>
          {initialRole && (
            <p className="mt-2 text-center text-sm text-gray-600">
              Signing in as <span className="font-semibold text-blue-600">{initialRole}</span>
            </p>
          )}
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`
                    appearance-none relative block w-full px-3 py-3 border 
                    ${errors.email ? 'border-red-300' : 'border-gray-300'} 
                    placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none 
                    focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 
                    transition-all duration-200
                  `}
                  placeholder="you@example.com"
                />
                {formData.email && !errors.email && (
                  <span className="absolute right-3 top-3 text-green-500">✓</span>
                )}
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 animate-slide-down">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`
                    appearance-none relative block w-full px-3 py-3 border 
                    ${errors.password ? 'border-red-300' : 'border-gray-300'} 
                    placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none 
                    focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10
                    transition-all duration-200 pr-10
                  `}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600 animate-slide-down">{errors.password}</p>
              )}
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="rememberMe"
                  name="rememberMe"
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                />
                <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-900 cursor-pointer">
                  Remember me
                </label>
              </div>

              <button
                type="button"
                onClick={onForgotPassword}
                className="text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
              >
                Forgot password?
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg animate-shake">
              <div className="flex">
                <div className="flex-shrink-0">
                  <span className="text-red-500">⚠️</span>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className={`
                group relative w-full flex justify-center py-3 px-4 border border-transparent 
                text-sm font-medium rounded-lg text-white 
                bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                transition-all duration-200 transform hover:scale-105
                ${loading ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin mr-2" />
                  Signing in...
                </div>
              ) : (
                'Sign in'
              )}
            </button>
          </div>

          {/* Register Link */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={onRegister}
                className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
              >
                Sign up here
              </button>
            </p>
          </div>
        </form>

        {/* Social Login */}
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3">
            <button className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors duration-200">
              <span className="text-xl">G</span>
            </button>
            <button className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors duration-200">
              <span className="text-xl">f</span>
            </button>
            <button className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors duration-200">
              <span className="text-xl">⌂</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;