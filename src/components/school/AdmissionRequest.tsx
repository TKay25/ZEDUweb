import React, { useState } from 'react';
import { format } from 'date-fns';
import {
  Mail, Phone, Calendar, GraduationCap,
  FileText, CheckCircle, XCircle, Clock,
  Eye, Download, AlertCircle,
  ChevronLeft, ChevronRight, Filter, Search
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Badge } from '../ui/Badge';
import { Avatar } from '../ui/Avatar';
import { Tabs } from '../ui/Tabs';
import { toast } from 'react-hot-toast';

// Education Levels
export type EducationLevel = 
  | 'ecd'           // Early Childhood Development (Ages 3-5)
  | 'primary'       // Grade 1-7
  | 'secondary'     // Form 1-4
  | 'a-level'       // Form 5-6
  | 'tertiary'      // College/University
  | 'vocational';   // Vocational Training

// Grade/Year mappings
export const GRADE_MAPPINGS: Record<EducationLevel, Array<{ value: string; label: string; description?: string }>> = {
  ecd: [
    { value: 'ecd-a', label: 'ECD A', description: 'Age 3-4 years' },
    { value: 'ecd-b', label: 'ECD B', description: 'Age 4-5 years' },
    { value: 'grade-0', label: 'Grade 0 / Reception', description: 'Age 5-6 years' }
  ],
  primary: [
    { value: 'grade-1', label: 'Grade 1', description: 'Age 6-7 years' },
    { value: 'grade-2', label: 'Grade 2', description: 'Age 7-8 years' },
    { value: 'grade-3', label: 'Grade 3', description: 'Age 8-9 years' },
    { value: 'grade-4', label: 'Grade 4', description: 'Age 9-10 years' },
    { value: 'grade-5', label: 'Grade 5', description: 'Age 10-11 years' },
    { value: 'grade-6', label: 'Grade 6', description: 'Age 11-12 years' },
    { value: 'grade-7', label: 'Grade 7', description: 'Age 12-13 years' }
  ],
  secondary: [
    { value: 'form-1', label: 'Form 1', description: 'Age 13-14 years' },
    { value: 'form-2', label: 'Form 2', description: 'Age 14-15 years' },
    { value: 'form-3', label: 'Form 3', description: 'Age 15-16 years' },
    { value: 'form-4', label: 'Form 4', description: 'Age 16-17 years' }
  ],
  'a-level': [
    { value: 'form-5', label: 'Form 5 (Lower 6)', description: 'Age 17-18 years' },
    { value: 'form-6', label: 'Form 6 (Upper 6)', description: 'Age 18-19 years' }
  ],
  tertiary: [
    { value: 'certificate', label: 'Certificate', description: '6-12 months' },
    { value: 'diploma', label: 'Diploma', description: '1-2 years' },
    { value: 'higher-diploma', label: 'Higher Diploma', description: '2-3 years' },
    { value: 'degree', label: 'Bachelor\'s Degree', description: '3-4 years' },
    { value: 'honours', label: 'Bachelor\'s Honours', description: '4 years' },
    { value: 'postgraduate', label: 'Postgraduate Diploma', description: '1 year' },
    { value: 'masters', label: 'Master\'s Degree', description: '1-2 years' },
    { value: 'phd', label: 'PhD / Doctorate', description: '3-5 years' }
  ],
  vocational: [
    { value: 'voc-level-1', label: 'National Certificate Level 1', description: 'Entry level' },
    { value: 'voc-level-2', label: 'National Certificate Level 2', description: 'Intermediate' },
    { value: 'voc-level-3', label: 'National Certificate Level 3', description: 'Advanced' },
    { value: 'voc-diploma', label: 'Vocational Diploma', description: 'Professional level' }
  ]
};

// Education Level options for select
const EDUCATION_LEVEL_OPTIONS = [
  { value: 'ecd', label: '🎓 Early Childhood (ECD)' },
  { value: 'primary', label: '📚 Primary School (Grade 1-7)' },
  { value: 'secondary', label: '🏫 Secondary School (Form 1-4)' },
  { value: 'a-level', label: '🎯 Advanced Level (Form 5-6)' },
  { value: 'tertiary', label: '🏛️ Tertiary / University' },
  { value: 'vocational', label: '🔧 Vocational Training' }
];

