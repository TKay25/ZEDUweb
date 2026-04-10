import React, { useState, useEffect } from 'react';
import {
   Mail, MessageCircle,
  Download, UserPlus,
  TrendingUp, TrendingDown, Award,
  Clock
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Avatar } from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';

// Simple Select component - this fixes the Select errors
const Select: React.FC<{
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  className?: string;
  children: React.ReactNode;
}> = ({ value, onChange, className, children }) => {
  return (
    <select
      value={value}
      onChange={onChange}
      className={`px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${className}`}
    >
      {children}
    </select>
  );
};

interface Student {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  courses: Array<{
    id: string;
    name: string;
    progress: number;
    grade: number;
  }>;
  totalCourses: number;
  averageGrade: number;
  attendance: number;
  lastActive: Date;
  status: 'active' | 'inactive' | 'at-risk';
  engagement: 'high' | 'medium' | 'low';
  parent?: {
    name: string;
    email: string;
    phone: string;
  };
}

export const Students: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  const API_BASE_URL = (window as any).process?.env?.REACT_APP_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      try {
        const response = await axios.get(`${API_BASE_URL}/tutor/students`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStudents(response.data);
      } catch (apiError) {
        console.log('Using mock data for students');
        // Mock data for development
        const mockStudents: Student[] = [
          {
            id: '1',
            name: 'John Smith',
            email: 'john.smith@example.com',
            avatar: '',
            courses: [
              { id: 'c1', name: 'Advanced Mathematics', progress: 75, grade: 82 },
              { id: 'c2', name: 'Physics 101', progress: 60, grade: 78 }
            ],
            totalCourses: 2,
            averageGrade: 80,
            attendance: 85,
            lastActive: new Date(),
            status: 'active',
            engagement: 'high',
            parent: {
              name: 'Robert Smith',
              email: 'robert.smith@example.com',
              phone: '+1234567890'
            }
          },
          {
            id: '2',
            name: 'Emma Wilson',
            email: 'emma.wilson@example.com',
            avatar: '',
            courses: [
              { id: 'c1', name: 'Advanced Mathematics', progress: 45, grade: 65 },
              { id: 'c3', name: 'Chemistry', progress: 30, grade: 58 }
            ],
            totalCourses: 2,
            averageGrade: 61.5,
            attendance: 65,
            lastActive: new Date(),
            status: 'at-risk',
            engagement: 'low',
            parent: {
              name: 'Sarah Wilson',
              email: 'sarah.wilson@example.com',
              phone: '+1234567891'
            }
          },
          {
            id: '3',
            name: 'Michael Brown',
            email: 'michael.brown@example.com',
            avatar: '',
            courses: [
              { id: 'c1', name: 'Advanced Mathematics', progress: 90, grade: 92 },
              { id: 'c2', name: 'Physics 101', progress: 85, grade: 88 }
            ],
            totalCourses: 2,
            averageGrade: 90,
            attendance: 95,
            lastActive: new Date(),
            status: 'active',
            engagement: 'high',
            parent: {
              name: 'David Brown',
              email: 'david.brown@example.com',
              phone: '+1234567892'
            }
          },
          {
            id: '4',
            name: 'Sarah Johnson',
            email: 'sarah.johnson@example.com',
            avatar: '',
            courses: [
              { id: 'c1', name: 'Advanced Mathematics', progress: 30, grade: 55 }
            ],
            totalCourses: 1,
            averageGrade: 55,
            attendance: 45,
            lastActive: new Date(),
            status: 'at-risk',
            engagement: 'low',
            parent: {
              name: 'Mark Johnson',
              email: 'mark.johnson@example.com',
              phone: '+1234567893'
            }
          },
          {
            id: '5',
            name: 'Jessica Lee',
            email: 'jessica.lee@example.com',
            avatar: '',
            courses: [
              { id: 'c1', name: 'Advanced Mathematics', progress: 85, grade: 88 },
              { id: 'c2', name: 'Physics 101', progress: 78, grade: 84 }
            ],
            totalCourses: 2,
            averageGrade: 86,
            attendance: 92,
            lastActive: new Date(),
            status: 'active',
            engagement: 'high',
            parent: {
              name: 'Thomas Lee',
              email: 'thomas.lee@example.com',
              phone: '+1234567894'
            }
          }
        ];
        setStudents(mockStudents);
      }
    } catch (error) {
      console.error('Failed to fetch students:', error);
      toast.error('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const getEngagementColor = (engagement: string) => {
    switch (engagement) {
      case 'high': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'at-risk': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleExportList = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/tutor/students/export`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `students-list-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success('Students list exported successfully');
    } catch (error) {
      console.error('Failed to export students:', error);
      toast.error('Failed to export students list');
    }
  };

  const filteredStudents = students
    .filter(student => {
      const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           student.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || student.status === filterStatus;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'grade') return b.averageGrade - a.averageGrade;
      if (sortBy === 'attendance') return b.attendance - a.attendance;
      return 0;
    });

  const averageGrade = students.length > 0 
    ? (students.reduce((sum, s) => sum + s.averageGrade, 0) / students.length).toFixed(1)
    : '0';
    
  const averageAttendance = students.length > 0
    ? (students.reduce((sum, s) => sum + s.attendance, 0) / students.length).toFixed(1)
    : '0';
    
  const atRiskCount = students.filter(s => s.status === 'at-risk').length;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">My Students</h1>
          <p className="text-gray-600 mt-1">Manage and track your students' progress</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={() => navigate('/tutor/students/invite')}>
            <UserPlus className="w-4 h-4 mr-2" />
            Invite Student
          </Button>
          <Button variant="outline" onClick={handleExportList}>
            <Download className="w-4 h-4 mr-2" />
            Export List
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Students</p>
              <p className="text-2xl font-bold">{students.length}</p>
            </div>
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
              <Award className="w-5 h-5 text-primary-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Average Grade</p>
              <p className="text-2xl font-bold">{averageGrade}%</p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Average Attendance</p>
              <p className="text-2xl font-bold">{averageAttendance}%</p>
            </div>
            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">At Risk</p>
              <p className="text-2xl font-bold text-red-600">{atRiskCount}</p>
            </div>
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <TrendingDown className="w-5 h-5 text-red-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <Input
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-40"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="at-risk">At Risk</option>
          </Select>
          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-40"
          >
            <option value="name">Sort by Name</option>
            <option value="grade">Sort by Grade</option>
            <option value="attendance">Sort by Attendance</option>
          </Select>
        </div>
      </Card>

      {/* Students List */}
      <div className="space-y-4">
        {filteredStudents.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-gray-500">No students found</p>
          </Card>
        ) : (
          filteredStudents.map((student) => (
            <Card key={student.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex flex-col lg:flex-row items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row items-start">
                    <Avatar
                      src={student.avatar}
                      name={student.name}
                      size="lg"
                      className="mr-4 mb-4 sm:mb-0"
                    />
                    
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2">
                        <div>
                          <h3 className="text-lg font-semibold">{student.name}</h3>
                          <p className="text-sm text-gray-500">{student.email}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getEngagementColor(student.engagement)}>
                            {student.engagement} engagement
                          </Badge>
                          <Badge className={getStatusColor(student.status)}>
                            {student.status}
                          </Badge>
                        </div>
                      </div>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-500">Courses</p>
                          <p className="font-semibold">{student.totalCourses}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Average Grade</p>
                          <p className="font-semibold">{student.averageGrade}%</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Attendance</p>
                          <p className="font-semibold">{student.attendance}%</p>
                        </div>
                      </div>

                      {/* Course Progress */}
                      <div className="space-y-2 mb-4">
                        {student.courses.map((course) => (
                          <div key={course.id}>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-gray-600">{course.name}</span>
                              <span className="font-medium">{course.grade}%</span>
                            </div>
                            <ProgressBar value={course.progress} className="h-1.5" />
                          </div>
                        ))}
                      </div>

                      {/* Parent Contact */}
                      {student.parent && (
                        <div className="bg-gray-50 p-3 rounded-lg mt-3">
                          <p className="text-sm font-medium mb-2">Parent/Guardian</p>
                          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 text-sm">
                            <span className="text-gray-600">{student.parent.name}</span>
                            <a href={`mailto:${student.parent.email}`} className="text-primary-600 hover:underline">
                              {student.parent.email}
                            </a>
                            <a href={`tel:${student.parent.phone}`} className="text-primary-600 hover:underline">
                              {student.parent.phone}
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-row lg:flex-col space-x-2 lg:space-x-0 lg:space-y-2">
                  <Button size="sm" onClick={() => navigate(`/tutor/students/${student.id}`)}>
                    View Profile
                  </Button>
                  <Button variant="outline" size="sm">
                    <Mail className="w-4 h-4 mr-2" />
                    Message
                  </Button>
                  <Button variant="outline" size="sm">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Contact Parent
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Students;