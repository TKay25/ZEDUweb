import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileQuestion, Home, ArrowLeft, Search } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

export const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-lg w-full p-8 text-center">
        <div className="mb-6">
          <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileQuestion className="w-12 h-12 text-primary-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">404</h1>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Page Not Found</h2>
          <p className="text-gray-600">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">You might want to:</p>
            <div className="flex flex-col space-y-2">
              <Button
                variant="outline"
                onClick={() => navigate(-1)}
                className="justify-start"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go back to previous page
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/')}
                className="justify-start"
              >
                <Home className="w-4 h-4 mr-2" />
                Return to homepage
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/search')}
                className="justify-start"
              >
                <Search className="w-4 h-4 mr-2" />
                Search for content
              </Button>
            </div>
          </div>

          <div className="text-sm text-gray-500">
            <p>If you believe this is an error, please contact our support team.</p>
            <p className="mt-2">
              <a href="/support" className="text-primary-600 hover:underline">
                Contact Support
              </a>
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};