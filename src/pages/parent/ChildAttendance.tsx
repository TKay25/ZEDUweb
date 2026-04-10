import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Clock, CheckCircle, XCircle,
  AlertCircle, ChevronLeft, Download,
  TrendingUp, Bell, Calendar, MessageSquare,
  Eye, Info, BookOpen
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';
import { toast } from 'react-hot-toast';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell
} from 'recharts';

interface AttendanceRecord {
  id: string;
  date: Date;
  status: 'present' | 'absent' | 'late' | 'excused';
  course: string;
  time?: string;
  reason?: string;
  markedBy: string;
  parentNotified: boolean;
  notificationSentAt?: Date;
}

interface ChildInfo {
  id: string;
  name: string;
  class: string;
  classTeacher: string;
  enrollmentDate: string;
}

interface AttendanceSummary {
  present: number;
  absent: number;
  late: number;
  excused: number;
  total: number;
  percentage: number;
  trend: number;
}

interface MonthlyData {
  month: string;
  present: number;
  absent: number;
  late: number;
  excused: number;
  total: number;
  percentage: number;
}

interface CourseAttendance {
  course: string;
  present: number;
  absent: number;
  late: number;
  excused: number;
  total: number;
  percentage: number;
}

interface DayOfWeekAttendance {
  day: string;
  present: number;
  late: number;
  absent: number;
  total: number;
  percentage: number;
}

interface AttendanceData {
  child: ChildInfo;
  summary: AttendanceSummary;
  monthly: MonthlyData[];
  daily: AttendanceRecord[];
  byCourse: CourseAttendance[];
  byDayOfWeek: DayOfWeekAttendance[];
  recentNotifications: Array<{
    id: string;
    date: Date;
    status: string;
    reason?: string;
    message: string;
  }>;
}

