import React, { useState } from 'react';
import {
  Search, Filter, MoreVertical, Eye, Edit,
  UserPlus, Download, Mail, Phone,
  GraduationCap, CheckCircle, XCircle,
  AlertCircle, ChevronLeft, ChevronRight, Upload
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Badge } from '../ui/Badge';
import { Avatar } from '../ui/Avatar';
import { toast } from 'react-hot-toast';

interface Student {
  id: string;
  admissionNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth: Date;
  gender: 'male' | 'female' | 'other';
  grade: string;
  class: string;
  stream?: string;
  address?: string;
  guardianName: string;
  guardianPhone: string;
  guardianEmail?: string;
  enrollmentDate: Date;
  status: 'active' | 'inactive' | 'graduated' | 'suspended' | 'transferred';
  attendance: number;
  performance: {
    average: number;
    rank?: number;
    subjects?: Array<{
      name: string;
      score: number;
      grade: string;
    }>;
  };
  fees: {
    total: number;
    paid: number;
    balance: number;
  };
  documents?: Array<{
    name: string;
    url: string;
  }>;
  avatar?: string;
  extracurricular?: string[];
  medicalInfo?: {
    bloodGroup?: string;
    allergies?: string[];
    conditions?: string[];
  };
}

interface StudentTableProps {
  students: Student[];
  onAddStudent: () => void;
  onEditStudent: (studentId: string) => void;
  onDeleteStudent?: (studentId: string) => void;
  onViewStudent: (studentId: string) => void;
  onImportStudents: (file: File) => Promise<void>;
  onExportStudents: (format: 'csv' | 'excel' | 'pdf') => void;
  onSendBulkEmail: (studentIds: string[]) => void;
  onSendBulkSMS: (studentIds: string[]) => void;
  onUpdateStatus?: (studentId: string, status: string) => void;
  onPrintIDCard: (studentId: string) => void;
}

