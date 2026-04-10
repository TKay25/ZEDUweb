import React, { useState } from 'react';
import {
  CheckCircle, XCircle, Clock, Eye,
  Download, Search, Mail,
  Phone, GraduationCap, Briefcase,
  FileText, Star, AlertCircle
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import Select from '../ui/Select';
import Badge from '../ui/Badge';
import Avatar from '../ui/Avatar';
import Tabs from '../ui/Tabs';
import { toast } from 'react-hot-toast';

interface Tutor {
  id: string;
  registrationNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: Date;
  gender: string;
  qualifications: Array<{
    degree: string;
    institution: string;
    year: number;
    certificate: string;
  }>;
  experience: number;
  subjects: string[];
  schools: Array<{
    name: string;
    from: Date;
    to: Date;
    verified: boolean;
  }>;
  documents: Array<{
    name: string;
    url: string;
    status: 'pending' | 'verified' | 'rejected';
  }>;
  status: 'pending' | 'verified' | 'rejected' | 'suspended';
  submittedAt: Date;
  verifiedAt?: Date;
  backgroundCheck: {
    status: 'pending' | 'cleared' | 'flagged';
    report?: string;
  };
  rating?: number;
  reviews?: number;
}

interface TutorVerificationProps {
  tutors: Tutor[];
  onVerifyTutor: (tutorId: string) => Promise<void>;
  onRejectTutor: (tutorId: string, reason: string) => Promise<void>;
  onSuspendTutor?: (tutorId: string, reason: string) => Promise<void>;
  onViewDocuments: (tutorId: string) => void;
  onBackgroundCheck: (tutorId: string) => Promise<void>;
  onContactTutor: (tutorId: string) => void;
}

export const TutorVerification: React.FC<TutorVerificationProps> = ({
  tutors,
  onVerifyTutor,
  onRejectTutor,
  onSuspendTutor: _onSuspendTutor,
  onViewDocuments,
  onBackgroundCheck,
  onContactTutor
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedTutor, setSelectedTutor] = useState<Tutor | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [activeTab, setActiveTab] = useState('pending');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'suspended': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      case 'suspended': return <AlertCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  const getBackgroundCheckColor = (status: string) => {
    switch (status) {
      case 'cleared': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'flagged': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredTutors = tutors.filter(tutor => {
    const matchesSearch = 
      tutor.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tutor.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tutor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tutor.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = selectedSubject === 'all' || tutor.subjects.includes(selectedSubject);
    const matchesStatus = selectedStatus === 'all' || tutor.status === selectedStatus;
    const matchesTab = activeTab === 'all' || tutor.status === activeTab;
    return matchesSearch && matchesSubject && matchesStatus && matchesTab;
  });

  const allSubjects = Array.from(new Set(tutors.flatMap(t => t.subjects)));

  // Subject options for select
  const subjectOptions = [
    { value: 'all', label: 'All Subjects' },
    ...allSubjects.map(subject => ({ value: subject, label: subject }))
  ];

  // Status options for select
  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'verified', label: 'Verified' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'suspended', label: 'Suspended' }
  ];

  // Tabs configuration
  const tabs = [
    { key: 'all', label: 'All Tutors' },
    { key: 'pending', label: 'Pending' },
    { key: 'verified', label: 'Verified' },
    { key: 'rejected', label: 'Rejected' }
  ];

  const handleVerify = async (tutorId: string) => {
    try {
      await onVerifyTutor(tutorId);
      toast.success('Tutor verified successfully');
    } catch (_error) {
      toast.error('Failed to verify tutor');
    }
  };

  const handleReject = async () => {
    if (!selectedTutor || !rejectReason) return;
    try {
      await onRejectTutor(selectedTutor.id, rejectReason);
      setShowRejectModal(false);
      setRejectReason('');
      toast.success('Tutor rejected');
    } catch (_error) {
      toast.error('Failed to reject tutor');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Tutor Verification</h1>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export List
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-sm text-gray-500">Total Tutors</p>
          <p className="text-2xl font-bold">{tutors.length}</p>
        </Card>
        <Card className="p-4 bg-yellow-50">
          <p className="text-sm text-yellow-700">Pending</p>
          <p className="text-2xl font-bold text-yellow-700">
            {tutors.filter(t => t.status === 'pending').length}
          </p>
        </Card>
        <Card className="p-4 bg-green-50">
          <p className="text-sm text-green-700">Verified</p>
          <p className="text-2xl font-bold text-green-700">
            {tutors.filter(t => t.status === 'verified').length}
          </p>
        </Card>
        <Card className="p-4 bg-red-50">
          <p className="text-sm text-red-700">Flagged Background</p>
          <p className="text-2xl font-bold text-red-700">
            {tutors.filter(t => t.backgroundCheck.status === 'flagged').length}
          </p>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search Input - removed icon prop, using wrapper */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              placeholder="Search tutors..."
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select
            value={selectedSubject}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedSubject(e.target.value)}
            options={subjectOptions}
          />
          
          <Select
            value={selectedStatus}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedStatus(e.target.value)}
            options={statusOptions}
          />
          
          <Button variant="ghost">
            <AlertCircle className="w-4 h-4 mr-2" />
            More Filters
          </Button>
        </div>
      </Card>

      {/* Tabs */}
      <Tabs
        items={tabs}
        activeKey={activeTab}
        onChange={setActiveTab}
      />

      {/* Tutors List */}
      <div className="space-y-4">
        {filteredTutors.map((tutor) => (
          <Card key={tutor.id} className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-start space-x-4">
                  <Avatar
                    name={`${tutor.firstName} ${tutor.lastName}`}
                    size="lg"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold">
                        {tutor.firstName} {tutor.lastName}
                      </h3>
                      <Badge className={getStatusColor(tutor.status)}>
                        <span className="flex items-center">
                          {getStatusIcon(tutor.status)}
                          <span className="ml-1 capitalize">{tutor.status}</span>
                        </span>
                      </Badge>
                      <Badge className={getBackgroundCheckColor(tutor.backgroundCheck.status)}>
                        BG: {tutor.backgroundCheck.status}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        Reg: {tutor.registrationNumber}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 text-gray-400 mr-1" />
                        {tutor.email}
                      </div>
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 text-gray-400 mr-1" />
                        {tutor.phone}
                      </div>
                      <div className="flex items-center">
                        <GraduationCap className="w-4 h-4 text-gray-400 mr-1" />
                        {tutor.qualifications[0]?.degree} - {tutor.qualifications[0]?.institution}
                      </div>
                      <div className="flex items-center">
                        <Briefcase className="w-4 h-4 text-gray-400 mr-1" />
                        {tutor.experience} years experience
                      </div>
                    </div>

                    {/* Subjects */}
                    <div className="mt-3 flex flex-wrap gap-1">
                      {tutor.subjects.map((subject, index) => (
                        <Badge key={index} variant="secondary" size="sm">
                          {subject}
                        </Badge>
                      ))}
                    </div>

                    {/* Employment History */}
                    <div className="mt-4">
                      <p className="text-sm font-medium mb-2">Employment History</p>
                      {tutor.schools.map((school, index) => (
                        <div key={index} className="flex items-center text-sm mb-1">
                          <span className="text-gray-600">{school.name}</span>
                          <span className="mx-2 text-gray-400">•</span>
                          <span className="text-gray-500">
                            {new Date(school.from).getFullYear()} - {new Date(school.to).getFullYear()}
                          </span>
                          {school.verified && (
                            <CheckCircle className="w-3 h-3 text-green-500 ml-2" />
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Rating */}
                    {tutor.rating && (
                      <div className="mt-2 flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="ml-1 text-sm font-medium">{tutor.rating}</span>
                        <span className="ml-1 text-sm text-gray-500">
                          ({tutor.reviews} reviews)
                        </span>
                      </div>
                    )}

                    {/* Documents */}
                    <div className="mt-4 flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium">Documents:</span>
                      {tutor.documents.map((doc, index) => (
                        <Badge
                          key={index}
                          className={
                            doc.status === 'verified' ? 'bg-green-100 text-green-800' :
                            doc.status === 'rejected' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }
                        >
                          {doc.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col space-y-2 ml-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onViewDocuments(tutor.id)}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Docs
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onContactTutor(tutor.id)}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Contact
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onBackgroundCheck(tutor.id)}
                >
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Background Check
                </Button>

                {tutor.status === 'pending' && (
                  <>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleVerify(tutor.id)}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Verify
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600"
                      onClick={() => {
                        setSelectedTutor(tutor);
                        setShowRejectModal(true);
                      }}
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                  </>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Reject Modal */}
      {showRejectModal && selectedTutor && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4">Reject Tutor</h2>
            <p className="text-sm text-gray-600 mb-4">
              Tutor: {selectedTutor.firstName} {selectedTutor.lastName}
            </p>
            <textarea
              className="w-full p-2 border rounded-lg mb-4"
              rows={4}
              placeholder="Reason for rejection..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setShowRejectModal(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                className="bg-red-600 hover:bg-red-700"
                onClick={handleReject}
                disabled={!rejectReason}
              >
                Reject Tutor
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};