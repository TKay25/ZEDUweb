import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Lock, Eye, EyeOff, Check, AlertCircle,
  ArrowLeft, Shield
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { toast } from 'react-hot-toast';

const resetPasswordSchema = z.object({
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validToken, setValidToken] = useState(true);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema)
  });

  const password = watch('password');

  // Validate token on mount
  useEffect(() => {
    if (!token) {
      setValidToken(false);
      toast.error('Invalid or missing reset token');
    } else {
      // API call to validate token would go here
      setValidToken(true);
    }
  }, [token]);

  const passwordRequirements = [
    { label: 'At least 8 characters', met: password?.length >= 8 },
    { label: 'Uppercase letter', met: /[A-Z]/.test(password || '') },
    { label: 'Lowercase letter', met: /[a-z]/.test(password || '') },
    { label: 'Number', met: /[0-9]/.test(password || '') },
    { label: 'Special character', met: /[^A-Za-z0-9]/.test(password || '') }
  ];

  const onSubmit = async (_data: ResetPasswordFormData) => {
    try {
      setLoading(true);
      // API call would go here
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Password reset successful! Please login with your new password.');
      navigate('/login');
    } catch (error) {
      toast.error('Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!validToken) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Invalid Reset Link</h1>
          <p className="text-gray-600 mb-6">
            This password reset link is invalid or has expired.
          </p>
          <Link to="/forgot-password">
            <Button variant="primary" className="w-full">
              Request New Reset Link
            </Button>
          </Link>
          <div className="mt-4">
            <Link
              to="/login"
              className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Login
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2">
            <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-2xl">Z</span>
            </div>
            <span className="font-bold text-2xl text-gray-900">ZEDU</span>
          </Link>
        </div>

        {/* Reset Password Card */}
        <Card className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Create New Password</h1>
            <p className="text-gray-600">
              Your new password must be different from previously used passwords.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* New Password */}
            <div className="relative">
              <Input
                label="New Password"
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
                error={errors.password?.message}
                placeholder="••••••••"
                icon={<Lock className="w-5 h-5" />}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Password Requirements */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm font-medium mb-2">Password must contain:</p>
              <ul className="space-y-1">
                {passwordRequirements.map((req, index) => (
                  <li key={index} className="flex items-center text-sm">
                    {req.met ? (
                      <Check className="w-4 h-4 text-green-500 mr-2" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-gray-400 mr-2" />
                    )}
                    <span className={req.met ? 'text-gray-700' : 'text-gray-500'}>
                      {req.label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <Input
                label="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                {...register('confirmPassword')}
                error={errors.confirmPassword?.message}
                placeholder="••••••••"
                icon={<Lock className="w-5 h-5" />}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              size="lg"
              loading={loading}
            >
              Reset Password
            </Button>
          </form>

          {/* Back to Login */}
          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Login
            </Link>
          </div>

          {/* Security Note */}
          <div className="mt-6 flex items-center justify-center text-xs text-gray-500">
            <Shield className="w-4 h-4 mr-1" />
            Your password is encrypted and secure
          </div>
        </Card>
      </div>
    </div>
  );
};