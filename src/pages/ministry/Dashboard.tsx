// src/pages/ministry/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import {
  TrendingUp, Users, School,
  Award, AlertCircle, CheckCircle,
  Download
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import ministryAPI from '../../api/ministry.api';
import type { DashboardStats } from '../../api/ministry.api';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Line
} from 'recharts';

export const MinistryDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('year');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadDashboardData();
  }, [selectedRegion, selectedPeriod]);

  const loadDashboardData = async () => {
    try {
      const data = await ministryAPI.getDashboardStats({
        region: selectedRegion,
        period: selectedPeriod
      });
      setStats(data);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleExportReport = async () => {
    try {
      await ministryAPI.exportNationalReport({
        region: selectedRegion,
        period: selectedPeriod,
        format: 'pdf'
      });
      toast.success('Report exported successfully');
    } catch (error) {
      toast.error('Failed to export report');
    }
  };

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
        <h1 className="text-2xl font-bold">National Education Dashboard</h1>
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Province</label>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-40 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Period</label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
              <option value="all">All Time</option>
            </select>
          </div>
          <Button variant="outline" onClick={handleExportReport} className="mt-6 sm:mt-0">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* National Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Schools</p>
              <p className="text-2xl font-bold">{stats.overview.totalSchools}</p>
            </div>
            <School className="w-8 h-8 text-blue-500" />
          </div>
          <div className="mt-2 flex items-center text-sm text-green-600">
            <TrendingUp className="w-4 h-4 mr-1" />
            +{stats.overview.registeredSchools} registered
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Students</p>
              <p className="text-2xl font-bold">{stats.overview.totalStudents.toLocaleString()}</p>
            </div>
            <Users className="w-8 h-8 text-green-500" />
          </div>
          <div className="mt-2 text-sm text-gray-600">
            {stats.overview.totalTeachers.toLocaleString()} teachers
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Graduation Rate</p>
              <p className="text-2xl font-bold">{stats.overview.graduationRate}%</p>
            </div>
            <Award className="w-8 h-8 text-purple-500" />
          </div>
          <div className="mt-2 text-sm text-gray-600">
            National average
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending Verification</p>
              <p className="text-2xl font-bold text-yellow-600">
                {stats.overview.pendingVerification}
              </p>
            </div>
            <AlertCircle className="w-8 h-8 text-yellow-500" />
          </div>
          <div className="mt-2 text-sm text-yellow-600">
            Requires attention
          </div>
        </Card>
      </div>

      {/* Custom Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex flex-wrap gap-4">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'overview'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('regional')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'regional'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Regional Analysis
          </button>
          <button
            onClick={() => setActiveTab('compliance')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'compliance'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Compliance
          </button>
          <button
            onClick={() => setActiveTab('alerts')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'alerts'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Alerts ({stats.alerts.length})
          </button>
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Trends Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Enrollment Trend */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">National Enrollment Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={stats.trends.enrollment}>
                  <defs>
                    <linearGradient id="enrollmentGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="students" stroke="#3b82f6" fillOpacity={1} fill="url(#enrollmentGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </Card>

            {/* Performance Trend */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">National Performance Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={stats.trends.performance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="average" fill="#10b981" name="Average Score" />
                  <Line type="monotone" dataKey="average" stroke="#059669" strokeWidth={2} />
                </ComposedChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Regional Distribution */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Regional Distribution</h3>
            <div className="space-y-4">
              {stats.regional.map(region => (
                <div key={region.province}>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium">{region.province}</span>
                      <Badge className="bg-blue-100 text-blue-800">
                        {region.schools} schools
                      </Badge>
                    </div>
                    <span className="text-lg font-bold text-primary-600">
                      {region.performance}%
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Students</p>
                      <p className="text-sm font-medium">{region.students.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Teachers</p>
                      <p className="text-sm font-medium">{region.teachers}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Compliance</p>
                      <p className={`text-sm font-medium ${
                        region.compliance >= 90 ? 'text-green-600' :
                        region.compliance >= 70 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {region.compliance}%
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full"
                      style={{ width: `${region.performance}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Regional Analysis Tab */}
      {activeTab === 'regional' && (
        <div className="space-y-6">
          {/* Province Comparison */}
          <Card className="p-6 overflow-x-auto">
            <h3 className="text-lg font-semibold mb-4">Province Comparison</h3>
            <div style={{ width: '100%', height: 400, minWidth: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.regional}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="province" />
                  <YAxis yAxisId="left" orientation="left" stroke="#3b82f6" />
                  <YAxis yAxisId="right" orientation="right" stroke="#10b981" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="students" fill="#3b82f6" name="Students" />
                  <Bar yAxisId="right" dataKey="performance" fill="#10b981" name="Performance %" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Regional Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {stats.regional.map(region => (
              <Card key={region.province} className="p-4">
                <h4 className="font-semibold mb-3">{region.province}</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-2xl font-bold text-primary-600">{region.schools}</p>
                    <p className="text-sm text-gray-500">Schools</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-600">{region.students.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">Students</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-purple-600">{region.teachers}</p>
                    <p className="text-sm text-gray-500">Teachers</p>
                  </div>
                  <div>
                    <p className={`text-2xl font-bold ${
                      region.compliance >= 90 ? 'text-green-600' :
                      region.compliance >= 70 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {region.compliance}%
                    </p>
                    <p className="text-sm text-gray-500">Compliance</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Compliance Tab */}
      {activeTab === 'compliance' && (
        <div className="space-y-6">
          {/* Compliance Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-4 bg-green-50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600">Verified</p>
                  <p className="text-2xl font-bold text-green-700">{stats.compliance.verified}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </Card>
            <Card className="p-4 bg-yellow-50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-yellow-600">Pending</p>
                  <p className="text-2xl font-bold text-yellow-700">{stats.compliance.pending}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-yellow-500" />
              </div>
            </Card>
            <Card className="p-4 bg-red-50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-red-600">Expired</p>
                  <p className="text-2xl font-bold text-red-700">{stats.compliance.expired}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
            </Card>
            <Card className="p-4 bg-purple-50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-600">Expiring Soon</p>
                  <p className="text-2xl font-bold text-purple-700">{stats.compliance.expiringSoon}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-purple-500" />
              </div>
            </Card>
          </div>

          {/* Compliance by Type */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Compliance by Type</h3>
            <div className="space-y-3">
              {stats.compliance.byType.map((item) => (
                <div key={item.type} className="flex items-center justify-between">
                  <span className="text-sm capitalize">{item.type}</span>
                  <div className="flex items-center flex-1 ml-4">
                    <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full"
                        style={{ width: `${(item.count / stats.compliance.verified) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">{item.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Alerts Tab */}
      {activeTab === 'alerts' && (
        <div className="space-y-4">
          {stats.alerts.length > 0 ? (
            stats.alerts.map(alert => (
              <Card key={alert.id} className={`p-4 border-l-4 ${
                alert.type === 'critical' ? 'border-l-red-500' :
                alert.type === 'warning' ? 'border-l-yellow-500' :
                'border-l-blue-500'
              }`}>
                <div className="flex flex-col sm:flex-row items-start">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0 ${
                    alert.type === 'critical' ? 'bg-red-100' :
                    alert.type === 'warning' ? 'bg-yellow-100' :
                    'bg-blue-100'
                  }`}>
                    <AlertCircle className={`w-4 h-4 ${
                      alert.type === 'critical' ? 'text-red-600' :
                      alert.type === 'warning' ? 'text-yellow-600' :
                      'text-blue-600'
                    }`} />
                  </div>
                  <div className="flex-1 mt-2 sm:mt-0">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                      <h4 className="font-semibold">{alert.title}</h4>
                      <span className="text-xs text-gray-500">
                        {format(new Date(alert.timestamp), 'MMM d, h:mm a')}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
                    {alert.region && (
                      <Badge className="mt-2 bg-gray-100 text-gray-800">
                        {alert.region}
                      </Badge>
                    )}
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <Card className="p-12 text-center">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
              <h3 className="text-lg font-medium mb-2">No Active Alerts</h3>
              <p className="text-gray-500">All systems are operating normally</p>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};