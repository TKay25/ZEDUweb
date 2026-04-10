// frontend/src/components/ministry/SchoolVerification.tsx
import React, { useState } from 'react';
import {
  CheckCircle, XCircle, Clock, Eye,
  Download, Search, Mail,
  Phone, MapPin, FileText, AlertCircle,
  ChevronLeft, ChevronRight, RefreshCw
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import Select from '../ui/Select';
import Badge from '../ui/Badge';
import Avatar from '../ui/Avatar';
import { toast } from 'react-hot-toast';

// School types in Zimbabwe
const SCHOOL_TYPES = [
  { value: 'primary', label: 'Primary School (Grade 1-7)' },
  { value: 'secondary', label: 'Secondary School (Form 1-4)' },
  { value: 'high', label: 'High School (Form 1-6)' },
  { value: 'combined', label: 'Combined School (Primary & Secondary)' },
  { value: 'ecd', label: 'ECD Centre' },
  { value: 'vocational', label: 'Vocational Training Centre' }
];

interface School {
  id: string;
  registrationNumber: string; // Format: MINED/YYYY/XXXXX
  name: string;
  type: 'primary' | 'secondary' | 'combined' | 'high' | 'ecd' | 'vocational';
  province: string;
  district: string; // e.g., 'Harare Urban', 'Mutare', 'Bulawayo Central'
  ward: string; // Added for Zimbabwe's ward system
  address: string;
  phone: string;
  email: string;
  headTeacher: string;
  enrollment: number;
  teachers: number;
  status: 'pending' | 'verified' | 'rejected' | 'suspended';
  submittedAt: Date;
  verifiedAt?: Date;
  documents: Array<{
    name: string;
    url: string;
    status: 'pending' | 'verified' | 'rejected';
  }>;
  compliance: {
    registration: boolean;      // Ministry registration certificate
    infrastructure: boolean;     // Adequate classrooms and facilities
    staffing: boolean;          // Qualified teachers (Zimbabwe Teachers Council)
    curriculum: boolean;        // Ministry-approved curriculum
    safety: boolean;            // Safety standards and policies
    health: boolean;            // Health protocols and sanitation
    fees: boolean;              // Approved fee structure
  };
  notes?: string;
  inspectionReport?: string;
  lastInspection?: Date;
}

interface SchoolVerificationProps {
  schools: School[];
  onVerifySchool: (schoolId: string, notes?: string) => Promise<void>;
  onRejectSchool: (schoolId: string, reason: string) => Promise<void>;
  onSuspendSchool: (schoolId: string, reason: string) => Promise<void>;
  onViewDocuments: (schoolId: string) => void;
  onDownloadReport: (schoolId: string) => void;
  onContactSchool: (schoolId: string) => void;
  onScheduleInspection: (schoolId: string, date: Date) => Promise<void>;
}

export const SchoolVerification: React.FC<SchoolVerificationProps> = ({
  schools,
  onVerifySchool,
  onRejectSchool,
  onSuspendSchool,
  onViewDocuments,
  onDownloadReport,
  onContactSchool,
  onScheduleInspection
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProvince, setSelectedProvince] = useState<string>('all');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [selectedSchoolType, setSelectedSchoolType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showInspectModal, setShowInspectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [inspectionDate, setInspectionDate] = useState<Date | null>(null);
  const [activeTab, setActiveTab] = useState('pending');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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

  // Get unique districts based on selected province
  const getDistrictsForProvince = (province: string): string[] => {
    // This would normally come from an API or database
    const districtMap: Record<string, string[]> = {
      'Harare': ['Harare Central', 'Harare East', 'Harare West', 'Harare North', 'Harare South'],
      'Bulawayo': ['Bulawayo Central', 'Bulawayo East', 'Bulawayo West', 'Bulawayo North', 'Bulawayo South'],
      'Manicaland': ['Mutare', 'Chipinge', 'Makoni', 'Buhera', 'Nyanga', 'Mutasa'],
      'Mashonaland Central': ['Bindura', 'Mazowe', 'Shamva', 'Guruve', 'Mount Darwin', 'Rushinga'],
      'Mashonaland East': ['Marondera', 'Goromonzi', 'Murehwa', 'Mudzi', 'Seke', 'Wedza'],
      'Mashonaland West': ['Chinhoyi', 'Kadoma', 'Chegutu', 'Karoi', 'Zvimba', 'Hurungwe'],
      'Masvingo': ['Masvingo', 'Chiredzi', 'Mwenezi', 'Zaka', 'Gutu', 'Bikita'],
      'Matabeleland North': ['Lupane', 'Hwange', 'Binga', 'Nkayi', 'Tsholotsho'],
      'Matabeleland South': ['Gwanda', 'Beitbridge', 'Mangwe', 'Insiza', 'Umzingwane'],
      'Midlands': ['Gweru', 'Kwekwe', 'Zvishavane', 'Shurugwi', 'Mvuma', 'Gokwe']
    };
    return districtMap[province] || [];
  };

  const districts = selectedProvince !== 'all' 
    ? getDistrictsForProvince(selectedProvince)
    : [];

  // Get unique provinces from schools data
  const provinces = Array.from(new Set(schools.map(s => s.province)));

  // Province options for select
  const provinceOptions = [
    { value: 'all', label: 'All Provinces' },
    ...provinces.map(p => ({ value: p, label: p }))
  ];

  // District options for select
  const districtOptions = [
    { value: 'all', label: 'All Districts' },
    ...districts.map(d => ({ value: d, label: d }))
  ];

  // School type options for select
  const schoolTypeOptions = [
    { value: 'all', label: 'All Types' },
    ...SCHOOL_TYPES
  ];

  // Status options for select
  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'verified', label: 'Verified' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'suspended', label: 'Suspended' },
  ];

  const filteredSchools = schools.filter(school => {
    const matchesSearch = 
      school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      school.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      school.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProvince = selectedProvince === 'all' || school.province === selectedProvince;
    const matchesDistrict = selectedDistrict === 'all' || school.district === selectedDistrict;
    const matchesSchoolType = selectedSchoolType === 'all' || school.type === selectedSchoolType;
    const matchesStatus = selectedStatus === 'all' || school.status === selectedStatus;
    const matchesTab = activeTab === 'all' || school.status === activeTab;
    return matchesSearch && matchesProvince && matchesDistrict && matchesSchoolType && matchesStatus && matchesTab;
  });

  const paginatedSchools = filteredSchools.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleVerify = async (schoolId: string) => {
    try {
      await onVerifySchool(schoolId);
      toast.success('School verified successfully!');
    } catch (_error) {
      toast.error('Failed to verify school');
    }
  };

  const handleReject = async () => {
    if (!selectedSchool || !rejectReason) return;
    try {
      await onRejectSchool(selectedSchool.id, rejectReason);
      setShowRejectModal(false);
      setRejectReason('');
      toast.success('School application rejected');
    } catch (_error) {
      toast.error('Failed to reject school');
    }
  };

  const handleScheduleInspection = async () => {
    if (!selectedSchool || !inspectionDate) return;
    try {
      await onScheduleInspection(selectedSchool.id, inspectionDate);
      setShowInspectModal(false);
      setInspectionDate(null);
      toast.success(`Inspection scheduled for ${inspectionDate.toLocaleDateString()}`);
    } catch (_error) {
      toast.error('Failed to schedule inspection');
    }
  };

  const tabs = [
    { id: 'all', label: 'All Schools' },
    { id: 'pending', label: 'Pending Verification' },
    { id: 'verified', label: 'Verified Schools' },
    { id: 'rejected', label: 'Rejected Applications' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">School Verification</h1>
          <p className="text-sm text-gray-500 mt-1">
            Ministry of Primary and Secondary Education - Zimbabwe
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={() => window.location.reload()}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-sm text-gray-500">Total Schools</p>
          <p className="text-2xl font-bold">{schools.length}</p>
          <p className="text-xs text-gray-400 mt-1">Registered in system</p>
        </Card>
        <Card className="p-4 bg-yellow-50">
          <p className="text-sm text-yellow-700">Pending Verification</p>
          <p className="text-2xl font-bold text-yellow-700">
            {schools.filter(s => s.status === 'pending').length}
          </p>
          <p className="text-xs text-yellow-600 mt-1">Awaiting ministry approval</p>
        </Card>
        <Card className="p-4 bg-green-50">
          <p className="text-sm text-green-700">Verified Schools</p>
          <p className="text-2xl font-bold text-green-700">
            {schools.filter(s => s.status === 'verified').length}
          </p>
          <p className="text-xs text-green-600 mt-1">Ministry accredited</p>
        </Card>
        <Card className="p-4 bg-red-50">
          <p className="text-sm text-red-700">Rejected Applications</p>
          <p className="text-2xl font-bold text-red-700">
            {schools.filter(s => s.status === 'rejected').length}
          </p>
          <p className="text-xs text-red-600 mt-1">Did not meet requirements</p>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              placeholder="Search by name, reg number..."
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          {/* Province Filter */}
          <Select
            label="Province"
            value={selectedProvince}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
              setSelectedProvince(e.target.value);
              setSelectedDistrict('all'); // Reset district when province changes
            }}
            options={provinceOptions}
          />
          
          {/* District Filter - Only shows when province is selected */}
          {selectedProvince !== 'all' && (
            <Select
              label="District"
              value={selectedDistrict}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedDistrict(e.target.value)}
              options={districtOptions}
            />
          )}
          
          {/* School Type Filter */}
          <Select
            label="School Type"
            value={selectedSchoolType}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedSchoolType(e.target.value)}
            options={schoolTypeOptions}
          />
          
          {/* Status Filter */}
          <Select
            label="Status"
            value={selectedStatus}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedStatus(e.target.value)}
            options={statusOptions}
          />
        </div>
      </Card>

      {/* Simple Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-green-600 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
              <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-600">
                {schools.filter(s => tab.id === 'all' || s.status === tab.id).length}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Schools List */}
      <div className="space-y-4">
        {paginatedSchools.map((school) => (
          <Card key={school.id} className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-4">
                  <Avatar size="lg" name={school.name} />
                  <div>
                    <div className="flex items-center space-x-3 flex-wrap gap-2">
                      <h3 className="text-lg font-semibold">{school.name}</h3>
                      <Badge className={getStatusColor(school.status)}>
                        <span className="flex items-center">
                          {getStatusIcon(school.status)}
                          <span className="ml-1 capitalize">{school.status}</span>
                        </span>
                      </Badge>
                      <span className="text-sm text-gray-500">
                        Reg: {school.registrationNumber}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2 text-sm">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 text-gray-400 mr-1" />
                        {school.district}, {school.province}
                      </div>
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 text-gray-400 mr-1" />
                        {school.phone}
                      </div>
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 text-gray-400 mr-1" />
                        {school.email}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Compliance Checklist - Updated for Zimbabwe */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-2 mb-4">
                  {Object.entries(school.compliance).map(([key, value]) => (
                    <div
                      key={key}
                      className={`p-2 rounded-lg text-center ${
                        value ? 'bg-green-50' : 'bg-red-50'
                      }`}
                    >
                      <p className="text-xs capitalize mb-1">
                        {key === 'registration' ? 'Reg Cert' :
                         key === 'infrastructure' ? 'Infra' :
                         key === 'staffing' ? 'Staff' :
                         key === 'curriculum' ? 'Curriculum' :
                         key === 'safety' ? 'Safety' :
                         key === 'health' ? 'Health' :
                         'Fees'}
                      </p>
                      {value ? (
                        <CheckCircle className="w-4 h-4 text-green-600 mx-auto" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-600 mx-auto" />
                      )}
                    </div>
                  ))}
                </div>

                {/* Stats */}
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                  <span>Enrollment: {school.enrollment}</span>
                  <span>Teachers: {school.teachers}</span>
                  <span>Student-Teacher Ratio: {(school.enrollment / school.teachers).toFixed(1)}:1</span>
                  <span>Submitted: {new Date(school.submittedAt).toLocaleDateString()}</span>
                  {school.verifiedAt && (
                    <span>Verified: {new Date(school.verifiedAt).toLocaleDateString()}</span>
                  )}
                </div>

                {/* Documents */}
                <div className="mt-4 flex items-center space-x-2 flex-wrap gap-2">
                  <FileText className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium">Documents:</span>
                  {school.documents.map((doc, index) => (
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

              {/* Actions */}
              <div className="flex flex-col space-y-2 ml-4 min-w-[120px]">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onViewDocuments(school.id)}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Docs
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDownloadReport(school.id)}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Report
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onContactSchool(school.id)}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Contact
                </Button>

                {school.status === 'pending' && (
                  <>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleVerify(school.id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Verify
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 border-red-300 hover:bg-red-50"
                      onClick={() => {
                        setSelectedSchool(school);
                        setShowRejectModal(true);
                      }}
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedSchool(school);
                        setShowInspectModal(true);
                      }}
                    >
                      <Clock className="w-4 h-4 mr-2" />
                      Schedule Inspection
                    </Button>
                  </>
                )}

                {school.status === 'verified' && (
                  <Select
                    value=""
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                      if (e.target.value === 'suspend') {
                        onSuspendSchool(school.id, 'Administrative suspension');
                      }
                    }}
                    options={[
                      { value: '', label: 'Actions' },
                      { value: 'suspend', label: 'Suspend' },
                      { value: 'reinspect', label: 'Re-inspect' }
                    ]}
                  />
                )}
              </div>
            </div>

            {/* Notes */}
            {school.notes && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm border-l-4 border-blue-500">
                <span className="font-medium">Ministry Notes: </span>
                {school.notes}
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Showing {paginatedSchools.length} of {filteredSchools.length} schools
        </p>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm">
            Page {currentPage} of {Math.ceil(filteredSchools.length / itemsPerPage) || 1}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(p => p + 1)}
            disabled={currentPage === Math.ceil(filteredSchools.length / itemsPerPage)}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && selectedSchool && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4">Reject School Application</h2>
            <p className="text-sm text-gray-600 mb-2">
              School: <span className="font-semibold">{selectedSchool.name}</span>
            </p>
            <p className="text-sm text-gray-600 mb-4">
              Reg Number: {selectedSchool.registrationNumber}
            </p>
            <textarea
              className="w-full p-2 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-red-500"
              rows={4}
              placeholder="Reason for rejection (required)..."
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
                Reject Application
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Schedule Inspection Modal */}
      {showInspectModal && selectedSchool && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4">Schedule School Inspection</h2>
            <p className="text-sm text-gray-600 mb-2">
              School: <span className="font-semibold">{selectedSchool.name}</span>
            </p>
            <p className="text-sm text-gray-600 mb-4">
              Location: {selectedSchool.district}, {selectedSchool.province}
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Inspection Date
              </label>
              <input
                type="date"
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                value={inspectionDate ? inspectionDate.toISOString().split('T')[0] : ''}
                onChange={(e) => setInspectionDate(e.target.value ? new Date(e.target.value) : null)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setShowInspectModal(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleScheduleInspection}
                disabled={!inspectionDate}
              >
                Schedule Inspection
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};