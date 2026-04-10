// src/pages/school/Verification.tsx
import React, { useState, useEffect } from 'react';
import {
  CheckCircle, XCircle, AlertCircle,
  FileText, Image, Download, Eye,
  Search, User, Mail,
  Phone, Award,
  RefreshCw
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
//import schoolAPI from '../../api/school.api';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';

interface VerificationRequest {
  id: string;
  type: 'student' | 'teacher' | 'parent' | 'document' | 'certificate';
  status: 'pending' | 'verified' | 'rejected' | 'in-review';
  priority: 'high' | 'medium' | 'low';
  submittedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: {
    id: string;
    name: string;
  };
  data: {
    id?: string;
    name: string;
    email?: string;
    phone?: string;
    documentType?: string;
    documentNumber?: string;
    issueDate?: Date;
    expiryDate?: Date;
    issuingAuthority?: string;
  };
  documents: Array<{
    id: string;
    name: string;
    type: string;
    url: string;
    uploadedAt: Date;
    verified?: boolean;
  }>;
  notes?: string;
  rejectionReason?: string;
}

interface VerificationStats {
  total: number;
  pending: number;
  verified: number;
  rejected: number;
  inReview: number;
  highPriority: number;
}

export const Verification: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<VerificationRequest[]>([]);
  const [stats, setStats] = useState<VerificationStats | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<VerificationRequest | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('pending');
  const [verificationNotes, setVerificationNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    loadVerificationRequests();
  }, []);

  const loadVerificationRequests = async () => {
    try {
      // Mock data for demonstration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockRequests: VerificationRequest[] = [
        {
          id: '1',
          type: 'student',
          status: 'pending',
          priority: 'high',
          submittedAt: new Date(),
          data: {
            id: 's1',
            name: 'John Doe',
            email: 'john.doe@student.com',
            phone: '+263 123 456789'
          },
          documents: [
            {
              id: 'd1',
              name: 'Birth Certificate',
              type: 'application/pdf',
              url: '/docs/birth-cert.pdf',
              uploadedAt: new Date()
            }
          ]
        },
        {
          id: '2',
          type: 'teacher',
          status: 'in-review',
          priority: 'medium',
          submittedAt: new Date(),
          data: {
            id: 't1',
            name: 'Jane Smith',
            email: 'jane.smith@school.com',
            phone: '+263 234 567890',
            documentType: 'Teaching Certificate',
            documentNumber: 'TC123456'
          },
          documents: [
            {
              id: 'd2',
              name: 'Teaching Certificate',
              type: 'application/pdf',
              url: '/docs/teaching-cert.pdf',
              uploadedAt: new Date()
            }
          ]
        },
        {
          id: '3',
          type: 'certificate',
          status: 'verified',
          priority: 'low',
          submittedAt: new Date(),
          data: {
            name: 'Graduation Certificate',
            documentNumber: 'GC789012',
            issueDate: new Date(2023, 10, 15),
            expiryDate: new Date(2028, 10, 15),
            issuingAuthority: 'Ministry of Education'
          },
          documents: [
            {
              id: 'd3',
              name: 'Graduation Certificate',
              type: 'application/pdf',
              url: '/docs/grad-cert.pdf',
              uploadedAt: new Date(),
              verified: true
            }
          ]
        }
      ];
      
      const mockStats: VerificationStats = {
        total: 15,
        pending: 5,
        verified: 8,
        rejected: 2,
        inReview: 3,
        highPriority: 2
      };
      
      setRequests(mockRequests);
      setStats(mockStats);
    } catch (error) {
      toast.error('Failed to load verification requests');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (requestId: string) => {
    try {
      setRequests(prev => prev.map(r => 
        r.id === requestId 
          ? { ...r, status: 'verified', reviewedAt: new Date(), notes: verificationNotes }
          : r
      ));
      toast.success('Request verified successfully');
      setSelectedRequest(null);
      setVerificationNotes('');
      // Update stats
      if (stats) {
        setStats({
          ...stats,
          pending: stats.pending - 1,
          verified: stats.verified + 1
        });
      }
    } catch (error) {
      toast.error('Failed to verify request');
      console.error(error);
    }
  };

  const handleReject = async (requestId: string) => {
    if (!rejectionReason) {
      toast.error('Please provide a rejection reason');
      return;
    }

    try {
      setRequests(prev => prev.map(r => 
        r.id === requestId 
          ? { ...r, status: 'rejected', reviewedAt: new Date(), rejectionReason }
          : r
      ));
      toast.success('Request rejected');
      setSelectedRequest(null);
      setRejectionReason('');
      // Update stats
      if (stats) {
        setStats({
          ...stats,
          pending: stats.pending - 1,
          rejected: stats.rejected + 1
        });
      }
    } catch (error) {
      toast.error('Failed to reject request');
      console.error(error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in-review': return 'bg-blue-100 text-blue-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'student': return <User className="w-4 h-4" />;
      case 'teacher': return <Award className="w-4 h-4" />;
      case 'parent': return <User className="w-4 h-4" />;
      case 'document': return <FileText className="w-4 h-4" />;
      case 'certificate': return <Award className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const filteredRequests = requests.filter(request => {
    const matchesSearch = 
      request.data.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.data.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.data.documentNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = selectedType === 'all' || request.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || request.status === selectedStatus;
    const matchesPriority = selectedPriority === 'all' || request.priority === selectedPriority;
    
    let matchesTab = true;
    if (activeTab === 'pending') {
      matchesTab = request.status === 'pending' || request.status === 'in-review';
    } else if (activeTab === 'verified') {
      matchesTab = request.status === 'verified';
    } else if (activeTab === 'rejected') {
      matchesTab = request.status === 'rejected';
    }
    
    return matchesSearch && matchesType && matchesStatus && matchesPriority && matchesTab;
  });

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Verification Dashboard</h1>
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={loadVerificationRequests}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="p-4">
          <p className="text-sm text-gray-500">Total</p>
          <p className="text-2xl font-bold">{stats.total}</p>
        </Card>
        <Card className="p-4 bg-yellow-50">
          <p className="text-sm text-yellow-600">Pending</p>
          <p className="text-2xl font-bold text-yellow-700">{stats.pending}</p>
        </Card>
        <Card className="p-4 bg-blue-50">
          <p className="text-sm text-blue-600">In Review</p>
          <p className="text-2xl font-bold text-blue-700">{stats.inReview}</p>
        </Card>
        <Card className="p-4 bg-green-50">
          <p className="text-sm text-green-600">Verified</p>
          <p className="text-2xl font-bold text-green-700">{stats.verified}</p>
        </Card>
        <Card className="p-4 bg-red-50">
          <p className="text-sm text-red-600">Rejected</p>
          <p className="text-2xl font-bold text-red-700">{stats.rejected}</p>
        </Card>
        <Card className="p-4 bg-red-100">
          <p className="text-sm text-red-800">High Priority</p>
          <p className="text-2xl font-bold text-red-900">{stats.highPriority}</p>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="md:col-span-2">
            <Input
              placeholder="Search by name, email, or document number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="w-4 h-4" />}
            />
          </div>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Types</option>
            <option value="student">Students</option>
            <option value="teacher">Teachers</option>
            <option value="parent">Parents</option>
            <option value="document">Documents</option>
            <option value="certificate">Certificates</option>
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in-review">In Review</option>
            <option value="verified">Verified</option>
            <option value="rejected">Rejected</option>
          </select>
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Priority</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </Card>

      {/* Simple Tabs Implementation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: 'pending', label: `Pending (${stats.pending + stats.inReview})` },
            { id: 'verified', label: `Verified (${stats.verified})` },
            { id: 'rejected', label: `Rejected (${stats.rejected})` },
            { id: 'all', label: 'All Requests' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {filteredRequests.map(request => (
          <Card
            key={request.id}
            className="p-4 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => setSelectedRequest(request)}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  request.type === 'student' ? 'bg-blue-100' :
                  request.type === 'teacher' ? 'bg-green-100' :
                  request.type === 'parent' ? 'bg-purple-100' :
                  'bg-gray-100'
                }`}>
                  {getTypeIcon(request.type)}
                </div>

                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2 flex-wrap gap-2">
                    <h3 className="text-lg font-semibold">{request.data.name}</h3>
                    <Badge className={getStatusColor(request.status)}>
                      {request.status}
                    </Badge>
                    <Badge className={getPriorityColor(request.priority)}>
                      {request.priority} priority
                    </Badge>
                    <Badge className="bg-gray-100 text-gray-800">
                      {request.type}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    {request.data.email && (
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 text-gray-400 mr-2" />
                        <span>{request.data.email}</span>
                      </div>
                    )}
                    {request.data.phone && (
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 text-gray-400 mr-2" />
                        <span>{request.data.phone}</span>
                      </div>
                    )}
                    {request.data.documentNumber && (
                      <div className="flex items-center">
                        <FileText className="w-4 h-4 text-gray-400 mr-2" />
                        <span>{request.data.documentNumber}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                    <span>Submitted: {format(request.submittedAt, 'MMM d, yyyy')}</span>
                    {request.reviewedAt && (
                      <>
                        <span>•</span>
                        <span>Reviewed: {format(request.reviewedAt, 'MMM d, yyyy')}</span>
                      </>
                    )}
                    <span>•</span>
                    <span>{request.documents.length} documents</span>
                  </div>

                  {request.rejectionReason && (
                    <div className="mt-2 p-2 bg-red-50 rounded-lg text-sm text-red-700">
                      <AlertCircle className="w-4 h-4 inline mr-1" />
                      Rejection reason: {request.rejectionReason}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2 ml-4">
                <Button variant="ghost" size="sm">
                  <Eye className="w-4 h-4" />
                </Button>
                {request.status === 'pending' && (
                  <Button size="sm">
                    Review
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Verification Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold">Verify Request</h2>
                <p className="text-gray-600">#{selectedRequest.id}</p>
              </div>
              <button
                onClick={() => setSelectedRequest(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <span className="text-2xl">&times;</span>
              </button>
            </div>

            <div className="space-y-6">
              {/* Request Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Information</h3>
                  <div className="space-y-2">
                    <p><span className="text-gray-500">Name:</span> {selectedRequest.data.name}</p>
                    {selectedRequest.data.email && (
                      <p><span className="text-gray-500">Email:</span> {selectedRequest.data.email}</p>
                    )}
                    {selectedRequest.data.phone && (
                      <p><span className="text-gray-500">Phone:</span> {selectedRequest.data.phone}</p>
                    )}
                    {selectedRequest.data.documentType && (
                      <p><span className="text-gray-500">Document Type:</span> {selectedRequest.data.documentType}</p>
                    )}
                    {selectedRequest.data.documentNumber && (
                      <p><span className="text-gray-500">Document Number:</span> {selectedRequest.data.documentNumber}</p>
                    )}
                    {selectedRequest.data.issueDate && (
                      <p><span className="text-gray-500">Issue Date:</span> {format(selectedRequest.data.issueDate, 'MMM d, yyyy')}</p>
                    )}
                    {selectedRequest.data.expiryDate && (
                      <p><span className="text-gray-500">Expiry Date:</span> {format(selectedRequest.data.expiryDate, 'MMM d, yyyy')}</p>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Submission Details</h3>
                  <div className="space-y-2">
                    <p><span className="text-gray-500">Type:</span> {selectedRequest.type}</p>
                    <p><span className="text-gray-500">Priority:</span> {selectedRequest.priority}</p>
                    <p><span className="text-gray-500">Submitted:</span> {format(selectedRequest.submittedAt, 'MMMM d, yyyy h:mm a')}</p>
                    <p><span className="text-gray-500">Documents:</span> {selectedRequest.documents.length}</p>
                  </div>
                </div>
              </div>

              {/* Documents */}
              <div>
                <h3 className="font-semibold mb-3">Documents</h3>
                <div className="space-y-3">
                  {selectedRequest.documents.map(doc => (
                    <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        {doc.type.startsWith('image/') ? (
                          <Image className="w-5 h-5 text-gray-500 mr-3" />
                        ) : (
                          <FileText className="w-5 h-5 text-gray-500 mr-3" />
                        )}
                        <div>
                          <p className="font-medium">{doc.name}</p>
                          <p className="text-xs text-gray-500">
                            Uploaded {format(doc.uploadedAt, 'MMM d, yyyy')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {doc.verified ? (
                          <Badge className="bg-green-100 text-green-800">
                            Verified
                          </Badge>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(doc.url, '_blank')}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Verification Notes */}
              <div>
                <label className="block text-sm font-medium mb-2">Verification Notes</label>
                <textarea
                  value={verificationNotes}
                  onChange={(e) => setVerificationNotes(e.target.value)}
                  rows={3}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Add any notes about this verification..."
                />
              </div>

              {/* Rejection Reason (shown when rejecting) */}
              {selectedRequest.status === 'pending' && (
                <div>
                  <label className="block text-sm font-medium mb-2">Rejection Reason (if applicable)</label>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    rows={2}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Provide reason if rejecting..."
                  />
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedRequest(null);
                    setVerificationNotes('');
                    setRejectionReason('');
                  }}
                >
                  Cancel
                </Button>
                {selectedRequest.status === 'pending' && (
                  <>
                    <Button
                      variant="outline"
                      className="text-red-600 border-red-200 hover:bg-red-50"
                      onClick={() => handleReject(selectedRequest.id)}
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                    <Button
                      onClick={() => handleVerify(selectedRequest.id)}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Verify
                    </Button>
                  </>
                )}
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};