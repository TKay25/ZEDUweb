import React from 'react';

interface AttendanceRecord {
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  course?: string;
}

interface AttendanceCalendarProps {
  records: AttendanceRecord[];
  month?: number;
  year?: number;
  className?: string;
}

const AttendanceCalendar: React.FC<AttendanceCalendarProps> = ({
  records,
  month = new Date().getMonth(),
  year = new Date().getFullYear(),
  className = ''
}) => {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  const getStatusForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const record = records.find(r => r.date.startsWith(dateStr));
    return record?.status || null;
  };

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'present': return 'bg-green-500';
      case 'absent': return 'bg-red-500';
      case 'late': return 'bg-yellow-500';
      case 'excused': return 'bg-blue-500';
      default: return 'bg-gray-200';
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow p-4 ${className}`}>
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold">
          {new Date(year, month).toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h3>
      </div>
      
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-sm font-medium text-gray-600">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {blanks.map(blank => (
          <div key={`blank-${blank}`} className="aspect-square" />
        ))}
        
        {days.map(day => {
          const status = getStatusForDay(day);
          return (
            <div
              key={day}
              className={`aspect-square flex items-center justify-center rounded-lg ${getStatusColor(status)} ${
                status ? 'text-white' : 'text-gray-700'
              }`}
            >
              <span className="text-sm">{day}</span>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex space-x-4 text-sm">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-500 rounded mr-1" />
          <span>Present</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-red-500 rounded mr-1" />
          <span>Absent</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-yellow-500 rounded mr-1" />
          <span>Late</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-blue-500 rounded mr-1" />
          <span>Excused</span>
        </div>
      </div>
    </div>
  );
};

export default AttendanceCalendar;