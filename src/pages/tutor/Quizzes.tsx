import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
  HelpCircle,
  Plus,
  Edit,
  Trash2,
  Copy,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Search,
  Filter,
  ChevronRight,
  Calendar,
  Users,
  BarChart,
  Award,
  ListChecks,
  Target,
  RefreshCw
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { ProgressBar } from '../../components/ui/ProgressBar';
import toast from 'react-hot-toast';
import axios from 'axios';

// Simple Modal Component
const Modal: React.FC<{
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}> = ({ title, onClose, children, size = 'md' }) => {
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className={`bg-white rounded-lg shadow-xl w-full ${sizeClasses[size]} max-h-[90vh] overflow-y-auto`}>
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            ×
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

// Define interfaces
interface QuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation?: string;
}

interface Question {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer' | 'essay' | 'matching' | 'fill-blank';
  text: string;
  options?: QuestionOption[];
  correctAnswer?: string;
  points: number;
  explanation?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  image?: string;
  timeLimit?: number;
}

interface Quiz {
  id: string;
  title: string;
  description: string;
  courseId: string;
  courseName: string;
  thumbnail?: string;
  questions: Question[];
  totalPoints: number;
  timeLimit?: number;
  passingScore: number;
  attemptsAllowed: number;
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  showResults: 'immediately' | 'after-submission' | 'after-deadline' | 'never';
  status: 'published' | 'draft' | 'archived';
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  dueDate?: Date;
  availability: {
    startDate?: Date;
    endDate?: Date;
  };
  settings: {
    allowReview: boolean;
    showCorrectAnswers: boolean;
    showExplanations: boolean;
    randomizeOrder: boolean;
    requireProctor: boolean;
    timePerQuestion?: boolean;
  };
}

interface QuizAttempt {
  id: string;
  studentId: string;
  studentName: string;
  studentAvatar?: string;
  score: number;
  maxScore: number;
  percentage: number;
  passed: boolean;
  startedAt: Date;
  completedAt: Date;
  timeSpent: number;
  answers: Record<string, any>;
}

interface QuizStats {
  totalAttempts: number;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  passRate: number;
  averageTimeSpent: number;
  totalStudents: number;
  studentsAttempted: number;
  questionBreakdown: {
    questionId: string;
    questionText: string;
    correctCount: number;
    totalAttempts: number;
    percentageCorrect: number;
  }[];
}

