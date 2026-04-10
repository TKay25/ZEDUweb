import React, { useState, useEffect } from 'react';
import {
  HelpCircle, Award, TrendingUp,
  Search, Filter
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { QuizCard } from '../../components/student/QuizCard';
// TODO: Import toast for notifications when API is integrated
// import { toast } from 'react-hot-toast';
// TODO: Import quiz API when backend is ready
// import { quizAPI } from '../../api/quiz.api';

// Define interfaces matching QuizCardProps
interface Question {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer';  // Changed from string to union type
  question: string;
  options?: string[];
  correctAnswer?: string | string[];
  points: number;
}

interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  timeLimit?: number;  // in minutes
  dueDate?: Date;
  attemptsAllowed: number;
  attemptsMade: number;
  passingScore: number;
  bestScore?: number;
  lastAttempt?: Date;
  status: 'not-started' | 'in-progress' | 'completed' | 'overdue';  // Changed to match expected status values
}

interface QuizStats {
  total: number;
  available: number;
  inProgress: number;
  completed: number;
  overdue: number;
  averageScore: number;
}

// 🔴 MOCK DATA STARTS HERE
const MOCK_QUIZZES: Quiz[] = [
  {
    id: '1',
    title: 'Calculus Quiz 1: Limits',
    description: 'Test your understanding of limits and continuity',
    questions: [
      { 
        id: 'q1', 
        type: 'multiple-choice', 
        question: 'What is the limit of (x²-1)/(x-1) as x→1?', 
        options: ['0', '1', '2', 'undefined'], 
        correctAnswer: '2', 
        points: 10 
      },
      { 
        id: 'q2', 
        type: 'multiple-choice', 
        question: 'If f(x) = 3x² - 2x + 1, find f\'(x)', 
        options: ['3x - 2', '6x - 2', '6x + 2', '3x² - 2'], 
        correctAnswer: '6x - 2', 
        points: 10 
      }
    ],
    timeLimit: 30,
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    attemptsAllowed: 3,
    attemptsMade: 0,
    passingScore: 70,
    status: 'not-started'  // Changed from 'available' to 'not-started'
  },
  {
    id: '2',
    title: 'Physics Quiz: Newton\'s Laws',
    description: 'Test your knowledge of Newton\'s laws of motion',
    questions: [
      { 
        id: 'q1', 
        type: 'multiple-choice', 
        question: 'Newton\'s First Law is also known as:', 
        options: ['Law of Inertia', 'Law of Acceleration', 'Action-Reaction', 'Law of Gravity'], 
        correctAnswer: 'Law of Inertia', 
        points: 10 
      },
      { 
        id: 'q2', 
        type: 'true-false', 
        question: 'Newton\'s Second Law states that F = ma', 
        options: ['True', 'False'],
        correctAnswer: 'True', 
        points: 5 
      }
    ],
    timeLimit: 20,
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    attemptsAllowed: 2,
    attemptsMade: 1,
    passingScore: 75,
    status: 'in-progress',
    bestScore: 65,
    lastAttempt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
  },
  {
    id: '3',
    title: 'Chemistry Quiz: Periodic Table',
    description: 'Elements, groups, and periodic trends',
    questions: [
      { 
        id: 'q1', 
        type: 'multiple-choice', 
        question: 'What is the symbol for Gold?', 
        options: ['Go', 'Gd', 'Au', 'Ag'], 
        correctAnswer: 'Au', 
        points: 10 
      },
      { 
        id: 'q2', 
        type: 'short-answer', 
        question: 'What is the atomic number of Carbon?', 
        correctAnswer: '6', 
        points: 5 
      }
    ],
    timeLimit: 25,
    dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    attemptsAllowed: 2,
    attemptsMade: 2,
    passingScore: 80,
    status: 'completed',
    bestScore: 85,
    lastAttempt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
  },
  {
    id: '4',
    title: 'English Quiz: Shakespeare',
    description: 'Test your knowledge of Shakespeare\'s works',
    questions: [
      { 
        id: 'q1', 
        type: 'multiple-choice', 
        question: 'Who wrote "Romeo and Juliet"?', 
        options: ['Charles Dickens', 'William Shakespeare', 'Jane Austen', 'Mark Twain'], 
        correctAnswer: 'William Shakespeare', 
        points: 10 
      }
    ],
    timeLimit: 40,
    dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    attemptsAllowed: 2,
    attemptsMade: 0,
    passingScore: 70,
    status: 'overdue'  // 'overdue' is valid for QuizCardProps
  }
];
// 🔴 MOCK DATA ENDS HERE

