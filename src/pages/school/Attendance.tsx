// src/pages/school/Attendance.tsx
import React, { useState, useEffect } from 'react';
import {
  Calendar, Clock, CheckCircle, XCircle,
  AlertCircle, Download, Search,
  TrendingUp, TrendingDown,
  ChevronLeft, ChevronRight,
  Bell, Eye, RefreshCw
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, subMonths } from 'date-fns';
import { toast } from 'react-hot-toast';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface AttendanceRecord {
  id: string;
  date: Date;
  studentId: string;
  studentName: string;
  studentClass: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  checkInTime?: string;
  checkOutTime?: string;
  reason?: string;
  markedBy: string;
  markedByRole: 'teacher' | 'admin';
  markedAt: Date;
  parentNotified: boolean;
  notificationSentAt?: Date;
}

interface AttendanceSummary {
  date: string;
  total: number;
  present: number;
  absent: number;
  late: number;
  excused: number;
  percentage: number;
}

interface ClassAttendance {
  className: string;
  total: number;
  present: number;
  absent: number;
  late: number;
  excused: number;
  percentage: number;
  teacherName: string;
}

interface StudentAttendance {
  studentId: string;
  studentName: string;
  studentClass: string;
  parentEmail: string;
  parentPhone: string;
  total: number;
  present: number;
  absent: number;
  late: number;
  excused: number;
  percentage: number;
  trend: number;
  lastAbsence?: Date;
}

interface TeacherPerformance {
  teacherId: string;
  teacherName: string;
  className: string;
  totalMarked: number;
  onTimeMarking: number;
  lateMarking: number;
  averageAttendance: number;
}

const COLORS = {
  present: '#10b981',
  absent: '#ef4444',
  late: '#f59e0b',
  excused: '#6b7280'
};

