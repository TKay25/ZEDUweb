import React, { useState } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, AreaChart, Area, Cell
} from 'recharts';
import {
  TrendingUp, Calendar, Download,
  Award, BookOpen
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import { Tabs } from '../ui/Tabs';

interface ProgressData {
  subject: string;
  currentGrade: number;
  previousGrade: number;
  classAverage: number;
  target: number;
}

interface AttendanceData {
  month: string;
  present: number;
  absent: number;
  late: number;
  total: number;
}

interface AssignmentData {
  name: string;
  score: number;
  maxScore: number;
  date: Date;
  feedback?: string;
}

interface ChildProgressChartProps {
  childId: string;
  childName: string;
  data: {
    overview: {
      overallGrade: number;
      improvement: number;
      rank: number;
      totalStudents: number;
      attendanceRate: number;
      completedAssignments: number;
      pendingAssignments: number;
    };
    subjects: ProgressData[];
    attendance: AttendanceData[];
    assignments: AssignmentData[];
    weeklyActivity: Array<{
      week: string;
      studyHours: number;
      assignments: number;
      participation: number;
    }>;
    performanceTrends: Array<{
      date: string;
      grade: number;
      average: number;
    }>;
  };
  onExport: (format: 'pdf' | 'excel') => void;
  onSubjectClick?: (subject: string) => void;
}

export const ChildProgressChart: React.FC<ChildProgressChartProps> = ({
  childId: _childId, // Prefix with underscore to indicate intentionally unused
  childName,
  data,
  onExport,
  onSubjectClick
}) => {
  const [timeRange, setTimeRange] = useState('semester');
  const [chartType, setChartType] = useState('line');
  const [activeTab, setActiveTab] = useState('overview');

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

  const calculateImprovement = (current: number, previous: number) => {
    const change = ((current - previous) / previous) * 100;
    return change.toFixed(1);
  };

  // Time range options for select
  const timeRangeOptions = [
    { value: 'month', label: 'This Month' },
    { value: 'semester', label: 'This Semester' },
    { value: 'year', label: 'This Year' },
    { value: 'all', label: 'All Time' }
  ];

  // Tabs configuration
  const tabs = [
    { key: 'overview', label: 'Overview' },
    { key: 'subjects', label: 'Subject Performance' },
    { key: 'attendance', label: 'Attendance' },
    { key: 'assignments', label: 'Assignments' },
    { key: 'activity', label: 'Activity' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{childName}'s Progress</h1>
          <p className="text-gray-600 mt-1">Track academic performance and achievements</p>
        </div>
        <div className="flex items-center space-x-3">
          <Select
            value={timeRange}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setTimeRange(e.target.value)}
            options={timeRangeOptions}
            className="w-32"
          />
          <Button variant="outline" onClick={() => onExport('pdf')}>
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Overall Grade</p>
              <p className={`text-2xl font-bold ${getGradeColor(data.overview.overallGrade)}`}>
                {data.overview.overallGrade}%
              </p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Award className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-600">
            Grade Letter: <span className="font-bold">{getGradeLetter(data.overview.overallGrade)}</span>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Class Rank</p>
              <p className="text-2xl font-bold">
                #{data.overview.rank} <span className="text-sm text-gray-500">/ {data.overview.totalStudents}</span>
              </p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <div className="mt-2 text-sm text-green-600">
            Top {((data.overview.rank / data.overview.totalStudents) * 100).toFixed(1)}%
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Attendance</p>
              <p className="text-2xl font-bold">{data.overview.attendanceRate}%</p>
            </div>
            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
              <Calendar className="w-5 h-5 text-yellow-600" />
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-600">
            {data.overview.attendanceRate >= 90 ? 'Excellent' : 'Needs Improvement'}
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Assignments</p>
              <p className="text-2xl font-bold">
                {data.overview.completedAssignments}/{data.overview.completedAssignments + data.overview.pendingAssignments}
              </p>
            </div>
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-600">
            {data.overview.pendingAssignments} pending
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs
        items={tabs}
        activeKey={activeTab}
        onChange={setActiveTab}
      />

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Performance Trend */}
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Performance Trend</h3>
              <div className="flex items-center space-x-2">
                <Button
                  variant={chartType === 'line' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setChartType('line')}
                >
                  Line
                </Button>
                <Button
                  variant={chartType === 'area' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setChartType('area')}
                >
                  Area
                </Button>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              {chartType === 'line' ? (
                <LineChart data={data.performanceTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="grade"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    name="Student's Grade"
                  />
                  <Line
                    type="monotone"
                    dataKey="average"
                    stroke="#94a3b8"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name="Class Average"
                  />
                </LineChart>
              ) : (
                <AreaChart data={data.performanceTrends}>
                  <defs>
                    <linearGradient id="colorGrade" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="grade"
                    stroke="#3b82f6"
                    fillOpacity={1}
                    fill="url(#colorGrade)"
                    name="Student's Grade"
                  />
                </AreaChart>
              )}
            </ResponsiveContainer>
          </Card>

          {/* Subject Performance Summary */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Subject Performance</h3>
            <div className="space-y-4">
              {data.subjects.map((subject) => (
                <div
                  key={subject.subject}
                  className="cursor-pointer hover:bg-gray-50 p-2 rounded-lg"
                  onClick={() => onSubjectClick?.(subject.subject)}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium">{subject.subject}</span>
                    <div className="flex items-center space-x-3">
                      <span className={`text-sm ${getGradeColor(subject.currentGrade)}`}>
                        Current: {subject.currentGrade}%
                      </span>
                      <span className="text-sm text-gray-500">
                        Target: {subject.target}%
                      </span>
                      <span className={`text-xs ${
                        subject.currentGrade >= subject.previousGrade
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}>
                        {calculateImprovement(subject.currentGrade, subject.previousGrade)}%
                      </span>
                    </div>
                  </div>
                  <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="absolute h-full bg-blue-500"
                      style={{ width: `${subject.currentGrade}%` }}
                    />
                    <div
                      className="absolute h-full bg-yellow-500"
                      style={{ width: `${subject.target}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Class Avg: {subject.classAverage}%</span>
                    <span>Previous: {subject.previousGrade}%</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Subjects Tab */}
      {activeTab === 'subjects' && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Detailed Subject Analysis</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data.subjects}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="subject" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Bar dataKey="currentGrade" fill="#3b82f6" name="Current Grade" />
              <Bar dataKey="previousGrade" fill="#94a3b8" name="Previous Grade" />
              <Bar dataKey="classAverage" fill="#f59e0b" name="Class Average" />
              <Bar dataKey="target" fill="#10b981" name="Target" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* Attendance Tab */}
      {activeTab === 'attendance' && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Attendance Overview</h3>
          <div className="grid grid-cols-2 gap-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.attendance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="present" stackId="a" fill="#10b981" name="Present" />
                <Bar dataKey="late" stackId="a" fill="#f59e0b" name="Late" />
                <Bar dataKey="absent" stackId="a" fill="#ef4444" name="Absent" />
              </BarChart>
            </ResponsiveContainer>

            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Present', value: data.overview.attendanceRate },
                    { name: 'Absent/Late', value: 100 - data.overview.attendanceRate }
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label
                >
                  <Cell fill="#10b981" />
                  <Cell fill="#ef4444" />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      {/* Assignments Tab */}
      {activeTab === 'assignments' && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Assignments</h3>
          <div className="space-y-4">
            {data.assignments.map((assignment, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium">{assignment.name}</p>
                  <p className="text-xs text-gray-500">
                    Due: {new Date(assignment.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${getGradeColor((assignment.score / assignment.maxScore) * 100)}`}>
                    {assignment.score}/{assignment.maxScore}
                  </p>
                  <p className="text-xs text-gray-500">
                    {((assignment.score / assignment.maxScore) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Activity Tab */}
      {activeTab === 'activity' && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Weekly Activity</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.weeklyActivity}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="studyHours"
                stroke="#3b82f6"
                name="Study Hours"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="assignments"
                stroke="#10b981"
                name="Assignments"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="participation"
                stroke="#f59e0b"
                name="Participation"
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      )}
    </div>
  );
};