export const Quizzes: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [showAttemptsModal, setShowAttemptsModal] = useState(false);
  const [quizStats, setQuizStats] = useState<QuizStats | null>(null);
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const API_BASE_URL = (window as any).process?.env?.REACT_APP_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    loadQuizzes();
  }, [courseId]);

  const showToastMessage = (message: string, type: 'success' | 'error') => {
    if (type === 'success') {
      toast.success(message);
    } else if (type === 'error') {
      toast.error(message);
    }
  };

  const loadQuizzes = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      try {
        const response = await axios.get(`${API_BASE_URL}/tutor/courses/${courseId}/quizzes`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setQuizzes(response.data);
      } catch (apiError) {
        console.log('Using mock data for quizzes');
        // Mock data
        const mockQuizzes: Quiz[] = [
          {
            id: 'quiz1',
            title: 'Calculus Fundamentals Quiz',
            description: 'Test your understanding of basic calculus concepts including limits, derivatives, and basic integration.',
            courseId: courseId || 'course1',
            courseName: 'Advanced Mathematics',
            questions: [
              {
                id: 'q1',
                type: 'multiple-choice',
                text: 'What is the derivative of x²?',
                options: [
                  { id: 'a', text: 'x', isCorrect: false },
                  { id: 'b', text: '2x', isCorrect: true },
                  { id: 'c', text: '2', isCorrect: false },
                  { id: 'd', text: 'x²', isCorrect: false }
                ],
                points: 10,
                difficulty: 'easy',
                tags: ['derivatives', 'calculus'],
                explanation: 'The derivative of x² is 2x using the power rule.'
              }
            ],
            totalPoints: 100,
            timeLimit: 30,
            passingScore: 70,
            attemptsAllowed: 3,
            shuffleQuestions: true,
            shuffleOptions: true,
            showResults: 'after-submission',
            status: 'published',
            createdAt: new Date(2024, 1, 1),
            updatedAt: new Date(2024, 1, 5),
            publishedAt: new Date(2024, 1, 6),
            dueDate: new Date(2024, 2, 1),
            availability: {
              startDate: new Date(2024, 1, 6),
              endDate: new Date(2024, 2, 1)
            },
            settings: {
              allowReview: true,
              showCorrectAnswers: true,
              showExplanations: true,
              randomizeOrder: true,
              requireProctor: false,
              timePerQuestion: false
            }
          },
          {
            id: 'quiz2',
            title: 'Linear Algebra Practice',
            description: 'Practice questions on matrices, vectors, and linear transformations.',
            courseId: courseId || 'course1',
            courseName: 'Advanced Mathematics',
            questions: [],
            totalPoints: 50,
            timeLimit: 20,
            passingScore: 60,
            attemptsAllowed: 2,
            shuffleQuestions: true,
            shuffleOptions: true,
            showResults: 'immediately',
            status: 'published',
            createdAt: new Date(2024, 1, 10),
            updatedAt: new Date(2024, 1, 12),
            publishedAt: new Date(2024, 1, 13),
            dueDate: new Date(2024, 2, 15),
            availability: {
              startDate: new Date(2024, 1, 13),
              endDate: new Date(2024, 2, 15)
            },
            settings: {
              allowReview: true,
              showCorrectAnswers: true,
              showExplanations: true,
              randomizeOrder: true,
              requireProctor: false,
              timePerQuestion: false
            }
          },
          {
            id: 'quiz3',
            title: 'Integration Techniques Quiz',
            description: 'Test your knowledge of various integration methods',
            courseId: courseId || 'course1',
            courseName: 'Advanced Mathematics',
            questions: [],
            totalPoints: 30,
            timeLimit: 15,
            passingScore: 70,
            attemptsAllowed: 3,
            shuffleQuestions: true,
            shuffleOptions: true,
            showResults: 'after-deadline',
            status: 'draft',
            createdAt: new Date(2024, 1, 15),
            updatedAt: new Date(2024, 1, 16),
            availability: {
              startDate: new Date(2024, 2, 1),
              endDate: new Date(2024, 2, 14)
            },
            settings: {
              allowReview: true,
              showCorrectAnswers: false,
              showExplanations: true,
              randomizeOrder: true,
              requireProctor: false,
              timePerQuestion: false
            }
          }
        ];
        setQuizzes(mockQuizzes);
      }
    } catch (error) {
      console.error('Failed to load quizzes:', error);
      showToastMessage('Failed to load quizzes', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadQuizStats = async (quizId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/tutor/quizzes/${quizId}/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setQuizStats(response.data);
    } catch (error) {
      console.error('Failed to load quiz stats:', error);
      // Mock stats
      const mockStats: QuizStats = {
        totalAttempts: 45,
        averageScore: 78.5,
        highestScore: 98,
        lowestScore: 45,
        passRate: 82,
        averageTimeSpent: 1250,
        totalStudents: 60,
        studentsAttempted: 45,
        questionBreakdown: [
          {
            questionId: 'q1',
            questionText: 'What is the derivative of x²?',
            correctCount: 38,
            totalAttempts: 45,
            percentageCorrect: 84.4
          }
        ]
      };
      setQuizStats(mockStats);
    }
  };

  const loadQuizAttempts = async (quizId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/tutor/quizzes/${quizId}/attempts`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAttempts(response.data);
    } catch (error) {
      console.error('Failed to load quiz attempts:', error);
      // Mock attempts
      const mockAttempts: QuizAttempt[] = [
        {
          id: 'attempt1',
          studentId: 'student1',
          studentName: 'John Smith',
          studentAvatar: '/avatars/john.jpg',
          score: 85,
          maxScore: 100,
          percentage: 85,
          passed: true,
          startedAt: new Date(2024, 1, 10, 10, 0),
          completedAt: new Date(2024, 1, 10, 10, 25),
          timeSpent: 1500,
          answers: {}
        },
        {
          id: 'attempt2',
          studentId: 'student2',
          studentName: 'Emma Wilson',
          studentAvatar: '/avatars/emma.jpg',
          score: 92,
          maxScore: 100,
          percentage: 92,
          passed: true,
          startedAt: new Date(2024, 1, 10, 11, 0),
          completedAt: new Date(2024, 1, 10, 11, 28),
          timeSpent: 1680,
          answers: {}
        }
      ];
      setAttempts(mockAttempts);
    }
  };

  const handleViewStats = async (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    await loadQuizStats(quiz.id);
    setShowStatsModal(true);
  };

  const handleViewAttempts = async (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    await loadQuizAttempts(quiz.id);
    setShowAttemptsModal(true);
  };

  const handleDeleteQuiz = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (selectedQuiz) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${API_BASE_URL}/tutor/quizzes/${selectedQuiz.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setQuizzes(quizzes.filter(q => q.id !== selectedQuiz.id));
        showToastMessage('Quiz deleted successfully', 'success');
      } catch (error) {
        console.error('Failed to delete quiz:', error);
        showToastMessage('Failed to delete quiz', 'error');
      }
      setShowDeleteModal(false);
      setSelectedQuiz(null);
    }
  };

  const handleDuplicateQuiz = async (quiz: Quiz) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_BASE_URL}/tutor/quizzes/${quiz.id}/duplicate`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setQuizzes([...quizzes, response.data]);
      showToastMessage('Quiz duplicated successfully', 'success');
    } catch (error) {
      console.error('Failed to duplicate quiz:', error);
      showToastMessage('Failed to duplicate quiz', 'error');
    }
  };

  const getStatusBadge = (status: Quiz['status']) => {
    switch (status) {
      case 'published':
        return <Badge variant="success" className="bg-green-100 text-green-800">Published</Badge>;
      case 'draft':
        return <Badge variant="warning" className="bg-yellow-100 text-yellow-800">Draft</Badge>;
      case 'archived':
        return <Badge variant="secondary" className="bg-gray-100 text-gray-800">Archived</Badge>;
    }
  };

  const formatTime = (minutes?: number) => {
    if (!minutes) return 'No time limit';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins} min`;
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    
    if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  const filteredQuizzes = quizzes
    .filter(quiz => {
      if (filterStatus !== 'all' && quiz.status !== filterStatus) return false;
      if (searchTerm) {
        return quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
               quiz.description.toLowerCase().includes(searchTerm.toLowerCase());
      }
      return true;
    });

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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
            <Link to="/tutor/courses" className="hover:text-primary-600">Courses</Link>
            <ChevronRight className="w-4 h-4" />
            <Link to={`/tutor/courses/${courseId}`} className="hover:text-primary-600">Course Details</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900">Quizzes</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Quiz Management</h1>
          <p className="text-gray-600 mt-1">
            Create and manage quizzes for your course
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={loadQuizzes}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={() => navigate(`/tutor/courses/${courseId}/quizzes/create`)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Quiz
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Quizzes</p>
              <p className="text-2xl font-bold text-gray-900">{quizzes.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <HelpCircle className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Published</p>
              <p className="text-2xl font-bold text-green-600">
                {quizzes.filter(q => q.status === 'published').length}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Drafts</p>
              <p className="text-2xl font-bold text-yellow-600">
                {quizzes.filter(q => q.status === 'draft').length}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <ListChecks className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Questions</p>
              <p className="text-2xl font-bold text-purple-600">
                {quizzes.reduce((sum, q) => sum + q.questions.length, 0)}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Target className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border-gray-300 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search quizzes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500 w-full sm:w-64"
              />
            </div>
            <div className="flex items-center border rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-gray-100 text-primary-600' : 'text-gray-400'}`}
              >
                <div className="grid grid-cols-2 gap-0.5">
                  <div className="w-2 h-2 bg-current rounded" />
                  <div className="w-2 h-2 bg-current rounded" />
                  <div className="w-2 h-2 bg-current rounded" />
                  <div className="w-2 h-2 bg-current rounded" />
                </div>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-gray-100 text-primary-600' : 'text-gray-400'}`}
              >
                <div className="w-4 h-4 flex flex-col justify-between">
                  <div className="w-full h-0.5 bg-current" />
                  <div className="w-full h-0.5 bg-current" />
                  <div className="w-full h-0.5 bg-current" />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Quiz Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredQuizzes.map((quiz) => (
              <Card key={quiz.id} className="hover:shadow-lg transition-shadow">
                <div className="w-full h-40 bg-gradient-to-br from-primary-100 to-primary-200 rounded-t-lg flex items-center justify-center">
                  <HelpCircle className="w-16 h-16 text-primary-400" />
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        {getStatusBadge(quiz.status)}
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                          {quiz.questions.length} questions
                        </Badge>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {quiz.title}
                      </h3>
                      <p className="text-sm text-gray-500 line-clamp-2">
                        {quiz.description}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="w-4 h-4 mr-2" />
                      {formatTime(quiz.timeLimit)}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Target className="w-4 h-4 mr-2" />
                      Passing Score: {quiz.passingScore}%
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Award className="w-4 h-4 mr-2" />
                      Total Points: {quiz.totalPoints}
                    </div>
                    {quiz.dueDate && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        Due: {new Date(quiz.dueDate).toLocaleDateString()}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/tutor/courses/${courseId}/quizzes/${quiz.id}/edit`)}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleViewStats(quiz)}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                        title="View Statistics"
                      >
                        <BarChart className="w-4 h-4 text-gray-500" />
                      </button>
                      <button
                        onClick={() => handleViewAttempts(quiz)}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                        title="View Attempts"
                      >
                        <Users className="w-4 h-4 text-gray-500" />
                      </button>
                      <button
                        onClick={() => handleDuplicateQuiz(quiz)}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                        title="Duplicate Quiz"
                      >
                        <Copy className="w-4 h-4 text-gray-500" />
                      </button>
                      <button
                        onClick={() => handleDeleteQuiz(quiz)}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                        title="Delete Quiz"
                      >
                        <Trash2 className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredQuizzes.map((quiz) => (
              <Card key={quiz.id} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="p-2 bg-primary-100 rounded-lg">
                        <HelpCircle className="w-5 h-5 text-primary-600" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold text-gray-900">{quiz.title}</h3>
                          {getStatusBadge(quiz.status)}
                        </div>
                        <p className="text-sm text-gray-500">{quiz.description}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 ml-12">
                      <span className="flex items-center">
                        <ListChecks className="w-4 h-4 mr-1" />
                        {quiz.questions.length} questions
                      </span>
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {formatTime(quiz.timeLimit)}
                      </span>
                      <span className="flex items-center">
                        <Target className="w-4 h-4 mr-1" />
                        Pass: {quiz.passingScore}%
                      </span>
                      <span className="flex items-center">
                        <Award className="w-4 h-4 mr-1" />
                        {quiz.totalPoints} pts
                      </span>
                      {quiz.dueDate && (
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          Due: {new Date(quiz.dueDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/tutor/courses/${courseId}/quizzes/${quiz.id}/preview`)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Preview
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => navigate(`/tutor/courses/${courseId}/quizzes/${quiz.id}/edit`)}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {filteredQuizzes.length === 0 && (
          <div className="text-center py-12">
            <HelpCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No quizzes found</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || filterStatus !== 'all'
                ? 'Try adjusting your filters'
                : 'Get started by creating your first quiz'}
            </p>
            {!searchTerm && filterStatus === 'all' && (
              <Button onClick={() => navigate(`/tutor/courses/${courseId}/quizzes/create`)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Quiz
              </Button>
            )}
          </div>
        )}
      </Card>

      {/* Quiz Statistics Modal */}
      {showStatsModal && selectedQuiz && quizStats && (
        <Modal
          title={`Statistics: ${selectedQuiz.title}`}
          onClose={() => {
            setShowStatsModal(false);
            setSelectedQuiz(null);
            setQuizStats(null);
          }}
          size="lg"
        >
          <div className="space-y-6">
            {/* Overview Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-900">{quizStats.totalAttempts}</p>
                <p className="text-xs text-gray-500">Total Attempts</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">{quizStats.averageScore}%</p>
                <p className="text-xs text-gray-500">Avg Score</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">{quizStats.passRate}%</p>
                <p className="text-xs text-gray-500">Pass Rate</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-purple-600">
                  {Math.round(quizStats.averageTimeSpent / 60)} min
                </p>
                <p className="text-xs text-gray-500">Avg Time</p>
              </div>
            </div>

            {/* Participation */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Student Participation</span>
                <span className="text-sm text-gray-500">
                  {quizStats.studentsAttempted}/{quizStats.totalStudents} students
                </span>
              </div>
              <ProgressBar
                value={(quizStats.studentsAttempted / quizStats.totalStudents) * 100}
                className="h-2"
              />
            </div>

            {/* Question Breakdown */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Question Performance</h3>
              <div className="space-y-4">
                {quizStats.questionBreakdown.map((q, index) => (
                  <div key={q.questionId} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <span className="text-sm text-gray-500">Question {index + 1}</span>
                        <p className="font-medium text-gray-900">{q.questionText}</p>
                      </div>
                      <Badge
                        className={
                          q.percentageCorrect >= 70
                            ? 'bg-green-100 text-green-800'
                            : q.percentageCorrect >= 50
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }
                      >
                        {q.percentageCorrect}% correct
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">
                        {q.correctCount}/{q.totalAttempts} correct
                      </span>
                      <ProgressBar
                        value={q.percentageCorrect}
                        className="w-32 h-2"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Quiz Attempts Modal */}
      {showAttemptsModal && selectedQuiz && (
        <Modal
          title={`Student Attempts: ${selectedQuiz.title}`}
          onClose={() => {
            setShowAttemptsModal(false);
            setSelectedQuiz(null);
            setAttempts([]);
          }}
          size="lg"
        >
          <div className="space-y-4">
            {attempts.map((attempt) => (
              <Card key={attempt.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar
                      src={attempt.studentAvatar}
                      name={attempt.studentName}
                      size="md"
                    />
                    <div>
                      <h4 className="font-medium text-gray-900">{attempt.studentName}</h4>
                      <div className="flex items-center space-x-3 text-sm text-gray-500">
                        <span className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {formatDuration(attempt.timeSpent)}
                        </span>
                        <span>
                          {new Date(attempt.completedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl font-bold text-gray-900">
                        {attempt.percentage}%
                      </span>
                      {attempt.passed ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                    </div>
                    <p className="text-sm text-gray-500">
                      Score: {attempt.score}/{attempt.maxScore}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedQuiz && (
        <Modal
          title="Delete Quiz"
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedQuiz(null);
          }}
        >
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Are you sure?</h3>
            <p className="text-gray-500 mb-6">
              You are about to delete "{selectedQuiz.title}". This action cannot be undone.
              All student attempts and data associated with this quiz will be permanently deleted.
            </p>
            <div className="flex justify-center space-x-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedQuiz(null);
                }}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={confirmDelete}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Quiz
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Quizzes;