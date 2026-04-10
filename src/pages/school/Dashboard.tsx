// src/pages/school/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, GraduationCap, BookOpen, DollarSign,
  TrendingUp, TrendingDown, Calendar, Bell,
  AlertCircle, ChevronRight, Plus
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { ProgressBar } from '../../components/ui/ProgressBar';
//import schoolAPI from '../../api/school.api';
import { format, formatDistanceToNow } from 'date-fns';
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
  ResponsiveContainer
} from 'recharts';

interface DashboardStats {
  totalStudents: number;
  totalStaff: number;
  totalClasses: number;
  totalRevenue: number;
  pendingFees: number;
  newAdmissions: number;
  attendanceRate: number;
  averageGrade: number;
  studentTrend: number;
  revenueTrend: number;
  attendanceTrend: number;
}

interface RecentActivity {
  id: string;
  type: 'admission' | 'payment' | 'attendance' | 'result' | 'complaint';
  title: string;
  description: string;
  timestamp: Date;
  user?: {
    name: string;
    avatar?: string;
  };
  status?: 'pending' | 'approved' | 'rejected';
}

interface UpcomingEvent {
  id: string;
  title: string;
  date: Date;
  type: 'exam' | 'meeting' | 'holiday' | 'event';
  description: string;
}

interface ClassPerformance {
  className: string;
  students: number;
  averageGrade: number;
  attendance: number;
  teacher: string;
}

