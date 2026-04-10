import React, { useState } from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, Cell, AreaChart, Area
} from 'recharts';
import {
  TrendingUp, Users, Award,
  BookOpen, Clock, Download
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import { Tabs } from '../ui/Tabs';

interface AnalyticsDashboardProps {
  data: {
    overview: {
      totalStudents: number;
      activeCourses: number;
      averageAttendance: number;
      averageGrade: number;
      completionRate: number;
      totalEarnings: number;
    };
    trends: {
      daily: Array<{ date: string; students: number; revenue: number }>;
      weekly: Array<{ week: string; attendance: number; grades: number }>;
      monthly: Array<{ month: string; enrollment: number; completion: number }>;
    };
    performance: {
      byGrade: Array<{ grade: string; average: number; students: number }>;
      byCourse: Array<{ course: string; average: number; enrollment: number }>;
      bySubject: Array<{ subject: string; score: number }>;
    };
    demographics: {
      ageGroups: Array<{ group: string; count: number }>;
      locations: Array<{ location: string; count: number }>;
      gender: Array<{ gender: string; count: number }>;
    };
    engagement: {
      daily: Array<{ time: string; active: number }>;
      features: Array<{ feature: string; usage: number }>;
    };
  };
  timeRange: 'day' | 'week' | 'month' | 'year';
  onTimeRangeChange: (range: string) => void;
  onExport: () => void;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  data,
  timeRange,
  onTimeRangeChange,
  onExport
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedMetric, setSelectedMetric] = useState('students');

  // Time range options for select
  const timeRangeOptions = [
    { value: 'day', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'year', label: 'This Year' }
  ];

  // Metric options for select
  const metricOptions = [
    { value: 'students', label: 'Students' },
    { value: 'attendance', label: 'Attendance' },
    { value: 'grades', label: 'Grades' },
    { value: 'revenue', label: 'Revenue' }
  ];

  // Tabs configuration
  const tabs = [
    { key: 'overview', label: 'Overview' },
    { key: 'performance', label: 'Performance' },
    { key: 'demographics', label: 'Demographics' },
    { key: 'engagement', label: 'Engagement' }
  ];

  // Custom label renderers for pie charts
  const renderAgeGroupLabel = (entry: any) => {
    const percent = entry.percent;
    if (percent === undefined) return entry.group;
    return `${entry.group} (${(percent * 100).toFixed(0)}%)`;
  };

  const renderLocationLabel = (entry: any) => {
    const percent = entry.percent;
    if (percent === undefined) return entry.location;
    return `${entry.location} (${(percent * 100).toFixed(0)}%)`;
  };

  const renderGenderLabel = (entry: any) => {
    const percent = entry.percent;
    if (percent === undefined) return entry.gender;
    return `${entry.gender} (${(percent * 100).toFixed(0)}%)`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
        <div className="flex items-center space-x-3">
          <Select
            value={timeRange}
            onChange={(e) => onTimeRangeChange(e.target.value)}
            options={timeRangeOptions}
            className="w-32"
          />
          <Button variant="outline" onClick={onExport}>
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Students</p>
              <p className="text-2xl font-bold">{data.overview.totalStudents}</p>
            </div>
            <Users className="w-8 h-8 text-primary-500" />
          </div>
          <div className="mt-2 text-sm text-green-600">↑ 12%</div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Courses</p>
              <p className="text-2xl font-bold">{data.overview.activeCourses}</p>
            </div>
            <BookOpen className="w-8 h-8 text-green-500" />
          </div>
          <div className="mt-2 text-sm text-green-600">↑ 8%</div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Attendance</p>
              <p className="text-2xl font-bold">{data.overview.averageAttendance}%</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-500" />
          </div>
          <div className="mt-2 text-sm text-red-600">↓ 3%</div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Average Grade</p>
              <p className="text-2xl font-bold">{data.overview.averageGrade}%</p>
            </div>
            <Award className="w-8 h-8 text-blue-500" />
          </div>
          <div className="mt-2 text-sm text-green-600">↑ 5%</div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Completion Rate</p>
              <p className="text-2xl font-bold">{data.overview.completionRate}%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-500" />
          </div>
          <div className="mt-2 text-sm text-green-600">↑ 10%</div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Earnings</p>
              <p className="text-2xl font-bold">${data.overview.totalEarnings}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-500" />
          </div>
          <div className="mt-2 text-sm text-green-600">↑ 15%</div>
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
          {/* Trends Chart */}
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Trends Over Time</h3>
              <Select
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value)}
                options={metricOptions}
                className="w-40"
              />
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.trends.daily}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey={selectedMetric === 'students' ? 'students' : 'revenue'}
                  stroke="#3b82f6"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Performance by Grade */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Performance by Grade</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.performance.byGrade}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="grade" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="average" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Course Performance</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.performance.byCourse}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="course" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="average" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </div>
      )}

      {/* Demographics Tab */}
      {activeTab === 'demographics' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Age Groups */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Age Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={data.demographics.ageGroups}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="count"
                  label={renderAgeGroupLabel}
                >
                  {data.demographics.ageGroups.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          {/* Locations */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Geographic Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={data.demographics.locations}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                  label={renderLocationLabel}
                >
                  {data.demographics.locations.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          {/* Gender */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Gender Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={data.demographics.gender}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                  label={renderGenderLabel}
                >
                  {data.demographics.gender.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>
      )}

      {/* Engagement Tab */}
      {activeTab === 'engagement' && (
        <div className="space-y-6">
          {/* Daily Active Users */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Daily Active Users</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={data.engagement.daily}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="active"
                  stroke="#3b82f6"
                  fill="#93c5fd"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          {/* Feature Usage */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Feature Usage</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.engagement.features}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="feature" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="usage" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
      )}
    </div>
  );
};