const ProgressBar: React.FC<{ value: number; className?: string; color?: string }> = ({ 
  value, 
  className = '',
  color = 'bg-primary-600'
}) => {
  const safeValue = Math.min(100, Math.max(0, value));
  return (
    <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${className}`}>
      <div
        className={`${color} h-full transition-all duration-300`}
        style={{ width: `${safeValue}%` }}
      />
    </div>
  );
};

const COLORS = {
  present: '#10b981',
  absent: '#ef4444',
  late: '#f59e0b',
  excused: '#6b7280'
};

export const ChildAttendance: React.FC = () => {
  const { childId } = useParams<{ childId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [attendance, setAttendance] = useState<AttendanceData | null>(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadAttendance();
  }, [childId, selectedMonth]);

  const loadAttendance = async () => {
    try {
      setLoading(true);
      // Simulate API call - in production, fetch from parentAPI
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data that reflects real attendance data from teachers
      const mockData = generateMockAttendanceData();
      setAttendance(mockData);
    } catch (error) {
      console.error('Failed to load attendance:', error);
      toast.error('Failed to load attendance data');
    } finally {
      setLoading(false);
    }
  };

  const generateMockAttendanceData = (): AttendanceData => {
    const childName = childId === '1' ? 'John' : childId === '2' ? 'Jane' : 'Michael';
    const months = ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'];
    
    // Generate monthly data
    const monthlyData: MonthlyData[] = months.map(month => ({
      month,
      present: 15 + Math.floor(Math.random() * 8),
      absent: Math.floor(Math.random() * 3),
      late: Math.floor(Math.random() * 4),
      excused: Math.floor(Math.random() * 2),
      total: 22,
      percentage: 70 + Math.random() * 25
    }));

    // Generate daily records for the selected month
    const daysInMonth = endOfMonth(selectedMonth).getDate();
    const dailyRecords: AttendanceRecord[] = [];
    const courses = ['Mathematics', 'Physics', 'English', 'Chemistry', 'History'];
    const teachers = ['Mrs. Sarah Johnson', 'Mr. Michael Chen', 'Dr. Patricia Moyo'];
    
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), i);
      // Skip weekends
      if (date.getDay() === 0 || date.getDay() === 6) continue;
      
      const rand = Math.random();
      let status: 'present' | 'absent' | 'late' | 'excused' = 'present';
      let reason;
      let parentNotified = false;
      
      if (rand < 0.08) {
        status = 'absent';
        reason = 'Sick - Flu symptoms';
        parentNotified = true;
      } else if (rand < 0.15) {
        status = 'late';
        reason = 'Traffic delay';
        parentNotified = true;
      } else if (rand < 0.18) {
        status = 'excused';
        reason = 'Doctor appointment';
        parentNotified = true;
      }
      
      dailyRecords.push({
        id: `${childId}-${date.toISOString()}`,
        date,
        status,
        course: courses[Math.floor(Math.random() * courses.length)],
        time: status !== 'absent' ? '08:00' : undefined,
        reason,
        markedBy: teachers[Math.floor(Math.random() * teachers.length)],
        parentNotified,
        notificationSentAt: parentNotified ? new Date() : undefined
      });
    }

    // Generate course attendance
    const courseAttendance: CourseAttendance[] = courses.map(course => ({
      course,
      present: 15 + Math.floor(Math.random() * 8),
      absent: Math.floor(Math.random() * 3),
      late: Math.floor(Math.random() * 4),
      excused: Math.floor(Math.random() * 2),
      total: 22,
      percentage: 70 + Math.random() * 25
    }));

    // Generate day of week attendance
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const dayOfWeekAttendance: DayOfWeekAttendance[] = daysOfWeek.map(day => ({
      day,
      present: 3 + Math.floor(Math.random() * 2),
      late: Math.floor(Math.random() * 2),
      absent: Math.floor(Math.random() * 2),
      total: 5,
      percentage: 70 + Math.random() * 25
    }));

    // Calculate summary
    const present = dailyRecords.filter(r => r.status === 'present').length;
    const absent = dailyRecords.filter(r => r.status === 'absent').length;
    const late = dailyRecords.filter(r => r.status === 'late').length;
    const excused = dailyRecords.filter(r => r.status === 'excused').length;
    const total = dailyRecords.length;
    const percentage = total > 0 ? ((present + late) / total) * 100 : 0;
    
    // Calculate trend (compare with previous month)
    const trend = (Math.random() * 10) - 5; // -5 to +5%

    // Generate recent notifications
    const recentNotifications = dailyRecords
      .filter(r => r.parentNotified)
      .slice(0, 5)
      .map(r => ({
        id: r.id,
        date: r.date,
        status: r.status,
        reason: r.reason,
        message: `Your child was marked ${r.status} on ${format(r.date, 'MMMM d, yyyy')}${r.reason ? `: ${r.reason}` : ''}`
      }));

    return {
      child: {
        id: childId || '1',
        name: childName,
        class: 'Form 1A',
        classTeacher: 'Mrs. Sarah Johnson',
        enrollmentDate: '2024-01-15'
      },
      summary: {
        present,
        absent,
        late,
        excused,
        total,
        percentage: Math.round(percentage),
        trend: Math.round(trend)
      },
      monthly: monthlyData,
      daily: dailyRecords,
      byCourse: courseAttendance,
      byDayOfWeek: dayOfWeekAttendance,
      recentNotifications
    };
  };

  const getStatusIcon = (status: string, size: string = 'w-4 h-4') => {
    switch (status) {
      case 'present': return <CheckCircle className={`${size} text-green-500`} />;
      case 'absent': return <XCircle className={`${size} text-red-500`} />;
      case 'late': return <Clock className={`${size} text-yellow-500`} />;
      case 'excused': return <AlertCircle className={`${size} text-blue-500`} />;
      default: return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      present: 'bg-green-100 text-green-800',
      absent: 'bg-red-100 text-red-800',
      late: 'bg-yellow-100 text-yellow-800',
      excused: 'bg-blue-100 text-blue-800'
    };
    return (
      <Badge className={styles[status as keyof typeof styles]}>
        <span className="flex items-center">
          {getStatusIcon(status)}
          <span className="ml-1 capitalize">{status}</span>
        </span>
      </Badge>
    );
  };

  const handleExportReport = () => {
    // Generate CSV report
    if (!attendance) return;
    
    const headers = ['Date', 'Status', 'Course', 'Time', 'Marked By', 'Reason', 'Parent Notified'];
    const csvData = attendance.daily.map(record => [
      format(record.date, 'yyyy-MM-dd'),
      record.status,
      record.course,
      record.time || 'N/A',
      record.markedBy,
      record.reason || 'N/A',
      record.parentNotified ? 'Yes' : 'No'
    ]);
    
    const csvContent = [headers, ...csvData].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${attendance.child.name}_attendance_${format(selectedMonth, 'yyyy-MM')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Report downloaded successfully');
  };

  if (loading || !attendance) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/parent/children')}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Children
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{attendance.child.name}'s Attendance</h1>
            <p className="text-gray-600 mt-1">
              {attendance.child.class} • Class Teacher: {attendance.child.classTeacher}
            </p>
          </div>
        </div>
        <Button variant="outline" onClick={handleExportReport}>
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Info Banner */}
      <Card className="p-4 bg-blue-50 border-blue-200">
        <div className="flex items-start space-x-3">
          <Info className="w-5 h-5 text-blue-600 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">About Attendance Records</p>
            <p>Attendance is marked daily by your child's teachers. You will receive automatic notifications via WhatsApp/SMS when your child is marked absent or late.</p>
          </div>
        </div>
      </Card>

      {/* Recent Notifications */}
      {attendance.recentNotifications.length > 0 && (
        <Card className="p-4 bg-yellow-50 border-yellow-200">
          <div className="flex items-start space-x-3">
            <Bell className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium text-yellow-800 mb-2">Recent Notifications</p>
              <div className="space-y-2">
                {attendance.recentNotifications.map(notification => (
                  <div key={notification.id} className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(notification.status, 'w-3 h-3')}
                      <span className="text-yellow-800">{notification.message}</span>
                    </div>
                    <span className="text-xs text-yellow-600">
                      {format(notification.date, 'MMM d')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="p-4 bg-green-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-700">Present</p>
              <p className="text-2xl font-bold text-green-700">
                {attendance.summary.present}
              </p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-red-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-700">Absent</p>
              <p className="text-2xl font-bold text-red-700">
                {attendance.summary.absent}
              </p>
            </div>
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-yellow-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-700">Late</p>
              <p className="text-2xl font-bold text-yellow-700">
                {attendance.summary.late}
              </p>
            </div>
            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-blue-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-700">Excused</p>
              <p className="text-2xl font-bold text-blue-700">
                {attendance.summary.excused}
              </p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-primary-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-primary-700">Attendance Rate</p>
              <p className="text-2xl font-bold text-primary-700">
                {attendance.summary.percentage}%
              </p>
            </div>
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-primary-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Overall Progress Bar */}
      <Card className="p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Overall Attendance</span>
          <span className="text-sm font-semibold text-primary-600">{attendance.summary.percentage}%</span>
        </div>
        <ProgressBar value={attendance.summary.percentage} className="h-3" />
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          <span>Target: 90%</span>
          <div className="flex items-center">
            <TrendingUp className={`w-3 h-3 mr-1 ${attendance.summary.trend >= 0 ? 'text-green-500' : 'text-red-500'}`} />
            <span className={attendance.summary.trend >= 0 ? 'text-green-600' : 'text-red-600'}>
              {attendance.summary.trend >= 0 ? '+' : ''}{attendance.summary.trend}% vs last month
            </span>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: Eye },
            { id: 'daily', label: 'Daily Records', icon: Calendar },
            { id: 'by-course', label: 'By Course', icon: BookOpen },
            { id: 'analytics', label: 'Analytics', icon: TrendingUp }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Monthly Chart */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Monthly Attendance Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={attendance.monthly}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="present" stackId="a" fill={COLORS.present} name="Present" />
                <Bar dataKey="late" stackId="a" fill={COLORS.late} name="Late" />
                <Bar dataKey="absent" stackId="a" fill={COLORS.absent} name="Absent" />
                <Bar dataKey="excused" stackId="a" fill={COLORS.excused} name="Excused" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Summary by Day of Week */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Attendance by Day of Week</h3>
            <div className="space-y-4">
              {attendance.byDayOfWeek.map(day => (
                <div key={day.day}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium text-gray-700">{day.day}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">
                        {day.present + day.late}/{day.total} present
                      </span>
                      <span className={`text-sm font-semibold ${
                        day.percentage >= 90 ? 'text-green-600' :
                        day.percentage >= 75 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {day.percentage}%
                      </span>
                    </div>
                  </div>
                  <ProgressBar value={day.percentage} className="h-2" />
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Daily Records Tab */}
      {activeTab === 'daily' && (
        <Card className="p-6">
          {/* Month Selector */}
          <div className="flex justify-between items-center mb-6">
            <Button
              variant="outline"
              onClick={() => setSelectedMonth(new Date(selectedMonth.setMonth(selectedMonth.getMonth() - 1)))}
            >
              Previous Month
            </Button>
            <h3 className="text-lg font-semibold">
              {format(selectedMonth, 'MMMM yyyy')}
            </h3>
            <Button
              variant="outline"
              onClick={() => setSelectedMonth(new Date(selectedMonth.setMonth(selectedMonth.getMonth() + 1)))}
            >
              Next Month
            </Button>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2 mb-6">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center font-medium py-2 bg-gray-50 rounded-lg">
                {day}
              </div>
            ))}

            {eachDayOfInterval({
              start: startOfMonth(selectedMonth),
              end: endOfMonth(selectedMonth)
            }).map(date => {
              const record = attendance.daily.find(d => isSameDay(new Date(d.date), date));
              const isToday = isSameDay(date, new Date());
              
              return (
                <div
                  key={date.toISOString()}
                  className={`p-2 border rounded-lg text-center transition-all ${
                    record ? 'cursor-pointer hover:shadow-md' : 'bg-gray-50'
                  } ${isToday ? 'ring-2 ring-primary-500' : ''}`}
                >
                  <div className={`font-medium ${isToday ? 'text-primary-600' : ''}`}>
                    {format(date, 'd')}
                  </div>
                  {record && (
                    <div className="mt-1 flex justify-center">
                      {getStatusIcon(record.status)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Records List */}
          <div>
            <h4 className="font-semibold mb-3 flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              Detailed Records
            </h4>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {attendance.daily
                .filter(d => new Date(d.date) >= startOfMonth(selectedMonth) && new Date(d.date) <= endOfMonth(selectedMonth))
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((record, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(record.status)}
                      <div>
                        <p className="font-medium text-gray-900">
                          {format(new Date(record.date), 'EEEE, MMMM d, yyyy')}
                        </p>
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                          <span>{record.course}</span>
                          <span>•</span>
                          <span>Marked by: {record.markedBy}</span>
                        </div>
                        {record.reason && (
                          <p className="text-xs text-gray-500 mt-1">Reason: {record.reason}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      {getStatusBadge(record.status)}
                      {record.time && (
                        <p className="text-xs text-gray-500 mt-1">{record.time}</p>
                      )}
                      {record.parentNotified && (
                        <div className="flex items-center justify-end mt-1 text-xs text-blue-600">
                          <Bell className="w-3 h-3 mr-1" />
                          Notified
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </Card>
      )}

      {/* By Course Tab */}
      {activeTab === 'by-course' && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Attendance by Course</h3>
          <div className="space-y-4">
            {attendance.byCourse.map(course => (
              <div key={course.course} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-gray-900">{course.course}</h4>
                  <span className={`text-lg font-bold ${
                    course.percentage >= 90 ? 'text-green-600' :
                    course.percentage >= 75 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {course.percentage}%
                  </span>
                </div>
                <ProgressBar value={course.percentage} className="h-2 mb-3" />
                <div className="grid grid-cols-4 gap-2 text-center text-sm">
                  <div>
                    <p className="text-gray-500">Present</p>
                    <p className="font-semibold text-green-600">{course.present}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Late</p>
                    <p className="font-semibold text-yellow-600">{course.late}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Absent</p>
                    <p className="font-semibold text-red-600">{course.absent}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Total</p>
                    <p className="font-semibold">{course.total}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Attendance Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <RePieChart>
                <Pie
                  data={[
                    { name: 'Present', value: attendance.summary.present },
                    { name: 'Late', value: attendance.summary.late },
                    { name: 'Absent', value: attendance.summary.absent },
                    { name: 'Excused', value: attendance.summary.excused }
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                >
                  <Cell fill={COLORS.present} />
                  <Cell fill={COLORS.late} />
                  <Cell fill={COLORS.absent} />
                  <Cell fill={COLORS.excused} />
                </Pie>
                <Tooltip />
              </RePieChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Trend Analysis</h3>
            <div className="space-y-6">
              <div>
                <p className="text-sm text-gray-500 mb-1">Overall Attendance Rate</p>
                <p className="text-3xl font-bold text-primary-600">
                  {attendance.summary.percentage}%
                </p>
                <div className="flex items-center mt-2">
                  <TrendingUp className={`w-4 h-4 mr-1 ${
                    attendance.summary.trend >= 0 ? 'text-green-500' : 'text-red-500'
                  }`} />
                  <span className={attendance.summary.trend >= 0 ? 'text-green-600' : 'text-red-600'}>
                    {attendance.summary.trend >= 0 ? '+' : ''}{attendance.summary.trend}%
                  </span>
                  <span className="text-gray-500 ml-2">vs last month</span>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-semibold mb-3 flex items-center">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Insights & Recommendations
                </h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 mr-2" />
                    Best attendance day: {
                      attendance.byDayOfWeek.reduce((best, current) => 
                        current.percentage > best.percentage ? current : best
                      ).day
                    } - Keep up the good work!
                  </li>
                  <li className="flex items-start">
                    <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-1.5 mr-2" />
                    Needs improvement on: {
                      attendance.byDayOfWeek.reduce((worst, current) => 
                        current.percentage < worst.percentage ? current : worst
                      ).day
                    } - Consider adjusting the morning routine
                  </li>
                  <li className="flex items-start">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 mr-2" />
                    Strongest subject: {
                      attendance.byCourse.reduce((best, current) => 
                        current.percentage > best.percentage ? current : best
                      ).course
                    } - Excellent engagement!
                  </li>
                  <li className="flex items-start">
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-1.5 mr-2" />
                    Total days missed: {attendance.summary.absent} - Review reasons with your child
                  </li>
                </ul>
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-semibold mb-3">Parent Tips</h4>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-blue-800">
                    • Ensure your child arrives at school before 8:00 AM to avoid being marked late<br/>
                    • Notify the school in advance for known absences to have them marked as excused<br/>
                    • Check attendance records regularly to stay informed<br/>
                    • Contact the class teacher if you notice any discrepancies
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