export const SchoolDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEvent[]>([]);
  const [classPerformance, setClassPerformance] = useState<ClassPerformance[]>([]);
  const [attendanceData, setAttendanceData] = useState<any[]>([]);
  const [revenueData, setRevenueData] = useState<any[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Mock data for demonstration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockStats: DashboardStats = {
        totalStudents: 1250,
        totalStaff: 85,
        totalClasses: 42,
        totalRevenue: 250000,
        pendingFees: 45000,
        newAdmissions: 45,
        attendanceRate: 92,
        averageGrade: 78,
        studentTrend: 5.2,
        revenueTrend: 8.1,
        attendanceTrend: 2.3
      };
      
      const mockActivities: RecentActivity[] = [
        {
          id: '1',
          type: 'admission',
          title: 'New Student Enrollment',
          description: 'John Doe enrolled in Form 1A',
          timestamp: new Date(),
          status: 'approved'
        },
        {
          id: '2',
          type: 'payment',
          title: 'Fee Payment Received',
          description: 'Payment of $500 received from Jane Smith',
          timestamp: new Date(Date.now() - 3600000),
          status: 'approved'
        },
        {
          id: '3',
          type: 'attendance',
          title: 'Low Attendance Alert',
          description: 'Form 2B attendance below 75% this week',
          timestamp: new Date(Date.now() - 7200000),
          status: 'pending'
        }
      ];
      
      const mockEvents: UpcomingEvent[] = [
        {
          id: '1',
          title: 'Final Examinations',
          date: new Date(Date.now() + 7 * 86400000),
          type: 'exam',
          description: 'End of term examinations begin'
        },
        {
          id: '2',
          title: 'Parent-Teacher Meeting',
          date: new Date(Date.now() + 3 * 86400000),
          type: 'meeting',
          description: 'Quarterly parent-teacher conference'
        },
        {
          id: '3',
          title: 'Public Holiday',
          date: new Date(Date.now() + 5 * 86400000),
          type: 'holiday',
          description: 'School closed for holiday'
        }
      ];
      
      const mockClassPerformance: ClassPerformance[] = [
        { className: 'Form 1A', students: 30, averageGrade: 85, attendance: 92, teacher: 'Mr. John Doe' },
        { className: 'Form 1B', students: 28, averageGrade: 82, attendance: 88, teacher: 'Mrs. Sarah Johnson' },
        { className: 'Form 2A', students: 32, averageGrade: 88, attendance: 90, teacher: 'Mr. Michael Lee' },
        { className: 'Form 2B', students: 29, averageGrade: 79, attendance: 85, teacher: 'Ms. Emily Davis' },
        { className: 'Form 3A', students: 31, averageGrade: 86, attendance: 91, teacher: 'Dr. Robert Brown' }
      ];
      
      const mockAttendanceData = [
        { date: 'Mon', attendance: 92 },
        { date: 'Tue', attendance: 94 },
        { date: 'Wed', attendance: 90 },
        { date: 'Thu', attendance: 93 },
        { date: 'Fri', attendance: 91 }
      ];
      
      const mockRevenueData = [
        { month: 'Jan', collected: 45000, pending: 5000 },
        { month: 'Feb', collected: 48000, pending: 4500 },
        { month: 'Mar', collected: 52000, pending: 6000 },
        { month: 'Apr', collected: 49000, pending: 4000 },
        { month: 'May', collected: 53000, pending: 5500 }
      ];
      
      setStats(mockStats);
      setRecentActivity(mockActivities);
      setUpcomingEvents(mockEvents);
      setClassPerformance(mockClassPerformance);
      setAttendanceData(mockAttendanceData);
      setRevenueData(mockRevenueData);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'admission': return <Users className="w-4 h-4 text-green-600" />;
      case 'payment': return <DollarSign className="w-4 h-4 text-blue-600" />;
      case 'attendance': return <Calendar className="w-4 h-4 text-yellow-600" />;
      case 'result': return <BookOpen className="w-4 h-4 text-purple-600" />;
      case 'complaint': return <AlertCircle className="w-4 h-4 text-red-600" />;
      default: return <Bell className="w-4 h-4 text-gray-600" />;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'exam': return 'bg-red-100 text-red-800';
      case 'meeting': return 'bg-blue-100 text-blue-800';
      case 'holiday': return 'bg-green-100 text-green-800';
      case 'event': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
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
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">School Dashboard</h1>
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={() => navigate('/school/communications')}>
            <Bell className="w-4 h-4 mr-2" />
            Notifications
          </Button>
          <Button onClick={() => navigate('/school/admissions')}>
            <Plus className="w-4 h-4 mr-2" />
            New Admission
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Students</p>
              <p className="text-2xl font-bold">{stats.totalStudents.toLocaleString()}</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <div className="mt-2 flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-600">+{stats.studentTrend}%</span>
            <span className="text-gray-500 ml-2">vs last month</span>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Staff Members</p>
              <p className="text-2xl font-bold">{stats.totalStaff}</p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            {stats.totalClasses} classes
          </p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Monthly Revenue</p>
              <p className="text-2xl font-bold text-green-600">
                ${stats.totalRevenue.toLocaleString()}
              </p>
            </div>
            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-yellow-600" />
            </div>
          </div>
          <div className="mt-2 flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-600">+{stats.revenueTrend}%</span>
            <span className="text-gray-500 ml-2">Pending: ${stats.pendingFees.toLocaleString()}</span>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Attendance Rate</p>
              <p className="text-2xl font-bold">{stats.attendanceRate}%</p>
            </div>
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <Calendar className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <div className="mt-2 flex items-center text-sm">
            {stats.attendanceTrend >= 0 ? (
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
            )}
            <span className={stats.attendanceTrend >= 0 ? 'text-green-600' : 'text-red-600'}>
              {stats.attendanceTrend > 0 ? '+' : ''}{stats.attendanceTrend}%
            </span>
            <span className="text-gray-500 ml-2">vs last month</span>
          </div>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Chart */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Attendance Trends</h3>
            <Button variant="ghost" size="sm">View Details →</Button>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={attendanceData}>
              <defs>
                <linearGradient id="attendanceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Area type="monotone" dataKey="attendance" stroke="#3b82f6" fillOpacity={1} fill="url(#attendanceGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Revenue Chart */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Revenue Overview</h3>
            <Button variant="ghost" size="sm">View Details →</Button>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="collected" fill="#10b981" name="Collected" />
              <Bar dataKey="pending" fill="#f59e0b" name="Pending" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Class Performance */}
        <Card className="p-6 lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Class Performance</h3>
            <Button variant="ghost" size="sm" onClick={() => navigate('/school/classes')}>
              View All Classes
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          <div className="space-y-4">
            {classPerformance.slice(0, 5).map(cls => (
              <div key={cls.className} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold">{cls.className}</h4>
                    <p className="text-sm text-gray-600">Teacher: {cls.teacher}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">{cls.students} students</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-500">Average Grade</span>
                      <span className="font-medium">{cls.averageGrade}%</span>
                    </div>
                    <ProgressBar value={cls.averageGrade} />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-500">Attendance</span>
                      <span className="font-medium">{cls.attendance}%</span>
                    </div>
                    <ProgressBar value={cls.attendance} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Upcoming Events */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Upcoming Events</h3>
            <Button variant="ghost" size="sm" onClick={() => navigate('/school/calendar')}>
              View Calendar
            </Button>
          </div>
          <div className="space-y-4">
            {upcomingEvents.slice(0, 5).map(event => (
              <div key={event.id} className="flex items-start space-x-3">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex flex-col items-center justify-center">
                  <span className="text-xs text-gray-500">{format(event.date, 'MMM')}</span>
                  <span className="text-lg font-bold">{format(event.date, 'd')}</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{event.title}</h4>
                  <p className="text-sm text-gray-500">{event.description}</p>
                  <Badge className={`mt-1 ${getEventColor(event.type)}`}>
                    {event.type}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Recent Activity</h3>
          <Button variant="ghost" size="sm">View All Activity</Button>
        </div>
        <div className="space-y-4">
          {recentActivity.slice(0, 5).map(activity => (
            <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                  {getActivityIcon(activity.type)}
                </div>
                <div>
                  <p className="font-medium">{activity.title}</p>
                  <p className="text-sm text-gray-500">{activity.description}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">
                  {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                </p>
                {activity.status && (
                  <Badge className={
                    activity.status === 'approved' ? 'bg-green-100 text-green-800' :
                    activity.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }>
                    {activity.status}
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};