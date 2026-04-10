import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, Cell, AreaChart, Area,
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis
} from 'recharts';
import {
  TrendingUp, Users, Award,
  Download, Activity, Target
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ProgressBar } from '../../components/ui/ProgressBar';
// TODO: Import toast for notifications when API is integrated
// import { toast } from 'react-hot-toast';
// TODO: Import analytics API when backend is ready
// import { analyticsAPI } from '../../api/analytics.api';

interface AnalyticsData {
  overview: {
    totalStudents: number;
    newStudents: number;
    activeStudents: number;
    totalCourses: number;
    totalLessons: number;
    totalEarnings: number;
    averageRating: number;
    completionRate: number;
    engagementRate: number;
  };
  trends: {
    daily: Array<{ date: string; students: number; revenue: number; engagement: number }>;
    weekly: Array<{ week: string; views: number; completions: number; ratings: number }>;
    monthly: Array<{ month: string; enrollment: number; revenue: number; satisfaction: number }>;
  };
  courses: Array<{
    id: string;
    name: string;
    students: number;
    completionRate: number;
    averageRating: number;
    totalViews: number;
    revenue: number;
    lessons: number;
  }>;
  demographics: {
    ageGroups: Array<{ group: string; count: number }>;
    locations: Array<{ location: string; count: number }>;
    devices: Array<{ device: string; count: number }>;
    timeOfDay: Array<{ hour: string; activity: number }>;
  };
  engagement: {
    pageViews: number;
    averageTimeSpent: number;
    bounceRate: number;
    returnRate: number;
    interactions: Array<{ type: string; count: number }>;
    feedback: Array<{ rating: number; count: number }>;
  };
  performance: {
    bySubject: Array<{ subject: string; score: number }>;
    byDifficulty: Array<{ level: string; completion: number }>;
    byTime: Array<{ hour: string; performance: number }>;
  };
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

// 🔴 MOCK DATA - Replace with API calls when backend is ready
const MOCK_ANALYTICS_DATA: AnalyticsData = {
  overview: {
    totalStudents: 1247,
    newStudents: 156,
    activeStudents: 892,
    totalCourses: 8,
    totalLessons: 124,
    totalEarnings: 45678,
    averageRating: 4.7,
    completionRate: 78,
    engagementRate: 65
  },
  trends: {
    daily: [
      { date: 'Mon', students: 45, revenue: 1200, engagement: 68 },
      { date: 'Tue', students: 52, revenue: 1500, engagement: 72 },
      { date: 'Wed', students: 48, revenue: 1300, engagement: 70 },
      { date: 'Thu', students: 61, revenue: 1800, engagement: 75 },
      { date: 'Fri', students: 58, revenue: 1600, engagement: 73 },
      { date: 'Sat', students: 42, revenue: 1100, engagement: 65 },
      { date: 'Sun', students: 38, revenue: 900, engagement: 60 }
    ],
    weekly: [
      { week: 'Week 1', views: 1200, completions: 450, ratings: 4.5 },
      { week: 'Week 2', views: 1350, completions: 520, ratings: 4.6 },
      { week: 'Week 3', views: 1500, completions: 580, ratings: 4.7 },
      { week: 'Week 4', views: 1650, completions: 620, ratings: 4.8 }
    ],
    monthly: [
      { month: 'Jan', enrollment: 120, revenue: 4500, satisfaction: 4.5 },
      { month: 'Feb', enrollment: 145, revenue: 5200, satisfaction: 4.6 },
      { month: 'Mar', enrollment: 168, revenue: 6100, satisfaction: 4.7 },
      { month: 'Apr', enrollment: 190, revenue: 7200, satisfaction: 4.8 }
    ]
  },
  courses: [
    { id: '1', name: 'Advanced Mathematics', students: 234, completionRate: 75, averageRating: 4.8, totalViews: 12340, revenue: 12450, lessons: 24 },
    { id: '2', name: 'Physics Fundamentals', students: 189, completionRate: 82, averageRating: 4.6, totalViews: 9870, revenue: 9870, lessons: 20 },
    { id: '3', name: 'Computer Science 101', students: 312, completionRate: 88, averageRating: 4.9, totalViews: 15670, revenue: 15670, lessons: 30 }
  ],
  demographics: {
    ageGroups: [
      { group: '18-24', count: 450 },
      { group: '25-34', count: 380 },
      { group: '35-44', count: 220 },
      { group: '45+', count: 150 }
    ],
    locations: [
      { location: 'Harare', count: 520 },
      { location: 'Bulawayo', count: 280 },
      { location: 'Mutare', count: 150 },
      { location: 'Gweru', count: 120 }
    ],
    devices: [
      { device: 'Mobile', count: 580 },
      { device: 'Desktop', count: 420 },
      { device: 'Tablet', count: 200 }
    ],
    timeOfDay: [
      { hour: '6am', activity: 45 },
      { hour: '9am', activity: 120 },
      { hour: '12pm', activity: 180 },
      { hour: '3pm', activity: 210 },
      { hour: '6pm', activity: 250 },
      { hour: '9pm', activity: 190 }
    ]
  },
  engagement: {
    pageViews: 45678,
    averageTimeSpent: 28,
    bounceRate: 32,
    returnRate: 68,
    interactions: [
      { type: 'comments', count: 1234 },
      { type: 'likes', count: 3456 },
      { type: 'shares', count: 567 },
      { type: 'bookmarks', count: 890 }
    ],
    feedback: [
      { rating: 5, count: 234 },
      { rating: 4, count: 156 },
      { rating: 3, count: 45 },
      { rating: 2, count: 12 },
      { rating: 1, count: 8 }
    ]
  },
  performance: {
    bySubject: [
      { subject: 'Math', score: 85 },
      { subject: 'Physics', score: 78 },
      { subject: 'Chemistry', score: 82 },
      { subject: 'Biology', score: 75 },
      { subject: 'CS', score: 90 }
    ],
    byDifficulty: [
      { level: 'Beginner', completion: 85 },
      { level: 'Intermediate', completion: 72 },
      { level: 'Advanced', completion: 58 }
    ],
    byTime: [
      { hour: 'Morning', performance: 82 },
      { hour: 'Afternoon', performance: 78 },
      { hour: 'Evening', performance: 85 }
    ]
  }
};

export const Analytics: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedCourse, setSelectedCourse] = useState<string>('all');
  const [exportFormat, setExportFormat] = useState('pdf');

  useEffect(() => {
    loadAnalytics();
  }, [selectedCourse]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      
      // 🔴 MOCK DATA - Remove when integrating API
      await new Promise(resolve => setTimeout(resolve, 1000));
      setData(MOCK_ANALYTICS_DATA);
      
      // 🟢 REAL API CALL - Uncomment when backend is ready
      // const response = await analyticsAPI.getAnalytics({
      //   courseId: selectedCourse !== 'all' ? selectedCourse : undefined
      // });
      // setData(response.data);
      
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      // 🟢 REAL API CALL - Uncomment when backend is ready
      // await analyticsAPI.exportAnalytics({
      //   format: exportFormat,
      //   courseId: selectedCourse !== 'all' ? selectedCourse : undefined
      // });
      
      // 🔴 MOCK IMPLEMENTATION
      console.log(`Exporting analytics as ${exportFormat}`);
      alert(`Analytics export as ${exportFormat} will be available when backend is integrated`);
      
    } catch (error) {
      console.error('Failed to export analytics:', error);
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Track your teaching performance and student engagement
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
          >
            <option value="all">All Courses</option>
            {data.courses.map(course => (
              <option key={course.id} value={course.id}>{course.name}</option>
            ))}
          </select>
          
          <div className="flex items-center space-x-2">
            <select
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
            >
              <option value="pdf">PDF</option>
              <option value="excel">Excel</option>
              <option value="csv">CSV</option>
            </select>
            <Button variant="outline" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Students</p>
              <p className="text-2xl font-bold text-gray-900">{data.overview.totalStudents.toLocaleString()}</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <div className="mt-2 flex items-center text-sm text-green-600">
            <TrendingUp className="w-4 h-4 mr-1" />
            +{data.overview.newStudents} this period
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Engagement Rate</p>
              <p className="text-2xl font-bold text-gray-900">{data.overview.engagementRate}%</p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <Activity className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-500">
            {data.engagement.averageTimeSpent} min avg. session
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Completion Rate</p>
              <p className="text-2xl font-bold text-gray-900">{data.overview.completionRate}%</p>
            </div>
            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
              <Target className="w-5 h-5 text-yellow-600" />
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-500">
            {data.overview.totalLessons} lessons completed
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Average Rating</p>
              <p className="text-2xl font-bold text-gray-900">{data.overview.averageRating.toFixed(1)}</p>
            </div>
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <Award className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-500">
            Based on {data.engagement.feedback.reduce((a, b) => a + b.count, 0)} reviews
          </div>
        </Card>
      </div>

      {/* Custom Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'courses', label: 'Course Performance' },
            { id: 'engagement', label: 'Student Engagement' },
            { id: 'demographics', label: 'Demographics' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Trends Over Time</h3>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={data.trends.daily}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="students" stroke="#3b82f6" name="Students" />
                <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#10b981" name="Revenue ($)" />
                <Line yAxisId="left" type="monotone" dataKey="engagement" stroke="#f59e0b" name="Engagement %" />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Courses</h3>
              <div className="space-y-4">
                {[...data.courses]
                  .sort((a, b) => b.completionRate - a.completionRate)
                  .slice(0, 5)
                  .map(course => (
                    <div key={course.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{course.name}</p>
                        <p className="text-sm text-gray-500">{course.students} students</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{course.completionRate}%</p>
                        <p className="text-sm text-gray-500">completion</p>
                      </div>
                    </div>
                  ))}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue by Course</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={data.courses}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="revenue"
                    label={({ name, percent }) => {
                      const percentage = percent ? (percent * 100).toFixed(0) : '0';
                      return `${name} (${percentage}%)`;
                    }}
                  >
                    {data.courses.map((_, idx) => (
                      <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </div>
      )}

      {/* Courses Tab */}
      {activeTab === 'courses' && (
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Performance</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Course</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Students</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Completion</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Rating</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Views</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {data.courses.map(course => (
                    <tr key={course.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-gray-900">{course.name}</td>
                      <td className="py-3 px-4 text-gray-600">{course.students}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <ProgressBar value={course.completionRate} className="w-24 h-2 mr-2" />
                          <span className="text-gray-600">{course.completionRate}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{course.averageRating.toFixed(1)} ★</td>
                      <td className="py-3 px-4 text-gray-600">{course.totalViews.toLocaleString()}</td>
                      <td className="py-3 px-4 font-semibold text-gray-900">${course.revenue.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance by Subject</h3>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={data.performance.bySubject}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis />
                  <Radar name="Score" dataKey="score" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                </RadarChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Completion by Difficulty</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.performance.byDifficulty}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="level" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="completion" fill="#10b981" name="Completion Rate %" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </div>
      )}

      {/* Engagement Tab */}
      {activeTab === 'engagement' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-4">
              <p className="text-sm text-gray-500">Page Views</p>
              <p className="text-2xl font-bold text-gray-900">{data.engagement.pageViews.toLocaleString()}</p>
            </Card>
            <Card className="p-4">
              <p className="text-sm text-gray-500">Avg. Time Spent</p>
              <p className="text-2xl font-bold text-gray-900">{data.engagement.averageTimeSpent} min</p>
            </Card>
            <Card className="p-4">
              <p className="text-sm text-gray-500">Bounce Rate</p>
              <p className="text-2xl font-bold text-gray-900">{data.engagement.bounceRate}%</p>
            </Card>
            <Card className="p-4">
              <p className="text-sm text-gray-500">Return Rate</p>
              <p className="text-2xl font-bold text-gray-900">{data.engagement.returnRate}%</p>
            </Card>
          </div>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity by Time of Day</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={data.demographics.timeOfDay}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="activity" stroke="#8b5cf6" fill="#c4b5fd" name="Activity Level" />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Student Feedback</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Rating Distribution</h4>
                <div className="space-y-2">
                  {[...data.engagement.feedback]
                    .sort((a, b) => b.rating - a.rating)
                    .map(item => (
                      <div key={item.rating} className="flex items-center">
                        <span className="w-12 text-sm text-gray-600">{item.rating} stars</span>
                        <div className="flex-1 mx-2">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-yellow-400 h-2 rounded-full"
                              style={{
                                width: `${(item.count / Math.max(...data.engagement.feedback.map(f => f.count))) * 100}%`
                              }}
                            />
                          </div>
                        </div>
                        <span className="text-sm text-gray-500">{item.count}</span>
                      </div>
                    ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Interaction Types</h4>
                <div className="space-y-3">
                  {data.engagement.interactions.map(interaction => (
                    <div key={interaction.type} className="flex items-center justify-between">
                      <span className="text-sm capitalize text-gray-600">{interaction.type}</span>
                      <span className="font-semibold text-gray-900">{interaction.count.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Demographics Tab - Fixed unused variable warnings */}
      {activeTab === 'demographics' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Age Distribution</h3>
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
                  label={({ name, percent }) => {
                    const percentage = percent ? (percent * 100).toFixed(0) : '0';
                    return `${name} (${percentage}%)`;
                  }}
                >
                  {data.demographics.ageGroups.map((_, idx) => (
                    <Cell key={`age-${idx}`} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Locations</h3>
            <div className="space-y-3">
              {data.demographics.locations.slice(0, 5).map((location, _idx) => (
                <div key={location.location} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{location.location}</span>
                  <div className="flex items-center">
                    <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full"
                        style={{
                          width: `${(location.count / data.demographics.locations[0].count) * 100}%`
                        }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900">{location.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Devices Used</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={data.demographics.devices}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                  label={({ name, percent }) => {
                    const percentage = percent ? (percent * 100).toFixed(0) : '0';
                    return `${name} (${percentage}%)`;
                  }}
                >
                  {data.demographics.devices.map((_, idx) => (
                    <Cell key={`device-${idx}`} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>
      )}
    </div>
  );
};