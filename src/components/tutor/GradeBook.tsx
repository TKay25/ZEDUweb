import React, { useState } from 'react';
import {
  Search, ChevronDown,
  TrendingUp, TrendingDown, Minus, Eye,
  Award, Users
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';

interface StudentGrade {
  studentId: string;
  studentName: string;
  studentEmail: string;
  avatar?: string;
  grades: {
    assignmentId: string;
    assignmentName: string;
    score: number;
    total: number;
    percentage: number;
    submittedAt?: Date;
    gradedAt?: Date;
  }[];
  attendance: number;
  participation: number;
  overall: number;
  rank?: number;
  trend?: 'up' | 'down' | 'stable';
}

interface Assignment {
  id: string;
  name: string;
  type: 'assignment' | 'quiz' | 'exam';
  totalPoints: number;
  weight: number;
  dueDate: Date;
  gradedCount: number;
  totalCount: number;
}

interface GradeBookProps {
  courseId: string;
  courseName: string;
  students: StudentGrade[];
  assignments: Assignment[];
  onExport: (format: 'csv' | 'excel' | 'pdf') => void;
  onGradeAssignment: (assignmentId: string) => void;
  onViewStudent: (studentId: string) => void;
}

export const GradeBook: React.FC<GradeBookProps> = ({
  courseId: _courseId,
  courseName,
  students,
  assignments,
  onExport,
  onGradeAssignment,
  onViewStudent
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAssignment, setSelectedAssignment] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'grade'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Calculate statistics
  const classAverage = students.reduce((sum, s) => sum + s.overall, 0) / students.length;
  const highestGrade = Math.max(...students.map(s => s.overall));
  const lowestGrade = Math.min(...students.map(s => s.overall));
  const passRate = students.filter(s => s.overall >= 60).length / students.length * 100;

  // Options for selects
  const exportOptions = [
    { value: 'csv', label: 'CSV' },
    { value: 'excel', label: 'Excel' },
    { value: 'pdf', label: 'PDF' }
  ];

  const assignmentOptions = [
    { value: 'all', label: 'All Assignments' },
    ...assignments.map(a => ({ value: a.id, label: a.name }))
  ];

  const sortByOptions = [
    { value: 'name', label: 'Sort by Name' },
    { value: 'grade', label: 'Sort by Grade' }
  ];

  const filteredStudents = students
    .filter(student => 
      student.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentEmail.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'name') {
        return sortOrder === 'asc' 
          ? a.studentName.localeCompare(b.studentName)
          : b.studentName.localeCompare(a.studentName);
      } else {
        return sortOrder === 'asc'
          ? a.overall - b.overall
          : b.overall - a.overall;
      }
    });

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

  const getTrendIcon = (trend?: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-500" />;
      case 'stable': return <Minus className="w-4 h-4 text-gray-500" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{courseName} - Gradebook</h1>
          <p className="text-gray-600 mt-1">Manage and track student grades</p>
        </div>
        <div className="flex space-x-3">
          <Select
            value=""
            onChange={(e) => onExport(e.target.value as any)}
            options={exportOptions}
            placeholder="Export as..."
            className="w-32"
          />
          <Button variant="primary" onClick={() => onGradeAssignment('new')}>
            <Award className="w-4 h-4 mr-2" />
            Grade Assignment
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Class Average</p>
              <p className="text-2xl font-bold text-primary-600">
                {classAverage.toFixed(1)}%
              </p>
            </div>
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
              <Users className="w-5 h-5 text-primary-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Highest Grade</p>
              <p className="text-2xl font-bold text-green-600">
                {highestGrade.toFixed(1)}%
              </p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Lowest Grade</p>
              <p className="text-2xl font-bold text-red-600">
                {lowestGrade.toFixed(1)}%
              </p>
            </div>
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <TrendingDown className="w-5 h-5 text-red-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pass Rate</p>
              <p className="text-2xl font-bold text-blue-600">
                {passRate.toFixed(1)}%
              </p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Award className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select
            value={selectedAssignment}
            onChange={(e) => setSelectedAssignment(e.target.value)}
            options={assignmentOptions}
            className="w-48"
          />

          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'name' | 'grade')}
            options={sortByOptions}
            className="w-32"
          />

          <button
            onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ChevronDown className={`w-5 h-5 transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
          </button>

          <div className="flex border rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-primary-600 text-white' : 'hover:bg-gray-100'}`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-2 ${viewMode === 'list' ? 'bg-primary-600 text-white' : 'hover:bg-gray-100'}`}
            >
              List
            </button>
          </div>
        </div>
      </Card>

      {/* Grade Grid */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStudents.map((student) => (
            <Card
              key={student.studentId}
              className="p-4 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => onViewStudent(student.studentId)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center">
                  {student.avatar ? (
                    <img
                      src={student.avatar}
                      alt={student.studentName}
                      className="w-12 h-12 rounded-full mr-3"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-primary-100 rounded-full mr-3 flex items-center justify-center">
                      <Users className="w-6 h-6 text-primary-600" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold">{student.studentName}</h3>
                    <p className="text-sm text-gray-500">{student.studentEmail}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  {getTrendIcon(student.trend)}
                </div>
              </div>

              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500">Overall Grade</span>
                <span className={`text-2xl font-bold ${getGradeColor(student.overall)}`}>
                  {student.overall.toFixed(1)}%
                </span>
              </div>

              <div className="mb-3">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      student.overall >= 90 ? 'bg-green-500' :
                      student.overall >= 80 ? 'bg-blue-500' :
                      student.overall >= 70 ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}
                    style={{ width: `${student.overall}%` }}
                  />
                </div>
              </div>

              <div className="flex justify-between text-sm">
                <div>
                  <span className="text-gray-500">Attendance:</span>
                  <span className="ml-1 font-medium">{student.attendance}%</span>
                </div>
                <div>
                  <span className="text-gray-500">Rank:</span>
                  <span className="ml-1 font-medium">#{student.rank}</span>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Grade Letter</span>
                  <span className="font-bold text-lg">
                    {getGradeLetter(student.overall)}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        /* List View */
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  {assignments.map(a => (
                    <th key={a.id} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {a.name}
                      <div className="text-xs font-normal text-gray-400">
                        {a.gradedCount}/{a.totalCount} graded
                      </div>
                    </th>
                  ))}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Overall
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredStudents.map((student) => (
                  <tr key={student.studentId} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {student.avatar ? (
                          <img
                            src={student.avatar}
                            alt={student.studentName}
                            className="w-8 h-8 rounded-full mr-3"
                          />
                        ) : (
                          <div className="w-8 h-8 bg-primary-100 rounded-full mr-3 flex items-center justify-center">
                            <Users className="w-4 h-4 text-primary-600" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium">{student.studentName}</p>
                          <p className="text-sm text-gray-500">{student.studentEmail}</p>
                        </div>
                      </div>
                    </td>
                    {assignments.map(a => {
                      const grade = student.grades.find(g => g.assignmentId === a.id);
                      return (
                        <td key={a.id} className="px-6 py-4">
                          {grade ? (
                            <div>
                              <span className={`font-medium ${getGradeColor(grade.percentage)}`}>
                                {grade.score}/{grade.total}
                              </span>
                              <span className="text-xs text-gray-500 ml-1">
                                ({grade.percentage.toFixed(1)}%)
                              </span>
                            </div>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </td>
                      );
                    })}
                    <td className="px-6 py-4">
                      <span className={`text-lg font-bold ${getGradeColor(student.overall)}`}>
                        {student.overall.toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => onViewStudent(student.studentId)}
                        className="text-primary-600 hover:text-primary-700"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {filteredStudents.length === 0 && (
        <Card className="p-12 text-center">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-medium mb-2">No Students Found</h3>
          <p className="text-gray-500">
            No students match your search criteria
          </p>
        </Card>
      )}
    </div>
  );
};