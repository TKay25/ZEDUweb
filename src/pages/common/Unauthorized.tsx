import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, AlertCircle, Home, LogIn, ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { useAuth } from '../../hooks/useAuth';

export const Unauthorized: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8 text-center">
        <div className="mb-6">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-10 h-10 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <div className="flex items-center justify-center space-x-2 text-yellow-600 bg-yellow-50 px-4 py-2 rounded-lg mb-4">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm font-medium">403 - Unauthorized</span>
          </div>
          <p className="text-gray-600">
            You don't have permission to access this page.
          </p>
        </div>

        <div className="space-y-4">
          {user ? (
            <>
              <p className="text-sm text-gray-600">
                You're logged in as <span className="font-medium">{user.role}</span>.
                This page requires different permissions.
              </p>
              <div className="flex flex-col space-y-2">
                <Button
                  variant="outline"
                  onClick={() => navigate(-1)}
                  className="justify-start"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Go back
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate(`/${user.role}/dashboard`)}
                  className="justify-start"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Go to your dashboard
                </Button>
              </div>
            </>
          ) : (
            <>
              <p className="text-sm text-gray-600">
                Please log in with an account that has the necessary permissions.
              </p>
              <div className="flex flex-col space-y-2">
                <Button
                  variant="primary"
                  onClick={() => navigate('/login')}
                  className="justify-start"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Log In
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate('/')}
                  className="justify-start"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Return to homepage
                </Button>
              </div>
            </>
          )}

          <div className="pt-4 border-t">
            <p className="text-xs text-gray-500">
              If you believe this is an error, please contact your system administrator or support.
            </p>
            <p className="mt-2">
              <a href="/support" className="text-xs text-primary-600 hover:underline">
                Contact Support
              </a>
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};