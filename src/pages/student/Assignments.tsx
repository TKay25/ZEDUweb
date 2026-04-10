import React, { useState, useEffect } from 'react';
import {
  FileText, Search, Filter, Calendar
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import AssignmentItem from '../../components/student/AssignmentItem';

// Define the Assignment interface matching AssignmentItemProps
interface Attachment {
  id: string;
  name: string;
  url: string;
  size?: number;
  type: 'pdf' | 'doc' | 'image' | 'video' | 'other';
}

interface Rubric {
  criterion: string;
  points: number;
  description: string;
}

interface Submission {
  content: string;
  attachments: Attachment[];
  submittedAt: Date;
}

interface Grade {
  points: number;
  totalPoints: number;
  percentage: number;
  feedback: string;
  gradedAt: Date;
  gradedBy: string;
}

interface Assignment {
  id: string;
  title: string;
  description: string;
  course: string;
  courseName: string;
  dueDate: Date;
  totalPoints: number;
  status: 'pending' | 'submitted' | 'graded';
  submittedAt: Date | null;
  attachments?: Attachment[];
  rubric?: Rubric[];
  submission?: Submission;
  grade?: Grade;
}

export const Assignments: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [filteredAssignments, setFilteredAssignments] = useState<Assignment[]>([]);
  const [activeTab, setActiveTab] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('all');

  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = async () => {
    try {
      setLoading(true);
      // API calls would go here
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockAssignments: Assignment[] = [
        {
          id: '1',
          title: 'Calculus Problem Set',
          description: 'Complete problems 1-20 from Chapter 3: Limits and Continuity',
          course: 'Advanced Mathematics',
          courseName: 'Advanced Mathematics',
          dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
          totalPoints: 100,
          status: 'pending',
          submittedAt: null,
          attachments: [
            {
              id: 'att1',
              name: 'problem_set.pdf',
              url: '#',
              size: 2.5,
              type: 'pdf'
            }
          ],
          rubric: [
            { criterion: 'Correct answers', points: 70, description: 'Each correct answer earns 3.5 points' },
            { criterion: 'Work shown', points: 20, description: 'Clear step-by-step solutions' },
            { criterion: 'Formatting', points: 10, description: 'Proper mathematical notation' }
          ]
        },
        {
          id: '2',
          title: 'Physics Lab Report',
          description: 'Write a lab report on the pendulum experiment including methodology, data analysis, and conclusions',
          course: 'Physics Fundamentals',
          courseName: 'Physics Fundamentals',
          dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
          totalPoints: 50,
          status: 'pending',
          submittedAt: null,
          attachments: [
            {
              id: 'att2',
              name: 'lab_instructions.pdf',
              url: '#',
              size: 1.2,
              type: 'pdf'
            },
            {
              id: 'att3',
              name: 'data_template.xlsx',
              url: '#',
              size: 0.5,
              type: 'other'
            }
          ]
        },
        {
          id: '3',
          title: 'Essay: Shakespeare Analysis',
          description: 'Write a 1000-word analysis of themes in Hamlet',
          course: 'English Literature',
          courseName: 'English Literature',
          dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          totalPoints: 100,
          status: 'submitted',
          submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          submission: {
            content: 'Submitted essay content...',
            attachments: [
              {
                id: 'att4',
                name: 'hamlet_essay.pdf',
                url: '#',
                size: 0.8,
                type: 'pdf'
              }
            ],
            submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
          }
        },
        {
          id: '4',
          title: 'Chemistry Problem Set',
          description: 'Balance chemical equations and calculate molar masses',
          course: 'Chemistry Essentials',
          courseName: 'Chemistry Essentials',
          dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          totalPoints: 75,
          status: 'graded',
          submittedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          grade: {
            points: 68,
            totalPoints: 75,
            percentage: 90.7,
            feedback: 'Excellent work! Your equation balancing is perfect. Minor errors in molar mass calculations.',
            gradedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
            gradedBy: 'Dr. Tafadzwa Moyo'
          },
          submission: {
            content: 'Submitted assignment content...',
            attachments: [
              {
                id: 'att5',
                name: 'chemistry_solutions.pdf',
                url: '#',
                size: 1.1,
                type: 'pdf'
              }
            ],
            submittedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          }
        }
      ];

      setAssignments(mockAssignments);
      setFilteredAssignments(mockAssignments);
    } catch (error) {
      console.error('Failed to load assignments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Filter assignments based on tab, search, and course
    let filtered = [...assignments];

    // Filter by tab
    if (activeTab !== 'all') {
      filtered = filtered.filter(a => a.status === activeTab);
    }

    // Filter by search
    if (searchTerm) {
      filtered = filtered.filter(a => 
        a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.courseName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by course
    if (selectedCourse !== 'all') {
      filtered = filtered.filter(a => 
        a.courseName.toLowerCase().includes(selectedCourse.toLowerCase())
      );
    }

    setFilteredAssignments(filtered);
  }, [activeTab, searchTerm, assignments, selectedCourse]);

  const getStats = () => {
    const stats = {
      total: assignments.length,
      pending: assignments.filter(a => a.status === 'pending').length,
      submitted: assignments.filter(a => a.status === 'submitted').length,
      graded: assignments.filter(a => a.status === 'graded').length,
      overdue: assignments.filter(a => 
        a.status === 'pending' && new Date(a.dueDate) < new Date()
      ).length
    };
    return stats;
  };

  const stats = getStats();

  const handleAssignmentSubmit = async (assignmentId: string, data: FormData) => {
    console.log('Submitting assignment:', assignmentId, data);
    // API call would go here
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
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
          <p className="text-gray-600 mt-1">
            Track and submit your assignments
          </p>
        </div>
        <Button variant="outline">
          <Calendar className="w-4 h-4 mr-2" />
          Calendar View
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="p-4">
          <p className="text-sm text-gray-500">Total</p>
          <p className="text-2xl font-bold">{stats.total}</p>
        </Card>
        <Card className="p-4 bg-yellow-50">
          <p className="text-sm text-yellow-700">Pending</p>
          <p className="text-2xl font-bold text-yellow-700">{stats.pending}</p>
        </Card>
        <Card className="p-4 bg-red-50">
          <p className="text-sm text-red-700">Overdue</p>
          <p className="text-2xl font-bold text-red-700">{stats.overdue}</p>
        </Card>
        <Card className="p-4 bg-blue-50">
          <p className="text-sm text-blue-700">Submitted</p>
          <p className="text-2xl font-bold text-blue-700">{stats.submitted}</p>
        </Card>
        <Card className="p-4 bg-green-50">
          <p className="text-sm text-green-700">Graded</p>
          <p className="text-2xl font-bold text-green-700">{stats.graded}</p>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="p-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <Input
              placeholder="Search assignments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="w-4 h-4" />}
            />
          </div>
          
          {/* Native select dropdown with custom styling */}
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="w-40 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
          >
            <option value="all">All Courses</option>
            <option value="math">Mathematics</option>
            <option value="physics">Physics</option>
            <option value="chemistry">Chemistry</option>
            <option value="english">English Literature</option>
          </select>
          
          <Button variant="ghost">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
      </Card>

      {/* Custom Tab Component using native buttons */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('all')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'all'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'pending'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setActiveTab('submitted')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'submitted'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Submitted
          </button>
          <button
            onClick={() => setActiveTab('graded')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'graded'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Graded
          </button>
        </nav>
      </div>

      {/* Assignments List */}
      <div className="space-y-4">
        {filteredAssignments.map((assignment) => (
          <AssignmentItem
            key={assignment.id}
            id={assignment.id}
            title={assignment.title}
            description={assignment.description}
            courseName={assignment.courseName}
            dueDate={assignment.dueDate}
            totalPoints={assignment.totalPoints}
            status={assignment.status}
            //submittedAt={assignment.submittedAt}
            attachments={assignment.attachments}
            rubric={assignment.rubric}
            //submission={assignment.submission}
           // grade={assignment.grade}
            onSubmit={handleAssignmentSubmit}
          />
        ))}
      </div>

      {filteredAssignments.length === 0 && (
        <Card className="p-12 text-center">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-medium mb-2">No Assignments Found</h3>
          <p className="text-gray-500">
            {searchTerm 
              ? 'No assignments match your search criteria'
              : 'You have no assignments in this category'}
          </p>
        </Card>
      )}
    </div>
  );
};