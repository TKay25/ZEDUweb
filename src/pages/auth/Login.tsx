import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Mail, Lock, Eye, EyeOff, LogIn,
  ArrowRight, Shield, AlertCircle
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAuth } from '../../context/AuthContext'; // Fixed import path
import { toast } from 'react-hot-toast';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'), // Changed from 8 to 6 for demo accounts
  rememberMe: z.boolean().optional()
});

type LoginFormData = z.infer<typeof loginSchema>;

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading: authLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Remove the automatic redirect - AuthContext will handle it
  // const from = (location.state as any)?.from?.pathname || '/dashboard';

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false
    }
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setLoading(true);
      setLoginError(null);
      
      console.log('Attempting login with:', data.email);
      
      // The login function from AuthContext handles the redirect automatically
      await login(data.email, data.password, data.rememberMe);
      
      // No need to navigate here - AuthContext already does it
      toast.success('Login successful! Redirecting to dashboard...');
      
    } catch (error: any) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Invalid email or password';
      setLoginError(errorMessage);
      toast.error('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Demo account filler
  const fillDemoCredentials = (email: string, password: string) => {
    setValue('email', email);
    setValue('password', password);
    setLoginError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-2xl">Z</span>
            </div>
            <span className="font-bold text-2xl text-gray-900">ZEDU</span>
          </Link>
        </div>

        {/* Login Card */}
        <Card className="p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back!</h1>
            <p className="text-gray-600">Sign in to continue to your dashboard</p>
          </div>

          {/* Error Alert */}
          {loginError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3 animate-shake">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-red-700">{loginError}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  {...register('email')}
                  className={`
                    w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
                    ${errors.email ? 'border-red-300' : 'border-gray-300'}
                  `}
                  autoComplete="email"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...register('password')}
                  className={`
                    w-full pl-10 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
                    ${errors.password ? 'border-red-300' : 'border-gray-300'}
                  `}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  {...register('rememberMe')}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <span className="text-sm text-gray-600">Remember me</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              size="lg"
              loading={loading || authLoading}
            >
              <LogIn className="w-5 h-5 mr-2" />
              Sign In
            </Button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center"
              >
                Create Account
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </p>
          </div>

          {/* Demo Accounts */}
          <div className="mt-8 pt-6 border-t">
            <p className="text-sm text-gray-500 text-center mb-4">Demo Accounts (Click to auto-fill)</p>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <button
                type="button"
                onClick={() => fillDemoCredentials('student@zedu.com', 'student123')}
                className="p-2 bg-blue-50 hover:bg-blue-100 rounded text-center transition-colors duration-200"
              >
                <p className="font-medium text-blue-800">Student</p>
                <p className="text-gray-600 text-xs">student@zedu.com</p>
              </button>
              <button
                type="button"
                onClick={() => fillDemoCredentials('tutor@zedu.com', 'tutor123')}
                className="p-2 bg-green-50 hover:bg-green-100 rounded text-center transition-colors duration-200"
              >
                <p className="font-medium text-green-800">Tutor</p>
                <p className="text-gray-600 text-xs">tutor@zedu.com</p>
              </button>
              <button
                type="button"
                onClick={() => fillDemoCredentials('parent@zedu.com', 'parent123')}
                className="p-2 bg-purple-50 hover:bg-purple-100 rounded text-center transition-colors duration-200"
              >
                <p className="font-medium text-purple-800">Parent</p>
                <p className="text-gray-600 text-xs">parent@zedu.com</p>
              </button>
              <button
                type="button"
                onClick={() => fillDemoCredentials('school@zedu.com', 'school123')}
                className="p-2 bg-orange-50 hover:bg-orange-100 rounded text-center transition-colors duration-200"
              >
                <p className="font-medium text-orange-800">School Admin</p>
                <p className="text-gray-600 text-xs">school@zedu.com</p>
              </button>
              <button
                type="button"
                onClick={() => fillDemoCredentials('ministry@zedu.com', 'ministry123')}
                className="p-2 bg-red-50 hover:bg-red-100 rounded text-center transition-colors duration-200 col-span-2"
              >
                <p className="font-medium text-red-800">Ministry Official</p>
                <p className="text-gray-600 text-xs">ministry@zedu.com</p>
              </button>
            </div>
            <p className="text-xs text-gray-400 text-center mt-3">
              Password for all demo accounts: student123, tutor123, parent123, school123, ministry123
            </p>
          </div>

          {/* Security Note */}
          <div className="mt-6 flex items-center justify-center text-xs text-gray-500">
            <Shield className="w-4 h-4 mr-1" />
            Protected by enterprise-grade security
          </div>
        </Card>
      </div>
    </div>
  );
};