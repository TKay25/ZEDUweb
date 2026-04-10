import React, { useState } from 'react';
import { 
  format, startOfMonth, endOfMonth, eachDayOfInterval, 
  isSameMonth, isToday, isSameDay, addMonths, subMonths 
} from 'date-fns';
import { 
  ChevronLeft, ChevronRight, CheckCircle, 
  XCircle, Clock, AlertCircle 
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

interface AttendanceCalendarProps {
  attendance: Array<{
    date: Date;
    status: 'present' | 'absent' | 'late' | 'excused';
    course?: string;
    time?: string;
  }>;
  onDateClick?: (date: Date, attendance: any) => void;
}

export const AttendanceCalendar: React.FC<AttendanceCalendarProps> = ({
  attendance,
  onDateClick
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getAttendanceForDate = (date: Date) => {
    return attendance.find(a => isSameDay(new Date(a.date), date));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'absent':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'late':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'excused':
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return 'bg-green-100 text-green-800 border-green-200';
      case 'absent': return 'bg-red-100 text-red-800 border-red-200';
      case 'late': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'excused': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-50 text-gray-400';
    }
  };

  const selectedAttendance = selectedDate ? getAttendanceForDate(selectedDate) : null;

  // Calculate statistics
  const totalDays = attendance.length;
  const present = attendance.filter(a => a.status === 'present').length;
  const absent = attendance.filter(a => a.status === 'absent').length;
  const late = attendance.filter(a => a.status === 'late').length;
  const excused = attendance.filter(a => a.status === 'excused').length;

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{present}</div>
          <div className="text-xs text-gray-600">Present</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">{late}</div>
          <div className="text-xs text-gray-600">Late</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-red-600">{absent}</div>
          <div className="text-xs text-gray-600">Absent</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-gray-600">{excused}</div>
          <div className="text-xs text-gray-600">Excused</div>
        </Card>
      </div>

      {/* Attendance Rate */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Attendance Rate</span>
          <span className="text-lg font-bold text-primary-600">
            {((present / totalDays) * 100).toFixed(1)}%
          </span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-green-500"
            style={{ width: `${(present / totalDays) * 100}%` }}
          />
          <div 
            className="h-full bg-yellow-500"
            style={{ width: `${(late / totalDays) * 100}%` }}
          />
        </div>
      </Card>

      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => setCurrentMonth(new Date())}
            className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            Today
          </button>
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <Card className="overflow-hidden">
        {/* Weekday Headers */}
        <div className="grid grid-cols-7 bg-gray-50 border-b">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-2 text-center text-sm font-medium text-gray-600">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7">
          {monthDays.map((day, i) => {
            const dayAttendance = getAttendanceForDate(day);
            const isSelected = selectedDate && isSameDay(day, selectedDate);
            
            return (
              <div
                key={i}
                onClick={() => {
                  setSelectedDate(day);
                  onDateClick?.(day, dayAttendance);
                }}
                className={`
                  min-h-[100px] p-2 border-b border-r cursor-pointer transition-colors
                  ${!isSameMonth(day, currentMonth) ? 'bg-gray-50' : 'bg-white'}
                  ${isToday(day) ? 'bg-blue-50' : ''}
                  ${isSelected ? 'ring-2 ring-primary-500 ring-inset' : ''}
                  hover:bg-gray-50
                `}
              >
                <div className="flex justify-between items-start">
                  <span className={`
                    text-sm font-medium
                    ${isToday(day) ? 'text-primary-600' : 'text-gray-700'}
                  `}>
                    {format(day, 'd')}
                  </span>
                  {dayAttendance && (
                    <div className="flex items-center">
                      {getStatusIcon(dayAttendance.status)}
                    </div>
                  )}
                </div>

                {dayAttendance && dayAttendance.course && (
                  <div className="mt-1">
                    <div className="text-xs text-gray-600 truncate">
                      {dayAttendance.course}
                    </div>
                    {dayAttendance.time && (
                      <div className="text-xs text-gray-400">
                        {dayAttendance.time}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {/* Selected Date Details */}
      {selectedDate && selectedAttendance && (
        <Card className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold mb-1">
                {format(selectedDate, 'EEEE, MMMM d, yyyy')}
              </h3>
              <div className="flex items-center space-x-2 mb-3">
                <Badge className={getStatusColor(selectedAttendance.status)}>
                  <span className="flex items-center">
                    {getStatusIcon(selectedAttendance.status)}
                    <span className="ml-1 capitalize">{selectedAttendance.status}</span>
                  </span>
                </Badge>
                {selectedAttendance.course && (
                  <span className="text-sm text-gray-600">
                    {selectedAttendance.course}
                  </span>
                )}
              </div>

              {selectedAttendance.status === 'late' && selectedAttendance.time && (
                <p className="text-sm text-gray-600">
                  Arrived at: {selectedAttendance.time}
                </p>
              )}
            </div>

            <button
              onClick={() => setSelectedDate(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              <XCircle className="w-5 h-5" />
            </button>
          </div>
        </Card>
      )}
    </div>
  );
};