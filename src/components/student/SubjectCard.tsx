// src/components/student/SubjectCard.tsx
import React, { useState } from 'react';
import {
  BookOpen, TrendingUp, TrendingDown, Minus,
  Clock, Award, ChevronRight, ChevronDown, ChevronUp,
  CheckCircle, AlertCircle, FileText
} from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import ProgressBar from '../ui/ProgressBar';

export interface Subject {
  id: string;
  name: string;
  code: string;
  teacher: {
    id: string;
    name: string;
    email?: string;
  };
  grade: number;
  previousGrade?: number;
  classAverage?: number;
  targetGrade?: number;
  attendance: number;
  assignments: Array<{
    id: string;
    name: string;
    score: number;
    maxScore: number;
    dueDate?: Date;
    status: 'pending' | 'submitted' | 'graded';
  }>;
  topics?: Array<{
    name: string;
    progress: number;
    mastery: number;
  }>;
  resources?: Array<{
    title: string;
    type: 'video' | 'document' | 'quiz';
    url: string;
  }>;
  recommendations?: string[];
}

interface SubjectCardProps {
  subject: Subject;
  onViewDetails?: (subjectId: string) => void;
  onViewAssignments?: (subjectId: string) => void;
  onViewResources?: (subjectId: string) => void;
  variant?: 'grid' | 'list' | 'compact';
  className?: string;
}

