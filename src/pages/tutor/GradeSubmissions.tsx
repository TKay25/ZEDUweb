import React, { useState, useEffect } from 'react';
import {
  Download, CheckCircle,
  Clock, AlertCircle, ChevronRight
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import AssignmentGrader from '../../components/tutor/AssignmentGrader';
import toast from 'react-hot-toast';
import axios from 'axios';

// Simple Select component
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

interface Submission {
  id: string;
  student: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  assignment: {
    id: string;
    title: string;
    totalPoints: number;
  };
  submittedAt: Date;
  content: string;
  attachments: Array<{
    name: string;
    url: string;
    size: number;
  }>;
  status: 'pending' | 'graded' | 'late';
  grade?: {
    points: number;
    feedback: string;
    gradedAt: Date;
  };
}

// Match the expected Submission type from AssignmentGrader
interface GraderSubmission {
  id: string;
  studentName: string;
  studentId: string;
  submittedAt: string;
  content: string;
  attachments: Array<{
    name: string;
    url: string;
    size: number;
  }>;
  grade?: number; // Changed from object to number (just the points)
}

export const GradeSubmissions: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedAssignment, setSelectedAssignment] = useState<{
    id: string;
    title: string;
    submissions: GraderSubmission[];
  } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const API_BASE_URL = (window as any).process?.env?.REACT_APP_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/tutor/submissions/pending`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Transform the data to match the Submission interface
      const transformedSubmissions = response.data.map((sub: any) => ({
        id: sub.id,
        student: {
          id: sub.studentId,
          name: sub.studentName,
          email: sub.studentEmail,
          avatar: sub.studentAvatar
        },
        assignment: {
          id: sub.assignmentId,
          title: sub.assignmentTitle,
          totalPoints: sub.totalPoints
        },
        submittedAt: new Date(sub.submittedAt),
        content: sub.content,
        attachments: sub.attachments || [],
        status: sub.status,
        grade: sub.grade
      }));
      
      setSubmissions(transformedSubmissions);
    } catch (error) {
      console.error('Failed to fetch submissions:', error);
      toast.error('Failed to load submissions');
      // Set mock data for demo
      setMockData();
    } finally {
      setLoading(false);
    }
  };

  const setMockData = () => {
    const mockSubmissions: Submission[] = [
      {
        id: '1',
        student: {
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          avatar: ''
        },
        assignment: {
          id: '1',
          title: 'Mathematics Assignment 1',
          totalPoints: 100
        },
        submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        content: 'Here is my solution to the calculus problems...',
        attachments: [
          { name: 'solution.pdf', url: '/uploads/solution.pdf', size: 1024000 }
        ],
        status: 'pending'
      },
      {
        id: '2',
        student: {
          id: '2',
          name: 'Jane Smith',
          email: 'jane@example.com',
          avatar: ''
        },
        assignment: {
          id: '1',
          title: 'Mathematics Assignment 1',
          totalPoints: 100
        },
        submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        content: 'My answers for all questions...',
        attachments: [],
        status: 'pending'
      },
      {
        id: '3',
        student: {
          id: '3',
          name: 'Bob Johnson',
          email: 'bob@example.com',
          avatar: ''
        },
        assignment: {
          id: '2',
          title: 'Physics Quiz',
          totalPoints: 50
        },
        submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        content: 'Physics answers...',
        attachments: [
          { name: 'physics-answers.docx', url: '/uploads/physics.docx', size: 512000 }
        ],
        status: 'graded',
        grade: {
          points: 45,
          feedback: 'Good work!',
          gradedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
        }
      }
    ];
    setSubmissions(mockSubmissions);
  };

  const handleGradeSubmission = async (submissionId: string, grade: number, feedback: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE_URL}/tutor/submissions/${submissionId}/grade`, 
        { points: grade, feedback },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Update local state
      setSubmissions(submissions.map(s => 
        s.id === submissionId 
          ? { 
              ...s, 
              status: 'graded', 
              grade: { 
                points: grade, 
                feedback, 
                gradedAt: new Date() 
              } 
            }
          : s
      ));
      
      toast.success('Grade submitted successfully');
      
      // Update the selected assignment submissions if it's open
      if (selectedAssignment) {
        const updatedSubmissions = selectedAssignment.submissions.map(s => 
          s.id === submissionId 
            ? { 
                ...s, 
                grade: grade // Store just the points number
              }
            : s
        );
        setSelectedAssignment({
          ...selectedAssignment,
          submissions: updatedSubmissions
        });
      }
    } catch (error) {
      console.error('Failed to submit grade:', error);
      toast.error('Failed to submit grade');
      throw error;
    }
  };

  const handleGradeAssignment = (assignmentId: string, assignmentTitle: string) => {
    // Get all submissions for this assignment
    const assignmentSubmissions = submissions
      .filter(s => s.assignment.id === assignmentId && s.status === 'pending')
      .map(s => ({
        id: s.id,
        studentName: s.student.name,
        studentId: s.student.id,
        submittedAt: s.submittedAt.toISOString(),
        content: s.content,
        attachments: s.attachments,
        grade: s.grade?.points // Extract just the points number if graded
      }));

    if (assignmentSubmissions.length === 0) {
      toast.error('No pending submissions for this assignment');
      return;
    }

    setSelectedAssignment({
      id: assignmentId,
      title: assignmentTitle,
      submissions: assignmentSubmissions
    });
  };

  const handleExportGrades = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/tutor/submissions/export`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `grades-export-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success('Grades exported successfully');
    } catch (error) {
      console.error('Failed to export grades:', error);
      toast.error('Failed to export grades');
    }
  };

  // Group submissions by assignment
  const assignments = submissions.reduce((acc, submission) => {
    const assignmentId = submission.assignment.id;
    if (!acc[assignmentId]) {
      acc[assignmentId] = {
        id: submission.assignment.id,
        title: submission.assignment.title,
        totalPoints: submission.assignment.totalPoints,
        totalSubmissions: 0,
        pendingSubmissions: 0,
        gradedSubmissions: 0
      };
    }
    acc[assignmentId].totalSubmissions++;
    if (submission.status === 'pending') acc[assignmentId].pendingSubmissions++;
    if (submission.status === 'graded') acc[assignmentId].gradedSubmissions++;
    return acc;
  }, {} as Record<string, any>);

  const pendingCount = submissions.filter(s => s.status === 'pending').length;
  const gradedCount = submissions.filter(s => s.status === 'graded').length;
  const lateCount = submissions.filter(s => s.status === 'late').length;

  const filteredAssignments = Object.values(assignments).filter(assignment => {
    const matchesSearch = assignment.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'pending' && assignment.pendingSubmissions > 0) ||
      (filterStatus === 'graded' && assignment.gradedSubmissions > 0);
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    );
  }

  if (selectedAssignment) {
    return (
      <AssignmentGrader
        assignmentId={selectedAssignment.id}
        assignmentTitle={selectedAssignment.title}
        submissions={selectedAssignment.submissions}
        onGrade={handleGradeSubmission}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Grade Submissions</h1>
          <p className="text-gray-600 mt-1">Review and grade student submissions</p>
        </div>
        <Button variant="outline" onClick={handleExportGrades}>
          <Download className="w-4 h-4 mr-2" />
          Export Grades
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Submissions</p>
              <p className="text-2xl font-bold">{submissions.length}</p>
            </div>
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
              <Download className="w-5 h-5 text-gray-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
            </div>
            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Graded</p>
              <p className="text-2xl font-bold text-green-600">{gradedCount}</p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Late</p>
              <p className="text-2xl font-bold text-red-600">{lateCount}</p>
            </div>
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-red-600" />
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
            />
          </div>
          <Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-40"
          >
            <option value="all">All Assignments</option>
            <option value="pending">Has Pending</option>
            <option value="graded">All Graded</option>
          </Select>
        </div>
      </Card>

      {/* Assignments List */}
      <div className="space-y-4">
        {filteredAssignments.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-gray-500">No assignments found</p>
          </Card>
        ) : (
          filteredAssignments.map((assignment) => (
            <Card key={assignment.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div className="flex-1">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{assignment.title}</h3>
                    <p className="text-sm text-gray-500 mb-3">
                      Total Points: {assignment.totalPoints}
                    </p>
                    
                    <div className="flex items-center space-x-4 text-sm flex-wrap gap-2">
                      <span className="text-gray-600">
                        📝 Total: {assignment.totalSubmissions} submissions
                      </span>
                      {assignment.pendingSubmissions > 0 && (
                        <Badge className="bg-yellow-100 text-yellow-800">
                          ⏳ {assignment.pendingSubmissions} pending
                        </Badge>
                      )}
                      {assignment.gradedSubmissions > 0 && (
                        <Badge className="bg-green-100 text-green-800">
                          ✓ {assignment.gradedSubmissions} graded
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <Button
                  variant="primary"
                  onClick={() => handleGradeAssignment(assignment.id, assignment.title)}
                  disabled={assignment.pendingSubmissions === 0}
                >
                  {assignment.pendingSubmissions === 0 ? 'All Graded' : 'Grade Submissions'}
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default GradeSubmissions;