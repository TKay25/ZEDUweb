import React, { useState } from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, Cell
} from 'recharts';
import {
  TrendingUp, TrendingDown, Users, GraduationCap,
  DollarSign, Download,
  Award, Clock
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import { Tabs } from '../ui/Tabs';

interface AnalyticsData {
  summary: {
    totalStudents: number;
    totalStaff: number;
    totalClasses: number;
    studentTeacherRatio: number;
    averageAttendance: number;
    averageGrade: number;
    passRate: number;
    graduationRate: number;
    totalRevenue: number;
    totalExpenses: number;
    netIncome: number;
  };
  trends: {
    enrollment: Array<{ year: string; students: number }>;
    performance: Array<{ year: string; average: number; passRate: number }>;
    attendance: Array<{ month: string; rate: number }>;
    financial: Array<{ month: string; revenue: number; expenses: number }>;
  };
  demographics: {
    byGrade: Array<{ grade: string; count: number }>;
    byGender: Array<{ gender: string; count: number }>;
    byAge: Array<{ age: number; count: number }>;
  };
  performance: {
    bySubject: Array<{ subject: string; average: number }>;
    byClass: Array<{ class: string; average: number; teacher: string }>;
    topStudents: Array<{ name: string; grade: string; average: number }>;
  };
  staff: {
    byDepartment: Array<{ department: string; count: number }>;
    byQualification: Array<{ qualification: string; count: number }>;
    turnover: number;
  };
  financial: {
    revenue: Array<{ source: string; amount: number }>;
    expenses: Array<{ category: string; amount: number }>;
    budget: {
      allocated: number;
      spent: number;
      remaining: number;
    };
  };
}

interface SchoolAnalyticsProps {
  data: AnalyticsData;
  academicYear: string;
  onAcademicYearChange: (year: string) => void;
  onExportReport: (format: 'pdf' | 'excel') => void;
  onGenerateInsights: () => void;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export const SchoolAnalytics: React.FC<SchoolAnalyticsProps> = ({
  data,
  academicYear,
  onAcademicYearChange,
  onExportReport,
  onGenerateInsights
}) => {
  const [activeTab, setActiveTab] = useState('overview');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getTrendIcon = (value: number, threshold: number = 0) => {
    if (value > threshold) return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (value < threshold) return <TrendingDown className="w-4 h-4 text-red-500" />;
    return null;
  };

  // Year options for select
  const yearOptions = [
    { value: '2024', label: '2024' },
    { value: '2023', label: '2023' },
    { value: '2022', label: '2022' }
  ];

  // Tabs configuration
  const tabs = [
    { key: 'overview', label: 'Overview' },
    { key: 'academic', label: 'Academic Performance' },
    { key: 'demographics', label: 'Demographics' },
    { key: 'staff', label: 'Staff Analytics' },
    { key: 'financial', label: 'Financial' }
  ];

  // Custom label renderers for pie charts
  const renderGenderLabel = (entry: any) => {
    const percent = entry.percent;
    if (percent === undefined) return entry.gender;
    return `${entry.gender} (${(percent * 100).toFixed(0)}%)`;
  };

  const renderDepartmentLabel = (entry: any) => {
    const percent = entry.percent;
    if (percent === undefined) return entry.department;
    return `${entry.department} (${(percent * 100).toFixed(0)}%)`;
  };

  const renderRevenueLabel = (entry: any) => {
    const percent = entry.percent;
    if (percent === undefined) return entry.source;
    return `${entry.source} (${(percent * 100).toFixed(0)}%)`;
  };

  const renderExpenseLabel = (entry: any) => {
    const percent = entry.percent;
    if (percent === undefined) return entry.category;
    return `${entry.category} (${(percent * 100).toFixed(0)}%)`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">School Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1">Comprehensive insights and metrics</p>
        </div>
        <div className="flex items-center space-x-3">
          <Select
            value={academicYear}
            onChange={(e) => onAcademicYearChange(e.target.value)}
            options={yearOptions}
            className="w-32"
          />
          <Button variant="outline" onClick={() => onExportReport('pdf')}>
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button variant="primary" onClick={onGenerateInsights}>
            <Award className="w-4 h-4 mr-2" />
            Generate Insights
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Students</p>
              <p className="text-2xl font-bold">{data.summary.totalStudents}</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <div className="mt-2 flex items-center text-sm">
            {getTrendIcon(5)}
            <span className="text-green-600 ml-1">+5% vs last year</span>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Avg Attendance</p>
              <p className="text-2xl font-bold text-green-600">
                {data.summary.averageAttendance}%
              </p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <Clock className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-500">
            Target: 95%
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pass Rate</p>
              <p className="text-2xl font-bold text-purple-600">
                {data.summary.passRate}%
              </p>
            </div>
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <div className="mt-2 flex items-center text-sm">
            {getTrendIcon(2)}
            <span className="text-green-600 ml-1">+2% vs last year</span>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Net Income</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(data.summary.netIncome)}
              </p>
            </div>
            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-yellow-600" />
            </div>
          </div>
          <div className="mt-2 flex items-center text-sm">
            {getTrendIcon(8)}
            <span className="text-green-600 ml-1">+8% vs last year</span>
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
          {/* Enrollment Trend */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Enrollment Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.trends.enrollment}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="students"
                  stroke="#3b82f6"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Performance Overview */}
          <div className="grid grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Performance by Subject</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={data.performance.bySubject}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="subject" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Bar dataKey="average" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Attendance Trend</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={data.trends.attendance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[80, 100]} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="rate"
                    stroke="#10b981"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </div>
      )}

      {/* Academic Performance Tab */}
      {activeTab === 'academic' && (
        <div className="space-y-6">
          {/* Class Performance */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Class Performance</h3>
            <div className="space-y-4">
              {data.performance.byClass.map((cls, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-1">
                    <div>
                      <span className="font-medium">{cls.class}</span>
                      <span className="text-sm text-gray-500 ml-2">Teacher: {cls.teacher}</span>
                    </div>
                    <span className={`font-bold ${
                      cls.average >= 75 ? 'text-green-600' :
                      cls.average >= 60 ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {cls.average}%
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        cls.average >= 75 ? 'bg-green-500' :
                        cls.average >= 60 ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${cls.average}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Top Students */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Top Performing Students</h3>
            <div className="space-y-3">
              {data.performance.topStudents.map((student, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <span className="w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-medium">{student.name}</p>
                      <p className="text-sm text-gray-500">Grade {student.grade}</p>
                    </div>
                  </div>
                  <span className="text-lg font-bold text-primary-600">
                    {student.average}%
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Demographics Tab */}
      {activeTab === 'demographics' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Grade Distribution */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Students by Grade</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.demographics.byGrade}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="grade" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Gender Distribution */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Gender Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.demographics.byGender}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                  label={renderGenderLabel}
                >
                  {data.demographics.byGender.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          {/* Age Distribution */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Age Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.demographics.byAge}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="age" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#f59e0b" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>
      )}

      {/* Staff Analytics Tab */}
      {activeTab === 'staff' && (
        <div className="grid grid-cols-2 gap-6">
          {/* Staff by Department */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Staff by Department</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.staff.byDepartment}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                  label={renderDepartmentLabel}
                >
                  {data.staff.byDepartment.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          {/* Qualifications */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Staff Qualifications</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.staff.byQualification}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="qualification" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Staff Stats */}
          <Card className="p-6 col-span-2">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600">{data.summary.totalStaff}</p>
                <p className="text-sm text-gray-600">Total Staff</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">{data.summary.studentTeacherRatio}:1</p>
                <p className="text-sm text-gray-600">Student-Teacher Ratio</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-purple-600">{data.staff.turnover}%</p>
                <p className="text-sm text-gray-600">Staff Turnover</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Financial Tab */}
      {activeTab === 'financial' && (
        <div className="space-y-6">
          {/* Revenue vs Expenses */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Revenue vs Expenses</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.trends.financial}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} />
                <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Revenue Sources */}
          <div className="grid grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Revenue Sources</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={data.financial.revenue}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="amount"
                    label={renderRevenueLabel}
                  >
                    {data.financial.revenue.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value as number)} />
                </PieChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Expense Categories</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={data.financial.expenses}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="amount"
                    label={renderExpenseLabel}
                  >
                    {data.financial.expenses.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value as number)} />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Budget Overview */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Budget Overview</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-600">Budget Utilization</span>
                  <span className="font-medium">
                    {formatCurrency(data.financial.budget.spent)} of {formatCurrency(data.financial.budget.allocated)}
                  </span>
                </div>
                <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500"
                    style={{ width: `${(data.financial.budget.spent / data.financial.budget.allocated) * 100}%` }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 rounded-lg text-center">
                  <p className="text-sm text-green-600">Remaining Budget</p>
                  <p className="text-2xl font-bold text-green-700">
                    {formatCurrency(data.financial.budget.remaining)}
                  </p>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg text-center">
                  <p className="text-sm text-yellow-600">Monthly Average</p>
                  <p className="text-2xl font-bold text-yellow-700">
                    {formatCurrency(data.summary.netIncome / 12)}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};