interface AdmissionRequest {
  id: string;
  applicationNumber: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  gender: 'male' | 'female' | 'other';
  nationality: string;
  address: string;
  phone: string;
  email: string;
  educationLevel: EducationLevel;
  applyingForGrade: string;
  previousSchool?: string;
  previousGrade?: string;
  previousInstitution?: string; // For tertiary applicants
  academicYear: string;
  // Additional fields for different education levels
  ecdInfo?: {
    immunizationRecord?: boolean;
    pottyTrained?: boolean;
    parentOrientation?: boolean;
  };
  primaryInfo?: {
    previousPrimarySchool?: string;
    literacyLevel?: string;
    numeracyLevel?: string;
  };
  secondaryInfo?: {
    previousSecondarySchool?: string;
    zimsecRegistration?: string;
    preferredStream?: 'science' | 'commercial' | 'arts';
  };
  aLevelInfo?: {
    oLevelResults?: Array<{ subject: string; grade: string }>;
    intendedSubjects?: string[];
    careerPath?: string;
  };
  tertiaryInfo?: {
    previousQualification?: string;
    institution?: string;
    yearOfCompletion?: number;
    transcript?: string;
    programOfStudy?: string;
    intendedMajor?: string;
    workExperience?: string;
  };
  vocationalInfo?: {
    trade?: string;
    previousTraining?: string;
    certification?: string;
    employerSponsor?: string;
  };
  guardian: {
    name: string;
    relationship: string;
    phone: string;
    email: string;
    occupation?: string;
    employer?: string;
    income?: number;
  };
  documents: Array<{
    name: string;
    url: string;
    type: string;
  }>;
  status: 'pending' | 'under-review' | 'interview-scheduled' | 'accepted' | 'rejected' | 'waitlisted';
  submittedAt: Date;
  lastUpdated: Date;
  interviewDate?: Date;
  interviewNotes?: string;
  reviewedBy?: string;
  comments?: string;
}

interface AdmissionRequestProps {
  requests: AdmissionRequest[];
  stats: {
    total: number;
    pending: number;
    underReview: number;
    interview: number;
    accepted: number;
    rejected: number;
    waitlisted: number;
    byLevel: Record<EducationLevel, number>;
  };
  onViewRequest: (requestId: string) => void;
  onUpdateStatus: (requestId: string, status: string, notes?: string) => Promise<void>;
  onScheduleInterview: (requestId: string, date: Date) => Promise<void>;
  onSendCommunication?: (requestId: string, type: 'email' | 'sms', message: string) => Promise<void>;
  onDownloadDocuments: (requestId: string) => void;
  onExportData: () => void;
}

