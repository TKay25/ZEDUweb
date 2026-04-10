// src/pages/tutor/Classes.tsx
import React, { useState, useEffect } from 'react';
import {
  Grid, List, Calendar, Clock, Users,
  Search, Plus, Edit, Trash2, Eye, UserPlus, X,
  UserCheck, UserX, MessageSquare, Bell, CheckCircle, XCircle
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Avatar } from '../../components/ui/Avatar';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
// TODO: Import toast for notifications when API is integrated
// import { toast } from 'react-hot-toast';
// TODO: Import classes API when backend is ready
// import { classesAPI } from '../../api/classes.api';

interface Student {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  enrolledDate: Date;
  status: 'active' | 'dropped' | 'completed';
  progress: number;
}

interface JoinRequest {
  id: string;
  classId: string;
  tutorId: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentAvatar?: string;
  message: string;
  status: 'pending' | 'approved' | 'rejected';
  requestedAt: Date;
  respondedAt?: Date;
}

interface Class {
  id: string;
  name: string;
  course: string;
  schedule: {
    day: string;
    time: string;
    duration: number;
  };
  students: number;
  capacity: number;
  status: 'active' | 'upcoming' | 'completed' | 'cancelled';
  nextSession?: Date;
  progress: number;
  enrolledStudents?: Student[];
  pendingRequests?: JoinRequest[];
}

// Mock data for development
const MOCK_STUDENTS: Student[] = [
  { id: 's1', name: 'John Doe', email: 'john@example.com', enrolledDate: new Date('2024-01-15'), status: 'active', progress: 75 },
  { id: 's2', name: 'Jane Smith', email: 'jane@example.com', enrolledDate: new Date('2024-01-15'), status: 'active', progress: 82 },
  { id: 's3', name: 'Michael Brown', email: 'michael@example.com', enrolledDate: new Date('2024-01-20'), status: 'active', progress: 45 },
  { id: 's4', name: 'Sarah Wilson', email: 'sarah@example.com', enrolledDate: new Date('2024-01-18'), status: 'active', progress: 91 },
  { id: 's5', name: 'David Lee', email: 'david@example.com', enrolledDate: new Date('2024-01-22'), status: 'dropped', progress: 30 },
];

const MOCK_AVAILABLE_STUDENTS: Student[] = [
  { id: 's6', name: 'Emma Thompson', email: 'emma@example.com', enrolledDate: new Date(), status: 'active', progress: 0 },
  { id: 's7', name: 'James Wilson', email: 'james@example.com', enrolledDate: new Date(), status: 'active', progress: 0 },
  { id: 's8', name: 'Lisa Anderson', email: 'lisa@example.com', enrolledDate: new Date(), status: 'active', progress: 0 },
  { id: 's9', name: 'Robert Taylor', email: 'robert@example.com', enrolledDate: new Date(), status: 'active', progress: 0 },
  { id: 's10', name: 'Maria Garcia', email: 'maria@example.com', enrolledDate: new Date(), status: 'active', progress: 0 },
];

const MOCK_CLASSES: Class[] = [
  {
    id: '1',
    name: 'Advanced Mathematics - Section A',
    course: 'Advanced Mathematics',
    schedule: {
      day: 'Monday',
      time: '09:00 AM',
      duration: 90
    },
    students: 45,
    capacity: 60,
    status: 'active',
    nextSession: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    progress: 65,
    enrolledStudents: MOCK_STUDENTS.slice(0, 4)
  },
  {
    id: '2',
    name: 'Physics Fundamentals - Section B',
    course: 'Physics Fundamentals',
    schedule: {
      day: 'Wednesday',
      time: '02:00 PM',
      duration: 90
    },
    students: 38,
    capacity: 45,
    status: 'active',
    nextSession: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
    progress: 42,
    enrolledStudents: MOCK_STUDENTS.slice(2, 5)
  },
  {
    id: '3',
    name: 'Computer Science 101 - Section C',
    course: 'Computer Science 101',
    schedule: {
      day: 'Friday',
      time: '11:00 AM',
      duration: 120
    },
    students: 52,
    capacity: 55,
    status: 'active',
    nextSession: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
    progress: 78,
    enrolledStudents: MOCK_STUDENTS.slice(0, 3)
  },
  {
    id: '4',
    name: 'English Literature - Section D',
    course: 'English Literature',
    schedule: {
      day: 'Tuesday',
      time: '10:00 AM',
      duration: 90
    },
    students: 28,
    capacity: 40,
    status: 'upcoming',
    nextSession: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    progress: 0,
    enrolledStudents: []
  },
  {
    id: '5',
    name: 'Chemistry Lab - Section E',
    course: 'Chemistry Essentials',
    schedule: {
      day: 'Thursday',
      time: '01:00 PM',
      duration: 120
    },
    students: 32,
    capacity: 35,
    status: 'completed',
    nextSession: undefined,
    progress: 100,
    enrolledStudents: MOCK_STUDENTS.slice(1, 5)
  }
];

