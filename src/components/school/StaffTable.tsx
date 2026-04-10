import React, { useState } from 'react';
import {
  Search, Eye, Edit,
  UserPlus, Download, Mail, Phone,
  Briefcase, Award, DollarSign, ChevronLeft, ChevronRight
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Badge } from '../ui/Badge';
import { Avatar } from '../ui/Avatar';

interface Staff {
  id: string;
  staffId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: Date;
  gender: 'male' | 'female' | 'other';
  role: 'teacher' | 'admin' | 'accountant' | 'librarian' | 'cleaner' | 'security' | 'management';
  department: string;
  designation: string;
  qualifications: string[];
  subjects?: string[];
  employmentDate: Date;
  employmentType: 'permanent' | 'contract' | 'part-time' | 'intern';
  status: 'active' | 'inactive' | 'on-leave' | 'terminated';
  salary: number;
  bankDetails: {
    bankName: string;
    accountNumber: string;
    branch: string;
  };
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  address: string;
  attendance: {
    present: number;
    total: number;
    percentage: number;
  };
  performance?: {
    rating: number;
    lastReview: Date;
    comments?: string;
  };
  documents?: Array<{
    name: string;
    url: string;
  }>;
  avatar?: string;
}

interface StaffTableProps {
  staff: Staff[];
  onAddStaff: () => void;
  onEditStaff: (staffId: string) => void;
  onDeleteStaff?: (staffId: string) => void;
  onViewStaff: (staffId: string) => void;
  onImportStaff?: (file: File) => Promise<void>;
  onExportStaff: (format: 'csv' | 'excel' | 'pdf') => void;
  onSendBulkEmail: (staffIds: string[]) => void;
  onProcessPayroll: (staffIds: string[]) => void;
}

