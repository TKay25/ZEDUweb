// src/pages/school/Staff.tsx
import React, { useState, useEffect } from 'react';
import {
  Users, Search, Download,
  Mail, Phone, Calendar, Briefcase,
   Eye,
  Edit2, Trash2, UserPlus, FileText, Clock,
  BookOpen, Star
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Avatar } from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';
//import schoolAPI from '../../api/school.api';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';

interface Staff {
  id: string;
  staffNumber: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  dateOfBirth: Date;
  gender: 'male' | 'female' | 'other';
  nationality: string;
  avatar?: string;
  role: 'teacher' | 'admin' | 'support' | 'management';
  department: string;
  position: string;
  qualifications: Array<{
    degree: string;
    institution: string;
    year: number;
    certificate?: string;
  }>;
  employmentDetails: {
    hireDate: Date;
    contractType: 'permanent' | 'contract' | 'temporary' | 'part-time';
    salary: number;
    bankDetails: {
      bankName: string;
      accountName: string;
      accountNumber: string;
      branch: string;
    };
    taxId: string;
    pensionNumber?: string;
  };
  contact: {
    email: string;
    phone: string;
    alternativePhone?: string;
    address: string;
    city: string;
    postalCode?: string;
  };
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
    email?: string;
  };
  subjects?: Array<{
    id: string;
    name: string;
    level: string;
  }>;
  classes?: Array<{
    id: string;
    name: string;
    stream?: string;
    students: number;
  }>;
  performance: {
    rating: number;
    attendance: number;
    punctuality: number;
    feedback: Array<{
      id: string;
      from: string;
      rating: number;
      comment: string;
      date: Date;
    }>;
  };
  documents: Array<{
    id: string;
    name: string;
    type: string;
    url: string;
    uploadedAt: Date;
  }>;
  status: 'active' | 'inactive' | 'on-leave' | 'terminated';
  leaveBalance: {
    annual: number;
    sick: number;
    personal: number;
    remaining: number;
  };
}

