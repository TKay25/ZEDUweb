import React, { useState, useEffect } from 'react';
import {
  Clock, CheckCircle, XCircle,
  AlertCircle, Download, Calendar as CalendarIcon,
  ChevronLeft, ChevronRight, Users, UserCheck,
  UserX, AlertTriangle, Info
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import AttendanceCalendar from '../../components/student/AttendanceCalendar';

// Define the AttendanceRecord interface
interface AttendanceRecord {
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  course: string;
  time: string;
  markedBy?: string;
  note?: string;
}

interface Stats {
  present: number;
  absent: number;
  late: number;
  excused: number;
  total: number;
  percentage: number;
}

interface AttendanceSummary {
  totalDays: number;
  presentDays: number;
  absentDays: number;
  lateDays: number;
  excusedDays: number;
  attendanceRate: number;
  lastUpdated: Date;
}

export const Attendance: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [stats, setStats] = useState<Stats>({
    present: 0,
    absent: 0,
    late: 0,
    excused: 0,
    total: 0,
    percentage: 0
  });
  const [summary, setSummary] = useState<AttendanceSummary | null>(null);

  useEffect(() => {
    loadAttendance();
  }, [selectedMonth, selectedYear]);

  const loadAttendance = async () => {
    try {
      setLoading(true);
      // Simulate API call to get attendance data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // This data would come from your backend API
      // In a real system, teachers mark attendance, and students/parents view it
      const mockAttendance = generateMockAttendance();
      setAttendance(mockAttendance);
      
      // Calculate statistics
      const calculatedStats = calculateStats(mockAttendance);
      setStats(calculatedStats);
      
      // Generate summary for the academic term/year
      const termSummary = generateTermSummary(mockAttendance);
      setSummary(termSummary);
      
    } catch (error) {
      console.error('Failed to load attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateMockAttendance = (): AttendanceRecord[] => {
    const records: AttendanceRecord[] = [];
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    
    // Mock teachers who marked attendance
    const teachers = [
      'Mrs. Sarah Johnson',
      'Mr. Michael Chen',
      'Dr. Patricia Moyo',
      'Prof. James Wilson'
    ];
    
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(selectedYear, selectedMonth, i);
      // Skip weekends (no classes)
      if (date.getDay() === 0 || date.getDay() === 6) continue;
      
      // More realistic attendance pattern
      const dayOfWeek = date.getDay();
      const isFriday = dayOfWeek === 5;
      const isMonday = dayOfWeek === 1;
      
      let status: 'present' | 'absent' | 'late' | 'excused' = 'present';
      let probability = Math.random();
      
      // Different patterns for different days
      if (isMonday) {
        if (probability < 0.08) status = 'absent';
        else if (probability < 0.15) status = 'late';
        else if (probability < 0.2) status = 'excused';
      } else if (isFriday) {
        if (probability < 0.05) status = 'absent';
        else if (probability < 0.18) status = 'late';
        else if (probability < 0.22) status = 'excused';
      } else {
        if (probability < 0.05) status = 'absent';
        else if (probability < 0.12) status = 'late';
        else if (probability < 0.15) status = 'excused';
      }
      
      const markedBy = teachers[Math.floor(Math.random() * teachers.length)];
      
      let note;
      if (status === 'absent') {
        const notes = ['Medical appointment', 'Family emergency', 'Sick leave', 'Religious holiday'];
        note = notes[Math.floor(Math.random() * notes.length)];
      } else if (status === 'late') {
        const notes = ['Traffic delay', 'Bus arrived late', 'Doctor appointment', 'Weather conditions'];
        note = notes[Math.floor(Math.random() * notes.length)];
      } else if (status === 'excused') {
        const notes = ['School event', 'Approved leave', 'Family commitment', 'Sports competition'];
        note = notes[Math.floor(Math.random() * notes.length)];
      }
      
      records.push({
        date: date.toISOString().split('T')[0],
        status,
        course: i % 3 === 0 ? 'Advanced Mathematics' : i % 3 === 1 ? 'Physics Fundamentals' : 'English Literature',
        time: status === 'late' ? `${8 + Math.floor(Math.random() * 2)}:${Math.random() > 0.5 ? '15' : '30'}` : '08:00',
        markedBy,
        note
      });
    }
    
    return records;
  };

  const calculateStats = (records: AttendanceRecord[]): Stats => {
    const calculatedStats = {
      present: records.filter(a => a.status === 'present').length,
      absent: records.filter(a => a.status === 'absent').length,
      late: records.filter(a => a.status === 'late').length,
      excused: records.filter(a => a.status === 'excused').length,
      total: records.length,
      percentage: 0
    };
    calculatedStats.percentage = ((calculatedStats.present + calculatedStats.late) / calculatedStats.total) * 100;
    return calculatedStats;
  };

  const generateTermSummary = (records: AttendanceRecord[]): AttendanceSummary => {
    const presentCount = records.filter(a => a.status === 'present').length;
    const absentCount = records.filter(a => a.status === 'absent').length;
    const lateCount = records.filter(a => a.status === 'late').length;
    const excusedCount = records.filter(a => a.status === 'excused').length;
    const totalDays = records.length;
    const attendanceRate = ((presentCount + lateCount) / totalDays) * 100;
    
    return {
      totalDays,
      presentDays: presentCount,
      absentDays: absentCount,
      lateDays: lateCount,
      excusedDays: excusedCount,
      attendanceRate,
      lastUpdated: new Date()
    };
  };

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const years = [2023, 2024, 2025];

  const handleMonthChange = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      if (selectedMonth === 0) {
        setSelectedMonth(11);
        setSelectedYear(selectedYear - 1);
      } else {
        setSelectedMonth(selectedMonth - 1);
      }
    } else {
      if (selectedMonth === 11) {
        setSelectedMonth(0);
        setSelectedYear(selectedYear + 1);
      } else {
        setSelectedMonth(selectedMonth + 1);
      }
    }
  };

  const downloadReport = () => {
    // Generate CSV report
    const headers = ['Date', 'Status', 'Course', 'Time', 'Marked By', 'Notes'];
    const csvData = attendance.map(record => [
      record.date,
      record.status,
      record.course,
      record.time,
      record.markedBy || 'N/A',
      record.note || 'N/A'
    ]);
    
    const csvContent = [headers, ...csvData].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance_report_${selectedMonth + 1}_${selectedYear}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Attendance Record</h1>
          <p className="text-gray-600 mt-1">
            Track your class attendance and view detailed history
          </p>
        </div>
        <Button variant="outline" onClick={downloadReport}>
          <Download className="w-4 h-4 mr-2" />
          Download Report
        </Button>
      </div>

      {/* Info Banner */}
      <Card className="p-4 bg-blue-50 border-blue-200">
        <div className="flex items-start space-x-3">
          <Info className="w-5 h-5 text-blue-600 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">About Your Attendance</p>
            <p>Attendance is marked daily by your teachers. If you notice any discrepancies, please contact your teacher or the school administration office.</p>
          </div>
        </div>
      </Card>

      {/* Stats Cards - Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="p-4 bg-green-50 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-700 font-medium">Present</p>
              <p className="text-2xl font-bold text-green-700">{stats.present}</p>
            </div>
            <UserCheck className="w-8 h-8 text-green-600 opacity-60" />
          </div>
        </Card>
        <Card className="p-4 bg-red-50 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-700 font-medium">Absent</p>
              <p className="text-2xl font-bold text-red-700">{stats.absent}</p>
            </div>
            <UserX className="w-8 h-8 text-red-600 opacity-60" />
          </div>
        </Card>
        <Card className="p-4 bg-yellow-50 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-700 font-medium">Late</p>
              <p className="text-2xl font-bold text-yellow-700">{stats.late}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-600 opacity-60" />
          </div>
        </Card>
        <Card className="p-4 bg-blue-50 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-700 font-medium">Excused</p>
              <p className="text-2xl font-bold text-blue-700">{stats.excused}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-blue-600 opacity-60" />
          </div>
        </Card>
        <Card className="p-4 bg-primary-50 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-primary-700 font-medium">Attendance Rate</p>
              <p className="text-2xl font-bold text-primary-700">
                {stats.percentage.toFixed(1)}%
              </p>
            </div>
            <Users className="w-8 h-8 text-primary-600 opacity-60" />
          </div>
        </Card>
      </div>

      {/* Term Summary */}
      {summary && (
        <Card className="p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Term Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-gray-500">Total School Days</p>
              <p className="text-lg font-semibold">{summary.totalDays}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Days Attended</p>
              <p className="text-lg font-semibold text-green-600">{summary.presentDays + summary.lateDays}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Days Missed</p>
              <p className="text-lg font-semibold text-red-600">{summary.absentDays}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Last Updated</p>
              <p className="text-sm font-medium">{summary.lastUpdated.toLocaleDateString()}</p>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t">
            <div className="flex justify-between text-sm mb-1">
              <span>Overall Attendance Rate</span>
              <span className="font-semibold">{summary.attendanceRate.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-primary-600 rounded-full h-2 transition-all duration-500"
                style={{ width: `${Math.min(100, summary.attendanceRate)}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {summary.attendanceRate >= 90 
                ? "Excellent attendance! Keep up the good work!" 
                : summary.attendanceRate >= 75 
                ? "Good attendance, but try to improve."
                : "Please work on improving your attendance."}
            </p>
          </div>
        </Card>
      )}

      {/* Month Navigation */}
      <Card className="p-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleMonthChange('prev')}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div className="flex items-center space-x-2">
              <CalendarIcon className="w-5 h-5 text-gray-500" />
              <h2 className="text-lg font-semibold">
                {months[selectedMonth]} {selectedYear}
              </h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleMonthChange('next')}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={selectedMonth.toString()}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
            >
              {months.map((month, index) => (
                <option key={month} value={index}>{month}</option>
              ))}
            </select>
            <select
              value={selectedYear.toString()}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
            >
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Attendance Calendar View */}
      <AttendanceCalendar
        records={attendance}
        month={selectedMonth}
        year={selectedYear}
        className="w-full"
      />

      {/* Legend and Information */}
      <Card className="p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
              <span className="text-sm text-gray-700">Present - Attended class on time</span>
            </div>
            <div className="flex items-center">
              <XCircle className="w-4 h-4 text-red-500 mr-2" />
              <span className="text-sm text-gray-700">Absent - Missed class without excuse</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 text-yellow-500 mr-2" />
              <span className="text-sm text-gray-700">Late - Arrived after scheduled time</span>
            </div>
            <div className="flex items-center">
              <AlertCircle className="w-4 h-4 text-blue-500 mr-2" />
              <span className="text-sm text-gray-700">Excused - Absence with valid reason</span>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <AlertTriangle className="w-4 h-4" />
            <span>Hover over dates to view attendance status</span>
          </div>
        </div>
      </Card>
    </div>
  );
};