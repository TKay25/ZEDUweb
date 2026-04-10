// src/pages/ministry/Students.tsx
import React, { useState, useEffect } from 'react';
import {
  Users, Search, Download,
  Eye, GraduationCap, MapPin,
  TrendingUp, School, BookOpen
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import ministryAPI from '../../api/ministry.api';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface Student {
  id: string;
  name: string;
  studentNumber: string;
  dateOfBirth: Date;
  gender: 'male' | 'female' | 'other';
  nationality: string;
  school: {
    id: string;
    name: string;
    district: string;
    province: string;
  };
  grade: string;
  class?: string;
  enrollmentDate: Date;
  status: 'active' | 'inactive' | 'graduated' | 'transferred';
  performance: {
    average: number;
    trend: number;
    rank?: number;
    subjects: Array<{
      name: string;
      score: number;
    }>;
  };
  attendance: {
    overall: number;
    trend: number;
  };
  parent: {
    name: string;
    email: string;
    phone: string;
  };
}

interface StudentStats {
  total: number;
  active: number;
  graduated: number;
  transferred: number;
  byGender: Array<{ gender: string; count: number }>;
  byGrade: Array<{ grade: string; count: number }>;
  byProvince: Array<{ province: string; count: number }>;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export const MinistryStudents: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<Student[]>([]);
  const [stats, setStats] = useState<StudentStats | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProvince, setSelectedProvince] = useState<string>('all');
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      const [studentsData, statsData] = await Promise.all([
        ministryAPI.getStudents(),
        ministryAPI.getStudentStats()
      ]);
      setStudents(studentsData);
      setStats(statsData);
    } catch (error) {
      toast.error('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = async () => {
    try {
      await ministryAPI.exportStudentData();
      toast.success('Student data exported successfully');
    } catch (error) {
      toast.error('Failed to export data');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'graduated': return 'bg-blue-100 text-blue-800';
      case 'transferred': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.school.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesProvince = selectedProvince === 'all' || student.school.province.toLowerCase() === selectedProvince;
    const matchesGrade = selectedGrade === 'all' || student.grade === selectedGrade;
    
    return matchesSearch && matchesProvince && matchesGrade;
  });

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold">National Student Registry</h1>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handleExportData}>
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
          <div className="flex border rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-2 text-sm ${
                viewMode === 'grid' 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-2 text-sm ${
                viewMode === 'list' 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              List
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Students</p>
              <p className="text-2xl font-bold">{stats.total.toLocaleString()}</p>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </div>
        </Card>
        <Card className="p-4 bg-green-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600">Active</p>
              <p className="text-2xl font-bold text-green-700">{stats.active.toLocaleString()}</p>
            </div>
            <Users className="w-8 h-8 text-green-500" />
          </div>
        </Card>
        <Card className="p-4 bg-blue-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600">Graduated</p>
              <p className="text-2xl font-bold text-blue-700">{stats.graduated.toLocaleString()}</p>
            </div>
            <GraduationCap className="w-8 h-8 text-blue-500" />
          </div>
        </Card>
        <Card className="p-4 bg-yellow-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-600">Transferred</p>
              <p className="text-2xl font-bold text-yellow-700">{stats.transferred.toLocaleString()}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-yellow-500" />
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gender Distribution */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Gender Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stats.byGender}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="count"
                label={({ name, percent }) => {
                  const gender = name === 'male' ? 'Male' : name === 'female' ? 'Female' : 'Other';
                  return `${gender} (${((percent || 0) * 100).toFixed(1)}%)`;
                }}
              >
                {stats.byGender.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Grade Distribution */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Students by Grade</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.byGrade}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="grade" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <Input
              placeholder="Search by name, ID, or school..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="w-4 h-4" />}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Province</label>
            <select
              value={selectedProvince}
              onChange={(e) => setSelectedProvince(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Provinces</option>
              <option value="harare">Harare</option>
              <option value="bulawayo">Bulawayo</option>
              <option value="manicaland">Manicaland</option>
              <option value="masvingo">Masvingo</option>
              <option value="midlands">Midlands</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Grade</label>
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Grades</option>
              <option value="Form 1">Form 1</option>
              <option value="Form 2">Form 2</option>
              <option value="Form 3">Form 3</option>
              <option value="Form 4">Form 4</option>
              <option value="Form 5">Form 5</option>
              <option value="Form 6">Form 6</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Students Grid/List */}
      {filteredStudents.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredStudents.map(student => (
              <Card
                key={student.id}
                className="p-4 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedStudent(student)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold">{student.name}</h3>
                    <p className="text-xs text-gray-500">{student.studentNumber}</p>
                  </div>
                  <Badge className={getStatusColor(student.status)}>
                    {student.status}
                  </Badge>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <School className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                    <span className="truncate">{student.school.name}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                    <span>{student.school.district}, {student.school.province}</span>
                  </div>
                  <div className="flex items-center">
                    <BookOpen className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                    <span>Grade {student.grade}</span>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-xs text-gray-500">Average</p>
                    <div className="flex items-center">
                      <span className={`text-lg font-bold ${
                        student.performance.average >= 75 ? 'text-green-600' :
                        student.performance.average >= 50 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {student.performance.average}%
                      </span>
                      <span className={`ml-2 text-xs ${
                        student.performance.trend > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {student.performance.trend > 0 ? '+' : ''}{student.performance.trend}%
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Attendance</p>
                    <div className="flex items-center">
                      <span className="text-lg font-bold text-blue-600">
                        {student.attendance.overall}%
                      </span>
                      <span className={`ml-2 text-xs ${
                        student.attendance.trend > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {student.attendance.trend > 0 ? '+' : ''}{student.attendance.trend}%
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      School
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Grade
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Performance
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Attendance
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredStudents.map(student => (
                    <tr 
                      key={student.id} 
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => setSelectedStudent(student)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {student.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {student.studentNumber}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{student.school.name}</div>
                        <div className="text-sm text-gray-500">{student.school.district}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">Form {student.grade}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className={`text-sm font-medium ${
                            student.performance.average >= 75 ? 'text-green-600' :
                            student.performance.average >= 50 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {student.performance.average}%
                          </span>
                          <span className={`ml-2 text-xs ${
                            student.performance.trend > 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {student.performance.trend > 0 ? '+' : ''}{student.performance.trend}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-blue-600">
                            {student.attendance.overall}%
                          </span>
                          <span className={`ml-2 text-xs ${
                            student.attendance.trend > 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {student.attendance.trend > 0 ? '+' : ''}{student.attendance.trend}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge className={getStatusColor(student.status)}>
                          {student.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedStudent(student);
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )
      ) : (
        <Card className="p-12 text-center">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-medium mb-2">No Students Found</h3>
          <p className="text-gray-500">
            {searchTerm || selectedProvince !== 'all' || selectedGrade !== 'all'
              ? 'Try adjusting your filters'
              : 'No students have been registered yet'}
          </p>
        </Card>
      )}

      {/* Student Details Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold">Student Details</h2>
              <button
                onClick={() => setSelectedStudent(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium">{selectedStudent.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Student Number</p>
                  <p className="font-medium">{selectedStudent.studentNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date of Birth</p>
                  <p className="font-medium">{format(new Date(selectedStudent.dateOfBirth), 'MMMM d, yyyy')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Gender</p>
                  <p className="font-medium capitalize">{selectedStudent.gender}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Nationality</p>
                  <p className="font-medium">{selectedStudent.nationality}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Enrollment Date</p>
                  <p className="font-medium">{format(new Date(selectedStudent.enrollmentDate), 'MMMM d, yyyy')}</p>
                </div>
              </div>

              {/* School Info */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-3">School Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">School</p>
                    <p className="font-medium">{selectedStudent.school.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-medium">{selectedStudent.school.district}, {selectedStudent.school.province}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Grade</p>
                    <p className="font-medium">Form {selectedStudent.grade}</p>
                  </div>
                  {selectedStudent.class && (
                    <div>
                      <p className="text-sm text-gray-500">Class</p>
                      <p className="font-medium">{selectedStudent.class}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Performance */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-3">Academic Performance</h3>
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <p className="text-sm text-gray-500">Overall Average</p>
                    <p className={`text-2xl font-bold ${
                      selectedStudent.performance.average >= 75 ? 'text-green-600' :
                      selectedStudent.performance.average >= 50 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {selectedStudent.performance.average}%
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Class Rank</p>
                    <p className="text-2xl font-bold text-primary-600">
                      #{selectedStudent.performance.rank || 'N/A'}
                    </p>
                  </div>
                </div>

                <h4 className="font-medium mb-2">Subject Breakdown</h4>
                <div className="space-y-2">
                  {selectedStudent.performance.subjects.map(subject => (
                    <div key={subject.name}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{subject.name}</span>
                        <span className={
                          subject.score >= 75 ? 'text-green-600' :
                          subject.score >= 50 ? 'text-yellow-600' : 'text-red-600'
                        }>
                          {subject.score}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full ${
                            subject.score >= 75 ? 'bg-green-500' :
                            subject.score >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${subject.score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Parent Info */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-3">Parent/Guardian Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-medium">{selectedStudent.parent.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{selectedStudent.parent.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium">{selectedStudent.parent.phone}</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};