export const Quizzes: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [filteredQuizzes, setFilteredQuizzes] = useState<Quiz[]>([]);
  const [activeTab, setActiveTab] = useState('not-started');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadQuizzes();
  }, []);

  useEffect(() => {
    // Filter quizzes based on tab and search
    let filtered = [...quizzes];

    // Filter by tab
    if (activeTab !== 'all') {
      filtered = filtered.filter(q => q.status === activeTab);
    }

    // Filter by search
    if (searchTerm) {
      filtered = filtered.filter(q => 
        q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredQuizzes(filtered);
  }, [activeTab, searchTerm, quizzes]);

  /**
   * 🟢 API INTEGRATION POINT 1 - Load Quizzes
   */
  const loadQuizzes = async () => {
    try {
      setLoading(true);
      
      // 🔴 MOCK DATA - Remove this when integrating API
      await new Promise(resolve => setTimeout(resolve, 1000));
      setQuizzes(MOCK_QUIZZES);
      setFilteredQuizzes(MOCK_QUIZZES);
      
      // 🟢 REAL API CALL - Uncomment when backend is ready
      // const response = await quizAPI.getStudentQuizzes();
      // setQuizzes(response.data);
      // setFilteredQuizzes(response.data);
      
    } catch (error) {
      console.error('Failed to load quizzes:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 🟢 API INTEGRATION POINT 2 - Start Quiz
   */
  const handleStartQuiz = async (quizId: string) => {
    try {
      // 🟢 REAL API CALL - Uncomment when backend is ready
      // const response = await quizAPI.startQuizAttempt(quizId);
      // window.location.href = `/student/quizzes/${quizId}/take/${response.data.attemptId}`;
      
      // 🔴 MOCK IMPLEMENTATION
      console.log('Starting quiz:', quizId);
      window.location.href = `/student/quizzes/${quizId}/take`;
      
    } catch (error) {
      console.error('Failed to start quiz:', error);
    }
  };

  /**
   * 🟢 API INTEGRATION POINT 3 - Review Quiz
   */
  const handleReviewQuiz = async (quizId: string) => {
    try {
      // 🟢 REAL API CALL - Uncomment when backend is ready
      // const response = await quizAPI.getQuizResults(quizId);
      // window.location.href = `/student/quizzes/${quizId}/review`;
      
      // 🔴 MOCK IMPLEMENTATION
      console.log('Reviewing quiz:', quizId);
      window.location.href = `/student/quizzes/${quizId}/review`;
      
    } catch (error) {
      console.error('Failed to load quiz review:', error);
    }
  };

  /**
   * Get Quiz Statistics
   */
  const getStats = (): QuizStats => {
    const stats = {
      total: quizzes.length,
      available: quizzes.filter(q => q.status === 'not-started').length,
      inProgress: quizzes.filter(q => q.status === 'in-progress').length,
      completed: quizzes.filter(q => q.status === 'completed').length,
      overdue: quizzes.filter(q => q.status === 'overdue').length,
      averageScore: 0
    };
    
    const quizzesWithScores = quizzes.filter(q => q.bestScore);
    if (quizzesWithScores.length > 0) {
      stats.averageScore = quizzesWithScores.reduce((acc, q) => acc + (q.bestScore || 0), 0) / quizzesWithScores.length;
    }
    
    return stats;
  };

  const stats = getStats();

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
          <h1 className="text-2xl font-bold text-gray-900">Quizzes</h1>
          <p className="text-gray-600 mt-1">
            Test your knowledge with interactive quizzes
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="p-4">
          <p className="text-sm text-gray-500">Total Quizzes</p>
          <p className="text-2xl font-bold">{stats.total}</p>
        </Card>
        <Card className="p-4 bg-green-50">
          <p className="text-sm text-green-700">Not Started</p>
          <p className="text-2xl font-bold text-green-700">{stats.available}</p>
        </Card>
        <Card className="p-4 bg-yellow-50">
          <p className="text-sm text-yellow-700">In Progress</p>
          <p className="text-2xl font-bold text-yellow-700">{stats.inProgress}</p>
        </Card>
        <Card className="p-4 bg-blue-50">
          <p className="text-sm text-blue-700">Completed</p>
          <p className="text-2xl font-bold text-blue-700">{stats.completed}</p>
        </Card>
        <Card className="p-4 bg-red-50">
          <p className="text-sm text-red-700">Overdue</p>
          <p className="text-2xl font-bold text-red-700">{stats.overdue}</p>
        </Card>
      </div>

      {/* Average Score Card */}
      <Card className="p-4 bg-primary-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Award className="w-8 h-8 text-primary-600" />
            <div>
              <p className="text-sm text-primary-700">Average Quiz Score</p>
              <p className="text-2xl font-bold text-primary-800">
                {stats.averageScore.toFixed(1)}%
              </p>
            </div>
          </div>
          <TrendingUp className="w-5 h-5 text-primary-600" />
        </div>
      </Card>

      {/* Search and Filters */}
      <Card className="p-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <Input
              placeholder="Search quizzes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="w-4 h-4" />}
            />
          </div>
          <select className="w-40 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white">
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

      {/* Custom Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: 'all', label: 'All' },
            { id: 'not-started', label: 'Not Started' },
            { id: 'in-progress', label: 'In Progress' },
            { id: 'completed', label: 'Completed' },
            { id: 'overdue', label: 'Overdue' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
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

      {/* Quizzes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredQuizzes.map((quiz) => (
          <QuizCard
            key={quiz.id}
            quiz={quiz}
            onStart={handleStartQuiz}
            onReview={handleReviewQuiz}
          />
        ))}
      </div>

      {filteredQuizzes.length === 0 && (
        <Card className="p-12 text-center">
          <HelpCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-medium mb-2">No Quizzes Found</h3>
          <p className="text-gray-500">
            {searchTerm 
              ? 'No quizzes match your search criteria'
              : 'You have no quizzes in this category'}
          </p>
        </Card>
      )}
    </div>
  );
};