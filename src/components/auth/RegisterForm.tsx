// src/components/auth/RegisterForm.tsx
import React, { useState } from 'react';
// Fix: Use type-only imports for all types
import type { ValidationErrors, UserRole, RegisterData } from '../../types/auth.types';

interface RegisterFormProps {
  onSubmit: (data: RegisterData) => Promise<void>;
  onLogin: () => void;
  selectedRole: UserRole;
  loading?: boolean;
  error?: string;
}

// Define form-specific fields that aren't in RegisterData
// Note: RegisterData uses 'passwordConfirm' not 'confirmPassword'
interface RegisterFormFields {
  confirmPassword: string; // This is for form validation only
  acceptTerms: boolean;
}

// Combine RegisterData with form fields
// But RegisterData already has passwordConfirm, so we need to handle it carefully
type RegisterFormData = RegisterData & RegisterFormFields;

const RegisterForm: React.FC<RegisterFormProps> = ({
  onSubmit,
  onLogin,
  selectedRole,
  loading = false,
  error
}) => {
  const [formData, setFormData] = useState<RegisterFormData>({
    email: '',
    password: '',
    passwordConfirm: '', // This is from RegisterData
    confirmPassword: '', // This is for form validation
    firstName: '',
    lastName: '',
    role: selectedRole,
    acceptTerms: false
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Set<string>>(new Set());
  const [passwordStrength, setPasswordStrength] = useState<'weak' | 'medium' | 'strong' | null>(null);

  const validateField = (name: string, value: any): string => {
    switch (name) {
      case 'email':
        if (!value) return 'Email is required';
        if (!/\S+@\S+\.\S+/.test(value)) return 'Email is invalid';
        break;
      case 'password':
        if (!value) return 'Password is required';
        if (value.length < 8) return 'Password must be at least 8 characters';
        if (!/[A-Z]/.test(value)) return 'Password must contain at least one uppercase letter';
        if (!/[a-z]/.test(value)) return 'Password must contain at least one lowercase letter';
        if (!/[0-9]/.test(value)) return 'Password must contain at least one number';
        if (!/[!@#$%^&*]/.test(value)) return 'Password must contain at least one special character';
        break;
      case 'confirmPassword':
        if (value !== formData.password) return 'Passwords do not match';
        break;
      case 'firstName':
        if (!value) return 'First name is required';
        if (value.length < 2) return 'First name must be at least 2 characters';
        break;
      case 'lastName':
        if (!value) return 'Last name is required';
        break;
      case 'acceptTerms':
        if (!value) return 'You must accept the terms and conditions';
        break;
    }
    return '';
  };

  const checkPasswordStrength = (password: string): 'weak' | 'medium' | 'strong' => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[!@#$%^&*]/.test(password)) score++;
    
    if (score <= 2) return 'weak';
    if (score <= 4) return 'medium';
    return 'strong';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData((prev: RegisterFormData) => ({ ...prev, [name]: newValue }));

    if (name === 'password') {
      setPasswordStrength(checkPasswordStrength(value));
      // Clear confirmPassword error when password changes
      if (touched.has('confirmPassword')) {
        const confirmError = validateField('confirmPassword', formData.confirmPassword);
        setErrors((prev: ValidationErrors) => confirmError ? { ...prev, confirmPassword: confirmError } : { ...prev, confirmPassword: '' });
      }
    }

    if (touched.has(name)) {
      const error = validateField(name, newValue);
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
      const error = validateField(key, formData[key as keyof RegisterFormData]);
      if (error) newErrors[key] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Prepare data for API - exclude confirmPassword and acceptTerms
    const { confirmPassword, acceptTerms, ...submitData } = formData;
    await onSubmit(submitData);
  };

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 'weak': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'strong': return 'bg-green-500';
      default: return 'bg-gray-200';
    }
  };

  const getPasswordStrengthText = () => {
    switch (passwordStrength) {
      case 'weak': return 'Weak';
      case 'medium': return 'Medium';
      case 'strong': return 'Strong';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-teal-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-2xl">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Create Account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Signing up as{' '}
            <span className="font-semibold text-blue-600 capitalize">{selectedRole}</span>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`
                    appearance-none relative block w-full px-3 py-3 border 
                    ${errors.firstName ? 'border-red-300' : 'border-gray-300'} 
                    placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none 
                    focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                    transition-all duration-200
                  `}
                  placeholder="John"
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                )}
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`
                    appearance-none relative block w-full px-3 py-3 border 
                    ${errors.lastName ? 'border-red-300' : 'border-gray-300'} 
                    placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none 
                    focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                    transition-all duration-200
                  `}
                  placeholder="Doe"
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                )}
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
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
                  focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                  transition-all duration-200
                `}
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`
                  appearance-none relative block w-full px-3 py-3 border 
                  ${errors.password ? 'border-red-300' : 'border-gray-300'} 
                  placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none 
                  focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                  transition-all duration-200
                `}
                placeholder="••••••••"
              />
              
              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex items-center space-x-1 mb-1">
                    <div className={`h-1 w-1/3 rounded-l ${passwordStrength === 'weak' ? getPasswordStrengthColor() : 'bg-gray-200'}`} />
                    <div className={`h-1 w-1/3 ${passwordStrength === 'medium' ? getPasswordStrengthColor() : 'bg-gray-200'}`} />
                    <div className={`h-1 w-1/3 rounded-r ${passwordStrength === 'strong' ? getPasswordStrengthColor() : 'bg-gray-200'}`} />
                  </div>
                  {passwordStrength && (
                    <p className="text-xs text-gray-600 mb-1">
                      Password strength: <span className="font-semibold">{getPasswordStrengthText()}</span>
                    </p>
                  )}
                  <p className="text-xs text-gray-500">
                    Password must be at least 8 characters with uppercase, lowercase, number, and special character
                  </p>
                </div>
              )}
              
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password - This is the form validation field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`
                  appearance-none relative block w-full px-3 py-3 border 
                  ${errors.confirmPassword ? 'border-red-300' : 'border-gray-300'} 
                  placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none 
                  focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                  transition-all duration-200
                `}
                placeholder="••••••••"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-center">
              <input
                id="acceptTerms"
                name="acceptTerms"
                type="checkbox"
                checked={formData.acceptTerms}
                onChange={handleChange}
                onBlur={handleBlur}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
              />
              <label htmlFor="acceptTerms" className="ml-2 block text-sm text-gray-900 cursor-pointer">
                I accept the{' '}
                <a href="/terms" className="text-blue-600 hover:text-blue-500">
                  Terms and Conditions
                </a>{' '}
                and{' '}
                <a href="/privacy" className="text-blue-600 hover:text-blue-500">
                  Privacy Policy
                </a>
              </label>
            </div>
            {errors.acceptTerms && (
              <p className="text-sm text-red-600">{errors.acceptTerms}</p>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
              <p className="text-sm text-red-700">{error}</p>
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
                bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500
                transition-all duration-200 transform hover:scale-105
                ${loading ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin mr-2" />
                  Creating Account...
                </div>
              ) : (
                'Sign Up'
              )}
            </button>
          </div>

          {/* Login Link */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <button
                type="button"
                onClick={onLogin}
                className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
              >
                Sign in here
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;