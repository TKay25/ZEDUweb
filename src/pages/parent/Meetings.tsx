import React, { useState, useEffect } from 'react';
import {
  Calendar, Clock, Video, Users,
  XCircle, AlertCircle,
  ChevronLeft, ChevronRight, Plus,
  Download, MapPin,
  Copy
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import parentAPI from '../../api/parent.api';
import type { Meeting } from '../../api/parent.api';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';
import { toast } from 'react-hot-toast';

export const Meetings: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [activeTab, setActiveTab] = useState('upcoming');

  useEffect(() => {
    loadMeetings();
  }, []);

  const loadMeetings = async () => {
    try {
      const data = await parentAPI.getMeetings();
      setMeetings(data);
    } catch (error) {
      toast.error('Failed to load meetings');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmMeeting = async (meetingId: string) => {
    try {
      await parentAPI.confirmMeeting(meetingId);
      setMeetings(prev =>
        prev.map(m =>
          m.id === meetingId ? { ...m, status: 'confirmed' } : m
        )
      );
      toast.success('Meeting confirmed');
    } catch (error) {
      toast.error('Failed to confirm meeting');
    }
  };

  const handleCancelMeeting = async (meetingId: string) => {
    try {
      await parentAPI.cancelMeeting(meetingId);
      setMeetings(prev =>
        prev.map(m =>
          m.id === meetingId ? { ...m, status: 'cancelled' } : m
        )
      );
      toast.success('Meeting cancelled');
    } catch (error) {
      toast.error('Failed to cancel meeting');
    }
  };

  const handleCopyLink = async (link: string) => {
    await navigator.clipboard.writeText(link);
    toast.success('Link copied to clipboard');
  };

  const getMeetingTypeIcon = (type: string) => {
    switch (type) {
      case 'parent-teacher': return <Users className="w-4 h-4" />;
      case 'academic-review': return <Calendar className="w-4 h-4" />;
      case 'disciplinary': return <AlertCircle className="w-4 h-4" />;
      case 'career-guidance': return <Video className="w-4 h-4" />;
      default: return <Calendar className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredMeetings = meetings.filter(meeting => {
    if (activeTab === 'upcoming') {
      return meeting.status !== 'completed' && meeting.status !== 'cancelled';
    } else if (activeTab === 'past') {
      return meeting.status === 'completed' || meeting.status === 'cancelled';
    }
    return true;
  });

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
        <h1 className="text-2xl font-bold">Meetings & Appointments</h1>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Request Meeting
        </Button>
      </div>

      {/* Calendar View */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Calendar</h2>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedDate(subMonths(selectedDate, 1))}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="font-medium">
              {format(selectedDate, 'MMMM yyyy')}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedDate(addMonths(selectedDate, 1))}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center font-medium py-2 text-gray-600">
              {day}
            </div>
          ))}

          {eachDayOfInterval({
            start: startOfMonth(selectedDate),
            end: endOfMonth(selectedDate)
          }).map(date => {
            const dayMeetings = meetings.filter(m => 
              isSameDay(new Date(m.datetime), date) &&
              m.status !== 'cancelled'
            );

            return (
              <div
                key={date.toISOString()}
                onClick={() => setSelectedDate(date)}
                className={`min-h-[80px] p-2 border rounded-lg cursor-pointer transition-colors ${
                  isSameDay(date, selectedDate)
                    ? 'bg-primary-50 border-primary-300'
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="font-medium text-sm mb-1">
                  {format(date, 'd')}
                </div>
                {dayMeetings.length > 0 && (
                  <div className="space-y-1">
                    {dayMeetings.slice(0, 2).map(meeting => (
                      <div
                        key={meeting.id}
                        className={`text-xs p-1 rounded truncate ${
                          meeting.status === 'confirmed'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {meeting.title}
                      </div>
                    ))}
                    {dayMeetings.length > 2 && (
                      <div className="text-xs text-gray-500">
                        +{dayMeetings.length - 2} more
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {/* Custom Tabs - Using button-based tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'upcoming'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'past'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Past Meetings
          </button>
        </nav>
      </div>

      {/* Meetings List */}
      <div className="space-y-4">
        {filteredMeetings.map(meeting => (
          <Card
            key={meeting.id}
            className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => setSelectedMeeting(meeting)}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  meeting.type === 'parent-teacher' ? 'bg-blue-100' :
                  meeting.type === 'academic-review' ? 'bg-green-100' :
                  meeting.type === 'disciplinary' ? 'bg-red-100' : 'bg-purple-100'
                }`}>
                  {getMeetingTypeIcon(meeting.type)}
                </div>

                <div>
                  <div className="flex items-center space-x-3 mb-1">
                    <h3 className="text-lg font-semibold">{meeting.title}</h3>
                    <Badge className={getStatusColor(meeting.status)}>
                      {meeting.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      {format(meeting.datetime, 'EEEE, MMMM d, yyyy')}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Clock className="w-4 h-4 mr-2" />
                      {format(meeting.datetime, 'h:mm a')} ({meeting.duration} min)
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Users className="w-4 h-4 mr-2" />
                      {meeting.teacher.name} • {meeting.child.name}
                    </div>
                    <div className="flex items-center text-gray-600">
                      {meeting.location === 'virtual' ? (
                        <Video className="w-4 h-4 mr-2" />
                      ) : (
                        <MapPin className="w-4 h-4 mr-2" />
                      )}
                      {meeting.location === 'virtual' ? 'Virtual Meeting' : meeting.address}
                    </div>
                  </div>

                  {meeting.agenda && meeting.agenda.length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm font-medium mb-1">Agenda:</p>
                      <ul className="text-sm text-gray-600 list-disc list-inside">
                        {meeting.agenda.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {meeting.status === 'scheduled' && (
                  <>
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleConfirmMeeting(meeting.id);
                      }}
                    >
                      Confirm
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCancelMeeting(meeting.id);
                      }}
                    >
                      Cancel
                    </Button>
                  </>
                )}
                {meeting.status === 'confirmed' && meeting.location === 'virtual' && meeting.link && (
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(meeting.link, '_blank');
                    }}
                  >
                    <Video className="w-4 h-4 mr-2" />
                    Join
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}

        {filteredMeetings.length === 0 && (
          <Card className="p-12 text-center">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-medium mb-2">No Meetings Found</h3>
            <p className="text-gray-500">
              {activeTab === 'upcoming' 
                ? "You don't have any upcoming meetings"
                : "No past meetings to display"}
            </p>
          </Card>
        )}
      </div>

      {/* Meeting Details Modal */}
      {selectedMeeting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-bold">{selectedMeeting.title}</h2>
                <Badge className={`mt-2 ${getStatusColor(selectedMeeting.status)}`}>
                  {selectedMeeting.status}
                </Badge>
              </div>
              <button
                onClick={() => setSelectedMeeting(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Date and Time */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-gray-500 mb-1" />
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium">
                    {format(selectedMeeting.datetime, 'EEEE, MMMM d, yyyy')}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <Clock className="w-5 h-5 text-gray-500 mb-1" />
                  <p className="text-sm text-gray-500">Time</p>
                  <p className="font-medium">
                    {format(selectedMeeting.datetime, 'h:mm a')} ({selectedMeeting.duration} min)
                  </p>
                </div>
              </div>

              {/* Participants */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500 mb-2">Teacher</p>
                  <div className="flex items-center">
                    <Avatar
                      src={selectedMeeting.teacher.avatar}
                      name={selectedMeeting.teacher.name}
                      size="md"
                      className="mr-3"
                    />
                    <div>
                      <p className="font-medium">{selectedMeeting.teacher.name}</p>
                      <p className="text-sm text-gray-500">{selectedMeeting.teacher.subject}</p>
                    </div>
                  </div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500 mb-2">Student</p>
                  <div>
                    <p className="font-medium">{selectedMeeting.child.name}</p>
                    <p className="text-sm text-gray-500">{selectedMeeting.child.grade}</p>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500 mb-2">Location</p>
                {selectedMeeting.location === 'virtual' ? (
                  <div>
                    <div className="flex items-center mb-2">
                      <Video className="w-5 h-5 text-gray-500 mr-2" />
                      <span>Virtual Meeting</span>
                    </div>
                    {selectedMeeting.link && (
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={selectedMeeting.link}
                          readOnly
                          className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-gray-50"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCopyLink(selectedMeeting.link!)}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 text-gray-500 mr-2" />
                    <span>{selectedMeeting.address}</span>
                  </div>
                )}
              </div>

              {/* Agenda */}
              {selectedMeeting.agenda && selectedMeeting.agenda.length > 0 && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500 mb-2">Agenda</p>
                  <ul className="list-disc list-inside space-y-1">
                    {selectedMeeting.agenda.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Notes */}
              {selectedMeeting.notes && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500 mb-2">Notes</p>
                  <p>{selectedMeeting.notes}</p>
                </div>
              )}

              {/* Materials */}
              {selectedMeeting.materials && selectedMeeting.materials.length > 0 && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500 mb-2">Materials</p>
                  <div className="space-y-2">
                    {selectedMeeting.materials.map((material, index) => (
                      <a
                        key={index}
                        href={material.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center p-2 bg-white rounded hover:bg-gray-50"
                      >
                        <Download className="w-4 h-4 text-gray-500 mr-2" />
                        <span>{material.name}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-4">
                {selectedMeeting.status === 'scheduled' && (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => handleCancelMeeting(selectedMeeting.id)}
                    >
                      Cancel Meeting
                    </Button>
                    <Button
                      onClick={() => handleConfirmMeeting(selectedMeeting.id)}
                    >
                      Confirm Meeting
                    </Button>
                  </>
                )}
                {selectedMeeting.status === 'confirmed' && selectedMeeting.location === 'virtual' && selectedMeeting.link && (
                  <Button
                    onClick={() => window.open(selectedMeeting.link, '_blank')}
                  >
                    <Video className="w-4 h-4 mr-2" />
                    Join Meeting
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};