export const Staff: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [activeTab, setActiveTab] = useState('personal');

  useEffect(() => {
    loadStaff();
  }, []);

  const loadStaff = async () => {
    try {
      // Mock data for demonstration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockStaff: Staff[] = [
        {
          id: '1',
          staffNumber: 'STF001',
          firstName: 'Fredy',
          lastName: 'Shonhiwa',
          dateOfBirth: new Date(1980, 0, 1),
          gender: 'male',
          nationality: 'Zimbabwean',
          role: 'teacher',
          department: 'Mathematics',
          position: 'Senior Teacher',
          qualifications: [
            {
              degree: 'Bachelor of Education',
              institution: 'University of Zimbabwe',
              year: 2005
            }
          ],
          employmentDetails: {
            hireDate: new Date(2010, 0, 1),
            contractType: 'permanent',
            salary: 5000,
            bankDetails: {
              bankName: 'Central Bank',
              accountName: 'Fredy Shonhiwa',
              accountNumber: '123456789',
              branch: 'Harare Main'
            },
            taxId: 'TAX123456'
          },
          contact: {
            email: 'fredy.shonhiwa@school.com',
            phone: '+263 123 456789',
            address: '123 Main St',
            city: 'Harare'
          },
          emergencyContact: {
            name: 'Spiwe Shonhiwa',
            relationship: 'Spouse',
            phone: '+263 987 654321'
          },
          subjects: [
            { id: 'sub1', name: 'Mathematics', level: 'Form 4' }
          ],
          classes: [
            { id: 'class1', name: 'Form 4A', students: 30 }
          ],
          performance: {
            rating: 4.5,
            attendance: 95,
            punctuality: 98,
            feedback: []
          },
          documents: [],
          status: 'active',
          leaveBalance: {
            annual: 20,
            sick: 10,
            personal: 5,
            remaining: 25
          }
        },
        {
          id: '2',
          staffNumber: 'STF002',
          firstName: 'Jane',
          lastName: 'Zinyimo',
          dateOfBirth: new Date(1985, 5, 15),
          gender: 'female',
          nationality: 'Zimbabwean',
          role: 'admin',
          department: 'Administration',
          position: 'Administrator',
          qualifications: [
            {
              degree: 'Bachelor of Business Administration',
              institution: 'Zimbabwe Open University',
              year: 2010
            }
          ],
          employmentDetails: {
            hireDate: new Date(2015, 2, 1),
            contractType: 'permanent',
            salary: 4500,
            bankDetails: {
              bankName: 'Central Bank',
              accountName: 'Jane Zinyimo',
              accountNumber: '987654321',
              branch: 'Harare Main'
            },
            taxId: 'TAX789012'
          },
          contact: {
            email: 'jane.zinyimo@school.com',
            phone: '+263 234 567890',
            address: '456 Oak Ave',
            city: 'Harare'
          },
          emergencyContact: {
            name: 'Bob Zinyimo',
            relationship: 'Husband',
            phone: '+263 876 543210'
          },
          performance: {
            rating: 4.2,
            attendance: 98,
            punctuality: 99,
            feedback: []
          },
          documents: [],
          status: 'active',
          leaveBalance: {
            annual: 22,
            sick: 10,
            personal: 5,
            remaining: 27
          }
        }
      ];
      
      setStaff(mockStaff);
    } catch (error) {
      toast.error('Failed to load staff');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStaff = async (staffId: string) => {
    if (window.confirm('Are you sure you want to delete this staff member?')) {
      try {
        setStaff(prev => prev.filter(s => s.id !== staffId));
        toast.success('Staff member deleted successfully');
      } catch (error) {
        toast.error('Failed to delete staff member');
        console.error(error);
      }
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

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'teacher': return <BookOpen className="w-4 h-4" />;
      case 'admin': return <Briefcase className="w-4 h-4" />;
      case 'support': return <Users className="w-4 h-4" />;
      case 'management': return <Star className="w-4 h-4" />;
      default: return <Users className="w-4 h-4" />;
    }
  };

  const filteredStaff = staff.filter(member => {
    const matchesSearch = 
      member.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.staffNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.contact.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = selectedDepartment === 'all' || member.department === selectedDepartment;
    const matchesRole = selectedRole === 'all' || member.role === selectedRole;
    const matchesStatus = selectedStatus === 'all' || member.status === selectedStatus;
    
    return matchesSearch && matchesDepartment && matchesRole && matchesStatus;
  });

  if (loading) {
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
        <h1 className="text-2xl font-bold">Staff Management</h1>
        <div className="flex items-center space-x-3">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Import
          </Button>
          <Button>
            <UserPlus className="w-4 h-4 mr-2" />
            Add Staff
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Staff</p>
              <p className="text-2xl font-bold">{staff.length}</p>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Teachers</p>
              <p className="text-2xl font-bold text-green-600">
                {staff.filter(s => s.role === 'teacher').length}
              </p>
            </div>
            <BookOpen className="w-8 h-8 text-green-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Administration</p>
              <p className="text-2xl font-bold text-purple-600">
                {staff.filter(s => s.role === 'admin').length}
              </p>
            </div>
            <Briefcase className="w-8 h-8 text-purple-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Support</p>
              <p className="text-2xl font-bold text-yellow-600">
                {staff.filter(s => s.role === 'support').length}
              </p>
            </div>
            <Users className="w-8 h-8 text-yellow-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Management</p>
              <p className="text-2xl font-bold text-red-600">
                {staff.filter(s => s.role === 'management').length}
              </p>
            </div>
            <Star className="w-8 h-8 text-red-500" />
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <Input
              placeholder="Search by name, ID, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="w-4 h-4" />}
            />
          </div>
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="w-40 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Departments</option>
            <option value="Mathematics">Mathematics</option>
            <option value="Science">Science</option>
            <option value="Languages">Languages</option>
            <option value="Humanities">Humanities</option>
            <option value="Administration">Administration</option>
          </select>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="w-40 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Roles</option>
            <option value="teacher">Teacher</option>
            <option value="admin">Administrator</option>
            <option value="support">Support Staff</option>
            <option value="management">Management</option>
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-40 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="on-leave">On Leave</option>
            <option value="terminated">Terminated</option>
          </select>
        </div>
      </Card>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStaff.map(member => (
          <Card key={member.id} className="p-4 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex items-center">
                <Avatar
                  src={member.avatar}
                  name={`${member.firstName} ${member.lastName}`}
                  size="lg"
                  className="mr-3"
                />
                <div>
                  <h3 className="font-semibold">
                    {member.firstName} {member.lastName}
                  </h3>
                  <p className="text-sm text-gray-600">{member.position}</p>
                  <div className="flex items-center mt-1">
                    {getRoleIcon(member.role)}
                    <span className="text-xs text-gray-500 ml-1 capitalize">{member.role}</span>
                  </div>
                </div>
              </div>
              <Badge className={getStatusColor(member.status)}>
                {member.status}
              </Badge>
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex items-center text-sm">
                <Mail className="w-4 h-4 text-gray-400 mr-2" />
                <span className="text-gray-600">{member.contact.email}</span>
              </div>
              <div className="flex items-center text-sm">
                <Phone className="w-4 h-4 text-gray-400 mr-2" />
                <span className="text-gray-600">{member.contact.phone}</span>
              </div>
              <div className="flex items-center text-sm">
                <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                <span className="text-gray-600">
                  Joined {format(member.employmentDetails.hireDate, 'MMM yyyy')}
                </span>
              </div>
            </div>

            {member.subjects && member.subjects.length > 0 && (
              <div className="mt-3">
                <div className="flex flex-wrap gap-1">
                  {member.subjects.map(subject => (
                    <Badge key={subject.id} className="bg-blue-100 text-blue-800">
                      {subject.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-4 pt-3 border-t flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="ml-1 text-sm font-medium">{member.performance.rating}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="ml-1 text-sm">{member.performance.attendance}%</span>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setSelectedStaff(member)}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  <Eye className="w-5 h-5" />
                </button>
                <button className="p-1 text-gray-400 hover:text-gray-600">
                  <Edit2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDeleteStaff(member.id)}
                  className="p-1 text-red-400 hover:text-red-600"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Staff Details Modal */}
      {selectedStaff && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center">
                <Avatar
                  src={selectedStaff.avatar}
                  name={`${selectedStaff.firstName} ${selectedStaff.lastName}`}
                  size="lg"
                  className="mr-4"
                />
                <div>
                  <h2 className="text-2xl font-bold">
                    {selectedStaff.firstName} {selectedStaff.lastName}
                  </h2>
                  <p className="text-gray-600">{selectedStaff.position} • {selectedStaff.department}</p>
                  <p className="text-sm text-gray-500">Staff ID: {selectedStaff.staffNumber}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedStaff(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <span className="text-2xl">&times;</span>
              </button>
            </div>

            {/* Simple Tabs Implementation */}
            <div className="border-b border-gray-200 mb-4">
              <nav className="flex space-x-8">
                {[
                  { id: 'personal', label: 'Personal Info' },
                  { id: 'employment', label: 'Employment' },
                  { id: 'qualifications', label: 'Qualifications' },
                  { id: 'performance', label: 'Performance' },
                  { id: 'documents', label: 'Documents' }
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

            {activeTab === 'personal' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3">Personal Details</h3>
                    <div className="space-y-2">
                      <p><span className="text-gray-500">Full Name:</span> {selectedStaff.firstName} {selectedStaff.middleName} {selectedStaff.lastName}</p>
                      <p><span className="text-gray-500">Date of Birth:</span> {format(selectedStaff.dateOfBirth, 'MMMM d, yyyy')}</p>
                      <p><span className="text-gray-500">Gender:</span> {selectedStaff.gender}</p>
                      <p><span className="text-gray-500">Nationality:</span> {selectedStaff.nationality}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Contact Information</h3>
                    <div className="space-y-2">
                      <p><span className="text-gray-500">Email:</span> {selectedStaff.contact.email}</p>
                      <p><span className="text-gray-500">Phone:</span> {selectedStaff.contact.phone}</p>
                      <p><span className="text-gray-500">Alt Phone:</span> {selectedStaff.contact.alternativePhone || 'N/A'}</p>
                      <p><span className="text-gray-500">Address:</span> {selectedStaff.contact.address}</p>
                      <p><span className="text-gray-500">City:</span> {selectedStaff.contact.city}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Emergency Contact</h3>
                    <div className="space-y-2">
                      <p><span className="text-gray-500">Name:</span> {selectedStaff.emergencyContact.name}</p>
                      <p><span className="text-gray-500">Relationship:</span> {selectedStaff.emergencyContact.relationship}</p>
                      <p><span className="text-gray-500">Phone:</span> {selectedStaff.emergencyContact.phone}</p>
                      <p><span className="text-gray-500">Email:</span> {selectedStaff.emergencyContact.email || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'employment' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3">Employment Details</h3>
                    <div className="space-y-2">
                      <p><span className="text-gray-500">Hire Date:</span> {format(selectedStaff.employmentDetails.hireDate, 'MMMM d, yyyy')}</p>
                      <p><span className="text-gray-500">Contract Type:</span> {selectedStaff.employmentDetails.contractType}</p>
                      <p><span className="text-gray-500">Salary:</span> ${selectedStaff.employmentDetails.salary.toLocaleString()}</p>
                      <p><span className="text-gray-500">Tax ID:</span> {selectedStaff.employmentDetails.taxId}</p>
                      <p><span className="text-gray-500">Pension Number:</span> {selectedStaff.employmentDetails.pensionNumber || 'N/A'}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Bank Details</h3>
                    <div className="space-y-2">
                      <p><span className="text-gray-500">Bank:</span> {selectedStaff.employmentDetails.bankDetails.bankName}</p>
                      <p><span className="text-gray-500">Account Name:</span> {selectedStaff.employmentDetails.bankDetails.accountName}</p>
                      <p><span className="text-gray-500">Account Number:</span> {selectedStaff.employmentDetails.bankDetails.accountNumber}</p>
                      <p><span className="text-gray-500">Branch:</span> {selectedStaff.employmentDetails.bankDetails.branch}</p>
                    </div>
                  </div>
                </div>

                {selectedStaff.classes && selectedStaff.classes.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-3">Assigned Classes</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {selectedStaff.classes.map(cls => (
                        <div key={cls.id} className="p-3 bg-gray-50 rounded-lg">
                          <p className="font-medium">{cls.name}</p>
                          <p className="text-sm text-gray-500">
                            {cls.stream || 'No stream'} • {cls.students} students
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedStaff.subjects && selectedStaff.subjects.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-3">Subjects Taught</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedStaff.subjects.map(subject => (
                        <Badge key={subject.id} className="bg-blue-100 text-blue-800">
                          {subject.name} ({subject.level})
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="font-semibold mb-3">Leave Balance</h3>
                  <div className="grid grid-cols-4 gap-4">
                    <Card className="p-3 text-center">
                      <p className="text-sm text-gray-500">Annual</p>
                      <p className="text-xl font-bold text-blue-600">{selectedStaff.leaveBalance.annual}</p>
                    </Card>
                    <Card className="p-3 text-center">
                      <p className="text-sm text-gray-500">Sick</p>
                      <p className="text-xl font-bold text-green-600">{selectedStaff.leaveBalance.sick}</p>
                    </Card>
                    <Card className="p-3 text-center">
                      <p className="text-sm text-gray-500">Personal</p>
                      <p className="text-xl font-bold text-yellow-600">{selectedStaff.leaveBalance.personal}</p>
                    </Card>
                    <Card className="p-3 text-center">
                      <p className="text-sm text-gray-500">Remaining</p>
                      <p className="text-xl font-bold text-purple-600">{selectedStaff.leaveBalance.remaining}</p>
                    </Card>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'qualifications' && (
              <div className="space-y-4">
                {selectedStaff.qualifications.map((qual, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">{qual.degree}</h4>
                        <p className="text-gray-600">{qual.institution} • {qual.year}</p>
                      </div>
                      {qual.certificate && (
                        <Button variant="outline" size="sm" onClick={() => window.open(qual.certificate)}>
                          <FileText className="w-4 h-4 mr-2" />
                          View Certificate
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'performance' && (
              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <Card className="p-4 text-center">
                    <p className="text-sm text-gray-500">Rating</p>
                    <p className="text-2xl font-bold text-yellow-600">{selectedStaff.performance.rating}/5</p>
                  </Card>
                  <Card className="p-4 text-center">
                    <p className="text-sm text-gray-500">Attendance</p>
                    <p className="text-2xl font-bold text-green-600">{selectedStaff.performance.attendance}%</p>
                  </Card>
                  <Card className="p-4 text-center">
                    <p className="text-sm text-gray-500">Punctuality</p>
                    <p className="text-2xl font-bold text-blue-600">{selectedStaff.performance.punctuality}%</p>
                  </Card>
                </div>

                <h3 className="font-semibold mb-3">Recent Feedback</h3>
                <div className="space-y-3">
                  {selectedStaff.performance.feedback.map(fb => (
                    <div key={fb.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center">
                          <span className="font-medium">{fb.from}</span>
                          <div className="flex items-center ml-3">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${i < fb.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                              />
                            ))}
                          </div>
                        </div>
                        <span className="text-xs text-gray-500">
                          {format(fb.date, 'MMM d, yyyy')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">{fb.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'documents' && (
              <div className="space-y-4">
                {selectedStaff.documents.map(doc => (
                  <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center">
                      <FileText className="w-5 h-5 text-gray-500 mr-3" />
                      <div>
                        <p className="font-medium">{doc.name}</p>
                        <p className="text-sm text-gray-500">
                          Uploaded {format(doc.uploadedAt, 'MMM d, yyyy')}
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => window.open(doc.url)}>
                      View
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
              <Button variant="outline" onClick={() => setSelectedStaff(null)}>
                Close
              </Button>
              <Button>
                <Edit2 className="w-4 h-4 mr-2" />
                Edit Staff
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};