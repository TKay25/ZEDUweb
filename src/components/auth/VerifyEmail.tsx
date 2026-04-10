// src/components/auth/VerifyEmail.tsx
import React, { useEffect, useState } from 'react';

interface VerifyEmailProps {
  token: string;
  onVerify: (token: string) => Promise<void>;
  onResend: () => Promise<void>;
  loading?: boolean;
}

const VerifyEmail: React.FC<VerifyEmailProps> = ({
  token,
  onVerify,
  onResend,
  loading: _loading // Prefix with underscore to indicate intentionally unused
}) => {
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    verifyEmail();
  }, [token]);

  useEffect(() => {
    // Fix: Use ReturnType<typeof setTimeout> instead of NodeJS.Timeout
    let timer: ReturnType<typeof setTimeout>;
    if (countdown > 0 && !canResend) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [countdown, canResend]);

  const verifyEmail = async () => {
    try {
      await onVerify(token);
      setStatus('success');
    } catch (error) {
      setStatus('error');
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    await onResend();
    setCountdown(60);
    setCanResend(false);
  };

  const getIcon = () => {
    switch (status) {
      case 'verifying':
        return (
          <div className="w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
        );
      case 'success':
        return (
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto animate-bounce">
            <span className="text-4xl">✓</span>
          </div>
        );
      case 'error':
        return (
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <span className="text-4xl">⚠️</span>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="px-6 py-8 text-center">
            {/* Icon */}
            <div className="mb-6">
              {getIcon()}
            </div>

            {/* Content */}
            {status === 'verifying' && (
              <>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Verifying Your Email</h2>
                <p className="text-gray-600 mb-4">
                  Please wait while we verify your email address...
                </p>
                <div className="flex justify-center">
                  <div className="w-12 h-1 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 animate-progress" />
                  </div>
                </div>
              </>
            )}

            {status === 'success' && (
              <>
                <div className="mb-4">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Email Verified! 🎉</h2>
                  <p className="text-gray-600">
                    Your email has been successfully verified. You can now access all features of your account.
                  </p>
                </div>

                <div className="space-y-4">
                  <button
                    onClick={() => window.location.href = '/dashboard'}
                    className="w-full py-3 px-4 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg font-medium hover:from-green-700 hover:to-teal-700 transform hover:scale-105 transition-all duration-200"
                  >
                    Go to Dashboard
                  </button>
                </div>
              </>
            )}

            {status === 'error' && (
              <>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Verification Failed</h2>
                <p className="text-gray-600 mb-6">
                  We couldn't verify your email. The link may have expired or is invalid.
                </p>

                <div className="space-y-4">
                  <button
                    onClick={handleResend}
                    disabled={!canResend}
                    className={`w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 ${
                      !canResend ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {canResend ? 'Resend Verification Email' : `Resend available in ${countdown}s`}
                  </button>

                  <button
                    onClick={() => window.location.href = '/support'}
                    className="w-full py-3 px-4 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors duration-200"
                  >
                    Contact Support
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <p className="text-sm text-center text-gray-600">
              Need help?{' '}
              <a href="/support" className="text-blue-600 hover:text-blue-500 font-medium">
                Contact Support
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Add animation keyframes */}
      <style>{`
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        .animate-progress {
          animation: progress 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default VerifyEmail;