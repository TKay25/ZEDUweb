import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import {
  Mail, CheckCircle, AlertCircle, RefreshCw,
  ArrowLeft, Shield
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { toast } from 'react-hot-toast';

export const VerifyEmail: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(true);

  const email = location.state?.email || 'your email';

  // Handle token verification
  useEffect(() => {
    if (token) {
      verifyEmailToken();
    }
  }, [token]);

  // Countdown for resend button
  useEffect(() => {
    if (!canResend && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setCanResend(true);
      setCountdown(60);
    }
  }, [canResend, countdown]);

  const verifyEmailToken = async () => {
    try {
      setVerifying(true);
      // API call to verify email would go here
      await new Promise(resolve => setTimeout(resolve, 1500));
      setVerified(true);
      toast.success('Email verified successfully!');
      
      // Redirect to dashboard after 3 seconds
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
    } catch (error) {
      setError('Failed to verify email. The link may have expired.');
      toast.error('Verification failed');
    } finally {
      setVerifying(false);
    }
  };

  const handleResendVerification = async () => {
    try {
      setResending(true);
      // API call to resend verification email would go here
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCanResend(false);
      toast.success('Verification email resent! Please check your inbox.');
    } catch (error) {
      toast.error('Failed to resend verification email');
    } finally {
      setResending(false);
    }
  };

  // Verification in progress
  if (verifying) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Verifying Your Email</h1>
          <p className="text-gray-600">Please wait while we verify your email address...</p>
        </Card>
      </div>
    );
  }

  // Verified successfully
  if (verified) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Email Verified!</h1>
          <p className="text-gray-600 mb-6">
            Your email has been successfully verified. You'll be redirected to your dashboard in a few seconds.
          </p>
          <Link to="/dashboard">
            <Button variant="primary" className="w-full">
              Go to Dashboard
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  // Verification page (no token or with token error)
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

        {/* Verification Card */}
        <Card className="p-8">
          {error ? (
            // Error state
            <>
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">Verification Failed</h1>
              <p className="text-gray-600 text-center mb-6">{error}</p>
              
              <div className="space-y-3">
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={handleResendVerification}
                  loading={resending}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Resend Verification Email
                </Button>
                
                <Link to="/login">
                  <Button variant="outline" className="w-full">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Login
                  </Button>
                </Link>
              </div>
            </>
          ) : (
            // Pending verification
            <>
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-primary-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">Verify Your Email</h1>
              <p className="text-gray-600 text-center mb-6">
                We've sent a verification email to<br />
                <span className="font-medium text-gray-900">{email}</span>
              </p>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-start space-x-3">
                  <Mail className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Check your inbox</p>
                    <p>Click the link in the email to verify your account. If you don't see it, check your spam folder.</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleResendVerification}
                  loading={resending}
                  disabled={!canResend}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Resend Email
                  {!canResend && (
                    <span className="ml-2 text-xs text-gray-500">
                      ({countdown}s)
                    </span>
                  )}
                </Button>

                <Link to="/login">
                  <Button variant="ghost" className="w-full">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Login
                  </Button>
                </Link>
              </div>

              {/* Help Text */}
              <div className="mt-6 pt-6 border-t">
                <p className="text-xs text-gray-500 text-center">
                  Having trouble? Contact our support team at{' '}
                  <a href="mailto:support@zedu.co.zw" className="text-primary-600 hover:underline">
                    support@zedu.co.zw
                  </a>
                </p>
              </div>
            </>
          )}

          {/* Security Note */}
          <div className="mt-6 flex items-center justify-center text-xs text-gray-500">
            <Shield className="w-4 h-4 mr-1" />
            Your information is protected by enterprise-grade security
          </div>
        </Card>
      </div>
    </div>
  );
};