// src/pages/ministry/Performance.tsx
import React, { useState, useEffect } from 'react';
import {
  TrendingUp, TrendingDown, Award,
  Users, Download,
  Target
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import ministryAPI from '../../api/ministry.api';
import type { PerformanceData } from '../../api/ministry.api';
import { toast } from 'react-hot-toast';
import {
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ComposedChart
} from 'recharts';

export const Performance: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<PerformanceData | null>(null);
  const [selectedYear, setSelectedYear] = useState<string>('2024');
  const [selectedProvince, setSelectedProvince] = useState<string>('all');
  const [selectedView, setSelectedView] = useState<'overview' | 'provincial' | 'subjects' | 'schools'>('overview');
  const [exportFormat, setExportFormat] = useState('pdf');

  useEffect(() => {
    loadPerformanceData();
  }, [selectedYear, selectedProvince]);

  const loadPerformanceData = async () => {
    try {
      const performanceData = await ministryAPI.getPerformanceData({
        year: selectedYear,
        province: selectedProvince
      });
      setData(performanceData);
    } catch (error) {
      toast.error('Failed to load performance data');
    } finally {
      setLoading(false);
    }
  };

  const handleExportReport = async () => {
    try {
      await ministryAPI.exportPerformanceReport({
        year: selectedYear,
        province: selectedProvince,
        format: exportFormat
      });
      toast.success('Report exported successfully');
    } catch (error) {
      toast.error('Failed to export report');
    }
  };

  if (loading || !data) {
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
        <h1 className="text-2xl font-bold">National Performance Analytics</h1>
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
              <option value="2021">2021</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Province</label>
            <select
              value={selectedProvince}
              onChange={(e) => setSelectedProvince(e.target.value)}
              className="w-40 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Provinces</option>
              <option value="Harare">Harare</option>
              <option value="Bulawayo">Bulawayo</option>
              <option value="Manicaland">Manicaland</option>
              <option value="Masvingo">Masvingo</option>
              <option value="Midlands">Midlands</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Format</label>
            <select
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value)}
              className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="pdf">PDF</option>
              <option value="excel">Excel</option>
              <option value="csv">CSV</option>
            </select>
          </div>
          <Button variant="outline" onClick={handleExportReport} className="mt-6 sm:mt-0">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* National Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">National Average</p>
              <p className="text-2xl font-bold text-primary-600">
                {data.national.averageScore}%
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-primary-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pass Rate</p>
              <p className="text-2xl font-bold text-green-600">
                {data.national.passRate}%
              </p>
            </div>
            <Award className="w-8 h-8 text-green-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Completion Rate</p>
              <p className="text-2xl font-bold text-blue-600">
                {data.national.completionRate}%
              </p>
            </div>
            <Target className="w-8 h-8 text-blue-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Students</p>
              <p className="text-2xl font-bold">
                {data.national.totalStudents.toLocaleString()}
              </p>
            </div>
            <Users className="w-8 h-8 text-purple-500" />
          </div>
        </Card>
      </div>

      {/* View Tabs */}
      <div className="flex flex-wrap gap-2 border-b">
        <button
          onClick={() => setSelectedView('overview')}
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
            selectedView === 'overview'
              ? 'border-primary-600 text-primary-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setSelectedView('provincial')}
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
            selectedView === 'provincial'
              ? 'border-primary-600 text-primary-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Provincial Analysis
        </button>
        <button
          onClick={() => setSelectedView('subjects')}
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
            selectedView === 'subjects'
              ? 'border-primary-600 text-primary-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Subject Performance
        </button>
        <button
          onClick={() => setSelectedView('schools')}
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
            selectedView === 'schools'
              ? 'border-primary-600 text-primary-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Top Schools
        </button>
      </div>

      {/* Overview View */}
      {selectedView === 'overview' && (
        <div className="space-y-6">
          {/* National Trends */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">National Performance Trends</h3>
            <ResponsiveContainer width="100%" height={400}>
              <ComposedChart data={data.national.trends.yearly}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis yAxisId="left" domain={[0, 100]} />
                <YAxis yAxisId="right" orientation="right" domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="passRate" fill="#10b981" name="Pass Rate %" />
                <Line yAxisId="right" type="monotone" dataKey="average" stroke="#3b82f6" strokeWidth={2} name="Average Score %" />
              </ComposedChart>
            </ResponsiveContainer>
          </Card>

          {/* Performance by Grade */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Performance by Grade</h3>
            <div className="space-y-4">
              {data.byGrade.map(grade => (
                <div key={grade.grade}>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium w-20">Form {grade.grade}</span>
                      <span className="text-sm text-gray-500">
                        ({grade.students} students)
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                      <span className="text-sm text-gray-500">
                        Range: {grade.lowestScore}% - {grade.topScore}%
                      </span>
                      <span className={`font-semibold ${
                        grade.averageScore >= 75 ? 'text-green-600' :
                        grade.averageScore >= 50 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {grade.averageScore}%
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        grade.averageScore >= 75 ? 'bg-green-500' :
                        grade.averageScore >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${grade.averageScore}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Performance Gaps */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Urban vs Rural Performance Gaps</h3>
            <div className="space-y-4">
              {data.performanceGaps.map(gap => (
                <div key={gap.category}>
                  <div className="flex flex-col sm:flex-row justify-between text-sm mb-1">
                    <span className="font-medium">{gap.category}</span>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                      <span className="text-blue-600">Urban: {gap.urban}%</span>
                      <span className="text-orange-600">Rural: {gap.rural}%</span>
                      <span className={`font-medium ${
                        gap.gap > 10 ? 'text-red-600' : 'text-yellow-600'
                      }`}>
                        Gap: {gap.gap}%
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${gap.urban}%` }}
                    />
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div
                      className="bg-orange-500 h-2 rounded-full"
                      style={{ width: `${gap.rural}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Provincial Analysis View */}
      {selectedView === 'provincial' && (
        <div className="space-y-6">
          {/* Provincial Rankings */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Provincial Performance Rankings</h3>
            <div className="space-y-4">
              {data.byProvince
                .sort((a, b) => b.averageScore - a.averageScore)
                .map((province, index) => (
                  <div key={province.province} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2">
                      <div className="flex items-center mb-2 sm:mb-0">
                        <span className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center font-bold text-primary-700 mr-3">
                          {index + 1}
                        </span>
                        <div>
                          <h4 className="font-semibold">{province.province}</h4>
                          <p className="text-sm text-gray-500">
                            {province.students.toLocaleString()} students • {province.schools} schools
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary-600">
                          {province.averageScore}%
                        </p>
                        <div className="flex items-center justify-end mt-1">
                          {province.trend > 0 ? (
                            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                          ) : (
                            <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                          )}
                          <span className={province.trend > 0 ? 'text-green-600' : 'text-red-600'}>
                            {province.trend > 0 ? '+' : ''}{province.trend}%
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-3">
                      <div>
                        <p className="text-xs text-gray-500">Pass Rate</p>
                        <p className={`text-lg font-semibold ${
                          province.passRate >= 75 ? 'text-green-600' :
                          province.passRate >= 50 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {province.passRate}%
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Completion</p>
                        <p className="text-lg font-semibold text-blue-600">
                          {province.completionRate}%
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Rank</p>
                        <p className="text-lg font-semibold text-purple-600">
                          #{province.rank}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </Card>

          {/* Provincial Comparison Chart */}
          <Card className="p-6 overflow-x-auto">
            <h3 className="text-lg font-semibold mb-4">Provincial Performance Comparison</h3>
            <div style={{ width: '100%', height: 400, minWidth: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.byProvince}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="province" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="averageScore" fill="#3b82f6" name="Average Score" />
                  <Bar dataKey="passRate" fill="#10b981" name="Pass Rate" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      )}

      {/* Subject Performance View */}
      {selectedView === 'subjects' && (
        <div className="space-y-6">
          {/* Subject Comparison */}
          <Card className="p-6 overflow-x-auto">
            <h3 className="text-lg font-semibold mb-4">Subject Performance Analysis</h3>
            <div style={{ width: '100%', height: 400, minWidth: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={data.bySubject}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar name="Current Score" dataKey="averageScore" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                  <Radar name="National Average" dataKey="nationalAverage" stroke="#9ca3af" fill="#9ca3af" fillOpacity={0.4} />
                  <Legend />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Subject Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.bySubject.map(subject => (
              <Card key={subject.subject} className="p-4">
                <h4 className="font-semibold text-lg mb-2">{subject.subject}</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-500">Average Score</span>
                      <span className={`font-medium ${
                        subject.averageScore >= 75 ? 'text-green-600' :
                        subject.averageScore >= 50 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {subject.averageScore}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          subject.averageScore >= 75 ? 'bg-green-500' :
                          subject.averageScore >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${subject.averageScore}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">vs National Avg</span>
                    <span className={`text-sm font-medium ${
                      subject.averageScore >= subject.nationalAverage ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {subject.averageScore >= subject.nationalAverage ? '+' : ''}
                      {(subject.averageScore - subject.nationalAverage).toFixed(1)}%
                    </span>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-sm text-gray-500">Students</span>
                    <span className="font-medium">{subject.totalStudents.toLocaleString()}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Top Schools View */}
      {selectedView === 'schools' && (
        <div className="space-y-6">
          {/* Top Schools Leaderboard */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Top Performing Schools Nationally</h3>
            <div className="space-y-4">
              {data.topSchools.map((school, index) => (
                <div key={school.id} className="flex flex-col sm:flex-row items-start sm:items-center p-4 bg-gray-50 rounded-lg">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white mb-2 sm:mb-0 sm:mr-4 ${
                    index === 0 ? 'bg-yellow-500' :
                    index === 1 ? 'bg-gray-400' :
                    index === 2 ? 'bg-orange-500' :
                    'bg-primary-600'
                  }`}>
                    #{index + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold">{school.name}</h4>
                    <p className="text-sm text-gray-600">{school.province} • {school.students} students</p>
                  </div>
                  <div className="text-left sm:text-right mt-2 sm:mt-0">
                    <p className="text-2xl font-bold text-primary-600">{school.averageScore}%</p>
                    <p className="text-sm text-gray-500">Pass Rate: {school.passRate}%</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* School Type Performance */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Performance by School Type</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.bySchoolType.map(type => (
                <Card key={type.type} className="p-4 text-center">
                  <p className="text-lg font-semibold mb-2">{type.type}</p>
                  <p className="text-3xl font-bold text-primary-600">{type.averageScore}%</p>
                  <p className="text-sm text-gray-500 mt-1">Pass Rate: {type.passRate}%</p>
                  <p className="text-xs text-gray-400 mt-2">{type.schools} schools</p>
                </Card>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};