export const SubjectCard: React.FC<SubjectCardProps> = ({
  subject,
  onViewDetails,
  onViewAssignments,
  onViewResources: _onViewResources,
  variant = 'grid',
  className = ''
}) => {
  const [expanded, setExpanded] = useState(false);

  const getGradeColor = (grade: number) => {
    if (grade >= 90) return 'text-green-600';
    if (grade >= 80) return 'text-blue-600';
    if (grade >= 70) return 'text-yellow-600';
    if (grade >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  const getGradeLetter = (grade: number) => {
    if (grade >= 90) return 'A';
    if (grade >= 80) return 'B';
    if (grade >= 70) return 'C';
    if (grade >= 60) return 'D';
    return 'F';
  };

  const getTrendIcon = () => {
    if (!subject.previousGrade) return null;
    const diff = subject.grade - subject.previousGrade;
    if (diff > 0) return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (diff < 0) return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <Minus className="w-4 h-4 text-gray-500" />;
  };

  const getPendingAssignments = () => {
    return subject.assignments.filter(a => a.status === 'pending').length;
  };

  const getCompletedAssignments = () => {
    return subject.assignments.filter(a => a.status === 'graded').length;
  };

  const pendingCount = getPendingAssignments();
  const completedCount = getCompletedAssignments();
  const totalAssignments = subject.assignments.length;

  if (variant === 'list') {
    return (
      <div
        className={`flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border hover:shadow-md transition-shadow cursor-pointer ${className}`}
        onClick={() => onViewDetails?.(subject.id)}
      >
        <div className="flex items-center space-x-4 flex-1">
          <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-primary-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold">{subject.name}</h3>
              <span className="text-xs text-gray-500">{subject.code}</span>
            </div>
            <p className="text-sm text-gray-600">{subject.teacher.name}</p>
            {pendingCount > 0 && (
              <Badge variant="warning" size="sm" className="mt-1">
                {pendingCount} pending assignments
              </Badge>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className={`text-2xl font-bold ${getGradeColor(subject.grade)}`}>
              {subject.grade}%
            </div>
            <div className="text-sm text-gray-500">{getGradeLetter(subject.grade)}</div>
          </div>
          {getTrendIcon()}
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div
        className={`flex items-center space-x-3 p-3 bg-white dark:bg-gray-800 rounded-lg border hover:shadow-md transition-shadow cursor-pointer ${className}`}
        onClick={() => onViewDetails?.(subject.id)}
      >
        <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
          <BookOpen className="w-5 h-5 text-primary-600" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm truncate">{subject.name}</h4>
          <p className="text-xs text-gray-500">{subject.teacher.name}</p>
        </div>
        <div className={`text-lg font-bold ${getGradeColor(subject.grade)}`}>
          {subject.grade}%
        </div>
      </div>
    );
  }

  // Grid variant (default)
  return (
    <Card className={`overflow-hidden hover:shadow-lg transition-shadow ${className}`}>
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">{subject.name}</h3>
              <p className="text-sm text-gray-500">{subject.code}</p>
            </div>
          </div>
          <div className="text-right">
            <div className={`text-2xl font-bold ${getGradeColor(subject.grade)}`}>
              {subject.grade}%
            </div>
            <div className="flex items-center justify-end text-sm">
              <span className="text-gray-500 mr-1">{getGradeLetter(subject.grade)}</span>
              {getTrendIcon()}
            </div>
          </div>
        </div>

        {/* Teacher Info */}
        <div className="mb-3 text-sm">
          <p className="text-gray-600">Teacher: {subject.teacher.name}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <p className="text-lg font-bold text-blue-600">{subject.attendance}%</p>
            <p className="text-xs text-gray-500">Attendance</p>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <p className="text-lg font-bold text-green-600">{completedCount}/{totalAssignments}</p>
            <p className="text-xs text-gray-500">Assignments</p>
          </div>
          {subject.classAverage && (
            <div className="text-center p-2 bg-gray-50 rounded-lg">
              <p className="text-lg font-bold text-purple-600">{subject.classAverage}%</p>
              <p className="text-xs text-gray-500">Class Avg</p>
            </div>
          )}
        </div>

        {/* Progress to Target */}
        {subject.targetGrade !== undefined && (
          <div className="mb-4">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-600">Progress to Target</span>
              <span className="font-medium">{subject.grade}/{subject.targetGrade}%</span>
            </div>
            <ProgressBar 
              value={(subject.grade / subject.targetGrade) * 100} 
              color="blue" 
              className="h-1.5"
            />
          </div>
        )}

        {/* Performance vs Class Average */}
        {subject.classAverage && (
          <div className={`text-sm mb-3 flex items-center ${
            subject.grade > subject.classAverage ? 'text-green-600' : 
            subject.grade < subject.classAverage ? 'text-red-600' : 'text-gray-600'
          }`}>
            <Award className="w-4 h-4 mr-1" />
            {subject.grade > subject.classAverage ? (
              `${(subject.grade - subject.classAverage).toFixed(1)}% above class average`
            ) : subject.grade < subject.classAverage ? (
              `${(subject.classAverage - subject.grade).toFixed(1)}% below class average`
            ) : (
              'At class average'
            )}
          </div>
        )}

        {/* Pending Assignments Alert */}
        {pendingCount > 0 && (
          <div className="flex items-center p-2 bg-yellow-50 rounded-lg mb-3">
            <AlertCircle className="w-4 h-4 text-yellow-600 mr-2" />
            <span className="text-xs text-yellow-700">
              {pendingCount} assignment{pendingCount !== 1 ? 's' : ''} pending
            </span>
          </div>
        )}

        {/* Expandable Section */}
        {expanded && (
          <div className="mt-4 pt-4 border-t space-y-3">
            {/* Recent Assignments */}
            {subject.assignments.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">Recent Assignments</h4>
                <div className="space-y-2">
                  {subject.assignments.slice(0, 3).map((assignment) => (
                    <div key={assignment.id} className="flex justify-between items-center text-sm">
                      <div className="flex items-center">
                        {assignment.status === 'graded' ? (
                          <CheckCircle className="w-3 h-3 text-green-500 mr-2" />
                        ) : assignment.status === 'submitted' ? (
                          <Clock className="w-3 h-3 text-yellow-500 mr-2" />
                        ) : (
                          <AlertCircle className="w-3 h-3 text-red-500 mr-2" />
                        )}
                        <span className="text-gray-600">{assignment.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {assignment.status === 'graded' && (
                          <span className="font-medium">
                            {assignment.score}/{assignment.maxScore}
                          </span>
                        )}
                        <Badge variant="secondary" size="sm">
                          {assignment.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Topics Progress */}
            {subject.topics && subject.topics.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">Topics Progress</h4>
                <div className="space-y-2">
                  {subject.topics.slice(0, 3).map((topic, index) => (
                    <div key={index}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-600">{topic.name}</span>
                        <span className="font-medium">{topic.progress}%</span>
                      </div>
                      <ProgressBar value={topic.progress} color="blue" className="h-1" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations */}
            {subject.recommendations && subject.recommendations.length > 0 && (
              <div className="p-2 bg-blue-50 rounded-lg">
                <h4 className="text-xs font-medium text-blue-800 mb-1">Recommendations</h4>
                <ul className="text-xs text-blue-700 space-y-1">
                  {subject.recommendations.slice(0, 2).map((rec, index) => (
                    <li key={index}>• {rec}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-2 mt-4 pt-3 border-t">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onViewDetails?.(subject.id)}
          >
            Details
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onViewAssignments?.(subject.id)}
          >
            <FileText className="w-4 h-4 mr-1" />
            Assignments
          </Button>
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-2 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </Card>
  );
};

export default SubjectCard;