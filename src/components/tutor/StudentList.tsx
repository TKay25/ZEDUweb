import React, { useState } from 'react';
import {
  Search, Mail, MessageCircle,
  Eye, User,
  GraduationCap, Calendar, Award
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { ProgressBar } from '../ui/ProgressBar';

interface Student {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  grade: string;
  attendance: number;
  averageGrade: number;
  courses: Array<{
    id: string;
    name: string;
    progress: number;
  }>;
  parent?: {
    name: string;
    email: string;
    phone: string;
  };
  lastActive: Date;
  status: 'active' | 'inactive' | 'suspended';
}

interface StudentListProps {
  students: Student[];
  onViewStudent: (studentId: string) => void;
  onContactStudent: (studentId: string) => void;
  onContactParent: (studentId: string) => void;
  onFilterChange: (filters: any) => void;
}

// Options for selects
const gradeOptions = [
  { value: 'all', label: 'All Grades' },
  { value: 'Form 1', label: 'Form 1' },
  { value: 'Form 2', label: 'Form 2' },
  { value: 'Form 3', label: 'Form 3' },
  { value: 'Form 4', label: 'Form 4' },
  { value: 'Form 5', label: 'Form 5' },
  { value: 'Form 6', label: 'Form 6' },
  { value: 'ECD', label: 'ECD' },
  { value: 'Tertiary', label: 'University' },
  { value: 'Vocational', label: 'Vocational' }
];

const statusOptions = [
  { value: 'all', label: 'All Status' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'suspended', label: 'Suspended' }
];

export const StudentList: React.FC<StudentListProps> = ({
  students,
  onViewStudent,
  onContactStudent,
  onContactParent,
  onFilterChange
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [sortBy] = useState<'name' | 'grade' | 'attendance'>('name');

  const filteredStudents = students
    .filter(student => {
      const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           student.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesGrade = selectedGrade === 'all' || student.grade === selectedGrade;
      const matchesStatus = selectedStatus === 'all' || student.status === selectedStatus;
      return matchesSearch && matchesGrade && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'grade') return b.averageGrade - a.averageGrade;
      return b.attendance - a.attendance;
    });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="col-span-2 relative">
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
            value={selectedGrade}
            onChange={(e) => {
              setSelectedGrade(e.target.value);
              onFilterChange({ grade: e.target.value });
            }}
            options={gradeOptions}
          />

          <Select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              onFilterChange({ status: e.target.value });
            }}
            options={statusOptions}
          />
        </div>
      </Card>

      {/* Student Cards */}
      <div className="space-y-4">
        {filteredStudents.map((student) => (
          <Card key={student.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              {/* Student Info */}
              <div className="flex-1">
                <div className="flex items-start">
                  <Avatar
                    src={student.avatar}
                    name={student.name}
                    size="lg"
                    className="mr-4"
                  />
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-semibold">{student.name}</h3>
                        <p className="text-sm text-gray-500">{student.email}</p>
                      </div>
                      <Badge className={getStatusColor(student.status)}>
                        {student.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center">
                        <GraduationCap className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-sm">{student.grade}</span>
                      </div>
                      <div className="flex items-center">
                        <Award className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-sm">Avg: {student.averageGrade}%</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-sm">Last active: {student.lastActive.toLocaleDateString()}</span>
                      </div>
                    </div>

                    {/* Courses */}
                    <div className="space-y-2 mb-4">
                      {student.courses.slice(0, 3).map((course) => (
                        <div key={course.id}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600">{course.name}</span>
                            <span className="font-medium">{course.progress}%</span>
                          </div>
                          <ProgressBar value={course.progress} color="blue" className="h-1.5" />
                        </div>
                      ))}
                    </div>

                    {/* Parent Contact */}
                    {student.parent && (
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm font-medium mb-2">Parent/Guardian</p>
                        <div className="flex items-center space-x-4 text-sm">
                          <span className="text-gray-600">{student.parent.name}</span>
                          <a href={`mailto:${student.parent.email}`} className="text-primary-600 hover:underline">
                            {student.parent.email}
                          </a>
                          <a href={`tel:${student.parent.phone}`} className="text-primary-600 hover:underline">
                            {student.parent.phone}
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-2 ml-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onViewStudent(student.id)}
                  title="View Details"
                >
                  <Eye className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onContactStudent(student.id)}
                  title="Message Student"
                >
                  <MessageCircle className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onContactParent(student.id)}
                  title="Contact Parent"
                >
                  <Mail className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredStudents.length === 0 && (
        <Card className="p-12 text-center">
          <User className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-medium mb-2">No Students Found</h3>
          <p className="text-gray-500">
            No students match your search criteria
          </p>
        </Card>
      )}
    </div>
  );
};