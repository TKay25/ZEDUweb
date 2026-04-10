import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Mail, ArrowLeft, Send, CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { toast } from 'react-hot-toast';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address')
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export const ForgotPassword: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema)
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      setLoading(true);
      // API call would go here
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSubmittedEmail(data.email);
      setSubmitted(true);
      toast.success('Password reset instructions sent to your email');
    } catch (error) {
      toast.error('Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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

        {/* Forgot Password Card */}
        <Card className="p-8">
          {!submitted ? (
            <>
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Forgot Password?</h1>
                <p className="text-gray-600">
                  Enter your email address and we'll send you instructions to reset your password.
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="you@example.com"
                  {...register('email')}
                  error={errors.email?.message}
                  icon={<Mail className="w-5 h-5" />}
                />

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full"
                  size="lg"
                  loading={loading}
                >
                  <Send className="w-5 h-5 mr-2" />
                  Send Reset Instructions
                </Button>
              </form>
            </>
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Check Your Email</h2>
              <p className="text-gray-600 mb-6">
                We've sent password reset instructions to<br />
                <span className="font-medium text-gray-900">{submittedEmail}</span>
              </p>
              <p className="text-sm text-gray-500 mb-6">
                Didn't receive the email? Check your spam folder or{' '}
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-primary-600 hover:underline font-medium"
                >
                  try again
                </button>
              </p>
            </div>
          )}

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
          {!submitted && (
            <div className="mt-6 flex items-center justify-center text-xs text-gray-500">
              <AlertCircle className="w-4 h-4 mr-1" />
              We'll never share your email with third parties
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};