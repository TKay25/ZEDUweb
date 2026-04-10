import React, { useState, useEffect } from 'react';
import {
  Calendar, Clock, Users, CheckCircle,
  XCircle, AlertCircle, Download, Filter,
  ChevronLeft, ChevronRight, Save, UserCheck,
  UserX, Bell, MessageSquare
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, parseISO } from 'date-fns';
import { toast } from 'react-hot-toast';

interface Student {
  id: string;
  name: string;
  email: string;
  parentEmail?: string;
  parentPhone?: string;
}

interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  date: Date;
  status: 'present' | 'absent' | 'late' | 'excused';
  course: string;
  courseId: string;
  checkInTime?: string;
  note?: string;
  markedBy: string;
  parentNotified: boolean;
}

interface Course {
  id: string;
  name: string;
  code: string;
}

interface AttendanceStats {
  present: number;
  absent: number;
  late: number;
  excused: number;
  total: number;
  percentage: number;
}

export const Attendance: React.FC = () => {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showMarker, setShowMarker] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [stats, setStats] = useState<AttendanceStats>({
    present: 0,
    absent: 0,
    late: 0,
    excused: 0,
    total: 0,
    percentage: 0
  });
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showStudentHistory, setShowStudentHistory] = useState(false);
  const [studentHistory, setStudentHistory] = useState<AttendanceRecord[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchAttendanceData();
    fetchCourses();
    fetchStudents();
  }, [selectedCourse, selectedDate]);

  const fetchAttendanceData = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock data - in real app, this comes from API
      const mockRecords = generateMockAttendance();
      setRecords(mockRecords);
      
      // Calculate stats
      const calculatedStats = calculateStats(mockRecords);
      setStats(calculatedStats);
    } catch (error) {
      console.error('Failed to fetch attendance:', error);
      toast.error('Failed to load attendance data');
    }
  };

  const fetchCourses = async () => {
    try {
      // Simulate API call
      const mockCourses: Course[] = [
        { id: '1', name: 'Advanced Mathematics', code: 'MATH301' },
        { id: '2', name: 'Physics Fundamentals', code: 'PHYS101' },
        { id: '3', name: 'English Literature', code: 'ENG201' },
        { id: '4', name: 'Chemistry Essentials', code: 'CHEM101' }
      ];
      setCourses(mockCourses);
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    }
  };

  const fetchStudents = async () => {
    try {
      // Simulate API call
      const mockStudents: Student[] = [
        { id: '1', name: 'John Doe', email: 'john@example.com', parentEmail: 'parent.john@example.com', parentPhone: '+263771234567' },
        { id: '2', name: 'Jane Smith', email: 'jane@example.com', parentEmail: 'parent.jane@example.com', parentPhone: '+263772345678' },
        { id: '3', name: 'Michael Brown', email: 'michael@example.com', parentEmail: 'parent.michael@example.com', parentPhone: '+263773456789' },
        { id: '4', name: 'Sarah Wilson', email: 'sarah@example.com', parentEmail: 'parent.sarah@example.com', parentPhone: '+263774567890' },
        { id: '5', name: 'David Lee', email: 'david@example.com', parentEmail: 'parent.david@example.com', parentPhone: '+263775678901' }
      ];
      setStudents(mockStudents);
    } catch (error) {
      console.error('Failed to fetch students:', error);
    }
  };

  const generateMockAttendance = (): AttendanceRecord[] => {
    const mockRecords: AttendanceRecord[] = [];
    const weekDays = eachDayOfInterval({
      start: startOfWeek(selectedDate),
      end: endOfWeek(selectedDate)
    });

    students.forEach(student => {
      weekDays.forEach(day => {
        // Skip weekends
        if (day.getDay() === 0 || day.getDay() === 6) return;
        
        const rand = Math.random();
        let status: 'present' | 'absent' | 'late' | 'excused' = 'present';
        if (rand < 0.1) status = 'absent';
        else if (rand < 0.18) status = 'late';
        else if (rand < 0.22) status = 'excused';
        
        mockRecords.push({
          id: `${student.id}-${day.toISOString()}`,
          studentId: student.id,
          studentName: student.name,
          date: day,
          status,
          course: selectedCourse !== 'all' ? courses.find(c => c.id === selectedCourse)?.name || '' : 'Multiple Courses',
          courseId: selectedCourse !== 'all' ? selectedCourse : 'all',
          checkInTime: status === 'late' ? '08:45' : status === 'present' ? '08:00' : undefined,
          note: status === 'absent' ? 'No response to check-in' : undefined,
          markedBy: 'Current Teacher',
          parentNotified: status !== 'present'
        });
      });
    });

    return mockRecords;
  };

  const calculateStats = (records: AttendanceRecord[]): AttendanceStats => {
    const present = records.filter(r => r.status === 'present').length;
    const absent = records.filter(r => r.status === 'absent').length;
    const late = records.filter(r => r.status === 'late').length;
    const excused = records.filter(r => r.status === 'excused').length;
    const total = records.length;
    const percentage = total > 0 ? ((present + late) / total) * 100 : 0;
    
    return { present, absent, late, excused, total, percentage };
  };

  const handleSaveAttendance = async (attendanceData: Record<string, string>) => {
    try {
      setSaving(true);
      
      // In real app, this would call an API endpoint
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Process each student's attendance
      for (const [studentId, status] of Object.entries(attendanceData)) {
        const student = students.find(s => s.id === studentId);
        
        // Save attendance record
        console.log(`Saving attendance for ${student?.name}: ${status}`);
        
        // Send notification to parent if absent or late
        if (status === 'absent' || status === 'late') {
          await notifyParent(student, status, selectedDate);
        }
      }
      
      toast.success('Attendance saved successfully! Parents have been notified of absences/lates.');
      setShowMarker(false);
      fetchAttendanceData(); // Refresh data
    } catch (error) {
      console.error('Failed to save attendance:', error);
      toast.error('Failed to save attendance. Please try again.');
      throw error;
    } finally {
      setSaving(false);
    }
  };

  const notifyParent = async (student: Student | undefined, status: string, date: Date) => {
    if (!student) return;
    
    // In real app, this would send WhatsApp/SMS/Email via the API
    console.log(`📧 NOTIFICATION SENT:
      To: ${student.parentEmail || student.email}
      Subject: Attendance Alert - ${student.name}
      Message: Your child ${student.name} was marked ${status} on ${format(date, 'MMMM d, yyyy')}
      Please log into the parent portal for more details.`);
    
    // Simulate API call to send notification
    await new Promise(resolve => setTimeout(resolve, 500));
  };

  const getStudentHistory = async (studentId: string) => {
    try {
      // Fetch student's attendance history
      const history = records.filter(r => r.studentId === studentId);
      setStudentHistory(history);
      setSelectedStudent(students.find(s => s.id === studentId) || null);
      setShowStudentHistory(true);
    } catch (error) {
      console.error('Failed to fetch student history:', error);
      toast.error('Failed to load student history');
    }
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
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const exportReport = () => {
    // Generate CSV report
    const headers = ['Date', 'Student Name', 'Status', 'Course', 'Check-in Time', 'Notes', 'Parent Notified'];
    const csvData = records.map(record => [
      format(record.date, 'yyyy-MM-dd'),
      record.studentName,
      record.status,
      record.course,
      record.checkInTime || 'N/A',
      record.note || 'N/A',
      record.parentNotified ? 'Yes' : 'No'
    ]);
    
    const csvContent = [headers, ...csvData].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance_report_${format(selectedDate, 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Report downloaded successfully');
  };

  const weekDays = eachDayOfInterval({
    start: startOfWeek(selectedDate),
    end: endOfWeek(selectedDate)
  });

  // Attendance Marker Modal
  if (showMarker) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold">Mark Attendance</h2>
                <p className="text-gray-600 mt-1">
                  {selectedCourse !== 'all' 
                    ? courses.find(c => c.id === selectedCourse)?.name 
                    : 'All Courses'} - {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                </p>
              </div>
              <Button variant="ghost" onClick={() => setShowMarker(false)}>
                Cancel
              </Button>
            </div>

            <div className="space-y-4">
              {/* Date selector */}
              <div className="flex items-center space-x-4 mb-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() - 1)))}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous Day
                </Button>
                <input
                  type="date"
                  value={format(selectedDate, 'yyyy-MM-dd')}
                  onChange={(e) => setSelectedDate(parseISO(e.target.value))}
                  className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() + 1)))}
                >
                  Next Day
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>

              {/* Students list for marking */}
              <div className="space-y-3">
                {students.map(student => {
                  const existingRecord = records.find(
                    r => r.studentId === student.id && 
                    format(r.date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
                  );
                  const currentStatus = existingRecord?.status || 'present';

                  return (
                    <div key={student.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{student.name}</p>
                        <p className="text-sm text-gray-500">{student.email}</p>
                      </div>
                      <div className="flex space-x-2">
                        {(['present', 'late', 'absent', 'excused'] as const).map(status => (
                          <button
                            key={status}
                            onClick={() => {
                              // Update status locally
                              const updatedRecords = [...records];
                              const recordIndex = updatedRecords.findIndex(
                                r => r.studentId === student.id && 
                                format(r.date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
                              );
                              if (recordIndex >= 0) {
                                updatedRecords[recordIndex].status = status;
                              } else {
                                updatedRecords.push({
                                  id: `${student.id}-${selectedDate.toISOString()}`,
                                  studentId: student.id,
                                  studentName: student.name,
                                  date: selectedDate,
                                  status,
                                  course: selectedCourse !== 'all' ? courses.find(c => c.id === selectedCourse)?.name || '' : 'Multiple Courses',
                                  courseId: selectedCourse,
                                  markedBy: 'Current Teacher',
                                  parentNotified: false
                                });
                              }
                              setRecords(updatedRecords);
                            }}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                              currentStatus === status
                                ? status === 'present'
                                  ? 'bg-green-500 text-white'
                                  : status === 'late'
                                  ? 'bg-yellow-500 text-white'
                                  : status === 'absent'
                                  ? 'bg-red-500 text-white'
                                  : 'bg-blue-500 text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            <div className="flex items-center space-x-2">
                              {getStatusIcon(status, 'w-4 h-4')}
                              <span>{status.charAt(0).toUpperCase() + status.slice(1)}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Note input */}
              <div className="mt-4">
                <label className="block text-sm font-medium mb-2">Add Note (Optional)</label>
                <textarea
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  rows={3}
                  placeholder="Add any notes about today's attendance..."
                />
              </div>

              {/* Save button */}
              <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
                <Button variant="outline" onClick={() => setShowMarker(false)}>
                  Cancel
                </Button>
                <Button 
                  variant="primary" 
                  onClick={() => {
                    const attendanceData: Record<string, string> = {};
                    students.forEach(student => {
                      const record = records.find(
                        r => r.studentId === student.id && 
                        format(r.date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
                      );
                      attendanceData[student.id] = record?.status || 'present';
                    });
                    handleSaveAttendance(attendanceData);
                  }}
                  disabled={saving}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Attendance & Notify Parents'}
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // Student History Modal
  if (showStudentHistory && selectedStudent) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <Card className="max-w-2xl w-full max-h-[80vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold">{selectedStudent.name}</h2>
                <p className="text-gray-600">Attendance History</p>
              </div>
              <Button variant="ghost" onClick={() => setShowStudentHistory(false)}>
                Close
              </Button>
            </div>

            <div className="space-y-3">
              {studentHistory.map(record => (
                <div key={record.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{format(record.date, 'MMMM d, yyyy')}</p>
                    <p className="text-sm text-gray-500">{record.course}</p>
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
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Attendance Tracking</h1>
          <p className="text-gray-600 mt-1">
            Monitor student attendance and notify parents of absences
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="primary" onClick={() => setShowMarker(true)}>
            <Calendar className="w-4 h-4 mr-2" />
            Mark Attendance
          </Button>
          <Button variant="outline" onClick={exportReport}>
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Info Banner */}
      <Card className="p-4 bg-blue-50 border-blue-200">
        <div className="flex items-start space-x-3">
          <Bell className="w-5 h-5 text-blue-600 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Parent Notifications</p>
            <p>When you mark a student as absent or late, their parents will automatically receive a notification via WhatsApp, SMS, or email.</p>
          </div>
        </div>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="p-4 bg-green-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-700">Present</p>
              <p className="text-2xl font-bold text-green-700">{stats.present}</p>
            </div>
            <UserCheck className="w-8 h-8 text-green-600 opacity-60" />
          </div>
        </Card>
        <Card className="p-4 bg-yellow-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-700">Late</p>
              <p className="text-2xl font-bold text-yellow-700">{stats.late}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-600 opacity-60" />
          </div>
        </Card>
        <Card className="p-4 bg-red-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-700">Absent</p>
              <p className="text-2xl font-bold text-red-700">{stats.absent}</p>
            </div>
            <UserX className="w-8 h-8 text-red-600 opacity-60" />
          </div>
        </Card>
        <Card className="p-4 bg-blue-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-700">Excused</p>
              <p className="text-2xl font-bold text-blue-700">{stats.excused}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-blue-600 opacity-60" />
          </div>
        </Card>
        <Card className="p-4 bg-primary-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-primary-700">Attendance Rate</p>
              <p className="text-2xl font-bold text-primary-700">{stats.percentage.toFixed(1)}%</p>
            </div>
            <Users className="w-8 h-8 text-primary-600 opacity-60" />
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() - 7)))}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="font-medium">
              {format(startOfWeek(selectedDate), 'MMM d')} - {format(endOfWeek(selectedDate), 'MMM d, yyyy')}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() + 7)))}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Courses</option>
            {courses.map(course => (
              <option key={course.id} value={course.id}>{course.name}</option>
            ))}
          </select>
          
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
      </Card>

      {/* Attendance Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                {weekDays.map(day => (
                  <th key={day.toISOString()} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    <div>{format(day, 'EEE')}</div>
                    <div className="text-xs font-normal">{format(day, 'MMM d')}</div>
                  </th>
                ))}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {students.map(student => {
                const studentRecords = records.filter(r => r.studentId === student.id);
                
                return (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{student.name}</p>
                        <p className="text-sm text-gray-500">{student.email}</p>
                      </div>
                    </td>
                    {weekDays.map(day => {
                      const record = studentRecords.find(r => 
                        format(new Date(r.date), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
                      );
                      return (
                        <td key={day.toISOString()} className="px-6 py-4">
                          {record && (
                            <div className="flex items-center space-x-2">
                              {getStatusIcon(record.status)}
                              <span className="text-sm capitalize">{record.status}</span>
                              {record.parentNotified && (
                                <Bell className="w-3 h-3 text-blue-500" />
                              )}
                            </div>
                          )}
                        </td>
                      );
                    })}
                    <td className="px-6 py-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => getStudentHistory(student.id)}
                      >
                        <MessageSquare className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Summary Footer */}
      <Card className="p-4">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            <p>Total Students: {students.length}</p>
            <p className="mt-1">Week of {format(startOfWeek(selectedDate), 'MMMM d, yyyy')}</p>
          </div>
          <div className="text-sm text-gray-600">
            <p className="font-medium">Legend:</p>
            <div className="flex space-x-4 mt-1">
              <div className="flex items-center"><CheckCircle className="w-3 h-3 text-green-500 mr-1" /> Present</div>
              <div className="flex items-center"><Clock className="w-3 h-3 text-yellow-500 mr-1" /> Late</div>
              <div className="flex items-center"><XCircle className="w-3 h-3 text-red-500 mr-1" /> Absent</div>
              <div className="flex items-center"><AlertCircle className="w-3 h-3 text-blue-500 mr-1" /> Excused</div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};