export const AdmissionRequest: React.FC<AdmissionRequestProps> = ({
  requests,
  stats,
  onViewRequest,
  onUpdateStatus,
  onScheduleInterview,
  onSendCommunication: _onSendCommunication,
  onDownloadDocuments,
  onExportData
}) => {
  const [activeTab, setActiveTab] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEducationLevel, setSelectedEducationLevel] = useState<string>('all');
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [selectedRequest, setSelectedRequest] = useState<AdmissionRequest | null>(null);
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [interviewDate, setInterviewDate] = useState('');
  const [interviewTime, setInterviewTime] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [rejectComments, setRejectComments] = useState('');

  // Get available grades based on selected education level
  const getAvailableGrades = () => {
    if (selectedEducationLevel === 'all') {
      // Return all grades from all levels
      const allGrades: Array<{ value: string; label: string }> = [];
      Object.values(GRADE_MAPPINGS).forEach(levelGrades => {
        levelGrades.forEach(grade => {
          allGrades.push({ value: grade.value, label: grade.label });
        });
      });
      return [{ value: 'all', label: 'All Grades' }, ...allGrades];
    }
    
    const grades = GRADE_MAPPINGS[selectedEducationLevel as EducationLevel];
    if (!grades) return [{ value: 'all', label: 'All Grades' }];
    return [{ value: 'all', label: 'All Grades' }, ...grades.map(g => ({ value: g.value, label: g.label }))];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'under-review': return 'bg-blue-100 text-blue-800';
      case 'interview-scheduled': return 'bg-purple-100 text-purple-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'waitlisted': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'under-review': return <AlertCircle className="w-4 h-4" />;
      case 'interview-scheduled': return <Calendar className="w-4 h-4" />;
      case 'accepted': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      case 'waitlisted': return <AlertCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  const getEducationLevelIcon = (level: EducationLevel) => {
    switch (level) {
      case 'ecd': return '🎓';
      case 'primary': return '📚';
      case 'secondary': return '🏫';
      case 'a-level': return '🎯';
      case 'tertiary': return '🏛️';
      case 'vocational': return '🔧';
      default: return '📖';
    }
  };

  const getEducationLevelLabel = (level: EducationLevel) => {
    switch (level) {
      case 'ecd': return 'Early Childhood (ECD)';
      case 'primary': return 'Primary School';
      case 'secondary': return 'Secondary School';
      case 'a-level': return 'Advanced Level (A-Level)';
      case 'tertiary': return 'Tertiary / University';
      case 'vocational': return 'Vocational Training';
      default: return level;
    }
  };

  // Grade options for select
  const gradeOptions = getAvailableGrades();

  // Action options for select
  const actionOptions = [
    { value: '', label: 'Actions' },
    { value: 'waitlist', label: 'Move to Waitlist' },
    { value: 'send-email', label: 'Send Email' },
    { value: 'send-sms', label: 'Send SMS' },
    { value: 'print', label: 'Print Application' }
  ];

  // Rejection reason options
  const rejectionReasonOptions = [
    { value: '', label: 'Select reason' },
    { value: 'academic', label: 'Academic requirements not met' },
    { value: 'documents', label: 'Incomplete documents' },
    { value: 'capacity', label: 'No available slots' },
    { value: 'age', label: 'Age requirements not met' },
    { value: 'prerequisites', label: 'Missing prerequisites' },
    { value: 'other', label: 'Other' }
  ];

  // Tabs configuration
  const tabs = [
    { key: 'all', label: 'All Applications' },
    { key: 'pending', label: 'Pending' },
    { key: 'under-review', label: 'Under Review' },
    { key: 'interview-scheduled', label: 'Interview' },
    { key: 'accepted', label: 'Accepted' },
    { key: 'rejected', label: 'Rejected' },
    { key: 'waitlisted', label: 'Waitlisted' }
  ];

  const filteredRequests = requests.filter(request => {
    const matchesSearch = 
      request.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.applicationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLevel = selectedEducationLevel === 'all' || request.educationLevel === selectedEducationLevel;
    const matchesGrade = selectedGrade === 'all' || request.applyingForGrade === selectedGrade;
    const matchesTab = activeTab === 'all' || request.status === activeTab;
    
    return matchesSearch && matchesLevel && matchesGrade && matchesTab;
  });

  const paginatedRequests = filteredRequests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleStatusUpdate = async (requestId: string, status: string) => {
    try {
      const notes = status === 'rejected' ? `${rejectReason}: ${rejectComments}` : rejectReason;
      await onUpdateStatus(requestId, status, notes);
      toast.success(`Application ${status} successfully`);
      setShowRejectModal(false);
      setRejectReason('');
      setRejectComments('');
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleScheduleInterview = async (requestId: string) => {
    try {
      const dateTime = new Date(`${interviewDate}T${interviewTime}`);
      await onScheduleInterview(requestId, dateTime);
      toast.success('Interview scheduled successfully');
      setShowInterviewModal(false);
      setInterviewDate('');
      setInterviewTime('');
    } catch (error) {
      toast.error('Failed to schedule interview');
    }
  };

  const renderAdditionalInfo = (request: AdmissionRequest) => {
    switch (request.educationLevel) {
      case 'ecd':
        return request.ecdInfo && (
          <div className="mt-2 text-xs text-gray-500">
            {request.ecdInfo.immunizationRecord && <Badge variant="secondary" className="mr-1">Immunization ✓</Badge>}
            {request.ecdInfo.pottyTrained && <Badge variant="secondary" className="mr-1">Potty Trained ✓</Badge>}
            {request.ecdInfo.parentOrientation && <Badge variant="secondary">Parent Orientation ✓</Badge>}
          </div>
        );
      case 'tertiary':
        return request.tertiaryInfo && (
          <div className="mt-2 text-xs text-gray-500">
            {request.tertiaryInfo.previousQualification && (
              <div>Previous: {request.tertiaryInfo.previousQualification}</div>
            )}
            {request.tertiaryInfo.intendedMajor && (
              <div>Major: {request.tertiaryInfo.intendedMajor}</div>
            )}
          </div>
        );
      case 'vocational':
        return request.vocationalInfo && (
          <div className="mt-2 text-xs text-gray-500">
            {request.vocationalInfo.trade && <div>Trade: {request.vocationalInfo.trade}</div>}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Admission Requests</h1>
          <p className="text-sm text-gray-500 mt-1">Manage applications from ECD to University level</p>
        </div>
        <Button variant="outline" onClick={onExportData}>
          <Download className="w-4 h-4 mr-2" />
          Export Data
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <Card className="p-3 text-center">
          <p className="text-2xl font-bold text-gray-700">{stats.total}</p>
          <p className="text-xs text-gray-500">Total</p>
        </Card>
        <Card className="p-3 text-center bg-yellow-50">
          <p className="text-2xl font-bold text-yellow-700">{stats.pending}</p>
          <p className="text-xs text-yellow-600">Pending</p>
        </Card>
        <Card className="p-3 text-center bg-blue-50">
          <p className="text-2xl font-bold text-blue-700">{stats.underReview}</p>
          <p className="text-xs text-blue-600">Reviewing</p>
        </Card>
        <Card className="p-3 text-center bg-purple-50">
          <p className="text-2xl font-bold text-purple-700">{stats.interview}</p>
          <p className="text-xs text-purple-600">Interview</p>
        </Card>
        <Card className="p-3 text-center bg-green-50">
          <p className="text-2xl font-bold text-green-700">{stats.accepted}</p>
          <p className="text-xs text-green-600">Accepted</p>
        </Card>
        <Card className="p-3 text-center bg-red-50">
          <p className="text-2xl font-bold text-red-700">{stats.rejected}</p>
          <p className="text-xs text-red-600">Rejected</p>
        </Card>
        <Card className="p-3 text-center bg-orange-50">
          <p className="text-2xl font-bold text-orange-700">{stats.waitlisted}</p>
          <p className="text-xs text-orange-600">Waitlisted</p>
        </Card>
      </div>

      {/* Education Level Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {Object.entries(stats.byLevel).map(([level, count]) => (
          <Card key={level} className="p-2 text-center cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedEducationLevel(level)}>
            <span className="text-2xl">{getEducationLevelIcon(level as EducationLevel)}</span>
            <p className="text-lg font-bold">{count}</p>
            <p className="text-xs text-gray-500">{getEducationLevelLabel(level as EducationLevel)}</p>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              placeholder="Search by name, application number, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select
            value={selectedEducationLevel}
            onChange={(e) => {
              setSelectedEducationLevel(e.target.value);
              setSelectedGrade('all');
            }}
            options={EDUCATION_LEVEL_OPTIONS}
          />
          
          <Select
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
            options={gradeOptions}
          />
          
          <Button variant="ghost">
            <Filter className="w-4 h-4 mr-2" />
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

      {/* Applications List */}
      <div className="space-y-4">
        {paginatedRequests.map((request) => (
          <Card key={request.id} className="p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              {/* Applicant Info */}
              <div className="flex-1">
                <div className="flex items-center space-x-4">
                  <Avatar
                    name={`${request.firstName} ${request.lastName}`}
                    size="lg"
                  />
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2 flex-wrap gap-2">
                      <h3 className="font-semibold text-lg">
                        {request.firstName} {request.lastName}
                      </h3>
                      <Badge className={getStatusColor(request.status)}>
                        <span className="flex items-center">
                          {getStatusIcon(request.status)}
                          <span className="ml-1 capitalize">{request.status.replace('-', ' ')}</span>
                        </span>
                      </Badge>
                      <Badge variant="secondary" className="flex items-center">
                        <span className="mr-1">{getEducationLevelIcon(request.educationLevel)}</span>
                        {getEducationLevelLabel(request.educationLevel)}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        #{request.applicationNumber}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                      <div className="flex items-center">
                        <GraduationCap className="w-4 h-4 text-gray-400 mr-2" />
                        <span>Applying for: {GRADE_MAPPINGS[request.educationLevel]?.find(g => g.value === request.applyingForGrade)?.label || request.applyingForGrade}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                        <span>DOB: {format(new Date(request.dateOfBirth), 'PP')}</span>
                      </div>
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 text-gray-400 mr-2" />
                        <a href={`mailto:${request.email}`} className="hover:text-primary-600 truncate">
                          {request.email}
                        </a>
                      </div>
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 text-gray-400 mr-2" />
                        <a href={`tel:${request.phone}`} className="hover:text-primary-600">
                          {request.phone}
                        </a>
                      </div>
                    </div>

                    <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500 flex-wrap gap-2">
                      <span>Submitted: {format(new Date(request.submittedAt), 'PP')}</span>
                      <span>•</span>
                      <span>Guardian: {request.guardian.name}</span>
                      <span>•</span>
                      <span>Previous Institution: {request.previousSchool || request.previousInstitution || 'N/A'}</span>
                    </div>

                    {renderAdditionalInfo(request)}

                    {request.interviewDate && (
                      <div className="mt-2 p-2 bg-purple-50 rounded text-sm text-purple-800">
                        <Calendar className="w-4 h-4 inline mr-1" />
                        Interview scheduled: {format(new Date(request.interviewDate), 'PPp')}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2 ml-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onViewRequest(request.id)}
                  title="View Details"
                >
                  <Eye className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDownloadDocuments(request.id)}
                  title="Download Documents"
                >
                  <Download className="w-4 h-4" />
                </Button>
                
                {request.status === 'pending' && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleStatusUpdate(request.id, 'under-review')}
                  >
                    Start Review
                  </Button>
                )}

                {request.status === 'under-review' && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      setSelectedRequest(request);
                      setShowInterviewModal(true);
                    }}
                  >
                    Schedule Interview
                  </Button>
                )}

                {request.status === 'interview-scheduled' && (
                  <>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleStatusUpdate(request.id, 'accepted')}
                    >
                      Accept
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600"
                      onClick={() => {
                        setSelectedRequest(request);
                        setShowRejectModal(true);
                      }}
                    >
                      Reject
                    </Button>
                  </>
                )}

                <Select
                  value=""
                  onChange={(e) => {
                    const action = e.target.value;
                    if (action === 'waitlist') {
                      handleStatusUpdate(request.id, 'waitlisted');
                    }
                  }}
                  options={actionOptions}
                  className="w-32"
                />
              </div>
            </div>

            {/* Documents Preview */}
            {request.documents.length > 0 && (
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm font-medium mb-2">Documents</p>
                <div className="flex flex-wrap gap-2">
                  {request.documents.map((doc, index) => (
                    <a
                      key={index}
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center px-3 py-1 bg-gray-100 rounded-lg text-sm hover:bg-gray-200"
                    >
                      <FileText className="w-3 h-3 mr-1" />
                      {doc.name}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Showing {paginatedRequests.length} of {filteredRequests.length} applications
        </p>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm">
            Page {currentPage} of {Math.ceil(filteredRequests.length / itemsPerPage) || 1}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredRequests.length / itemsPerPage)))}
            disabled={currentPage === Math.ceil(filteredRequests.length / itemsPerPage)}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Schedule Interview Modal */}
      {showInterviewModal && selectedRequest && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4">Schedule Interview</h2>
            <p className="text-sm text-gray-600 mb-4">
              Applicant: {selectedRequest.firstName} {selectedRequest.lastName}
            </p>
            <p className="text-xs text-gray-500 mb-4">
              Level: {getEducationLevelLabel(selectedRequest.educationLevel)}
            </p>

            <div className="space-y-4">
              <Input
                label="Interview Date"
                type="date"
                value={interviewDate}
                onChange={(e) => setInterviewDate(e.target.value)}
                min={format(new Date(), 'yyyy-MM-dd')}
              />
              <Input
                label="Interview Time"
                type="time"
                value={interviewTime}
                onChange={(e) => setInterviewTime(e.target.value)}
              />
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <Button variant="outline" onClick={() => setShowInterviewModal(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={() => handleScheduleInterview(selectedRequest.id)}
                disabled={!interviewDate || !interviewTime}
              >
                <Calendar className="w-4 h-4 mr-2" />
                Schedule
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && selectedRequest && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4">Reject Application</h2>
            <p className="text-sm text-gray-600 mb-4">
              Applicant: {selectedRequest.firstName} {selectedRequest.lastName}
            </p>
            <p className="text-xs text-gray-500 mb-4">
              Level: {getEducationLevelLabel(selectedRequest.educationLevel)}
            </p>

            <div className="space-y-4">
              <Select
                label="Rejection Reason"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                options={rejectionReasonOptions}
              />

              <textarea
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                rows={4}
                placeholder="Additional comments..."
                value={rejectComments}
                onChange={(e) => setRejectComments(e.target.value)}
              />
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <Button variant="outline" onClick={() => setShowRejectModal(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                className="bg-red-600 hover:bg-red-700"
                onClick={() => handleStatusUpdate(selectedRequest.id, 'rejected')}
                disabled={!rejectReason}
              >
                <XCircle className="w-4 h-4 mr-2" />
                Reject Application
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};