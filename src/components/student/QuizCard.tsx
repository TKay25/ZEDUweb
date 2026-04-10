import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { 
  HelpCircle, Clock, Award, AlertTriangle, 
  CheckCircle, ChevronRight 
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { ProgressBar } from '../ui/ProgressBar';

interface QuizCardProps {
  quiz: {
    id: string;
    title: string;
    description: string;
    questions: Array<{
      id: string;
      type: 'multiple-choice' | 'true-false' | 'short-answer';
      question: string;
      options?: string[];
      correctAnswer?: string | string[];
      points: number;
    }>;
    timeLimit?: number; // in minutes
    dueDate?: Date;
    attemptsAllowed: number;
    attemptsMade: number;
    passingScore: number;
    bestScore?: number;
    lastAttempt?: Date;
    status: 'not-started' | 'in-progress' | 'completed' | 'overdue';
  };
  onStart?: (quizId: string) => void;
  onReview?: (quizId: string) => void;
}

export const QuizCard: React.FC<QuizCardProps> = ({
  quiz,
  onStart,
  onReview
}) => {
  const [showDetails, setShowDetails] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'not-started': return 'bg-gray-100 text-gray-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'not-started': return <HelpCircle className="w-4 h-4" />;
      case 'in-progress': return <Clock className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'overdue': return <AlertTriangle className="w-4 h-4" />;
      default: return null;
    }
  };

  const calculateProgress = () => {
    if (quiz.status === 'completed') return 100;
    if (quiz.status === 'in-progress') return 50;
    if (quiz.attemptsMade > 0) return (quiz.attemptsMade / quiz.attemptsAllowed) * 100;
    return 0;
  };

  const isOverdue = quiz.dueDate && new Date() > new Date(quiz.dueDate) && quiz.status !== 'completed';

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center mb-2">
              <Award className="w-5 h-5 text-primary-600 mr-2" />
              <h3 className="text-lg font-semibold">{quiz.title}</h3>
            </div>
            
            <div className="flex items-center space-x-3 mb-3">
              <Badge className={getStatusColor(isOverdue ? 'overdue' : quiz.status)}>
                <span className="flex items-center">
                  {getStatusIcon(isOverdue ? 'overdue' : quiz.status)}
                  <span className="ml-1 capitalize">
                    {isOverdue ? 'overdue' : quiz.status.replace('-', ' ')}
                  </span>
                </span>
              </Badge>

              {quiz.bestScore !== undefined && (
                <Badge variant="secondary">
                  Best: {quiz.bestScore}%
                </Badge>
              )}
            </div>
          </div>

          {quiz.bestScore !== undefined && (
            <div className="text-right">
              <div className="text-2xl font-bold text-primary-600">
                {quiz.bestScore}%
              </div>
              <div className="text-xs text-gray-500">Best Score</div>
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4">{quiz.description}</p>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="flex items-center justify-center text-gray-600 mb-1">
              <HelpCircle className="w-4 h-4 mr-1" />
            </div>
            <div className="font-semibold">{quiz.questions.length}</div>
            <div className="text-xs text-gray-500">Questions</div>
          </div>

          {quiz.timeLimit && (
            <div className="text-center">
              <div className="flex items-center justify-center text-gray-600 mb-1">
                <Clock className="w-4 h-4 mr-1" />
              </div>
              <div className="font-semibold">{quiz.timeLimit} min</div>
              <div className="text-xs text-gray-500">Time Limit</div>
            </div>
          )}

          <div className="text-center">
            <div className="flex items-center justify-center text-gray-600 mb-1">
              <Award className="w-4 h-4 mr-1" />
            </div>
            <div className="font-semibold">{quiz.passingScore}%</div>
            <div className="text-xs text-gray-500">Passing</div>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">Progress</span>
            <span className="font-medium">
              {quiz.attemptsMade}/{quiz.attemptsAllowed} attempts
            </span>
          </div>
          <ProgressBar value={calculateProgress()} className="h-2" />
        </div>

        {/* Due Date */}
        {quiz.dueDate && (
          <div className="flex items-center justify-between text-sm mb-4 p-3 bg-gray-50 rounded-lg">
            <span className="text-gray-600">Due:</span>
            <span className={`font-medium ${isOverdue ? 'text-red-600' : 'text-gray-900'}`}>
              {formatDistanceToNow(new Date(quiz.dueDate), { addSuffix: true })}
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-3">
          {quiz.status === 'completed' ? (
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => onReview?.(quiz.id)}
            >
              Review Answers
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button 
              variant="primary" 
              className="flex-1"
              onClick={() => onStart?.(quiz.id)}
              disabled={isOverdue || quiz.attemptsMade >= quiz.attemptsAllowed}
            >
              {quiz.attemptsMade === 0 ? 'Start Quiz' : 'Retry Quiz'}
            </Button>
          )}

          <Button 
            variant="ghost" 
            onClick={() => setShowDetails(!showDetails)}
          >
            Details
          </Button>
        </div>

        {/* Expanded Details */}
        {showDetails && (
          <div className="mt-4 pt-4 border-t">
            <h4 className="font-medium mb-3">Questions Overview</h4>
            <div className="space-y-2">
              {quiz.questions.map((question, index) => (
                <div key={question.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div className="flex items-center">
                    <span className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs font-medium mr-3">
                      {index + 1}
                    </span>
                    <span className="text-sm">{question.question.substring(0, 50)}...</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" size="sm">
                      {question.type === 'multiple-choice' ? 'MC' : 
                       question.type === 'true-false' ? 'TF' : 'SA'}
                    </Badge>
                    <span className="text-xs text-gray-500">{question.points} pts</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};