// src/components/parent/MeetingScheduler.tsx
import React, { useState } from 'react';
import { format } from 'date-fns';
import {
  Calendar, Clock, User, Video, Phone,
  X, CheckCircle, ChevronLeft,
  ChevronRight, Mail, MapPin, Plus
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import { Badge } from '../ui/Badge';
import { toast } from 'react-hot-toast';

export interface Teacher {
  id: string;
  name: string;
  subject: string;
  email?: string;
  avatar?: string;
  availability: AvailabilitySlot[];
}

export interface AvailabilitySlot {
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  slots: Array<{
    start: string;
    end: string;
  }>;
}

export interface ScheduledMeeting {
  id: string;
  teacherId: string;
  teacherName: string;
  subject: string;
  childId: string;
  childName: string;
  date: Date;
  startTime: string;
  endTime: string;
  type: 'video' | 'phone' | 'in_person';
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
  meetingLink?: string;
  location?: string;
  notes?: string;
  createdAt: Date;
}

interface MeetingSchedulerProps {
  childId: string;
  childName: string;
  teachers: Teacher[];
  scheduledMeetings: ScheduledMeeting[];
  onScheduleMeeting: (data: {
    teacherId: string;
    childId: string;
    date: Date;
    startTime: string;
    endTime: string;
    type: 'video' | 'phone' | 'in_person';
    notes?: string;
  }) => Promise<void>;
  onCancelMeeting: (meetingId: string) => Promise<void>;
  onRescheduleMeeting: (meetingId: string, date: Date, time: string) => Promise<void>;
  onJoinMeeting: (meetingId: string) => void;
  className?: string;
}

export const MeetingScheduler: React.FC<MeetingSchedulerProps> = ({
  childId,
  childName: _childName,
  teachers,
  scheduledMeetings,
  onScheduleMeeting,
  onCancelMeeting,
  onRescheduleMeeting,
  onJoinMeeting,
  className = ''
}) => {
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [showScheduler, setShowScheduler] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');
  const [meetingType, setMeetingType] = useState<'video' | 'phone' | 'in_person'>('video');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [rescheduleMode, setRescheduleMode] = useState<string | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState<Date>(new Date());
  const [rescheduleTime, setRescheduleTime] = useState('');

  const weekDays: Array<'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday'> = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
  ];

  const getAvailableSlotsForDay = (teacher: Teacher, day: string) => {
    const availability = teacher.availability.find(a => a.day === day);
    return availability?.slots || [];
  };

  const handleSchedule = async () => {
    if (!selectedTeacher || !selectedTimeSlot) {
      toast.error('Please select a teacher and time slot');
      return;
    }

    const [startTime, endTime] = selectedTimeSlot.split('-');

    try {
      setLoading(true);
      await onScheduleMeeting({
        teacherId: selectedTeacher.id,
        childId,
        date: selectedDate,
        startTime,
        endTime,
        type: meetingType,
        notes
      });
      toast.success('Meeting scheduled successfully!');
      setShowScheduler(false);
      resetForm();
    } catch (error) {
      toast.error('Failed to schedule meeting');
    } finally {
      setLoading(false);
    }
  };

  const handleReschedule = async (meetingId: string) => {
    if (!rescheduleDate || !rescheduleTime) {
      toast.error('Please select a new date and time');
      return;
    }

    try {
      setLoading(true);
      await onRescheduleMeeting(meetingId, rescheduleDate, rescheduleTime);
      toast.success('Meeting rescheduled successfully!');
      setRescheduleMode(null);
      setRescheduleDate(new Date());
      setRescheduleTime('');
    } catch (error) {
      toast.error('Failed to reschedule meeting');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedTeacher(null);
    setSelectedDate(new Date());
    setSelectedTimeSlot('');
    setMeetingType('video');
    setNotes('');
  };

  const formatDate = (date: Date) => {
    return format(date, 'EEEE, MMMM d, yyyy');
  };

  const getMeetingTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="w-4 h-4" />;
      case 'phone': return <Phone className="w-4 h-4" />;
      case 'in_person': return <MapPin className="w-4 h-4" />;
      default: return <Calendar className="w-4 h-4" />;
    }
  };

  // Fix: Use correct BadgeVariant values
  const getStatusVariant = (status: string): 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'default' => {
    switch (status) {
      case 'scheduled': return 'info';
      case 'confirmed': return 'success';
      case 'completed': return 'default';
      case 'cancelled': return 'danger';
      default: return 'default';
    }
  };

  // Generate time slots (9 AM to 5 PM in 30-minute increments)
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 17; hour++) {
      for (let minute of [0, 30]) {
        if (hour === 17 && minute === 30) continue;
        const start = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const endHour = minute === 30 ? hour + 1 : hour;
        const endMinute = minute === 30 ? 0 : 30;
        const end = `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;
        slots.push(`${start}-${end}`);
      }
    }
    return slots;
  };

  const allTimeSlots = generateTimeSlots();

  // Teacher options for select
  const teacherOptions = teachers.map(teacher => ({
    value: teacher.id,
    label: `${teacher.name} - ${teacher.subject}`
  }));

  // Meeting type options
  const meetingTypeOptions = [
    { value: 'video', label: 'Video Call' },
    { value: 'phone', label: 'Phone Call' },
    { value: 'in_person', label: 'In Person' }
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Upcoming Meetings */}
      {scheduledMeetings.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Upcoming Meetings</h3>
          <div className="space-y-3">
            {scheduledMeetings.map((meeting) => (
              <div
                key={meeting.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    {getMeetingTypeIcon(meeting.type)}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <p className="font-medium">{meeting.teacherName}</p>
                      <Badge variant={getStatusVariant(meeting.status)}>
                        {meeting.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{meeting.subject}</p>
                    <div className="flex items-center space-x-3 mt-1 text-xs text-gray-500">
                      <span className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {formatDate(meeting.date)}
                      </span>
                      <span className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {meeting.startTime} - {meeting.endTime}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  {meeting.status === 'scheduled' || meeting.status === 'confirmed' ? (
                    <>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => onJoinMeeting(meeting.id)}
                      >
                        <Video className="w-4 h-4 mr-2" />
                        Join
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setRescheduleMode(meeting.id)}
                      >
                        Reschedule
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onCancelMeeting(meeting.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </>
                  ) : meeting.status === 'completed' ? (
                    <Badge variant="success">Completed</Badge>
                  ) : (
                    <Badge variant="danger">Cancelled</Badge>
                  )}
                </div>

                {/* Reschedule Modal */}
                {rescheduleMode === meeting.id && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <Card className="w-full max-w-md p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold">Reschedule Meeting</h3>
                        <button
                          onClick={() => setRescheduleMode(null)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">New Date</label>
                          <input
                            type="date"
                            value={rescheduleDate.toISOString().split('T')[0]}
                            onChange={(e) => setRescheduleDate(new Date(e.target.value))}
                            min={new Date().toISOString().split('T')[0]}
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">New Time</label>
                          <select
                            value={rescheduleTime}
                            onChange={(e) => setRescheduleTime(e.target.value)}
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                          >
                            <option value="">Select time</option>
                            {allTimeSlots.map(slot => (
                              <option key={slot} value={slot}>{slot}</option>
                            ))}
                          </select>
                        </div>
                        <div className="flex space-x-3">
                          <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => setRescheduleMode(null)}
                          >
                            Cancel
                          </Button>
                          <Button
                            variant="primary"
                            className="flex-1"
                            onClick={() => handleReschedule(meeting.id)}
                            loading={loading}
                          >
                            Confirm Reschedule
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Schedule New Meeting */}
      {!showScheduler ? (
        <Card className="p-6 text-center">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-primary-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Schedule a Meeting</h3>
          <p className="text-gray-600 mb-4">
            Meet with your child's teachers to discuss progress and concerns
          </p>
          <Button onClick={() => setShowScheduler(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Schedule New Meeting
          </Button>
        </Card>
      ) : (
        <Card className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">Schedule a Meeting</h3>
            <Button variant="ghost" size="sm" onClick={() => setShowScheduler(false)}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-6">
            {/* Select Teacher */}
            <div>
              <label className="block text-sm font-medium mb-2">Select Teacher</label>
              <Select
                value={selectedTeacher?.id || ''}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  const teacher = teachers.find(t => t.id === e.target.value);
                  setSelectedTeacher(teacher || null);
                }}
                options={teacherOptions}
                placeholder="Choose a teacher"
              />
            </div>

            {selectedTeacher && (
              <>
                {/* Teacher Info */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <User className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="font-medium">{selectedTeacher.name}</p>
                      <p className="text-sm text-gray-600">{selectedTeacher.subject}</p>
                      {selectedTeacher.email && (
                        <p className="text-xs text-gray-500 flex items-center mt-1">
                          <Mail className="w-3 h-3 mr-1" />
                          {selectedTeacher.email}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Date Selection */}
                <div>
                  <label className="block text-sm font-medium mb-2">Select Date</label>
                  <div className="flex items-center space-x-4 mb-4">
                    <button
                      onClick={() => {
                        const newDate = new Date(selectedDate);
                        newDate.setDate(newDate.getDate() - 1);
                        setSelectedDate(newDate);
                      }}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="text-lg font-medium">{formatDate(selectedDate)}</span>
                    <button
                      onClick={() => {
                        const newDate = new Date(selectedDate);
                        newDate.setDate(newDate.getDate() + 1);
                        setSelectedDate(newDate);
                      }}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Day of week selector */}
                  <div className="flex space-x-2 mb-4 overflow-x-auto pb-2">
                    {weekDays.map(day => (
                      <button
                        key={day}
                        onClick={() => {
                          const today = new Date();
                          const targetDay = weekDays.indexOf(day);
                          const currentDay = today.getDay();
                          let daysToAdd = targetDay - currentDay;
                          if (daysToAdd <= 0) daysToAdd += 7;
                          const newDate = new Date(today);
                          newDate.setDate(today.getDate() + daysToAdd);
                          setSelectedDate(newDate);
                        }}
                        className={`px-3 py-1 rounded-lg text-sm ${
                          formatDate(selectedDate).includes(day)
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {day.slice(0, 3)}
                      </button>
                    ))}
                  </div>

                  {/* Available Time Slots */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Available Time Slots</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {getAvailableSlotsForDay(selectedTeacher, weekDays[selectedDate.getDay() - 1] || 'Monday')
                        .map((slot) => (
                          <button
                            key={`${slot.start}-${slot.end}`}
                            onClick={() => setSelectedTimeSlot(`${slot.start}-${slot.end}`)}
                            className={`p-2 text-sm rounded-lg border transition-all ${
                              selectedTimeSlot === `${slot.start}-${slot.end}`
                                ? 'border-primary-500 bg-primary-50 text-primary-700'
                                : 'border-gray-200 hover:border-primary-300'
                            }`}
                          >
                            {slot.start} - {slot.end}
                          </button>
                        ))}
                    </div>
                    {getAvailableSlotsForDay(selectedTeacher, weekDays[selectedDate.getDay() - 1] || 'Monday').length === 0 && (
                      <p className="text-sm text-gray-500 text-center py-4">
                        No available time slots for this day. Please select another day.
                      </p>
                    )}
                  </div>
                </div>

                {/* Meeting Type */}
                <div>
                  <label className="block text-sm font-medium mb-2">Meeting Type</label>
                  <div className="grid grid-cols-3 gap-3">
                    {meetingTypeOptions.map(type => (
                      <button
                        key={type.value}
                        onClick={() => setMeetingType(type.value as any)}
                        className={`p-3 rounded-lg border text-center transition-all ${
                          meetingType === type.value
                            ? 'border-primary-500 bg-primary-50 text-primary-700'
                            : 'border-gray-200 hover:border-primary-300'
                        }`}
                      >
                        {getMeetingTypeIcon(type.value)}
                        <p className="text-sm mt-1">{type.label}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="Any specific topics you'd like to discuss?"
                  />
                </div>

                {/* Actions */}
                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowScheduler(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    className="flex-1"
                    onClick={handleSchedule}
                    loading={loading}
                    disabled={!selectedTeacher || !selectedTimeSlot}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Schedule Meeting
                  </Button>
                </div>
              </>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

export default MeetingScheduler;