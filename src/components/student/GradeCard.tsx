import React from 'react';
import { TrendingUp, TrendingDown, Award, BookOpen } from 'lucide-react';
import { Card } from '../ui/Card';
import { ProgressBar } from '../ui/ProgressBar';

interface GradeCardProps {
  grade: {
    courseName: string;
    courseCode: string;
    overall: number;
    assignments: Array<{
      name: string;
      score: number;
      total: number;
      weight: number;
    }>;
    exams: Array<{
      name: string;
      score: number;
      total: number;
      weight: number;
    }>;
    attendance: number;
    rank?: {
      current: number;
      total: number;
      trend?: 'up' | 'down' | 'stable';
    };
    teacher: {
      name: string;
      email: string;
    };
    semester: string;
    academicYear: string;
  };
  onClick?: () => void;
}

// ProgressBar color type
type ProgressColor = 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'indigo';

export const GradeCard: React.FC<GradeCardProps> = ({ grade, onClick }) => {
  const calculateWeightedAverage = (items: Array<{ score: number; total: number; weight: number }>) => {
    if (items.length === 0) return 0;
    
    const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
    const weightedSum = items.reduce((sum, item) => 
      sum + ((item.score / item.total) * item.weight), 0
    );
    
    return (weightedSum / totalWeight) * 100;
  };

  const getGradeColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 80) return 'text-blue-600';
    if (percentage >= 70) return 'text-yellow-600';
    if (percentage >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  const getGradeLetter = (percentage: number) => {
    if (percentage >= 90) return 'A';
    if (percentage >= 80) return 'B';
    if (percentage >= 70) return 'C';
    if (percentage >= 60) return 'D';
    return 'F';
  };

  // Get progress bar color based on percentage
  const getProgressColor = (percentage: number): ProgressColor => {
    if (percentage >= 90) return 'green';
    if (percentage >= 70) return 'blue';
    if (percentage >= 50) return 'yellow';
    return 'red';
  };

  const assignmentAverage = calculateWeightedAverage(grade.assignments);
  const examAverage = calculateWeightedAverage(grade.exams);
  const finalGrade = grade.overall;

  return (
    <Card 
      className="hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold">{grade.courseName}</h3>
            <p className="text-sm text-gray-500">{grade.courseCode}</p>
          </div>
          <div className="text-right">
            <div className={`text-3xl font-bold ${getGradeColor(finalGrade)}`}>
              {finalGrade.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-500">Final Grade</div>
          </div>
        </div>

        {/* Grade Letter Badge */}
        <div className="mb-4 flex justify-between items-center">
          <div className="flex items-center">
            <Award className="w-5 h-5 text-yellow-500 mr-2" />
            <span className="text-2xl font-bold">{getGradeLetter(finalGrade)}</span>
          </div>
          
          {grade.rank && (
            <div className="flex items-center text-sm">
              <span className="text-gray-600 mr-1">Class Rank:</span>
              <span className="font-semibold">#{grade.rank.current}</span>
              <span className="text-gray-500 mx-1">/</span>
              <span className="text-gray-500">{grade.rank.total}</span>
              {grade.rank.trend && (
                <span className="ml-2">
                  {grade.rank.trend === 'up' && <TrendingUp className="w-4 h-4 text-green-500" />}
                  {grade.rank.trend === 'down' && <TrendingDown className="w-4 h-4 text-red-500" />}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Grade Breakdown */}
        <div className="space-y-3 mb-4">
          {/* Assignments */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Assignments</span>
              <span className="font-medium">{assignmentAverage.toFixed(1)}%</span>
            </div>
            <ProgressBar 
              value={assignmentAverage} 
              color={getProgressColor(assignmentAverage)}
              className="h-2"
            />
          </div>

          {/* Exams */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Exams</span>
              <span className="font-medium">{examAverage.toFixed(1)}%</span>
            </div>
            <ProgressBar 
              value={examAverage} 
              color={getProgressColor(examAverage)}
              className="h-2"
            />
          </div>

          {/* Attendance */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Attendance</span>
              <span className="font-medium">{grade.attendance}%</span>
            </div>
            <ProgressBar 
              value={grade.attendance} 
              color={getProgressColor(grade.attendance)}
              className="h-2"
            />
          </div>
        </div>

        {/* Assignment List */}
        <div className="mb-4">
          <h4 className="text-sm font-medium mb-2 flex items-center">
            <BookOpen className="w-4 h-4 mr-1" />
            Recent Assignments
          </h4>
          <div className="space-y-2">
            {grade.assignments.slice(0, 3).map((assignment, index) => (
              <div key={index} className="flex justify-between items-center text-sm">
                <span className="text-gray-600 truncate flex-1">{assignment.name}</span>
                <span className="font-medium">
                  {assignment.score}/{assignment.total}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center pt-4 border-t text-sm">
          <div>
            <p className="text-gray-600">{grade.teacher.name}</p>
            <p className="text-gray-400 text-xs">{grade.semester} {grade.academicYear}</p>
          </div>
          <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
            View Details →
          </button>
        </div>
      </div>
    </Card>
  );
};