export const StudentTable: React.FC<StudentTableProps> = ({
  students,
  onAddStudent,
  onEditStudent,
  onDeleteStudent: _onDeleteStudent,
  onViewStudent,
  onImportStudents,
  onExportStudents,
  onSendBulkEmail,
  onSendBulkSMS,
  onUpdateStatus: _onUpdateStatus,
  onPrintIDCard
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showFilters, setShowFilters] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);

  // Get unique grades for filter
  const grades = Array.from(new Set(students.map(s => s.grade))).sort();

  // Grade options for select
  const gradeOptions = [
    { value: 'all', label: 'All Grades' },
    ...grades.map(grade => ({ value: grade, label: grade }))
  ];

  // Status options for select
  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'graduated', label: 'Graduated' },
    { value: 'suspended', label: 'Suspended' },
    { value: 'transferred', label: 'Transferred' }
  ];

  // Advanced filter options
  const genderOptions = [
    { value: '', label: 'All Genders' },
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' }
  ];

  // Filter students
  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.admissionNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.guardianName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesGrade = selectedGrade === 'all' || student.grade === selectedGrade;
    const matchesStatus = selectedStatus === 'all' || student.status === selectedStatus;
    
    return matchesSearch && matchesGrade && matchesStatus;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredStudents.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage) || 1;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'graduated': return 'bg-blue-100 text-blue-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      case 'transferred': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'inactive': return <AlertCircle className="w-4 h-4" />;
      case 'graduated': return <GraduationCap className="w-4 h-4" />;
      case 'suspended': return <XCircle className="w-4 h-4" />;
      case 'transferred': return <AlertCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  const handleSelectAll = () => {
    if (selectedStudents.length === currentItems.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(currentItems.map(s => s.id));
    }
  };

  const handleSelectStudent = (studentId: string) => {
    if (selectedStudents.includes(studentId)) {
      setSelectedStudents(selectedStudents.filter(id => id !== studentId));
    } else {
      setSelectedStudents([...selectedStudents, studentId]);
    }
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImportFile(e.target.files[0]);
    }
  };

  const handleImportSubmit = async () => {
    if (importFile) {
      await onImportStudents(importFile);
      setShowImportModal(false);
      setImportFile(null);
    }
  };

  const handleBulkAction = (action: 'email' | 'sms') => {
    if (selectedStudents.length === 0) {
      toast.error('Please select at least one student');
      return;
    }
    if (action === 'email') {
      onSendBulkEmail(selectedStudents);
    } else {
      onSendBulkSMS(selectedStudents);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Student Management</h1>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={() => setShowImportModal(true)}>
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
          <Button variant="outline" onClick={() => onExportStudents('excel')}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="primary" onClick={onAddStudent}>
            <UserPlus className="w-4 h-4 mr-2" />
            Add Student
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-sm text-gray-500">Total Students</p>
          <p className="text-2xl font-bold">{students.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-500">Active Students</p>
          <p className="text-2xl font-bold text-green-600">
            {students.filter(s => s.status === 'active').length}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-500">Suspended</p>
          <p className="text-2xl font-bold text-red-600">
            {students.filter(s => s.status === 'suspended').length}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-500">Outstanding Fees</p>
          <p className="text-2xl font-bold text-yellow-600">
            ${students.reduce((sum, s) => sum + s.fees.balance, 0).toLocaleString()}
          </p>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              placeholder="Search by name, email, admission number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
            options={gradeOptions}
            className="w-40"
          />
          <Select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            options={statusOptions}
            className="w-40"
          />
          <Button
            variant="ghost"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-4 h-4 mr-2" />
            More Filters
          </Button>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t">
            <Input placeholder="Min Attendance %" type="number" />
            <Input placeholder="Max Attendance %" type="number" />
            <Input placeholder="Min Average Grade" type="number" />
            <Select options={genderOptions} placeholder="Gender" />
            <Input placeholder="Enrollment Date From" type="date" />
            <Input placeholder="Enrollment Date To" type="date" />
          </div>
        )}
      </Card>

      {/* Bulk Actions */}
      {selectedStudents.length > 0 && (
        <Card className="p-4 bg-primary-50">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">
              {selectedStudents.length} students selected
            </span>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={() => handleBulkAction('email')}>
                <Mail className="w-4 h-4 mr-2" />
                Send Email
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleBulkAction('sms')}>
                <Phone className="w-4 h-4 mr-2" />
                Send SMS
              </Button>
              <Button variant="outline" size="sm" onClick={() => setSelectedStudents([])}>
                Clear Selection
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Student Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedStudents.length === currentItems.length && currentItems.length > 0}
                    onChange={handleSelectAll}
                    className="rounded"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Admission No.
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Grade/Class
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Guardian
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Attendance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Performance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fees Balance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {currentItems.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedStudents.includes(student.id)}
                      onChange={() => handleSelectStudent(student.id)}
                      className="rounded"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <Avatar
                        src={student.avatar}
                        name={`${student.firstName} ${student.lastName}`}
                        size="sm"
                        className="mr-3"
                      />
                      <div>
                        <p className="font-medium">
                          {student.firstName} {student.lastName}
                        </p>
                        <p className="text-sm text-gray-500">{student.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-mono">{student.admissionNumber}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium">{student.grade}</p>
                      <p className="text-sm text-gray-500">
                        {student.class} {student.stream && `- ${student.stream}`}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      {student.phone && (
                        <a href={`tel:${student.phone}`} className="text-sm text-gray-600 hover:text-primary-600 flex items-center">
                          <Phone className="w-3 h-3 mr-1" />
                          {student.phone}
                        </a>
                      )}
                      <a href={`mailto:${student.email}`} className="text-sm text-gray-600 hover:text-primary-600 flex items-center">
                        <Mail className="w-3 h-3 mr-1" />
                        Email
                      </a>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium">{student.guardianName}</p>
                      <a href={`tel:${student.guardianPhone}`} className="text-sm text-gray-500 hover:text-primary-600">
                        {student.guardianPhone}
                      </a>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className={`font-medium ${
                        student.attendance >= 90 ? 'text-green-600' :
                        student.attendance >= 75 ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {student.attendance}%
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className={`font-medium ${
                        student.performance.average >= 75 ? 'text-green-600' :
                        student.performance.average >= 60 ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {student.performance.average}%
                      </p>
                      {student.performance.rank && (
                        <p className="text-xs text-gray-500">Rank: #{student.performance.rank}</p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className={`font-medium ${
                        student.fees.balance === 0 ? 'text-green-600' :
                        student.fees.balance > 0 ? 'text-red-600' :
                        'text-gray-600'
                      }`}>
                        ${student.fees.balance.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500">
                        Paid: ${student.fees.paid.toLocaleString()}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge className={`flex items-center ${getStatusColor(student.status)}`}>
                      {getStatusIcon(student.status)}
                      <span className="ml-1 capitalize">{student.status}</span>
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => onViewStudent(student.id)}
                        className="p-1 hover:bg-gray-100 rounded"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4 text-gray-600" />
                      </button>
                      <button
                        onClick={() => onEditStudent(student.id)}
                        className="p-1 hover:bg-gray-100 rounded"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4 text-gray-600" />
                      </button>
                      <button
                        onClick={() => onPrintIDCard(student.id)}
                        className="p-1 hover:bg-gray-100 rounded"
                        title="Print ID Card"
                      >
                        <GraduationCap className="w-4 h-4 text-gray-600" />
                      </button>
                      <div className="relative">
                        <button
                          onClick={() => {}}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <MoreVertical className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredStudents.length)} of {filteredStudents.length} students
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
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4">Import Students</h2>
            <p className="text-sm text-gray-600 mb-4">
              Upload a CSV or Excel file with student data. Download the template for the correct format.
            </p>
            
            <div className="space-y-4">
              <div className="border-2 border-dashed rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-1">
                  {importFile ? importFile.name : 'Click to select file'}
                </p>
                <p className="text-xs text-gray-400">
                  Supported formats: .csv, .xlsx (Max 10MB)
                </p>
                <input
                  type="file"
                  accept=".csv,.xlsx"
                  onChange={handleImportFile}
                  className="hidden"
                  id="import-file"
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => document.getElementById('import-file')?.click()}
                >
                  Select File
                </Button>
              </div>

              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setShowImportModal(false)}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleImportSubmit}
                  disabled={!importFile}
                >
                  Import
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};