export const Attendance: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [summary, setSummary] = useState<AttendanceSummary[]>([]);
  const [classStats, setClassStats] = useState<ClassAttendance[]>([]);
  const [studentStats, setStudentStats] = useState<StudentAttendance[]>([]);
  const [teacherPerformance, setTeacherPerformance] = useState<TeacherPerformance[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedView, setSelectedView] = useState<'daily' | 'summary' | 'students' | 'teachers'>('daily');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<StudentAttendance | null>(null);
  const [showStudentDetails, setShowStudentDetails] = useState(false);
  const [studentHistory, setStudentHistory] = useState<AttendanceRecord[]>([]);
  const [showNotificationHistory, setShowNotificationHistory] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    loadAttendanceData();
  }, [selectedDate, selectedClass]);

  const loadAttendanceData = async () => {
    try {
      setLoading(true);
      // Simulate API call - in production, this would fetch from your backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data that reflects real system data flow
      const mockAttendance = generateMockAttendance();
      const mockSummary = generateMockSummary();
      const mockClassStats = generateMockClassStats();
      const mockStudentStats = generateMockStudentStats();
      const mockTeacherPerformance = generateMockTeacherPerformance();
      
      setAttendance(mockAttendance);
      setSummary(mockSummary);
      setClassStats(mockClassStats);
      setStudentStats(mockStudentStats);
      setTeacherPerformance(mockTeacherPerformance);
    } catch (error) {
      toast.error('Failed to load attendance data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const generateMockAttendance = (): AttendanceRecord[] => {
    const records: AttendanceRecord[] = [];
    const classes = ['Form 1A', 'Form 1B', 'Form 2A', 'Form 2B', 'Form 3A'];
    const students = [
      { id: 's1', name: 'John Doe', parentEmail: 'parent.john@example.com', parentPhone: '+263771234567' },
      { id: 's2', name: 'Jane Smith', parentEmail: 'parent.jane@example.com', parentPhone: '+263772345678' },
      { id: 's3', name: 'Michael Brown', parentEmail: 'parent.michael@example.com', parentPhone: '+263773456789' },
      { id: 's4', name: 'Sarah Wilson', parentEmail: 'parent.sarah@example.com', parentPhone: '+263774567890' },
      { id: 's5', name: 'David Lee', parentEmail: 'parent.david@example.com', parentPhone: '+263775678901' }
    ];
    const teachers = [
      { name: 'Mrs. Sarah Johnson', role: 'teacher' as const },
      { name: 'Mr. Michael Chen', role: 'teacher' as const },
      { name: 'Dr. Patricia Moyo', role: 'teacher' as const }
    ];

    classes.forEach(className => {
      students.forEach(student => {
        const rand = Math.random();
        let status: 'present' | 'absent' | 'late' | 'excused' = 'present';
        let parentNotified = false;
        let reason;
        
        if (rand < 0.08) {
          status = 'absent';
          parentNotified = true;
          reason = 'Sick - Flu symptoms';
        } else if (rand < 0.15) {
          status = 'late';
          parentNotified = true;
          reason = 'Traffic delay';
        } else if (rand < 0.18) {
          status = 'excused';
          parentNotified = true;
          reason = 'Doctor appointment';
        }
        
        const teacher = teachers[Math.floor(Math.random() * teachers.length)];
        
        records.push({
          id: `${student.id}-${selectedDate.toISOString()}`,
          date: selectedDate,
          studentId: student.id,
          studentName: student.name,
          studentClass: className,
          status,
          checkInTime: status !== 'absent' ? '08:00' : undefined,
          checkOutTime: '15:00',
          reason,
          markedBy: teacher.name,
          markedByRole: teacher.role,
          markedAt: new Date(),
          parentNotified,
          notificationSentAt: parentNotified ? new Date() : undefined
        });
      });
    });

    return records;
  };

  const generateMockSummary = (): AttendanceSummary[] => {
    const weekDays = eachDayOfInterval({
      start: startOfWeek(selectedDate),
      end: endOfWeek(selectedDate)
    });
    
    return weekDays.map(day => ({
      date: format(day, 'EEE'),
      total: 150,
      present: Math.floor(120 + Math.random() * 20),
      absent: Math.floor(5 + Math.random() * 10),
      late: Math.floor(3 + Math.random() * 8),
      excused: Math.floor(2 + Math.random() * 5),
      percentage: 80 + Math.random() * 15
    }));
  };

  const generateMockClassStats = (): ClassAttendance[] => {
    const classes = ['Form 1A', 'Form 1B', 'Form 2A', 'Form 2B', 'Form 3A'];
    const teachers = ['Mrs. Sarah Johnson', 'Mr. Michael Chen', 'Dr. Patricia Moyo', 'Prof. James Wilson', 'Ms. Elizabeth Taylor'];
    
    return classes.map((className, index) => ({
      className,
      total: 30,
      present: 25 + Math.floor(Math.random() * 5),
      absent: Math.floor(Math.random() * 3),
      late: Math.floor(Math.random() * 3),
      excused: Math.floor(Math.random() * 2),
      percentage: 80 + Math.random() * 15,
      teacherName: teachers[index]
    }));
  };

  const generateMockStudentStats = (): StudentAttendance[] => {
    const students = [
      { id: 's1', name: 'John Doe', class: 'Form 1A', parentEmail: 'parent.john@example.com', parentPhone: '+263771234567' },
      { id: 's2', name: 'Jane Smith', class: 'Form 1A', parentEmail: 'parent.jane@example.com', parentPhone: '+263772345678' },
      { id: 's3', name: 'Michael Brown', class: 'Form 2A', parentEmail: 'parent.michael@example.com', parentPhone: '+263773456789' },
      { id: 's4', name: 'Sarah Wilson', class: 'Form 2B', parentEmail: 'parent.sarah@example.com', parentPhone: '+263774567890' },
      { id: 's5', name: 'David Lee', class: 'Form 3A', parentEmail: 'parent.david@example.com', parentPhone: '+263775678901' }
    ];
    
    return students.map(student => ({
      studentId: student.id,
      studentName: student.name,
      studentClass: student.class,
      parentEmail: student.parentEmail,
      parentPhone: student.parentPhone,
      total: 20,
      present: 14 + Math.floor(Math.random() * 6),
      absent: Math.floor(Math.random() * 3),
      late: Math.floor(Math.random() * 3),
      excused: Math.floor(Math.random() * 2),
      percentage: 70 + Math.random() * 25,
      trend: -5 + Math.random() * 15,
      lastAbsence: Math.random() > 0.7 ? new Date() : undefined
    }));
  };

  const generateMockTeacherPerformance = (): TeacherPerformance[] => {
    const teachers = [
      { id: 't1', name: 'Mrs. Sarah Johnson', class: 'Form 1A' },
      { id: 't2', name: 'Mr. Michael Chen', class: 'Form 1B' },
      { id: 't3', name: 'Dr. Patricia Moyo', class: 'Form 2A' },
      { id: 't4', name: 'Prof. James Wilson', class: 'Form 2B' },
      { id: 't5', name: 'Ms. Elizabeth Taylor', class: 'Form 3A' }
    ];
    
    return teachers.map(teacher => ({
      teacherId: teacher.id,
      teacherName: teacher.name,
      className: teacher.class,
      totalMarked: 20,
      onTimeMarking: 15 + Math.floor(Math.random() * 5),
      lateMarking: Math.floor(Math.random() * 5),
      averageAttendance: 75 + Math.random() * 20
    }));
  };

  const viewStudentHistory = async (student: StudentAttendance) => {
    setSelectedStudent(student);
    const history = attendance.filter(a => a.studentId === student.studentId);
    setStudentHistory(history);
    setShowStudentDetails(true);
  };

  const viewNotificationHistory = async () => {
    // In production, fetch from API
    const mockNotifications = attendance
      .filter(a => a.parentNotified)
      .map(a => ({
        id: a.id,
        studentName: a.studentName,
        status: a.status,
        date: a.date,
        reason: a.reason,
        sentAt: a.notificationSentAt,
        method: 'WhatsApp & SMS'
      }));
    setNotifications(mockNotifications);
    setShowNotificationHistory(true);
  };

  const handleExportAttendance = async () => {
    try {
      // In production, call schoolAPI.generateReport
      toast.success('Attendance report exported successfully');
    } catch (error) {
      toast.error('Failed to export attendance');
      console.error(error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'absent': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'late': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'excused': return <AlertCircle className="w-4 h-4 text-blue-500" />;
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

  if (loading) {
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
          <h1 className="text-2xl font-bold text-gray-900">Attendance Management</h1>
          <p className="text-gray-600 mt-1">
            School-wide attendance oversight and reporting
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={viewNotificationHistory}>
            <Bell className="w-4 h-4 mr-2" />
            Notifications
          </Button>
          <Button variant="outline" onClick={handleExportAttendance}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" onClick={() => loadAttendanceData()}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Info Banner */}
      <Card className="p-4 bg-blue-50 border-blue-200">
        <div className="flex items-start space-x-3">
          <Eye className="w-5 h-5 text-blue-600 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">School Admin View</p>
            <p>You have read-only access to all attendance records. Teachers mark daily attendance, and parents are automatically notified of absences and late arrivals.</p>
          </div>
        </div>
      </Card>

      {/* Date and Class Selector */}
      <Card className="p-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedDate(subMonths(selectedDate, 1))}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <div className="px-4 py-2 bg-gray-100 rounded-lg">
                <Calendar className="w-4 h-4 inline mr-2" />
                <span className="font-medium">{format(selectedDate, 'MMMM yyyy')}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedDate(new Date())}
              >
                Today
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedDate(subMonths(selectedDate, -1))}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Classes</option>
              <option value="form1a">Form 1A</option>
              <option value="form1b">Form 1B</option>
              <option value="form2a">Form 2A</option>
              <option value="form2b">Form 2B</option>
              <option value="form3a">Form 3A</option>
            </select>
          </div>

          <div className="flex space-x-2">
            <Button
              variant={selectedView === 'daily' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setSelectedView('daily')}
            >
              Daily View
            </Button>
            <Button
              variant={selectedView === 'summary' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setSelectedView('summary')}
            >
              Analytics
            </Button>
            <Button
              variant={selectedView === 'students' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setSelectedView('students')}
            >
              Student Report
            </Button>
            <Button
              variant={selectedView === 'teachers' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setSelectedView('teachers')}
            >
              Teacher Performance
            </Button>
          </div>
        </div>
      </Card>

      {/* Daily View */}
      {selectedView === 'daily' && (
        <div className="space-y-6">
          {/* Today's Summary */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Card className="p-4">
              <p className="text-sm text-gray-500">Total Students</p>
              <p className="text-2xl font-bold">{attendance.length}</p>
            </Card>
            <Card className="p-4 bg-green-50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600">Present</p>
                  <p className="text-2xl font-bold text-green-700">
                    {attendance.filter(a => a.status === 'present').length}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </Card>
            <Card className="p-4 bg-red-50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-red-600">Absent</p>
                  <p className="text-2xl font-bold text-red-700">
                    {attendance.filter(a => a.status === 'absent').length}
                  </p>
                </div>
                <XCircle className="w-8 h-8 text-red-500" />
              </div>
            </Card>
            <Card className="p-4 bg-yellow-50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-yellow-600">Late</p>
                  <p className="text-2xl font-bold text-yellow-700">
                    {attendance.filter(a => a.status === 'late').length}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-yellow-500" />
              </div>
            </Card>
            <Card className="p-4 bg-blue-50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600">Parent Notifications</p>
                  <p className="text-2xl font-bold text-blue-700">
                    {attendance.filter(a => a.parentNotified).length}
                  </p>
                </div>
                <Bell className="w-8 h-8 text-blue-500" />
              </div>
            </Card>
          </div>

          {/* Attendance Table */}
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Class</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Marked By</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Parent Notified</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {attendance.map(record => (
                    <tr key={record.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{record.studentName}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{record.studentClass}</td>
                      <td className="px-6 py-4">{getStatusBadge(record.status)}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{record.markedBy}</td>
                      <td className="px-6 py-4">
                        {record.parentNotified ? (
                          <Badge className="bg-blue-100 text-blue-800">
                            <Bell className="w-3 h-3 mr-1" />
                            Sent
                          </Badge>
                        ) : (
                          <Badge className="bg-gray-100 text-gray-600">Not Required</Badge>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{record.reason || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* Analytics View */}
      {selectedView === 'summary' && (
        <div className="space-y-6">
          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Daily Trend */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Daily Attendance Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={summary}>
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
                  <Area type="monotone" dataKey="percentage" stroke="#3b82f6" fillOpacity={1} fill="url(#attendanceGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </Card>

            {/* Distribution */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Attendance Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Present', value: summary.reduce((acc, d) => acc + d.present, 0) },
                      { name: 'Late', value: summary.reduce((acc, d) => acc + d.late, 0) },
                      { name: 'Absent', value: summary.reduce((acc, d) => acc + d.absent, 0) },
                      { name: 'Excused', value: summary.reduce((acc, d) => acc + d.excused, 0) }
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
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Class Statistics */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Class Attendance Overview</h3>
            <div className="space-y-4">
              {classStats.map(cls => (
                <div key={cls.className}>
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <span className="font-medium">{cls.className}</span>
                      <span className="text-sm text-gray-500 ml-2">
                        Teacher: {cls.teacherName}
                      </span>
                      <span className="text-sm text-gray-500 ml-2">
                        ({cls.present + cls.late}/{cls.total} present)
                      </span>
                    </div>
                    <span className={`text-lg font-bold ${
                      cls.percentage >= 90 ? 'text-green-600' :
                      cls.percentage >= 75 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {cls.percentage.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        cls.percentage >= 90 ? 'bg-green-500' :
                        cls.percentage >= 75 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${cls.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Student Report View */}
      {selectedView === 'students' && (
        <div className="space-y-6">
          {/* Search */}
          <Card className="p-4">
            <Input
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="w-4 h-4" />}
            />
          </Card>

          {/* Student Statistics */}
          <div className="space-y-4">
            {studentStats
              .filter(student => student.studentName.toLowerCase().includes(searchTerm.toLowerCase()))
              .map(student => (
                <Card key={student.studentId} className="p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => viewStudentHistory(student)}>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">{student.studentName}</h3>
                      <p className="text-sm text-gray-500">{student.studentClass}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        Parent: {student.parentEmail}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary-600">
                        {student.percentage.toFixed(1)}%
                      </p>
                      <div className="flex items-center mt-1">
                        {student.trend > 0 ? (
                          <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                        )}
                        <span className={student.trend > 0 ? 'text-green-600' : 'text-red-600'}>
                          {student.trend > 0 ? '+' : ''}{student.trend.toFixed(1)}%
                        </span>
                      </div>
                      {student.lastAbsence && (
                        <p className="text-xs text-red-500 mt-1">
                          Last absent: {format(student.lastAbsence, 'MMM d')}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-4 text-center">
                    <div>
                      <p className="text-sm text-gray-500">Present</p>
                      <p className="text-xl font-bold text-green-600">{student.present}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Late</p>
                      <p className="text-xl font-bold text-yellow-600">{student.late}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Absent</p>
                      <p className="text-xl font-bold text-red-600">{student.absent}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Excused</p>
                      <p className="text-xl font-bold text-blue-600">{student.excused}</p>
                    </div>
                  </div>

                  <div className="mt-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full transition-all"
                        style={{ width: `${student.percentage}%` }}
                      />
                    </div>
                  </div>
                </Card>
              ))}
          </div>
        </div>
      )}

      {/* Teacher Performance View */}
      {selectedView === 'teachers' && (
        <div className="space-y-4">
          {teacherPerformance.map(teacher => (
            <Card key={teacher.teacherId} className="p-4">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900">{teacher.teacherName}</h3>
                  <p className="text-sm text-gray-500">{teacher.className}</p>
                </div>
                <Badge className="bg-primary-100 text-primary-800">
                  Attendance Rate: {teacher.averageAttendance.toFixed(1)}%
                </Badge>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">{teacher.totalMarked}</p>
                  <p className="text-sm text-gray-500">Days Marked</p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">{teacher.onTimeMarking}</p>
                  <p className="text-sm text-green-600">On-Time Marking</p>
                </div>
                <div className="text-center p-3 bg-yellow-50 rounded-lg">
                  <p className="text-2xl font-bold text-yellow-600">{teacher.lateMarking}</p>
                  <p className="text-sm text-yellow-600">Late Marking</p>
                </div>
              </div>
              
              <div className="mt-2">
                <div className="flex justify-between text-sm mb-1">
                  <span>On-Time Marking Rate</span>
                  <span className="font-medium">
                    {((teacher.onTimeMarking / teacher.totalMarked) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${(teacher.onTimeMarking / teacher.totalMarked) * 100}%` }}
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Student Details Modal */}
      {showStudentDetails && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-bold">{selectedStudent.studentName}</h2>
                  <p className="text-gray-600">{selectedStudent.studentClass}</p>
                </div>
                <Button variant="ghost" onClick={() => setShowStudentDetails(false)}>
                  Close
                </Button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-600">Attendance Rate</p>
                    <p className="text-2xl font-bold text-green-700">{selectedStudent.percentage.toFixed(1)}%</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-600">Parent Contact</p>
                    <p className="text-sm font-medium">{selectedStudent.parentEmail}</p>
                    <p className="text-sm">{selectedStudent.parentPhone}</p>
                  </div>
                </div>
                
                <h3 className="font-semibold mt-4">Recent Attendance History</h3>
                <div className="space-y-2">
                  {studentHistory.slice(0, 10).map(record => (
                    <div key={record.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{format(record.date, 'MMM d, yyyy')}</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        {getStatusBadge(record.status)}
                        {record.parentNotified && (
                          <Bell className="w-4 h-4 text-blue-500" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Notification History Modal */}
      {showNotificationHistory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold">Parent Notifications</h2>
                <Button variant="ghost" onClick={() => setShowNotificationHistory(false)}>
                  Close
                </Button>
              </div>
              
              <div className="space-y-3">
                {notifications.map(notification => (
                  <div key={notification.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{notification.studentName}</p>
                        <p className="text-sm text-gray-600">
                          Status: <span className="capitalize">{notification.status}</span>
                        </p>
                        {notification.reason && (
                          <p className="text-sm text-gray-600">Reason: {notification.reason}</p>
                        )}
                        <p className="text-xs text-gray-400 mt-1">
                          Sent: {format(notification.sentAt, 'MMM d, yyyy HH:mm')}
                        </p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">
                        {notification.method}
                      </Badge>
                    </div>
                  </div>
                ))}
                {notifications.length === 0 && (
                  <p className="text-center text-gray-500 py-8">No notifications sent</p>
                )}
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};