import React, { useState } from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, Cell, AreaChart, Area
} from 'recharts';
import {
   Users, GraduationCap,
  School, BookOpen, Download,
  Printer, Share2, Map, Globe, Award
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import { Tabs } from '../ui/Tabs';

interface NationalStatsProps {
  data: {
    overview: {
      totalSchools: number;
      totalStudents: number;
      totalTeachers: number;
      totalGraduates: number;
      literacyRate: number;
      enrollmentRate: number;
      dropoutRate: number;
      passRate: number;
      genderParityIndex: number;
      studentTeacherRatio: number;
    };
    trends: {
      enrollment: Array<{ year: string; primary: number; secondary: number; tertiary: number }>;
      performance: Array<{ year: string; average: number; passRate: number }>;
      graduation: Array<{ year: string; male: number; female: number }>;
    };
    byProvince: Array<{
      province: string;
      schools: number;
      students: number;
      teachers: number;
      passRate: number;
      enrollment: number;
    }>;
    bySchoolType: Array<{
      type: string;
      count: number;
      students: number;
    }>;
    byGender: Array<{
      level: string;
      male: number;
      female: number;
    }>;
    subjects: Array<{
      name: string;
      average: number;
      passRate: number;
    }>;
  };
  year: string;
  onYearChange: (year: string) => void;
  onExportData: (format: 'pdf' | 'excel' | 'csv') => void;
  onPrintReport: () => void;
  onShareReport: () => void;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export const NationalStats: React.FC<NationalStatsProps> = ({
  data,
  year,
  onYearChange,
  onExportData,
  onPrintReport,
  onShareReport
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedProvince, setSelectedProvince] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'chart' | 'table'>('chart');

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const formatPercentage = (num: number) => {
    return `${num.toFixed(1)}%`;
  };

  const filteredProvinceData = selectedProvince === 'all' 
    ? data.byProvince 
    : data.byProvince.filter(p => p.province === selectedProvince);

  // Province options for select
  const provinceOptions = [
    { value: 'all', label: 'All Provinces' },
    ...data.byProvince.map(p => ({ value: p.province, label: p.province }))
  ];

  // Year options for select
  const yearOptions = [
    { value: '2024', label: '2024' },
    { value: '2023', label: '2023' },
    { value: '2022', label: '2022' }
  ];

  // Tabs configuration
  const tabs = [
    { key: 'overview', label: 'National Overview' },
    { key: 'provincial', label: 'Provincial Analysis' },
    { key: 'academic', label: 'Academic Performance' },
    { key: 'trends', label: 'Historical Trends' }
  ];

  // Get gender distribution for display
  const genderData = data.byGender[0] || { male: 0, female: 0 };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">National Education Statistics</h1>
          <p className="text-gray-600 mt-1">Zimbabwe Ministry of Primary and Secondary Education</p>
        </div>
        <div className="flex items-center space-x-3">
          <Select 
            value={year} 
            onChange={(e) => onYearChange(e.target.value)} 
            options={yearOptions}
            className="w-32"
          />
          <Button variant="outline" onClick={() => onExportData('pdf')}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" onClick={onPrintReport}>
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
          <Button variant="outline" onClick={onShareReport}>
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

      {/* National Flag Banner */}
      <div className="bg-gradient-to-r from-green-600 via-yellow-500 to-red-600 h-2 rounded-full" />

      {/* Key National Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-primary-50 border-primary-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-primary-700 font-medium">Total Schools</p>
              <p className="text-3xl font-bold text-primary-800">{formatNumber(data.overview.totalSchools)}</p>
            </div>
            <School className="w-10 h-10 text-primary-600" />
          </div>
          <div className="mt-2 flex items-center text-sm text-primary-600">
            <Map className="w-4 h-4 mr-1" />
            <span>{data.byProvince.length} provinces</span>
          </div>
        </Card>

        <Card className="p-4 bg-green-50 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-700 font-medium">Total Students</p>
              <p className="text-3xl font-bold text-green-800">{formatNumber(data.overview.totalStudents)}</p>
            </div>
            <Users className="w-10 h-10 text-green-600" />
          </div>
          <div className="mt-2 flex items-center text-sm text-green-600">
            <GraduationCap className="w-4 h-4 mr-1" />
            <span>Male: {genderData.male}% | Female: {genderData.female}%</span>
          </div>
        </Card>

        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-700 font-medium">Total Teachers</p>
              <p className="text-3xl font-bold text-blue-800">{formatNumber(data.overview.totalTeachers)}</p>
            </div>
            <BookOpen className="w-10 h-10 text-blue-600" />
          </div>
          <div className="mt-2 flex items-center text-sm text-blue-600">
            <Users className="w-4 h-4 mr-1" />
            <span>Ratio: 1:{data.overview.studentTeacherRatio}</span>
          </div>
        </Card>

        <Card className="p-4 bg-purple-50 border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-700 font-medium">Literacy Rate</p>
              <p className="text-3xl font-bold text-purple-800">{formatPercentage(data.overview.literacyRate)}</p>
            </div>
            <Award className="w-10 h-10 text-purple-600" />
          </div>
          <div className="mt-2 flex items-center text-sm text-purple-600">
            <Globe className="w-4 h-4 mr-1" />
            <span>National target: 95%</span>
          </div>
        </Card>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-3">
          <p className="text-sm text-gray-500">Enrollment Rate</p>
          <p className="text-xl font-bold text-blue-600">{formatPercentage(data.overview.enrollmentRate)}</p>
        </Card>
        <Card className="p-3">
          <p className="text-sm text-gray-500">Pass Rate</p>
          <p className="text-xl font-bold text-green-600">{formatPercentage(data.overview.passRate)}</p>
        </Card>
        <Card className="p-3">
          <p className="text-sm text-gray-500">Dropout Rate</p>
          <p className="text-xl font-bold text-red-600">{formatPercentage(data.overview.dropoutRate)}</p>
        </Card>
        <Card className="p-3">
          <p className="text-sm text-gray-500">Gender Parity</p>
          <p className="text-xl font-bold text-purple-600">{data.overview.genderParityIndex.toFixed(2)}</p>
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
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Enrollment by Education Level</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.trends.enrollment}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="primary" fill="#3b82f6" name="Primary" />
                <Bar dataKey="secondary" fill="#10b981" name="Secondary" />
                <Bar dataKey="tertiary" fill="#f59e0b" name="Tertiary" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <div className="grid grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Schools by Type</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={data.bySchoolType}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                    label
                  >
                    {data.bySchoolType.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Gender Distribution</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={data.byGender}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="level" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="male" fill="#3b82f6" />
                  <Bar dataKey="female" fill="#ec4899" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </div>
      )}

      {/* Provincial Analysis Tab */}
      {activeTab === 'provincial' && (
        <div className="space-y-6">
          <Card className="p-4">
            <div className="flex items-center space-x-4">
              <Select
                value={selectedProvince}
                onChange={(e) => setSelectedProvince(e.target.value)}
                options={provinceOptions}
                className="w-64"
              />
              <div className="flex space-x-2">
                <Button
                  variant={viewMode === 'chart' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('chart')}
                >
                  Chart View
                </Button>
                <Button
                  variant={viewMode === 'table' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('table')}
                >
                  Table View
                </Button>
              </div>
            </div>
          </Card>

          {viewMode === 'chart' ? (
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Provincial Comparison</h3>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={filteredProvinceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="province" angle={-45} textAnchor="end" height={100} />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="students" fill="#3b82f6" name="Students" />
                  <Bar yAxisId="left" dataKey="schools" fill="#f59e0b" name="Schools" />
                  <Line yAxisId="right" type="monotone" dataKey="passRate" stroke="#10b981" name="Pass Rate %" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          ) : (
            <Card className="overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left">Province</th>
                    <th className="px-6 py-3 text-right">Schools</th>
                    <th className="px-6 py-3 text-right">Students</th>
                    <th className="px-6 py-3 text-right">Teachers</th>
                    <th className="px-6 py-3 text-right">Pass Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredProvinceData.map((province) => (
                    <tr key={province.province}>
                      <td className="px-6 py-4 font-medium">{province.province}</td>
                      <td className="px-6 py-4 text-right">{formatNumber(province.schools)}</td>
                      <td className="px-6 py-4 text-right">{formatNumber(province.students)}</td>
                      <td className="px-6 py-4 text-right">{formatNumber(province.teachers)}</td>
                      <td className="px-6 py-4 text-right">{province.passRate}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          )}
        </div>
      )}

      {/* Academic Performance Tab */}
      {activeTab === 'academic' && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Subject Performance Analysis</h3>
          <div className="space-y-4">
            {data.subjects.map((subject) => (
              <div key={subject.name}>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium">{subject.name}</span>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-600">Avg: {subject.average}%</span>
                    <span className={`text-sm font-medium ${
                      subject.passRate >= 75 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      Pass: {subject.passRate}%
                    </span>
                  </div>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500"
                    style={{ width: `${subject.average}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Trends Tab */}
      {activeTab === 'trends' && (
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Performance Trends</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.trends.performance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="average" stroke="#3b82f6" name="Average Score" />
                <Line type="monotone" dataKey="passRate" stroke="#10b981" name="Pass Rate" />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Graduation Trends by Gender</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={data.trends.graduation}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="male" stackId="1" stroke="#3b82f6" fill="#3b82f6" />
                <Area type="monotone" dataKey="female" stackId="1" stroke="#ec4899" fill="#ec4899" />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </div>
      )}
    </div>
  );
};