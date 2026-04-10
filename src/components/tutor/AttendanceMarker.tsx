import React, { useState } from 'react';
import { format } from 'date-fns';
import {
  CheckCircle, XCircle, Clock, AlertCircle,
  Search, Save, Calendar, Users,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { toast } from 'react-hot-toast';

interface Student {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  attendanceStatus?: 'present' | 'absent' | 'late' | 'excused';
  checkInTime?: string;
}

interface AttendanceMarkerProps {
  courseId: string;
  courseName: string;
  date: Date;
  students: Student[];
  onSave: (attendance: Record<string, string>) => Promise<void>;
  onDateChange: (date: Date) => void;
}

export const AttendanceMarker: React.FC<AttendanceMarkerProps> = ({
  courseId: _courseId,
  courseName,
  date,
  students,
  onSave,
  onDateChange
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [attendance, setAttendance] = useState<Record<string, string>>(
    students.reduce((acc, student) => ({
      ...acc,
      [student.id]: student.attendanceStatus || 'present'
    }), {})
  );
  const [saving, setSaving] = useState(false);

  // Status options for select
  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'present', label: 'Present' },
    { value: 'absent', label: 'Absent' },
    { value: 'late', label: 'Late' },
    { value: 'excused', label: 'Excused' }
  ];

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || attendance[student.id] === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleStatusChange = (studentId: string, status: string) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const handleMarkAll = (status: string) => {
    const newAttendance = { ...attendance };
    students.forEach(student => {
      newAttendance[student.id] = status;
    });
    setAttendance(newAttendance);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await onSave(attendance);
      toast.success('Attendance saved successfully');
    } catch (error) {
      toast.error('Failed to save attendance');
    } finally {
      setSaving(false);
    }
  };

  const getStatusCounts = () => {
    const counts = {
      present: 0,
      absent: 0,
      late: 0,
      excused: 0,
      total: students.length
    };

    Object.values(attendance).forEach(status => {
      if (status === 'present') counts.present++;
      else if (status === 'absent') counts.absent++;
      else if (status === 'late') counts.late++;
      else if (status === 'excused') counts.excused++;
    });

    return counts;
  };

  const counts = getStatusCounts();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return 'bg-green-100 text-green-800 border-green-200';
      case 'absent': return 'bg-red-100 text-red-800 border-red-200';
      case 'late': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'excused': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Attendance Marker</h1>
          <p className="text-gray-600 mt-1">{courseName}</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={() => onDateChange(new Date(date.setDate(date.getDate() - 1)))}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <div className="flex items-center px-4 py-2 bg-gray-100 rounded-lg">
            <Calendar className="w-5 h-5 text-gray-500 mr-2" />
            <span className="font-medium">{format(date, 'EEEE, MMMM d, yyyy')}</span>
          </div>
          <Button
            variant="outline"
            onClick={() => onDateChange(new Date(date.setDate(date.getDate() + 1)))}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Present</p>
              <p className="text-2xl font-bold text-green-600">{counts.present}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
          <div className="mt-2 text-sm text-gray-500">
            {counts.total > 0 ? ((counts.present / counts.total) * 100).toFixed(1) : '0'}% of class
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Late</p>
              <p className="text-2xl font-bold text-yellow-600">{counts.late}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-500" />
          </div>
          <div className="mt-2 text-sm text-gray-500">
            {counts.total > 0 ? ((counts.late / counts.total) * 100).toFixed(1) : '0'}% of class
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Absent</p>
              <p className="text-2xl font-bold text-red-600">{counts.absent}</p>
            </div>
            <XCircle className="w-8 h-8 text-red-500" />
          </div>
          <div className="mt-2 text-sm text-gray-500">
            {counts.total > 0 ? ((counts.absent / counts.total) * 100).toFixed(1) : '0'}% of class
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Excused</p>
              <p className="text-2xl font-bold text-gray-600">{counts.excused}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-gray-500" />
          </div>
          <div className="mt-2 text-sm text-gray-500">
            {counts.total > 0 ? ((counts.excused / counts.total) * 100).toFixed(1) : '0'}% of class
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <span className="font-medium">Quick Actions</span>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleMarkAll('present')}
            >
              Mark All Present
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleMarkAll('absent')}
            >
              Mark All Absent
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleMarkAll('late')}
            >
              Mark All Late
            </Button>
          </div>
        </div>
      </Card>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            options={statusOptions}
            className="w-40"
          />
        </div>
      </Card>

      {/* Student List */}
      <Card className="overflow-hidden">
        <div className="max-h-[400px] overflow-y-auto">
          <table className="w-full">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Check-in Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      {student.avatar ? (
                        <img
                          src={student.avatar}
                          alt={student.name}
                          className="w-8 h-8 rounded-full mr-3"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-primary-100 rounded-full mr-3 flex items-center justify-center">
                          <Users className="w-4 h-4 text-primary-600" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium">{student.name}</p>
                        <p className="text-sm text-gray-500">{student.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(attendance[student.id])}`}>
                      {attendance[student.id]?.charAt(0).toUpperCase() + attendance[student.id]?.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {attendance[student.id] === 'late' ? (
                      <Input
                        type="time"
                        value={student.checkInTime || '09:00'}
                        onChange={() => {}}
                        className="w-32"
                      />
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleStatusChange(student.id, 'present')}
                        className={`p-1 rounded ${
                          attendance[student.id] === 'present'
                            ? 'text-green-600 bg-green-100'
                            : 'text-gray-400 hover:text-green-600'
                        }`}
                      >
                        <CheckCircle className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleStatusChange(student.id, 'absent')}
                        className={`p-1 rounded ${
                          attendance[student.id] === 'absent'
                            ? 'text-red-600 bg-red-100'
                            : 'text-gray-400 hover:text-red-600'
                        }`}
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleStatusChange(student.id, 'late')}
                        className={`p-1 rounded ${
                          attendance[student.id] === 'late'
                            ? 'text-yellow-600 bg-yellow-100'
                            : 'text-gray-400 hover:text-yellow-600'
                        }`}
                      >
                        <Clock className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleStatusChange(student.id, 'excused')}
                        className={`p-1 rounded ${
                          attendance[student.id] === 'excused'
                            ? 'text-gray-600 bg-gray-100'
                            : 'text-gray-400 hover:text-gray-600'
                        }`}
                      >
                        <AlertCircle className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {filteredStudents.length === 0 && (
        <Card className="p-12 text-center">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-medium mb-2">No Students Found</h3>
          <p className="text-gray-500">
            No students match your search criteria
          </p>
        </Card>
      )}

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          variant="primary"
          onClick={handleSave}
          loading={saving}
        >
          <Save className="w-4 h-4 mr-2" />
          Save Attendance
        </Button>
      </div>
    </div>
  );
};