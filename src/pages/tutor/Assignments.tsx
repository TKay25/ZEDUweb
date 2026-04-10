// Assignments.tsx
import React, { useState, useEffect } from 'react';
import {
  Plus, FileText, Clock, Users,
  Edit, Trash2, Eye, CheckCircle,
  Search
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
// TODO: Import toast for notifications when API is integrated
// import { toast } from 'react-hot-toast';
// TODO: Import assignments API when backend is ready
// import { assignmentsAPI } from '../../api/assignments.api';

interface Assignment {
  id: string;
  title: string;
  course: string;
  dueDate: Date;
  totalPoints: number;
  submissions: number;
  totalStudents: number;
  status: 'active' | 'draft' | 'closed';
  type: 'assignment' | 'quiz' | 'exam';
}

// 🔴 MOCK DATA - Replace with API calls when backend is ready
const MOCK_ASSIGNMENTS: Assignment[] = [
  {
    id: '1',
    title: 'Calculus Problem Set 1',
    course: 'Advanced Mathematics',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    totalPoints: 100,
    submissions: 45,
    totalStudents: 60,
    status: 'active',
    type: 'assignment'
  },
  {
    id: '2',
    title: 'Physics Lab Report',
    course: 'Physics Fundamentals',
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    totalPoints: 50,
    submissions: 28,
    totalStudents: 45,
    status: 'active',
    type: 'assignment'
  },
  {
    id: '3',
    title: 'JavaScript Quiz',
    course: 'Computer Science 101',
    dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    totalPoints: 30,
    submissions: 52,
    totalStudents: 55,
    status: 'closed',
    type: 'quiz'
  },
  {
    id: '4',
    title: 'Mid-term Exam Draft',
    course: 'Advanced Mathematics',
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    totalPoints: 200,
    submissions: 0,
    totalStudents: 60,
    status: 'draft',
    type: 'exam'
  }
];

export const Assignments: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCourse, setFilterCourse] = useState('all');

  useEffect(() => {
    fetchAssignments();
  }, []);

  /**
   * 🟢 API INTEGRATION POINT 1 - Fetch Assignments
   * ==============================================
   * Get all assignments for the tutor
   */
  const fetchAssignments = async () => {
    try {
      setLoading(true);
      
      // 🔴 MOCK DATA - Remove when integrating API
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAssignments(MOCK_ASSIGNMENTS);
      
      // 🟢 REAL API CALL - Uncomment when backend is ready
      // const response = await assignmentsAPI.getAssignments();
      // setAssignments(response.data);
      
    } catch (error) {
      console.error('Failed to fetch assignments:', error);
      // toast.error('Failed to load assignments');
    } finally {
      setLoading(false);
    }
  };

  /**
   * 🟢 API INTEGRATION POINT 2 - Delete Assignment
   * ==============================================
   * Delete an assignment by ID
   */
  const handleDeleteAssignment = async (assignmentId: string) => {
    if (window.confirm('Are you sure you want to delete this assignment?')) {
      try {
        // 🔴 MOCK IMPLEMENTATION - Remove when integrating API
        setAssignments(assignments.filter(a => a.id !== assignmentId));
        alert('Assignment deleted successfully');
        
        // 🟢 REAL API CALL - Uncomment when backend is ready
        // await assignmentsAPI.deleteAssignment(assignmentId);
        // setAssignments(assignments.filter(a => a.id !== assignmentId));
        // toast.success('Assignment deleted successfully');
        
      } catch (error) {
        console.error('Failed to delete assignment:', error);
        // toast.error('Failed to delete assignment');
      }
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'closed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string): string => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const getSubmissionPercentage = (submissions: number, totalStudents: number): number => {
    if (totalStudents === 0) return 0;
    return (submissions / totalStudents) * 100;
  };

  const getUniqueCourses = (): string[] => {
    const courses = assignments.map(a => a.course);
    return ['all', ...new Set(courses)];
  };

  const filteredAssignments = assignments.filter(a => {
    const matchesSearch = a.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || a.status === filterStatus;
    const matchesCourse = filterCourse === 'all' || a.course === filterCourse;
    return matchesSearch && matchesStatus && matchesCourse;
  });

  const activeCount = assignments.filter(a => a.status === 'active').length;
  const pendingSubmissions = assignments.reduce((sum, a) => sum + (a.totalStudents - a.submissions), 0);
  const totalSubmissions = assignments.reduce((sum, a) => sum + a.submissions, 0);

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
          <h1 className="text-2xl font-bold text-gray-900">Assignments</h1>
          <p className="text-gray-600 mt-1">Create and manage assignments</p>
        </div>
        <Button onClick={() => navigate('/tutor/assignments/create')}>
          <Plus className="w-4 h-4 mr-2" />
          Create Assignment
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Assignments</p>
              <p className="text-2xl font-bold text-gray-900">{activeCount}</p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <FileText className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending Submissions</p>
              <p className="text-2xl font-bold text-gray-900">{pendingSubmissions}</p>
            </div>
            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Submissions</p>
              <p className="text-2xl font-bold text-gray-900">{totalSubmissions}</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <Input
              placeholder="Search assignments..."
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
            <option value="draft">Draft</option>
            <option value="closed">Closed</option>
          </select>
          <select
            value={filterCourse}
            onChange={(e) => setFilterCourse(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
          >
            <option value="all">All Courses</option>
            {getUniqueCourses().filter(c => c !== 'all').map(course => (
              <option key={course} value={course}>{course}</option>
            ))}
          </select>
        </div>
      </Card>

      {/* Assignments List */}
      <div className="space-y-4">
        {filteredAssignments.map((assignment) => (
          <Card key={assignment.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center flex-wrap gap-2 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{assignment.title}</h3>
                  <Badge className={getStatusColor(assignment.status)}>
                    {getStatusText(assignment.status)}
                  </Badge>
                  <Badge variant="secondary" className="capitalize">
                    {assignment.type}
                  </Badge>
                </div>

                <p className="text-sm text-gray-600 mb-3">{assignment.course}</p>

                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <span className="flex items-center text-gray-500">
                    <Clock className="w-4 h-4 mr-1" />
                    Due: {format(new Date(assignment.dueDate), 'MMM d, yyyy')}
                  </span>
                  <span className="flex items-center text-gray-500">
                    <Users className="w-4 h-4 mr-1" />
                    {assignment.submissions}/{assignment.totalStudents} submitted
                  </span>
                  <span className="flex items-center text-gray-500">
                    <FileText className="w-4 h-4 mr-1" />
                    {assignment.totalPoints} points
                  </span>
                </div>

                <div className="mt-3">
                  <ProgressBar 
                    value={getSubmissionPercentage(assignment.submissions, assignment.totalStudents)} 
                    className="h-2"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {getSubmissionPercentage(assignment.submissions, assignment.totalStudents).toFixed(0)}% submission rate
                  </p>
                </div>
              </div>

              <div className="flex space-x-2 ml-4">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate(`/tutor/assignments/${assignment.id}/grade`)}
                >
                  Grade ({assignment.submissions})
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate(`/tutor/assignments/${assignment.id}`)}
                >
                  <Eye className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate(`/tutor/assignments/${assignment.id}/edit`)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDeleteAssignment(assignment.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredAssignments.length === 0 && (
        <Card className="p-12 text-center">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Assignments Found</h3>
          <p className="text-gray-500">
            {searchTerm 
              ? 'No assignments match your search criteria'
              : 'Create your first assignment to get started'}
          </p>
          {!searchTerm && (
            <Button 
              variant="primary" 
              className="mt-4"
              onClick={() => navigate('/tutor/assignments/create')}
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Assignment
            </Button>
          )}
        </Card>
      )}
    </div>
  );
};

// Quizzes.tsx (similar structure but for quizzes)
export const Quizzes: React.FC = () => {
  const navigate = useNavigate(); // Added missing navigate hook
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quizzes</h1>
          <p className="text-gray-600 mt-1">Create and manage quizzes</p>
        </div>
        <Button onClick={() => navigate('/tutor/quizzes/create')}>
          <Plus className="w-4 h-4 mr-2" />
          Create Quiz
        </Button>
      </div>
      <Card className="p-12 text-center">
        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Quiz Management</h3>
        <p className="text-gray-500">Quiz features coming soon</p>
      </Card>
    </div>
  );
};