export const Classes: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [classes, setClasses] = useState<Class[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Student management states
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [availableStudents, setAvailableStudents] = useState<Student[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [studentSearchTerm, setStudentSearchTerm] = useState('');
  
  // Request management states
  const [showRequestsModal, setShowRequestsModal] = useState(false);
  const [pendingRequests, setPendingRequests] = useState<JoinRequest[]>([]);
  const [showRequestDetails, setShowRequestDetails] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<JoinRequest | null>(null);
  const [requestCount, setRequestCount] = useState(0);

  useEffect(() => {
    fetchClasses();
    loadPendingRequests();
  }, []);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setClasses(MOCK_CLASSES);
    } catch (error) {
      console.error('Failed to fetch classes:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPendingRequests = async () => {
    try {
      // Load from localStorage for demo
      const savedRequests = JSON.parse(localStorage.getItem('joinRequests') || '[]');
      // Filter requests for this tutor's classes
      const tutorClassIds = classes.map(c => c.id);
      const pending = savedRequests.filter(
        (r: JoinRequest) => tutorClassIds.includes(r.classId) && r.status === 'pending'
      );
      setPendingRequests(pending);
      setRequestCount(pending.length);
    } catch (error) {
      console.error('Failed to load requests:', error);
    }
  };

  const handleDeleteClass = async (classId: string) => {
    if (window.confirm('Are you sure you want to delete this class?')) {
      try {
        setClasses(classes.filter(c => c.id !== classId));
        alert('Class deleted successfully');
      } catch (error) {
        console.error('Failed to delete class:', error);
      }
    }
  };

  const handleAddStudents = async () => {
    if (!selectedClass) return;
    
    try {
      const newStudents = availableStudents.filter(s => selectedStudents.includes(s.id));
      const updatedClass = {
        ...selectedClass,
        students: selectedClass.students + newStudents.length,
        enrolledStudents: [...(selectedClass.enrolledStudents || []), ...newStudents]
      };
      
      setClasses(classes.map(c => c.id === selectedClass.id ? updatedClass : c));
      alert(`${newStudents.length} student(s) added to ${selectedClass.name}`);
      
      setShowStudentModal(false);
      setSelectedStudents([]);
      setStudentSearchTerm('');
    } catch (error) {
      console.error('Failed to add students:', error);
      alert('Failed to add students');
    }
  };

  const handleRemoveStudent = async (classId: string, studentId: string) => {
    if (!window.confirm('Are you sure you want to remove this student from the class?')) return;
    
    try {
      const updatedClasses = classes.map(c => {
        if (c.id === classId) {
          return {
            ...c,
            students: c.students - 1,
            enrolledStudents: c.enrolledStudents?.filter(s => s.id !== studentId)
          };
        }
        return c;
      });
      setClasses(updatedClasses);
      alert('Student removed from class');
    } catch (error) {
      console.error('Failed to remove student:', error);
      alert('Failed to remove student');
    }
  };

  const handleApproveRequest = async (request: JoinRequest) => {
    try {
      // Update request status
      const savedRequests = JSON.parse(localStorage.getItem('joinRequests') || '[]');
      const updatedRequests = savedRequests.map((r: JoinRequest) =>
        r.id === request.id ? { ...r, status: 'approved', respondedAt: new Date() } : r
      );
      localStorage.setItem('joinRequests', JSON.stringify(updatedRequests));
      
      // Update class enrollment
      const updatedClasses = classes.map(c =>
        c.id === request.classId ? { ...c, students: c.students + 1 } : c
      );
      setClasses(updatedClasses);
      
      alert(`✅ Approved ${request.studentName} to join the class`);
      loadPendingRequests();
      setShowRequestDetails(false);
    } catch (error) {
      console.error('Failed to approve request:', error);
      alert('Failed to approve request');
    }
  };

  const handleRejectRequest = async (request: JoinRequest) => {
    try {
      const savedRequests = JSON.parse(localStorage.getItem('joinRequests') || '[]');
      const updatedRequests = savedRequests.map((r: JoinRequest) =>
        r.id === request.id ? { ...r, status: 'rejected', respondedAt: new Date() } : r
      );
      localStorage.setItem('joinRequests', JSON.stringify(updatedRequests));
      
      alert(`❌ Rejected ${request.studentName}'s request`);
      loadPendingRequests();
      setShowRequestDetails(false);
    } catch (error) {
      console.error('Failed to reject request:', error);
      alert('Failed to reject request');
    }
  };

  const openAddStudentModal = (classItem: Class) => {
    setSelectedClass(classItem);
    const enrolledIds = classItem.enrolledStudents?.map(s => s.id) || [];
    const available = MOCK_AVAILABLE_STUDENTS.filter(s => !enrolledIds.includes(s.id));
    setAvailableStudents(available);
    setShowStudentModal(true);
    setSelectedStudents([]);
    setStudentSearchTerm('');
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStudentStatusColor = (status: string): string => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'dropped': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string): string => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const filteredClasses = classes.filter(cls => {
    const matchesSearch = cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cls.course.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || cls.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatCounts = () => {
    return {
      active: classes.filter(c => c.status === 'active').length,
      upcoming: classes.filter(c => c.status === 'upcoming').length,
      completed: classes.filter(c => c.status === 'completed').length,
      totalStudents: classes.reduce((sum, c) => sum + c.students, 0),
      pendingRequests: requestCount
    };
  };

  const stats = getStatCounts();
  const filteredAvailableStudents = availableStudents.filter(student =>
    student.name.toLowerCase().includes(studentSearchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(studentSearchTerm.toLowerCase())
  );

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
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Classes</h1>
          <p className="text-gray-600 mt-1">Manage your scheduled classes and students</p>
        </div>
        <div className="flex space-x-3">
          <Button 
            variant="outline" 
            onClick={() => {
              loadPendingRequests();
              setShowRequestsModal(true);
            }}
            className="relative"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Join Requests
            {requestCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {requestCount}
              </span>
            )}
          </Button>
          <Button onClick={() => navigate('/tutor/classes/create')}>
            <Plus className="w-4 h-4 mr-2" />
            Create New Class
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Classes</p>
              <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <Calendar className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Upcoming Classes</p>
              <p className="text-2xl font-bold text-gray-900">{stats.upcoming}</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Completed Classes</p>
              <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
            </div>
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <Grid className="w-5 h-5 text-purple-600" />
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Students</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalStudents}</p>
            </div>
            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
              <Users className="w-5 h-5 text-yellow-600" />
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-primary-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-primary-700">Pending Requests</p>
              <p className="text-2xl font-bold text-primary-700">{stats.pendingRequests}</p>
            </div>
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
              <Bell className="w-5 h-5 text-primary-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <Input
              placeholder="Search classes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="w-4 h-4" />}
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="upcoming">Upcoming</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <div className="flex border rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 transition-colors ${
                viewMode === 'list' 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
      </Card>

      {/* Classes Grid/List */}
      {filteredClasses.length === 0 ? (
        <Card className="p-12 text-center">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Classes Found</h3>
          <p className="text-gray-500">
            {searchTerm 
              ? 'No classes match your search criteria'
              : 'Create your first class to get started'}
          </p>
          {!searchTerm && (
            <Button 
              variant="primary" 
              className="mt-4"
              onClick={() => navigate('/tutor/classes/create')}
            >
              <Plus className="w-4 h-4 mr-2" />
              Create New Class
            </Button>
          )}
        </Card>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredClasses.map((cls) => (
            <Card key={cls.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">{cls.name}</h3>
                  <p className="text-sm text-gray-600">{cls.course}</p>
                </div>
                <Badge className={getStatusColor(cls.status)}>
                  {getStatusText(cls.status)}
                </Badge>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  {cls.schedule.day}, {cls.schedule.time} ({cls.schedule.duration} min)
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="w-4 h-4 mr-2" />
                  {cls.students}/{cls.capacity} students
                </div>
                {cls.nextSession && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-2" />
                    Next: {format(new Date(cls.nextSession), 'MMM d, h:mm a')}
                  </div>
                )}
              </div>

              <div className="mb-4">
                <ProgressBar value={cls.progress} className="h-2" />
                <p className="text-xs text-gray-500 mt-1">{cls.progress}% complete</p>
              </div>

              <div className="flex space-x-2">
                <Button 
                  variant="primary" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => navigate(`/tutor/classes/${cls.id}`)}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => openAddStudentModal(cls)}
                  title="Add Students"
                >
                  <UserPlus className="w-4 h-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate(`/tutor/classes/${cls.id}/edit`)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleDeleteClass(cls.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Class</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Schedule</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Students</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Progress</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredClasses.map((cls) => (
                  <tr key={cls.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{cls.name}</p>
                        <p className="text-sm text-gray-500">{cls.course}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <p className="text-gray-900">{cls.schedule.day}</p>
                        <p className="text-gray-500">{cls.schedule.time}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="w-4 h-4 text-gray-400 mr-2" />
                        {cls.students}/{cls.capacity}
                      </div>
                    </td>
                    <td className="px-6 py-4 w-48">
                      <div>
                        <ProgressBar value={cls.progress} className="h-2" />
                        <p className="text-xs text-gray-500 mt-1">{cls.progress}%</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge className={getStatusColor(cls.status)}>
                        {getStatusText(cls.status)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => navigate(`/tutor/classes/${cls.id}`)}
                          className="text-gray-400 hover:text-primary-600 transition-colors"
                          title="View Class"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => openAddStudentModal(cls)}
                          className="text-gray-400 hover:text-green-600 transition-colors"
                          title="Add Students"
                        >
                          <UserPlus className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => navigate(`/tutor/classes/${cls.id}/edit`)}
                          className="text-gray-400 hover:text-primary-600 transition-colors"
                          title="Edit Class"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleDeleteClass(cls.id)}
                          className="text-gray-400 hover:text-red-600 transition-colors"
                          title="Delete Class"
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
      )}

      {/* Add Students Modal */}
      {showStudentModal && selectedClass && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Add Students to Class</h2>
                  <p className="text-gray-600 mt-1">{selectedClass.name}</p>
                </div>
                <button
                  onClick={() => setShowStudentModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="mb-4">
                <Input
                  placeholder="Search students..."
                  value={studentSearchTerm}
                  onChange={(e) => setStudentSearchTerm(e.target.value)}
                  icon={<Search className="w-4 h-4" />}
                />
              </div>

              {/* Current Students */}
              {selectedClass.enrolledStudents && selectedClass.enrolledStudents.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">
                    Current Students ({selectedClass.enrolledStudents.length}/{selectedClass.capacity})
                  </h3>
                  <div className="space-y-2">
                    {selectedClass.enrolledStudents.map((student) => (
                      <div key={student.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Avatar name={student.name} size="sm" />
                          <div>
                            <p className="font-medium text-gray-900">{student.name}</p>
                            <p className="text-sm text-gray-500">{student.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getStudentStatusColor(student.status)}>
                            {getStatusText(student.status)}
                          </Badge>
                          <button
                            onClick={() => handleRemoveStudent(selectedClass.id, student.id)}
                            className="text-red-500 hover:text-red-700"
                            title="Remove Student"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Available Students */}
              {filteredAvailableStudents.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">
                    Available Students ({filteredAvailableStudents.length})
                  </h3>
                  <div className="space-y-2">
                    {filteredAvailableStudents.map((student) => (
                      <label key={student.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                        <div className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={selectedStudents.includes(student.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedStudents([...selectedStudents, student.id]);
                              } else {
                                setSelectedStudents(selectedStudents.filter(id => id !== student.id));
                              }
                            }}
                            className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                          />
                          <Avatar name={student.name} size="sm" />
                          <div>
                            <p className="font-medium text-gray-900">{student.name}</p>
                            <p className="text-sm text-gray-500">{student.email}</p>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {filteredAvailableStudents.length === 0 && (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">No available students to add</p>
                </div>
              )}
            </div>

            <div className="p-6 border-t flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setShowStudentModal(false)}>
                Cancel
              </Button>
              <Button 
                variant="primary" 
                onClick={handleAddStudents}
                disabled={selectedStudents.length === 0}
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Add Selected ({selectedStudents.length})
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Join Requests Modal */}
      {showRequestsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Student Join Requests</h2>
                  <p className="text-gray-600 mt-1">
                    Review and manage student requests to join your classes
                  </p>
                </div>
                <button
                  onClick={() => setShowRequestsModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {pendingRequests.length === 0 ? (
                <div className="text-center py-8">
                  <UserCheck className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">No pending requests</p>
                  <p className="text-sm text-gray-400">When students request to join your classes, they will appear here.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingRequests.map((request) => {
                    const classInfo = classes.find(c => c.id === request.classId);
                    return (
                      <div key={request.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <Avatar name={request.studentName} size="md" />
                            <div>
                              <h3 className="font-semibold text-gray-900">{request.studentName}</h3>
                              <p className="text-sm text-gray-500">{request.studentEmail}</p>
                            </div>
                          </div>
                          <Badge className="bg-yellow-100 text-yellow-800">
                            Pending
                          </Badge>
                        </div>
                        
                        <div className="bg-gray-50 p-3 rounded-lg mb-3">
                          <p className="text-sm font-medium text-gray-700 mb-1">Student's Message:</p>
                          <p className="text-sm text-gray-600">{request.message}</p>
                        </div>
                        
                        {classInfo && (
                          <div className="text-sm text-gray-500 mb-3">
                            <p>Requesting to join: <span className="font-medium text-gray-700">{classInfo.name}</span></p>
                            <p>Class schedule: {classInfo.schedule.day}, {classInfo.schedule.time}</p>
                          </div>
                        )}
                        
                        <p className="text-xs text-gray-400 mb-3">
                          Requested: {new Date(request.requestedAt).toLocaleString()}
                        </p>
                        
                        <div className="flex space-x-3">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-green-600 border-green-300 hover:bg-green-50"
                            onClick={() => {
                              setSelectedRequest(request);
                              setShowRequestDetails(true);
                              setShowRequestsModal(false);
                            }}
                          >
                            <MessageSquare className="w-4 h-4 mr-1" />
                            Review Details
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-green-600"
                            onClick={() => handleApproveRequest(request)}
                          >
                            <UserCheck className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-red-600"
                            onClick={() => handleRejectRequest(request)}
                          >
                            <UserX className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* Request Details Modal */}
      {showRequestDetails && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Review Join Request</h2>
                  <p className="text-gray-600 mt-1">Review student details before approving</p>
                </div>
                <button
                  onClick={() => {
                    setShowRequestDetails(false);
                    setShowRequestsModal(true);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3 pb-3 border-b">
                  <Avatar name={selectedRequest.studentName} size="lg" />
                  <div>
                    <h3 className="font-semibold text-gray-900">{selectedRequest.studentName}</h3>
                    <p className="text-sm text-gray-500">{selectedRequest.studentEmail}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Student's Message:</p>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-600">{selectedRequest.message}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Request Details:</p>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>• Requested: {new Date(selectedRequest.requestedAt).toLocaleString()}</p>
                    <p>• Class: {classes.find(c => c.id === selectedRequest.classId)?.name}</p>
                  </div>
                </div>

                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> Once approved, the student will be added to your class roster and will have access to all class materials.
                  </p>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <Button variant="outline" onClick={() => {
                  setShowRequestDetails(false);
                  setShowRequestsModal(true);
                }}>
                  Cancel
                </Button>
                <Button variant="outline" className="text-red-600" onClick={() => {
                  handleRejectRequest(selectedRequest);
                  setShowRequestDetails(false);
                  setShowRequestsModal(true);
                }}>
                  <XCircle className="w-4 h-4 mr-1" />
                  Reject
                </Button>
                <Button variant="primary" className="bg-green-600 hover:bg-green-700" onClick={() => {
                  handleApproveRequest(selectedRequest);
                  setShowRequestDetails(false);
                  setShowRequestsModal(true);
                }}>
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Approve & Add to Class
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};