export const StaffTable: React.FC<StaffTableProps> = ({
  staff,
  onAddStaff,
  onEditStaff,
  onDeleteStaff: _onDeleteStaff,
  onViewStaff,
  onImportStaff: _onImportStaff,
  onExportStaff,
  onSendBulkEmail,
  onProcessPayroll
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedStaff, setSelectedStaff] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Get unique roles and departments
  const roles = Array.from(new Set(staff.map(s => s.role)));
  const departments = Array.from(new Set(staff.map(s => s.department)));

  // Role options for select
  const roleOptions = [
    { value: 'all', label: 'All Roles' },
    ...roles.map(role => ({ value: role, label: role.charAt(0).toUpperCase() + role.slice(1) }))
  ];

  // Department options for select
  const departmentOptions = [
    { value: 'all', label: 'All Departments' },
    ...departments.map(dept => ({ value: dept, label: dept }))
  ];

  // Status options for select
  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'on-leave', label: 'On Leave' },
    { value: 'terminated', label: 'Terminated' }
  ];

  // Filter staff
  const filteredStaff = staff.filter(member => {
    const matchesSearch = 
      member.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.staffId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.designation.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = selectedRole === 'all' || member.role === selectedRole;
    const matchesDept = selectedDepartment === 'all' || member.department === selectedDepartment;
    const matchesStatus = selectedStatus === 'all' || member.status === selectedStatus;
    
    return matchesSearch && matchesRole && matchesDept && matchesStatus;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredStaff.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredStaff.length / itemsPerPage) || 1;

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'teacher': return <Briefcase className="w-4 h-4" />;
      case 'admin': return <Award className="w-4 h-4" />;
      case 'accountant': return <DollarSign className="w-4 h-4" />;
      default: return <Briefcase className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'on-leave': return 'bg-yellow-100 text-yellow-800';
      case 'terminated': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEmploymentTypeColor = (type: string) => {
    switch (type) {
      case 'permanent': return 'bg-blue-100 text-blue-800';
      case 'contract': return 'bg-purple-100 text-purple-800';
      case 'part-time': return 'bg-orange-100 text-orange-800';
      case 'intern': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const calculateTotalSalary = () => {
    return staff.reduce((sum, member) => sum + member.salary, 0);
  };

  const handleSelectAll = () => {
    if (selectedStaff.length === currentItems.length) {
      setSelectedStaff([]);
    } else {
      setSelectedStaff(currentItems.map(s => s.id));
    }
  };

  const handleSelectStaff = (staffId: string) => {
    if (selectedStaff.includes(staffId)) {
      setSelectedStaff(selectedStaff.filter(id => id !== staffId));
    } else {
      setSelectedStaff([...selectedStaff, staffId]);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Staff Management</h1>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={() => onExportStaff('excel')}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="primary" onClick={onAddStaff}>
            <UserPlus className="w-4 h-4 mr-2" />
            Add Staff
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-sm text-gray-500">Total Staff</p>
          <p className="text-2xl font-bold">{staff.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-500">Teachers</p>
          <p className="text-2xl font-bold text-blue-600">
            {staff.filter(s => s.role === 'teacher').length}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-500">Active</p>
          <p className="text-2xl font-bold text-green-600">
            {staff.filter(s => s.status === 'active').length}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-500">Monthly Payroll</p>
          <p className="text-2xl font-bold text-purple-600">
            ${calculateTotalSalary().toLocaleString()}
          </p>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              placeholder="Search staff..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            options={roleOptions}
          />
          <Select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            options={departmentOptions}
          />
          <Select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            options={statusOptions}
          />
        </div>
      </Card>

      {/* Bulk Actions */}
      {selectedStaff.length > 0 && (
        <Card className="p-4 bg-primary-50">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">
              {selectedStaff.length} staff selected
            </span>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={() => onSendBulkEmail(selectedStaff)}>
                <Mail className="w-4 h-4 mr-2" />
                Send Email
              </Button>
              <Button variant="outline" size="sm" onClick={() => onProcessPayroll(selectedStaff)}>
                <DollarSign className="w-4 h-4 mr-2" />
                Process Payroll
              </Button>
              <Button variant="outline" size="sm" onClick={() => setSelectedStaff([])}>
                Clear
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Staff Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedStaff.length === currentItems.length && currentItems.length > 0}
                    onChange={handleSelectAll}
                    className="rounded"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Staff Member
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Staff ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role/Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Attendance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Salary
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
              {currentItems.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedStaff.includes(member.id)}
                      onChange={() => handleSelectStaff(member.id)}
                      className="rounded"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <Avatar
                        src={member.avatar}
                        name={`${member.firstName} ${member.lastName}`}
                        size="sm"
                        className="mr-3"
                      />
                      <div>
                        <p className="font-medium">
                          {member.firstName} {member.lastName}
                        </p>
                        <p className="text-sm text-gray-500">{member.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-mono">{member.staffId}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-1">
                      <Badge className="bg-blue-100 text-blue-800">
                        {getRoleIcon(member.role)}
                        <span className="ml-1">{member.role}</span>
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{member.designation}</p>
                    <p className="text-xs text-gray-500">{member.department}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <a href={`tel:${member.phone}`} className="text-sm text-gray-600 hover:text-primary-600 flex items-center">
                        <Phone className="w-3 h-3 mr-1" />
                        {member.phone}
                      </a>
                      <a href={`mailto:${member.email}`} className="text-sm text-gray-600 hover:text-primary-600 flex items-center">
                        <Mail className="w-3 h-3 mr-1" />
                        Email
                      </a>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge className={getEmploymentTypeColor(member.employmentType)}>
                      {member.employmentType}
                    </Badge>
                    <p className="text-sm text-gray-600 mt-1">
                      Since {new Date(member.employmentDate).toLocaleDateString()}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className={`font-medium ${
                        member.attendance.percentage >= 95 ? 'text-green-600' :
                        member.attendance.percentage >= 85 ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {member.attendance.percentage}%
                      </p>
                      <p className="text-xs text-gray-500">
                        {member.attendance.present}/{member.attendance.total} days
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium">${member.salary.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">per month</p>
                  </td>
                  <td className="px-6 py-4">
                    <Badge className={getStatusColor(member.status)}>
                      {member.status === 'on-leave' ? 'On Leave' : member.status}
                    </Badge>
                    {member.performance && (
                      <p className="text-xs text-gray-500 mt-1">
                        Rating: {member.performance.rating}/5
                      </p>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => onViewStaff(member.id)}
                        className="p-1 hover:bg-gray-100 rounded"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4 text-gray-600" />
                      </button>
                      <button
                        onClick={() => onEditStaff(member.id)}
                        className="p-1 hover:bg-gray-100 rounded"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4 text-gray-600" />
                      </button>
                      <button
                        onClick={() => onProcessPayroll([member.id])}
                        className="p-1 hover:bg-gray-100 rounded"
                        title="Process Payroll"
                      >
                        <DollarSign className="w-4 h-4 text-gray-600" />
                      </button>
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
            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredStaff.length)} of {filteredStaff.length} staff
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
    </div>
  );
};