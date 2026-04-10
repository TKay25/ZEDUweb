// src/pages/school/Admissions.tsx
import React, { useState, useEffect } from 'react';
import {
  FileText, CheckCircle, Clock, Calendar,
  Upload, Eye, Filter, Search,
  Mail, Phone, UserPlus
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Avatar } from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';
import schoolAPI from '../../api/school.api';
import type { Applicant, AdmissionStats } from '../../api/school.api';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';

export const Admissions: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [stats, setStats] = useState<AdmissionStats | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [modalTab, setModalTab] = useState('personal');

  useEffect(() => {
    loadAdmissions();
  }, []);

  const loadAdmissions = async () => {
    try {
      const [applicantsRes, statsRes] = await Promise.all([
        schoolAPI.getApplicants(),
        schoolAPI.getAdmissionStats()
      ]);
      setApplicants(applicantsRes.data);
      setStats(statsRes.data);
    } catch (error) {
      toast.error('Failed to load admissions');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (applicantId: string, status: Applicant['status']) => {
    try {
      await schoolAPI.updateApplicantStatus(applicantId, status);
      setApplicants(prev =>
        prev.map(a =>
          a.id === applicantId ? { ...a, status } : a
        )
      );
      toast.success(`Application marked as ${status}`);
    } catch (error) {
      toast.error('Failed to update status');
      console.error(error);
    }
  };

  const handleSendEmail = async (applicantId: string) => {
    try {
      await schoolAPI.sendAdmissionEmail(applicantId);
      toast.success('Email sent successfully');
    } catch (error) {
      toast.error('Failed to send email');
      console.error(error);
    }
  };

  const handleVerifyDocument = async (applicantId: string, documentId: string) => {
    try {
      await schoolAPI.verifyDocument(applicantId, documentId);
      setApplicants(prev =>
        prev.map(a => {
          if (a.id === applicantId) {
            const updatedDocs = a.documents.map(d =>
              d.id === documentId ? { ...d, verified: true } : d
            );
            return { ...a, documents: updatedDocs };
          }
          return a;
        })
      );
      toast.success('Document verified');
    } catch (error) {
      toast.error('Failed to verify document');
      console.error(error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'reviewing': return 'bg-blue-100 text-blue-800';
      case 'interview': return 'bg-purple-100 text-purple-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'waitlisted': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredApplicants = applicants.filter(applicant => {
    const matchesSearch = 
      applicant.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      applicant.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      applicant.applicationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      applicant.contact.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === 'all' || applicant.status === selectedStatus;
    const matchesGrade = selectedGrade === 'all' || applicant.applyingFor.grade === selectedGrade;
    
    return matchesSearch && matchesStatus && matchesGrade;
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
        <h1 className="text-2xl font-bold">Admissions Management</h1>
        <div className="flex items-center space-x-3">
          <Button variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Bulk Upload
          </Button>
          <Button>
            <UserPlus className="w-4 h-4 mr-2" />
            Add Applicant
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <Card className="p-4">
          <p className="text-sm text-gray-500">Total</p>
          <p className="text-2xl font-bold">{stats.total}</p>
        </Card>
        <Card className="p-4 bg-yellow-50">
          <p className="text-sm text-yellow-600">Pending</p>
          <p className="text-2xl font-bold text-yellow-700">{stats.pending}</p>
        </Card>
        <Card className="p-4 bg-blue-50">
          <p className="text-sm text-blue-600">Reviewing</p>
          <p className="text-2xl font-bold text-blue-700">{stats.reviewing}</p>
        </Card>
        <Card className="p-4 bg-purple-50">
          <p className="text-sm text-purple-600">Interview</p>
          <p className="text-2xl font-bold text-purple-700">{stats.interview}</p>
        </Card>
        <Card className="p-4 bg-green-50">
          <p className="text-sm text-green-600">Accepted</p>
          <p className="text-2xl font-bold text-green-700">{stats.accepted}</p>
        </Card>
        <Card className="p-4 bg-red-50">
          <p className="text-sm text-red-600">Rejected</p>
          <p className="text-2xl font-bold text-red-700">{stats.rejected}</p>
        </Card>
        <Card className="p-4 bg-gray-50">
          <p className="text-sm text-gray-600">Waitlisted</p>
          <p className="text-2xl font-bold text-gray-700">{stats.waitlisted}</p>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <Input
              placeholder="Search by name, application number, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="w-4 h-4" />}
            />
          </div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-40 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="reviewing">Reviewing</option>
            <option value="interview">Interview</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
            <option value="waitlisted">Waitlisted</option>
          </select>
          <select
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
            className="w-40 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Grades</option>
            <option value="Form 1">Form 1</option>
            <option value="Form 2">Form 2</option>
            <option value="Form 3">Form 3</option>
            <option value="Form 4">Form 4</option>
            <option value="Form 5">Form 5</option>
            <option value="Form 6">Form 6</option>
          </select>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            More Filters
          </Button>
        </div>
      </Card>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: 'all', label: 'All Applications' },
            { id: 'pending', label: 'Pending Review' },
            { id: 'interview', label: 'Interview Scheduled' },
            { id: 'accepted', label: 'Accepted' }
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

      {/* Applicants List */}
      <div className="space-y-4">
        {filteredApplicants.map(applicant => (
          <Card key={applicant.id} className="p-4 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <Avatar
                  src={applicant.avatar}
                  name={`${applicant.firstName} ${applicant.lastName}`}
                  size="lg"
                />
                <div>
                  <div className="flex items-center space-x-3 mb-1">
                    <h3 className="text-lg font-semibold">
                      {applicant.firstName} {applicant.lastName}
                    </h3>
                    <Badge className={getStatusColor(applicant.status)}>
                      {applicant.status}
                    </Badge>
                    <Badge className="bg-gray-100 text-gray-800">
                      {applicant.applicationNumber}
                    </Badge>
                  </div>

                  <p className="text-sm text-gray-600 mb-2">
                    Applying for: {applicant.applyingFor.grade} • {applicant.applyingFor.academicYear}
                  </p>

                  <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                      <span>DOB: {format(new Date(applicant.dateOfBirth), 'MMM d, yyyy')}</span>
                    </div>
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 text-gray-400 mr-2" />
                      <span>{applicant.contact.email}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 text-gray-400 mr-2" />
                      <span>{applicant.contact.phone}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 text-gray-400 mr-2" />
                      <span>Submitted: {format(new Date(applicant.submittedAt), 'MMM d, yyyy')}</span>
                    </div>
                  </div>

                  {applicant.previousSchool && (
                    <div className="mt-2 text-sm text-gray-500">
                      Previous School: {applicant.previousSchool.name} • {applicant.previousSchool.lastGrade} • {applicant.previousSchool.yearLeft}
                    </div>
                  )}

                  {applicant.interviewDate && (
                    <div className="mt-2">
                      <Badge className="bg-purple-100 text-purple-800">
                        Interview: {format(new Date(applicant.interviewDate), 'MMM d, yyyy h:mm a')}
                      </Badge>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSendEmail(applicant.id)}
                >
                  <Mail className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedApplicant(applicant)}
                >
                  <Eye className="w-4 h-4" />
                </Button>
                {applicant.status === 'pending' && (
                  <Button
                    size="sm"
                    onClick={() => handleUpdateStatus(applicant.id, 'reviewing')}
                  >
                    Start Review
                  </Button>
                )}
                {applicant.status === 'reviewing' && (
                  <Button
                    size="sm"
                    onClick={() => handleUpdateStatus(applicant.id, 'interview')}
                  >
                    Schedule Interview
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Applicant Details Modal */}
      {selectedApplicant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold">
                  {selectedApplicant.firstName} {selectedApplicant.lastName}
                </h2>
                <p className="text-gray-600">Application #{selectedApplicant.applicationNumber}</p>
              </div>
              <Badge className={getStatusColor(selectedApplicant.status)}>
                {selectedApplicant.status}
              </Badge>
            </div>

            {/* Modal Tabs */}
            <div className="border-b border-gray-200 mb-4">
              <nav className="flex space-x-8">
                {[
                  { id: 'personal', label: 'Personal Info' },
                  { id: 'documents', label: 'Documents' },
                  { id: 'interview', label: 'Interview' },
                  { id: 'history', label: 'History' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setModalTab(tab.id)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      modalTab === tab.id
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {modalTab === 'personal' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3">Personal Details</h3>
                    <div className="space-y-2">
                      <p><span className="text-gray-500">Full Name:</span> {selectedApplicant.firstName} {selectedApplicant.middleName} {selectedApplicant.lastName}</p>
                      <p><span className="text-gray-500">Date of Birth:</span> {format(new Date(selectedApplicant.dateOfBirth), 'MMMM d, yyyy')}</p>
                      <p><span className="text-gray-500">Gender:</span> {selectedApplicant.gender}</p>
                      <p><span className="text-gray-500">Nationality:</span> {selectedApplicant.nationality}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Contact Information</h3>
                    <div className="space-y-2">
                      <p><span className="text-gray-500">Email:</span> {selectedApplicant.contact.email}</p>
                      <p><span className="text-gray-500">Phone:</span> {selectedApplicant.contact.phone}</p>
                      <p><span className="text-gray-500">Address:</span> {selectedApplicant.contact.address}</p>
                      <p><span className="text-gray-500">City:</span> {selectedApplicant.contact.city}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Parent/Guardian</h3>
                    <div className="space-y-2">
                      <p><span className="text-gray-500">Name:</span> {selectedApplicant.parent.name}</p>
                      <p><span className="text-gray-500">Relationship:</span> {selectedApplicant.parent.relationship}</p>
                      <p><span className="text-gray-500">Email:</span> {selectedApplicant.parent.email}</p>
                      <p><span className="text-gray-500">Phone:</span> {selectedApplicant.parent.phone}</p>
                      {selectedApplicant.parent.occupation && (
                        <p><span className="text-gray-500">Occupation:</span> {selectedApplicant.parent.occupation}</p>
                      )}
                    </div>
                  </div>

                  {selectedApplicant.previousSchool && (
                    <div>
                      <h3 className="font-semibold mb-3">Previous School</h3>
                      <div className="space-y-2">
                        <p><span className="text-gray-500">School:</span> {selectedApplicant.previousSchool.name}</p>
                        <p><span className="text-gray-500">Address:</span> {selectedApplicant.previousSchool.address}</p>
                        <p><span className="text-gray-500">Last Grade:</span> {selectedApplicant.previousSchool.lastGrade}</p>
                        <p><span className="text-gray-500">Year Left:</span> {selectedApplicant.previousSchool.yearLeft}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {modalTab === 'documents' && (
              <div className="space-y-4">
                {selectedApplicant.documents.map(doc => (
                  <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center">
                      <FileText className="w-5 h-5 text-gray-500 mr-3" />
                      <div>
                        <p className="font-medium">{doc.name}</p>
                        <p className="text-sm text-gray-500">
                          Uploaded {format(new Date(doc.uploadedAt), 'MMM d, yyyy')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {doc.verified ? (
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleVerifyDocument(selectedApplicant.id, doc.id)}
                        >
                          Verify
                        </Button>
                      )}
                      <Button variant="outline" size="sm" onClick={() => window.open(doc.url)}>
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {modalTab === 'interview' && (
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold mb-3">Interview Details</h3>
                  {selectedApplicant.interviewDate ? (
                    <div>
                      <p><span className="text-gray-500">Date:</span> {format(new Date(selectedApplicant.interviewDate), 'MMMM d, yyyy h:mm a')}</p>
                      {selectedApplicant.interviewNotes && (
                        <div className="mt-3">
                          <p className="text-gray-500">Notes:</p>
                          <p className="mt-1">{selectedApplicant.interviewNotes}</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      <p className="text-gray-600">No interview scheduled</p>
                      <Button className="mt-3">Schedule Interview</Button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {modalTab === 'history' && (
              <div className="space-y-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Application Submitted</p>
                  <p className="font-medium">{format(new Date(selectedApplicant.submittedAt), 'MMMM d, yyyy h:mm a')}</p>
                </div>
                {selectedApplicant.reviewedAt && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Application Reviewed</p>
                    <p className="font-medium">{format(new Date(selectedApplicant.reviewedAt), 'MMMM d, yyyy h:mm a')}</p>
                  </div>
                )}
                {selectedApplicant.remarks && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Remarks</p>
                    <p className="font-medium">{selectedApplicant.remarks}</p>
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => setSelectedApplicant(null)}
              >
                Close
              </Button>
              {selectedApplicant.status === 'pending' && (
                <Button onClick={() => handleUpdateStatus(selectedApplicant.id, 'reviewing')}>
                  Start Review
                </Button>
              )}
              {selectedApplicant.status === 'reviewing' && (
                <Button onClick={() => handleUpdateStatus(selectedApplicant.id, 'interview')}>
                  Schedule Interview
                </Button>
              )}
              {selectedApplicant.status === 'interview' && (
                <>
                  <Button
                    variant="outline"
                    className="text-red-600"
                    onClick={() => handleUpdateStatus(selectedApplicant.id, 'rejected')}
                  >
                    Reject
                  </Button>
                  <Button
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => handleUpdateStatus(selectedApplicant.id, 'accepted')}
                  >
                    Accept
                  </Button>
                </>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};