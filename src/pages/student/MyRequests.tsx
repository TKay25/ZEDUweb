// src/pages/student/MyRequests.tsx
import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { CheckCircle, XCircle, Clock, BookOpen, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface JoinRequest {
  id: string;
  classId: string;
  tutorId: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  message: string;
  status: 'pending' | 'approved' | 'rejected';
  requestedAt: Date;
  respondedAt?: Date;
  classTitle?: string;
  tutorName?: string;
}

export const MyRequests: React.FC = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<JoinRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      setLoading(true);
      // Load from localStorage for demo
      const savedRequests = JSON.parse(localStorage.getItem('joinRequests') || '[]');
      setRequests(savedRequests);
    } catch (error) {
      console.error('Failed to load requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Join Requests</h1>
        <p className="text-gray-600 mt-1">
          Track the status of your class join requests
        </p>
      </div>

      {requests.length === 0 ? (
        <Card className="p-12 text-center">
          <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Requests Yet</h3>
          <p className="text-gray-500">
            Browse classes and send join requests to tutors.
          </p>
          <Button variant="primary" className="mt-4" onClick={() => navigate('/student/find-tutors')}>
            Find Classes
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <Card key={request.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    {getStatusIcon(request.status)}
                    <h3 className="text-lg font-semibold text-gray-900">
                      {request.classTitle || 'Class Request'}
                    </h3>
                    {getStatusBadge(request.status)}
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2">
                    Tutor: {request.tutorName || 'Unknown'}
                  </p>
                  
                  <p className="text-gray-700 mb-3">{request.message}</p>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>Requested: {new Date(request.requestedAt).toLocaleDateString()}</span>
                    {request.respondedAt && (
                      <span>Responded: {new Date(request.respondedAt).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>
                
                {request.status === 'approved' && (
                  <Button 
                    variant="primary" 
                    onClick={() => navigate(`/student/classes/${request.classId}`)}
                  >
                    Go to Class
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};