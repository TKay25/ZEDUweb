// src/pages/school/Students.tsx
import React, { useState, useEffect } from 'react';
import {
  Users, Search, Download,
  CheckCircle, Eye,
  Edit2, Trash2, UserPlus, FileText,
  GraduationCap, TrendingUp, Filter
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Avatar } from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';
import schoolAPI from '../../api/school.api';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';

interface Student {
  id: string;
  studentNumber: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  dateOfBirth: Date;
  gender: 'male' | 'female' | 'other';
  nationality: string;
  religion?: string;
  avatar?: string;
  grade: string;
  class: string;
  stream?: string;
  enrollmentDate: Date;
  status: 'active' | 'inactive' | 'graduated' | 'transferred' | 'suspended';
  contact: {
    email: string;
    phone: string;
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
  parent: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  medicalInfo?: {
    bloodGroup?: string;
    allergies?: string[];
    conditions?: string[];
    doctorName?: string;
    doctorPhone?: string;
  };
  academics: {
    currentAverage: number;
    totalCredits: number;
    attendance: number;
    rank?: number;
    subjects: Array<{
      name: string;
      teacher: string;
      grade: number;
    }>;
  };
  documents: Array<{
    id: string;
    name: string;
    type: string;
    url: string;
    uploadedAt: Date;
  }>;
  extracurricular: Array<{
    id: string;
    activity: string;
    role: string;
    joinedAt: Date;
  }>;
}

export const Students: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [activeTab, setActiveTab] = useState('personal');

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      // Mock data for demonstration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockStudents: Student[] = [
        {
          id: '1',
          studentNumber: 'STU001',
          firstName: 'John',
          lastName: 'Doe',
          dateOfBirth: new Date(2005, 5, 15),
          gender: 'male',
          nationality: 'Zimbabwean',
          grade: 'Form 1',
          class: 'Form 1A',
          enrollmentDate: new Date(2023, 0, 15),
          status: 'active',
          contact: {
            email: 'john.doe@student.com',
            phone: '+263 123 456789',
            address: '123 Main St',
            city: 'Harare'
          },
          emergencyContact: {
            name: 'Jane Doe',
            relationship: 'Mother',
            phone: '+263 987 654321'
          },
          parent: {
            id: 'p1',
            name: 'Jane Doe',
            email: 'jane.doe@parent.com',
            phone: '+263 987 654321'
          },
          academics: {
            currentAverage: 85,
            totalCredits: 15,
            attendance: 92,
            rank: 5,
            subjects: [
              { name: 'Mathematics', teacher: 'Mr. Smith', grade: 88 },
              { name: 'English', teacher: 'Ms. Johnson', grade: 82 },
              { name: 'Science', teacher: 'Dr. Brown', grade: 85 }
            ]
          },
          documents: [],
          extracurricular: []
        },
        {
          id: '2',
          studentNumber: 'STU002',
          firstName: 'Jane',
          lastName: 'Smith',
          dateOfBirth: new Date(2006, 3, 20),
          gender: 'female',
          nationality: 'Zimbabwean',
          grade: 'Form 1',
          class: 'Form 1B',
          enrollmentDate: new Date(2023, 0, 15),
          status: 'active',
          contact: {
            email: 'jane.smith@student.com',
            phone: '+263 234 567890',
            address: '456 Oak Ave',
            city: 'Harare'
          },
          emergencyContact: {
            name: 'John Smith',
            relationship: 'Father',
            phone: '+263 876 543210'
          },
          parent: {
            id: 'p2',
            name: 'John Smith',
            email: 'john.smith@parent.com',
            phone: '+263 876 543210'
          },
          academics: {
            currentAverage: 92,
            totalCredits: 15,
            attendance: 96,
            rank: 2,
            subjects: [
              { name: 'Mathematics', teacher: 'Mr. Smith', grade: 95 },
              { name: 'English', teacher: 'Ms. Johnson', grade: 90 },
              { name: 'Science', teacher: 'Dr. Brown', grade: 91 }
            ]
          },
          documents: [],
          extracurricular: []
        }
      ];
      
      setStudents(mockStudents);
    } catch (error) {
      toast.error('Failed to load students');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStudent = async (studentId: string) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        setStudents(prev => prev.filter(s => s.id !== studentId));
        toast.success('Student deleted successfully');
      } catch (error) {
        toast.error('Failed to delete student');
        console.error(error);
      }
    }
  };

  const handleExportData = async () => {
    try {
      await schoolAPI.generateReport('students', undefined, 'csv');
      toast.success('Student data exported successfully');
    } catch (error) {
      toast.error('Failed to export data');
      console.error(error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'graduated': return 'bg-blue-100 text-blue-800';
      case 'transferred': return 'bg-yellow-100 text-yellow-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.contact.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesGrade = selectedGrade === 'all' || student.grade === selectedGrade;
    const matchesStatus = selectedStatus === 'all' || student.status === selectedStatus;
    
    return matchesSearch && matchesGrade && matchesStatus;
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
        <h1 className="text-2xl font-bold">Student Management</h1>
        <div className="flex items-center space-x-3">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Import
          </Button>
          <Button variant="outline" onClick={handleExportData}>
            <FileText className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button>
            <UserPlus className="w-4 h-4 mr-2" />
            Add Student
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Students</p>
              <p className="text-2xl font-bold">{students.length}</p>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active</p>
              <p className="text-2xl font-bold text-green-600">
                {students.filter(s => s.status === 'active').length}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Graduated</p>
              <p className="text-2xl font-bold text-blue-600">
                {students.filter(s => s.status === 'graduated').length}
              </p>
            </div>
            <GraduationCap className="w-8 h-8 text-blue-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Average Attendance</p>
              <p className="text-2xl font-bold">
                {(students.reduce((acc, s) => acc + (s.academics?.attendance || 0), 0) / students.length).toFixed(1)}%
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-500" />
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
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
            className="w-48 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Grades</option>
            <option value="ECD">ECD (Early Childhood)</option>
            <option value="Grade 1">Grade 1</option>
            <option value="Grade 2">Grade 2</option>
            <option value="Grade 3">Grade 3</option>
            <option value="Grade 4">Grade 4</option>
            <option value="Grade 5">Grade 5</option>
            <option value="Grade 6">Grade 6</option>
            <option value="Grade 7">Grade 7</option>
            <option value="Form 1">Form 1</option>
            <option value="Form 2">Form 2</option>
            <option value="Form 3">Form 3</option>
            <option value="Form 4">Form 4</option>
            <option value="Form 5">Form 5</option>
            <option value="Form 6">Form 6</option>
            <option value="Year 1">University Year 1</option>
            <option value="Year 2">University Year 2</option>
            <option value="Year 3">University Year 3</option>
            <option value="Year 4">University Year 4</option>
            <option value="Year 5">University Year 5</option>
            <option value="Masters">Masters</option>
            <option value="PhD">PhD</option>
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-40 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="graduated">Graduated</option>
            <option value="transferred">Transferred</option>
            <option value="suspended">Suspended</option>
          </select>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            More Filters
          </Button>
        </div>
      </Card>

      {/* Students Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Class/Grade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Parent/Guardian
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Academics
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Avatar
                        src={student.avatar}
                        name={`${student.firstName} ${student.lastName}`}
                        size="md"
                        className="mr-3"
                      />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {student.firstName} {student.lastName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {student.studentNumber}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{student.class || 'Not assigned'}</div>
                    <div className="text-sm text-gray-500">{student.grade}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{student.contact.email}</div>
                    <div className="text-sm text-gray-500">{student.contact.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{student.parent?.name || 'N/A'}</div>
                    <div className="text-sm text-gray-500">{student.parent?.phone || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className={`text-sm font-medium ${
                        student.academics?.currentAverage >= 75 ? 'text-green-600' :
                        student.academics?.currentAverage >= 50 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {student.academics?.currentAverage || 0}%
                      </span>
                      <span className="mx-2 text-gray-300">|</span>
                      <span className="text-sm text-gray-600">
                        {student.academics?.attendance || 0}% Att.
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge className={getStatusColor(student.status)}>
                      {student.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => setSelectedStudent(student)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button className="text-gray-400 hover:text-gray-600">
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteStudent(student.id)}
                        className="text-red-400 hover:text-red-600"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Student Details Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center">
                <Avatar
                  src={selectedStudent.avatar}
                  name={`${selectedStudent.firstName} ${selectedStudent.lastName}`}
                  size="lg"
                  className="mr-4"
                />
                <div>
                  <h2 className="text-2xl font-bold">
                    {selectedStudent.firstName} {selectedStudent.lastName}
                  </h2>
                  <p className="text-gray-600">Student ID: {selectedStudent.studentNumber}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedStudent(null)}
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
                  { id: 'academic', label: 'Academic' },
                  { id: 'documents', label: 'Documents' },
                  { id: 'extracurricular', label: 'Extracurricular' }
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
                      <p><span className="text-gray-500">Date of Birth:</span> {format(selectedStudent.dateOfBirth, 'MMMM d, yyyy')}</p>
                      <p><span className="text-gray-500">Gender:</span> {selectedStudent.gender}</p>
                      <p><span className="text-gray-500">Nationality:</span> {selectedStudent.nationality}</p>
                      <p><span className="text-gray-500">Religion:</span> {selectedStudent.religion || 'N/A'}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Contact Information</h3>
                    <div className="space-y-2">
                      <p><span className="text-gray-500">Email:</span> {selectedStudent.contact.email}</p>
                      <p><span className="text-gray-500">Phone:</span> {selectedStudent.contact.phone}</p>
                      <p><span className="text-gray-500">Address:</span> {selectedStudent.contact.address}</p>
                      <p><span className="text-gray-500">City:</span> {selectedStudent.contact.city}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Emergency Contact</h3>
                    <div className="space-y-2">
                      <p><span className="text-gray-500">Name:</span> {selectedStudent.emergencyContact.name}</p>
                      <p><span className="text-gray-500">Relationship:</span> {selectedStudent.emergencyContact.relationship}</p>
                      <p><span className="text-gray-500">Phone:</span> {selectedStudent.emergencyContact.phone}</p>
                      <p><span className="text-gray-500">Email:</span> {selectedStudent.emergencyContact.email || 'N/A'}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Medical Information</h3>
                    {selectedStudent.medicalInfo ? (
                      <div className="space-y-2">
                        <p><span className="text-gray-500">Blood Group:</span> {selectedStudent.medicalInfo.bloodGroup || 'N/A'}</p>
                        <p><span className="text-gray-500">Allergies:</span> {selectedStudent.medicalInfo.allergies?.join(', ') || 'None'}</p>
                        <p><span className="text-gray-500">Medical Conditions:</span> {selectedStudent.medicalInfo.conditions?.join(', ') || 'None'}</p>
                        <p><span className="text-gray-500">Doctor:</span> {selectedStudent.medicalInfo.doctorName || 'N/A'}</p>
                      </div>
                    ) : (
                      <p className="text-gray-500">No medical information provided</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'academic' && (
              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <Card className="p-4 text-center">
                    <p className="text-sm text-gray-500">Current Average</p>
                    <p className="text-2xl font-bold text-primary-600">
                      {selectedStudent.academics.currentAverage}%
                    </p>
                  </Card>
                  <Card className="p-4 text-center">
                    <p className="text-sm text-gray-500">Attendance</p>
                    <p className="text-2xl font-bold text-green-600">
                      {selectedStudent.academics.attendance}%
                    </p>
                  </Card>
                  <Card className="p-4 text-center">
                    <p className="text-sm text-gray-500">Class Rank</p>
                    <p className="text-2xl font-bold text-blue-600">
                      #{selectedStudent.academics.rank || 'N/A'}
                    </p>
                  </Card>
                </div>

                <h3 className="font-semibold mb-3">Subjects</h3>
                <div className="grid grid-cols-2 gap-4">
                  {selectedStudent.academics.subjects.map((subject, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{subject.name}</p>
                        <p className="text-sm text-gray-500">{subject.teacher}</p>
                      </div>
                      <span className={`text-lg font-bold ${
                        subject.grade >= 75 ? 'text-green-600' :
                        subject.grade >= 50 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {subject.grade}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'documents' && (
              <div className="space-y-4">
                {selectedStudent.documents.map(doc => (
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

            {activeTab === 'extracurricular' && (
              <div className="space-y-4">
                {selectedStudent.extracurricular.map(activity => (
                  <div key={activity.id} className="p-3 border rounded-lg">
                    <h4 className="font-semibold">{activity.activity}</h4>
                    <p className="text-sm text-gray-600">Role: {activity.role}</p>
                    <p className="text-sm text-gray-500">
                      Joined {format(activity.joinedAt, 'MMMM yyyy')}
                    </p>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
              <Button variant="outline" onClick={() => setSelectedStudent(null)}>
                Close
              </Button>
              <Button>
                <Edit2 className="w-4 h-4 mr-2" />
                Edit Student
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};