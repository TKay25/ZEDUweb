// src/components/auth/ResetPasswordForm.tsx
import React, { useState } from 'react';

interface ResetPasswordFormProps {
  token: string;
  onSubmit: (password: string) => Promise<void>;
  loading?: boolean;
  error?: string;
}

const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({
  token: _token, // Prefix with underscore to indicate intentionally unused
  onSubmit,
  loading = false,
  error: externalError
}) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string }>({});
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<'weak' | 'medium' | 'strong' | null>(null);

  const validatePassword = (pass: string): string => {
    if (!pass) return 'Password is required';
    if (pass.length < 8) return 'Password must be at least 8 characters';
    if (!/[A-Z]/.test(pass)) return 'Must contain at least one uppercase letter';
    if (!/[a-z]/.test(pass)) return 'Must contain at least one lowercase letter';
    if (!/[0-9]/.test(pass)) return 'Must contain at least one number';
    if (!/[!@#$%^&*]/.test(pass)) return 'Must contain at least one special character';
    return '';
  };

  const checkPasswordStrength = (pass: string): 'weak' | 'medium' | 'strong' => {
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[a-z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[!@#$%^&*]/.test(pass)) score++;
    
    if (score <= 2) return 'weak';
    if (score <= 4) return 'medium';
    return 'strong';
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordStrength(checkPasswordStrength(newPassword));
    
    const error = validatePassword(newPassword);
    setErrors(prev => ({ ...prev, password: error }));
    
    // Also validate confirm password if it exists
    if (confirmPassword) {
      setErrors(prev => ({
        ...prev,
        confirmPassword: newPassword !== confirmPassword ? 'Passwords do not match' : ''
      }));
    }
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newConfirmPassword = e.target.value;
    setConfirmPassword(newConfirmPassword);
    setErrors(prev => ({
      ...prev,
      confirmPassword: password !== newConfirmPassword ? 'Passwords do not match' : ''
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const passwordError = validatePassword(password);
    if (passwordError) {
      setErrors({ password: passwordError });
      return;
    }

    if (password !== confirmPassword) {
      setErrors({ confirmPassword: 'Passwords do not match' });
      return;
    }

    await onSubmit(password);
  };

  const getStrengthColor = () => {
    switch (passwordStrength) {
      case 'weak': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'strong': return 'bg-green-500';
      default: return 'bg-gray-200';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8 text-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🔄</span>
            </div>
            <h2 className="text-2xl font-bold text-white">Reset Password</h2>
            <p className="text-blue-100 mt-2">Create a new password for your account</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 py-8 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={handlePasswordChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 pr-10 ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {password && (
                <div className="mt-2">
                  <div className="flex items-center space-x-1 mb-1">
                    <div className={`h-1 w-1/3 rounded-l ${passwordStrength === 'weak' ? getStrengthColor() : 'bg-gray-200'}`} />
                    <div className={`h-1 w-1/3 ${passwordStrength === 'medium' ? getStrengthColor() : 'bg-gray-200'}`} />
                    <div className={`h-1 w-1/3 rounded-r ${passwordStrength === 'strong' ? getStrengthColor() : 'bg-gray-200'}`} />
                  </div>
                  <p className="text-xs text-gray-500">
                    {passwordStrength === 'weak' && 'Weak - Add more complexity'}
                    {passwordStrength === 'medium' && 'Medium - Getting better'}
                    {passwordStrength === 'strong' && 'Strong - Good password!'}
                  </p>
                </div>
              )}

              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm New Password
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Confirm new password"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Password Requirements */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-blue-800 mb-2">Password Requirements:</h4>
              <ul className="text-xs text-blue-700 space-y-1">
                <li className="flex items-center">
                  <span className={`mr-2 ${password.length >= 8 ? 'text-green-600' : ''}`}>
                    {password.length >= 8 ? '✓' : '•'}
                  </span>
                  At least 8 characters
                </li>
                <li className="flex items-center">
                  <span className={`mr-2 ${/[A-Z]/.test(password) ? 'text-green-600' : ''}`}>
                    {/[A-Z]/.test(password) ? '✓' : '•'}
                  </span>
                  At least one uppercase letter
                </li>
                <li className="flex items-center">
                  <span className={`mr-2 ${/[a-z]/.test(password) ? 'text-green-600' : ''}`}>
                    {/[a-z]/.test(password) ? '✓' : '•'}
                  </span>
                  At least one lowercase letter
                </li>
                <li className="flex items-center">
                  <span className={`mr-2 ${/[0-9]/.test(password) ? 'text-green-600' : ''}`}>
                    {/[0-9]/.test(password) ? '✓' : '•'}
                  </span>
                  At least one number
                </li>
                <li className="flex items-center">
                  <span className={`mr-2 ${/[!@#$%^&*]/.test(password) ? 'text-green-600' : ''}`}>
                    {/[!@#$%^&*]/.test(password) ? '✓' : '•'}
                  </span>
                  At least one special character (!@#$%^&*)
                </li>
              </ul>
            </div>

            {/* External Error */}
            {externalError && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                <p className="text-sm text-red-700">{externalError}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !!errors.password || !!errors.confirmPassword}
              className={`w-full py-3 px-4 border border-transparent rounded-lg text-white font-medium bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin mr-2" />
                  Resetting Password...
                </div>
              ) : (
                'Reset Password'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordForm;