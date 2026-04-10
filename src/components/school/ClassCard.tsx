import React, { useState } from 'react';
import {
  Users, BookOpen, Calendar,
  UserPlus, Eye, Edit,
  Trash2, TrendingUp, TrendingDown,
  MoreVertical
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Avatar } from '../ui/Avatar';
import { ProgressBar } from '../ui/ProgressBar';

interface ClassData {
  id: string;
  name: string;
  grade: string;
  stream?: string;
  academicYear: string;
  formTeacher: {
    id: string;
    name: string;
    avatar?: string;
  };
  students: Array<{
    id: string;
    name: string;
  }>;
  studentCount: number;
  capacity: number;
  subjects: Array<{
    id: string;
    name: string;
    teacher: string;
    hoursPerWeek: number;
  }>;
  schedule: {
    monday?: string;
    tuesday?: string;
    wednesday?: string;
    thursday?: string;
    friday?: string;
  };
  performance: {
    average: number;
    previousAverage?: number;
    topStudent?: string;
    passRate: number;
  };
  attendance: {
    average: number;
    today?: number;
  };
  status: 'active' | 'inactive' | 'archived';
}

interface ClassCardProps {
  classData: ClassData;
  variant?: 'grid' | 'list' | 'detail';
  onViewClass: (classId: string) => void;
  onEditClass: (classId: string) => void;
  onDeleteClass: (classId: string) => void;
  onManageStudents: (classId: string) => void;
  onViewTimetable: (classId: string) => void;
  onAddStudent: (classId: string) => void;
}

export const ClassCard: React.FC<ClassCardProps> = ({
  classData,
  variant = 'grid',
  onViewClass,
  onEditClass,
  onDeleteClass,
  onManageStudents,
  onViewTimetable,
  onAddStudent
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'archived': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPerformanceTrend = () => {
    if (!classData.performance.previousAverage) return null;
    const change = classData.performance.average - classData.performance.previousAverage;
    if (change > 0) {
      return <span className="text-green-600 flex items-center text-xs"><TrendingUp className="w-3 h-3 mr-1" />+{change.toFixed(1)}%</span>;
    } else if (change < 0) {
      return <span className="text-red-600 flex items-center text-xs"><TrendingDown className="w-3 h-3 mr-1" />{change.toFixed(1)}%</span>;
    }
    return null;
  };

  const occupancyRate = (classData.studentCount / classData.capacity) * 100;

  // Get progress bar color based on occupancy rate
  const getProgressColor = () => {
    if (occupancyRate >= 90) return 'yellow';
    return 'green';
  };

  // Grid View
  if (variant === 'grid') {
    return (
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
        {/* Header with Color */}
        <div className="h-2 bg-gradient-to-r from-primary-500 to-primary-600" />
        
        <div className="p-4">
          {/* Title and Status */}
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="text-lg font-semibold">{classData.name}</h3>
              <p className="text-sm text-gray-500">
                Grade {classData.grade} {classData.stream && `• Stream ${classData.stream}`}
              </p>
            </div>
            <Badge className={getStatusColor(classData.status)}>
              {classData.status}
            </Badge>
          </div>

          {/* Form Teacher */}
          <div className="flex items-center mb-4">
            <Avatar
              src={classData.formTeacher.avatar}
              name={classData.formTeacher.name}
              size="sm"
              className="mr-2"
            />
            <div>
              <p className="text-xs text-gray-500">Form Teacher</p>
              <p className="text-sm font-medium">{classData.formTeacher.name}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <div className="flex items-center text-gray-600 mb-1">
                <Users className="w-4 h-4 mr-1" />
                <span className="text-xs">Students</span>
              </div>
              <p className="text-lg font-semibold">{classData.studentCount}</p>
              <p className="text-xs text-gray-500">Capacity: {classData.capacity}</p>
            </div>
            <div>
              <div className="flex items-center text-gray-600 mb-1">
                <BookOpen className="w-4 h-4 mr-1" />
                <span className="text-xs">Subjects</span>
              </div>
              <p className="text-lg font-semibold">{classData.subjects.length}</p>
              <p className="text-xs text-gray-500">{classData.subjects.slice(0, 3).map(s => s.name).join(', ')}{classData.subjects.length > 3 ? '...' : ''}</p>
            </div>
          </div>

          {/* Occupancy Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-600">Occupancy</span>
              <span className="font-medium">{occupancyRate.toFixed(1)}%</span>
            </div>
            <ProgressBar 
              value={occupancyRate} 
              color={getProgressColor()}
              className="h-2"
            />
          </div>

          {/* Performance */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="text-center p-2 bg-gray-50 rounded">
              <p className="text-xs text-gray-500">Average</p>
              <p className={`text-lg font-semibold ${
                classData.performance.average >= 75 ? 'text-green-600' :
                classData.performance.average >= 60 ? 'text-yellow-600' :
                'text-red-600'
              }`}>
                {classData.performance.average}%
              </p>
              {getPerformanceTrend()}
            </div>
            <div className="text-center p-2 bg-gray-50 rounded">
              <p className="text-xs text-gray-500">Attendance</p>
              <p className="text-lg font-semibold text-blue-600">
                {classData.attendance.average}%
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => onViewClass(classData.id)}
            >
              <Eye className="w-4 h-4 mr-2" />
              View
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => onManageStudents(classData.id)}
            >
              <Users className="w-4 h-4 mr-2" />
              Students
            </Button>
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowMenu(!showMenu)}
              >
                <MoreVertical className="w-4 h-4" />
              </Button>
              
              {showMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-10">
                  <div className="py-1">
                    <button
                      onClick={() => {
                        onEditClass(classData.id);
                        setShowMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Class
                    </button>
                    <button
                      onClick={() => {
                        onViewTimetable(classData.id);
                        setShowMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center"
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Timetable
                    </button>
                    <button
                      onClick={() => {
                        onAddStudent(classData.id);
                        setShowMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center"
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      Add Student
                    </button>
                    <button
                      onClick={() => {
                        onDeleteClass(classData.id);
                        setShowMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center text-red-600"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Class
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    );
  }

  // List View
  if (variant === 'list') {
    return (
      <Card className="p-4 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1">
            <div className={`w-1 h-12 rounded-full ${
              classData.status === 'active' ? 'bg-green-500' :
              classData.status === 'inactive' ? 'bg-gray-400' : 'bg-yellow-500'
            }`} />
            
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold">{classData.name}</h3>
                <Badge size="sm" className={getStatusColor(classData.status)}>
                  {classData.status}
                </Badge>
              </div>
              <p className="text-sm text-gray-600">
                Grade {classData.grade} • Form Teacher: {classData.formTeacher.name}
              </p>
            </div>

            <div className="flex items-center space-x-6">
              <div className="text-center">
                <p className="text-sm text-gray-500">Students</p>
                <p className="font-semibold">{classData.studentCount}/{classData.capacity}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500">Average</p>
                <p className={`font-semibold ${
                  classData.performance.average >= 75 ? 'text-green-600' :
                  classData.performance.average >= 60 ? 'text-yellow-600' :
                  'text-red-600'
                }`}>
                  {classData.performance.average}%
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500">Attendance</p>
                <p className="font-semibold text-blue-600">{classData.attendance.average}%</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={() => onViewClass(classData.id)}>
              <Eye className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onEditClass(classData.id)}>
              <Edit className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setExpanded(!expanded)}>
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {expanded && (
          <div className="mt-4 pt-4 border-t grid grid-cols-3 gap-4">
            <div>
              <h4 className="text-xs font-medium text-gray-500 mb-2">Subjects</h4>
              <ul className="space-y-1">
                {classData.subjects.slice(0, 5).map(subject => (
                  <li key={subject.id} className="text-sm flex justify-between">
                    <span>{subject.name}</span>
                    <span className="text-gray-500">{subject.hoursPerWeek}h/w</span>
                  </li>
                ))}
                {classData.subjects.length > 5 && (
                  <li className="text-sm text-gray-500">+{classData.subjects.length - 5} more</li>
                )}
              </ul>
            </div>
            
            <div>
              <h4 className="text-xs font-medium text-gray-500 mb-2">Schedule</h4>
              <ul className="space-y-1 text-sm">
                <li>Mon: {classData.schedule.monday || '—'}</li>
                <li>Tue: {classData.schedule.tuesday || '—'}</li>
                <li>Wed: {classData.schedule.wednesday || '—'}</li>
                <li>Thu: {classData.schedule.thursday || '—'}</li>
                <li>Fri: {classData.schedule.friday || '—'}</li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-medium text-gray-500 mb-2">Performance</h4>
              <ul className="space-y-1 text-sm">
                <li>Pass Rate: {classData.performance.passRate}%</li>
                <li>Top Student: {classData.performance.topStudent || 'N/A'}</li>
                <li>Previous Avg: {classData.performance.previousAverage || 'N/A'}%</li>
              </ul>
            </div>
          </div>
        )}
      </Card>
    );
  }

  // Detail View
  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold">{classData.name}</h1>
            <p className="text-gray-600 mt-1">
              Grade {classData.grade} {classData.stream && `• Stream ${classData.stream}`} • {classData.academicYear}
            </p>
          </div>
          <Badge className={getStatusColor(classData.status)}>
            {classData.status}
          </Badge>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-4 mt-6">
          <div className="p-4 bg-gray-50 rounded-lg">
            <Users className="w-5 h-5 text-gray-500 mb-2" />
            <p className="text-sm text-gray-600">Total Students</p>
            <p className="text-2xl font-bold">{classData.studentCount}</p>
            <p className="text-xs text-gray-500">Capacity: {classData.capacity}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <BookOpen className="w-5 h-5 text-gray-500 mb-2" />
            <p className="text-sm text-gray-600">Subjects</p>
            <p className="text-2xl font-bold">{classData.subjects.length}</p>
            <p className="text-xs text-gray-500">Total hours: {classData.subjects.reduce((sum, s) => sum + s.hoursPerWeek, 0)}/week</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <TrendingUp className="w-5 h-5 text-gray-500 mb-2" />
            <p className="text-sm text-gray-600">Average Grade</p>
            <p className={`text-2xl font-bold ${
              classData.performance.average >= 75 ? 'text-green-600' :
              classData.performance.average >= 60 ? 'text-yellow-600' :
              'text-red-600'
            }`}>
              {classData.performance.average}%
            </p>
            {getPerformanceTrend()}
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <Calendar className="w-5 h-5 text-gray-500 mb-2" />
            <p className="text-sm text-gray-600">Attendance</p>
            <p className="text-2xl font-bold text-blue-600">{classData.attendance.average}%</p>
            <p className="text-xs text-gray-500">Today: {classData.attendance.today || 'N/A'}%</p>
          </div>
        </div>

        {/* Form Teacher */}
        <div className="mt-6 p-4 bg-primary-50 rounded-lg flex items-center">
          <Avatar
            src={classData.formTeacher.avatar}
            name={classData.formTeacher.name}
            size="lg"
            className="mr-4"
          />
          <div>
            <p className="text-sm text-primary-600">Form Teacher</p>
            <p className="text-lg font-semibold">{classData.formTeacher.name}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 mt-6">
          <Button variant="primary" onClick={() => onManageStudents(classData.id)}>
            <Users className="w-4 h-4 mr-2" />
            Manage Students
          </Button>
          <Button variant="outline" onClick={() => onViewTimetable(classData.id)}>
            <Calendar className="w-4 h-4 mr-2" />
            Timetable
          </Button>
          <Button variant="outline" onClick={() => onEditClass(classData.id)}>
            <Edit className="w-4 h-4 mr-2" />
            Edit Class
          </Button>
        </div>
      </Card>

      {/* Subjects List */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Subjects</h2>
        <div className="space-y-3">
          {classData.subjects.map((subject) => (
            <div key={subject.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">{subject.name}</p>
                <p className="text-sm text-gray-600">Teacher: {subject.teacher}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">{subject.hoursPerWeek} hours/week</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Student List Preview */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Students</h2>
          <Button variant="outline" size="sm" onClick={() => onAddStudent(classData.id)}>
            <UserPlus className="w-4 h-4 mr-2" />
            Add Student
          </Button>
        </div>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {classData.students.slice(0, 10).map((student) => (
            <div key={student.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
              <span>{student.name}</span>
              <Button variant="ghost" size="sm">
                <Eye className="w-4 h-4" />
              </Button>
            </div>
          ))}
          {classData.students.length > 10 && (
            <p className="text-center text-sm text-gray-500 pt-2">
              +{classData.students.length - 10} more students
            </p>
          )}
        </div>
      </Card>
    </div>
  );
};