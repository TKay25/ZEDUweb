import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  User, Mail, Lock, Eye, EyeOff,
  ArrowRight, Shield, Check, AlertCircle,
  Briefcase, GraduationCap, Users, School
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
//import { Select } from '../../components/ui/Select';
//import { Checkbox } from '../../components/ui/Checkbox';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-hot-toast';

const registerSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().regex(/^(\+263|0)[0-9]{9}$/, 'Invalid Zimbabwe phone number'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: z.string(),
  role: z.enum(['student', 'tutor', 'parent', 'school', 'ministry']),
  agreeToTerms: z.boolean().refine(val => val === true, 'You must agree to the terms and conditions'),
  acceptMarketing: z.boolean().optional()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      role: 'student',
      agreeToTerms: false,
      acceptMarketing: false
    }
  });

  const selectedRole = watch('role');
  const password = watch('password');

  const passwordRequirements = [
    { label: 'At least 8 characters', met: password.length >= 8 },
    { label: 'Uppercase letter', met: /[A-Z]/.test(password) },
    { label: 'Lowercase letter', met: /[a-z]/.test(password) },
    { label: 'Number', met: /[0-9]/.test(password) },
    { label: 'Special character', met: /[^A-Za-z0-9]/.test(password) }
  ];

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setLoading(true);
      await registerUser(data);
      toast.success('Registration successful! Please check your email to verify your account.');
      navigate('/verify-email', { state: { email: data.email } });
    } catch (error: any) {
      toast.error(error.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'student': return <GraduationCap className="w-5 h-5" />;
      case 'tutor': return <Briefcase className="w-5 h-5" />;
      case 'parent': return <Users className="w-5 h-5" />;
      case 'school': return <School className="w-5 h-5" />;
      case 'ministry': return <Shield className="w-5 h-5" />;
      default: return <User className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2">
            <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-2xl">Z</span>
            </div>
            <span className="font-bold text-2xl text-gray-900">ZEDU</span>
          </Link>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step >= 1 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              1
            </div>
            <div className={`w-16 h-1 ${step >= 2 ? 'bg-primary-600' : 'bg-gray-200'}`} />
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step >= 2 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              2
            </div>
            <div className={`w-16 h-1 ${step >= 3 ? 'bg-primary-600' : 'bg-gray-200'}`} />
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step >= 3 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              3
            </div>
          </div>
        </div>

        {/* Registration Card */}
        <Card className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Create Your Account</h1>
            <p className="text-gray-600">Join Zimbabwe's leading education platform</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Step 1: Basic Information */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="First Name"
                    {...register('firstName')}
                    error={errors.firstName?.message}
                    placeholder="John"
                    icon={<User className="w-5 h-5" />}
                  />
                  <Input
                    label="Last Name"
                    {...register('lastName')}
                    error={errors.lastName?.message}
                    placeholder="Doe"
                    icon={<User className="w-5 h-5" />}
                  />
                </div>

                <Input
                  label="Email Address"
                  type="email"
                  {...register('email')}
                  error={errors.email?.message}
                  placeholder="you@example.com"
                  icon={<Mail className="w-5 h-5" />}
                />

                <Input
                  label="Phone Number"
                  {...register('phone')}
                  error={errors.phone?.message}
                  placeholder="0771234567"
                  icon={<Mail className="w-5 h-5" />}
                />

                <Button
                  type="button"
                  variant="primary"
                  className="w-full"
                  onClick={() => setStep(2)}
                >
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}

            {/* Step 2: Account Security */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="relative">
                  <Input
                    label="Password"
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

                <div className="flex space-x-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setStep(1)}
                  >
                    Back
                  </Button>
                  <Button
                    type="button"
                    variant="primary"
                    className="flex-1"
                    onClick={() => setStep(3)}
                  >
                    Continue
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Role Selection & Terms */}
            {step === 3 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">I am a:</label>
                  <div className="grid grid-cols-2 gap-3">
                    {['student', 'tutor', 'parent', 'school', 'ministry'].map((role) => (
                      <label
                        key={role}
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${
                          selectedRole === role
                            ? 'border-primary-500 bg-primary-50'
                            : 'hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          {...register('role')}
                          value={role}
                          className="hidden"
                        />
                        <div className="flex flex-col items-center text-center">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                            selectedRole === role ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600'
                          }`}>
                            {getRoleIcon(role)}
                          </div>
                          <span className="text-sm font-medium capitalize">{role}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                  {errors.role && (
                    <p className="mt-2 text-sm text-red-600">{errors.role.message}</p>
                  )}
                </div>

                <div className="space-y-3">
                  <label className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      {...register('agreeToTerms')}
                      className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-600">
                      I agree to the{' '}
                      <Link to="/terms" className="text-primary-600 hover:underline">
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link to="/privacy" className="text-primary-600 hover:underline">
                        Privacy Policy
                      </Link>
                    </span>
                  </label>
                  {errors.agreeToTerms && (
                    <p className="text-sm text-red-600">{errors.agreeToTerms.message}</p>
                  )}

                  <label className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      {...register('acceptMarketing')}
                      className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-600">
                      I'd like to receive updates and marketing communications
                    </span>
                  </label>
                </div>

                <div className="flex space-x-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setStep(2)}
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    className="flex-1"
                    loading={loading}
                  >
                    Create Account
                  </Button>
                </div>
              </div>
            )}
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center"
              >
                Sign In
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};