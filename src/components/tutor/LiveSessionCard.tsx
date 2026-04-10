// src/components/tutor/LiveSessionCard.tsx
import React, { useState } from 'react';
import { 
  Video, Users, Clock, Calendar, 
  CheckCircle, XCircle,
  Play, Settings, Share2, Copy,
  Download
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Avatar } from '../ui/Avatar';
import { ProgressBar } from '../ui/ProgressBar';
import { toast } from 'react-hot-toast';

export interface Participant {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'tutor' | 'student';
  isPresent: boolean;
  joinedAt?: Date;
  leftAt?: Date;
  isSpeaking?: boolean;
  isVideoOn?: boolean;
  isAudioOn?: boolean;
}

export interface LiveSession {
  id: string;
  title: string;
  description?: string;
  courseName: string;
  courseId: string;
  scheduledStart: Date;
  scheduledEnd: Date;
  actualStart?: Date;
  actualEnd?: Date;
  status: 'scheduled' | 'live' | 'ended' | 'cancelled';
  participants: Participant[];
  maxParticipants: number;
  meetingLink?: string;
  recordingUrl?: string;
  chatEnabled: boolean;
  recordingEnabled: boolean;
  attendanceRecorded: boolean;
  settings: {
    allowChat: boolean;
    allowScreenShare: boolean;
    allowRecording: boolean;
    muteOnEntry: boolean;
    waitingRoom: boolean;
  };
  statistics?: {
    averageAttendance: number;
    totalMinutes: number;
    engagement: number;
  };
}

interface LiveSessionCardProps {
  session: LiveSession;
  variant?: 'grid' | 'list' | 'detailed';
  onJoin: (sessionId: string) => void;
  onEdit: (sessionId: string) => void;
  onCancel: (sessionId: string) => void;
  onStartRecording?: (sessionId: string) => void;
  onStopRecording?: (sessionId: string) => void;
  onShareLink?: (sessionId: string) => void;
  onViewRecording?: (recordingUrl: string) => void;
  onDownloadAttendance?: (sessionId: string) => void;
  className?: string;
}

export const LiveSessionCard: React.FC<LiveSessionCardProps> = ({
  session,
  variant = 'grid',
  onJoin,
  onEdit,
  onCancel,
  onStartRecording,
  onStopRecording,
  onShareLink,
  onViewRecording,
  onDownloadAttendance,
  className = ''
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);

  const getStatusIcon = () => {
    switch (session.status) {
      case 'live':
        return <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />;
      case 'ended':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusText = () => {
    switch (session.status) {
      case 'live': return 'Live Now';
      case 'ended': return 'Ended';
      case 'cancelled': return 'Cancelled';
      default: return 'Scheduled';
    }
  };

  const getStatusColor = () => {
    switch (session.status) {
      case 'live': return 'bg-red-100 text-red-800';
      case 'ended': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).format(date);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const getTimeUntilStart = () => {
    const now = new Date();
    const start = new Date(session.scheduledStart);
    const diff = start.getTime() - now.getTime();
    
    if (diff <= 0) return 'Starting soon';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const presentCount = session.participants.filter(p => p.isPresent).length;
  const attendanceRate = session.participants.length > 0 
    ? (presentCount / session.participants.length) * 100 
    : 0;

  const handleStartRecording = () => {
    setIsRecording(true);
    onStartRecording?.(session.id);
    toast.success('Recording started');
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    onStopRecording?.(session.id);
    toast.success('Recording stopped');
  };

  const handleCopyLink = () => {
    if (session.meetingLink) {
      navigator.clipboard.writeText(session.meetingLink);
      toast.success('Meeting link copied to clipboard');
    }
  };

  // List View
  if (variant === 'list') {
    return (
      <div
        className={`flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border hover:shadow-md transition-shadow ${className}`}
      >
        <div className="flex items-center space-x-4 flex-1">
          <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center">
            <Video className="w-6 h-6 text-primary-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <h4 className="font-semibold">{session.title}</h4>
              <Badge className={getStatusColor()}>
                <span className="flex items-center">
                  {getStatusIcon()}
                  <span className="ml-1">{getStatusText()}</span>
                </span>
              </Badge>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span className="flex items-center">
                <Calendar className="w-3 h-3 mr-1" />
                {formatDate(session.scheduledStart)}
              </span>
              <span className="flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                {formatTime(session.scheduledStart)} - {formatTime(session.scheduledEnd)}
              </span>
              <span className="flex items-center">
                <Users className="w-3 h-3 mr-1" />
                {presentCount}/{session.participants.length} present
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2 ml-4">
          {session.status === 'scheduled' && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(session.id)}
              >
                <Settings className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-red-600"
                onClick={() => onCancel(session.id)}
              >
                <XCircle className="w-4 h-4" />
              </Button>
            </>
          )}
          {session.status === 'live' && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => onJoin(session.id)}
            >
              <Play className="w-4 h-4 mr-2" />
              Join Now
            </Button>
          )}
          {session.status === 'ended' && session.recordingUrl && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewRecording?.(session.recordingUrl!)}
            >
              <Download className="w-4 h-4 mr-2" />
              View Recording
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Detailed View
  if (variant === 'detailed') {
    return (
      <Card className={`overflow-hidden ${className}`}>
        {/* Header */}
        <div className="p-6 border-b bg-gradient-to-r from-primary-600 to-primary-800 text-white">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold mb-2">{session.title}</h2>
              <p className="text-primary-100">{session.courseName}</p>
            </div>
            <Badge className={`${getStatusColor()} bg-opacity-20 backdrop-blur`}>
              <span className="flex items-center">
                {getStatusIcon()}
                <span className="ml-1">{getStatusText()}</span>
              </span>
            </Badge>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Description */}
          {session.description && (
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-gray-600 dark:text-gray-400">{session.description}</p>
            </div>
          )}

          {/* Schedule Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Date & Time</p>
              <p className="font-medium">{formatDate(session.scheduledStart)}</p>
              <p className="text-sm text-gray-600">
                {formatTime(session.scheduledStart)} - {formatTime(session.scheduledEnd)}
              </p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Duration</p>
              <p className="font-medium">
                {Math.ceil((session.scheduledEnd.getTime() - session.scheduledStart.getTime()) / (1000 * 60))} minutes
              </p>
              {session.status === 'scheduled' && (
                <p className="text-sm text-blue-600">Starts in {getTimeUntilStart()}</p>
              )}
            </div>
          </div>

          {/* Statistics */}
          {session.statistics && (
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary-600">
                  {session.statistics.averageAttendance}%
                </p>
                <p className="text-sm text-gray-500">Avg Attendance</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary-600">
                  {session.statistics.totalMinutes}
                </p>
                <p className="text-sm text-gray-500">Total Minutes</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary-600">
                  {session.statistics.engagement}%
                </p>
                <p className="text-sm text-gray-500">Engagement</p>
              </div>
            </div>
          )}

          {/* Participants */}
          <div>
            <button
              onClick={() => setShowParticipants(!showParticipants)}
              className="flex items-center justify-between w-full p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
            >
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-gray-500" />
                <span className="font-medium">Participants ({presentCount}/{session.participants.length})</span>
              </div>
              <span className="text-sm text-gray-500">{showParticipants ? '▼' : '▶'}</span>
            </button>
            
            {showParticipants && (
              <div className="mt-3 space-y-2 max-h-60 overflow-y-auto">
                {session.participants.map((participant) => (
                  <div key={participant.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                    <div className="flex items-center space-x-3">
                      <Avatar
                        src={participant.avatar}
                        name={participant.name}
                        size="sm"
                      />
                      <div>
                        <p className="font-medium text-sm">{participant.name}</p>
                        <p className="text-xs text-gray-500">{participant.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {participant.isPresent ? (
                        <Badge variant="success" size="sm">Present</Badge>
                      ) : (
                        <Badge variant="secondary" size="sm">Absent</Badge>
                      )}
                      {participant.isSpeaking && (
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Attendance Progress */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Attendance Rate</span>
              <span className="font-medium">{attendanceRate.toFixed(1)}%</span>
            </div>
            <ProgressBar value={attendanceRate} color="blue" className="h-2" />
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 pt-4 border-t">
            {session.status === 'live' && (
              <>
                <Button variant="primary" onClick={() => onJoin(session.id)}>
                  <Video className="w-4 h-4 mr-2" />
                  Join Session
                </Button>
                {session.settings.allowRecording && (
                  isRecording ? (
                    <Button variant="outline" onClick={handleStopRecording}>
                      <span className="w-4 h-4 mr-2">⏹️</span>
                      Stop Recording
                    </Button>
                  ) : (
                    <Button variant="outline" onClick={handleStartRecording}>
                      <span className="w-4 h-4 mr-2">⏺️</span>
                      Start Recording
                    </Button>
                  )
                )}
              </>
            )}
            
            {session.status === 'scheduled' && (
              <>
                <Button variant="outline" onClick={() => onEdit(session.id)}>
                  <Settings className="w-4 h-4 mr-2" />
                  Edit Session
                </Button>
                <Button variant="outline" onClick={() => onShareLink?.(session.id)}>
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Link
                </Button>
              </>
            )}
            
            {session.status === 'ended' && (
              <>
                {session.recordingUrl && (
                  <Button variant="outline" onClick={() => onViewRecording?.(session.recordingUrl!)}>
                    <Download className="w-4 h-4 mr-2" />
                    View Recording
                  </Button>
                )}
                {session.attendanceRecorded && (
                  <Button variant="outline" onClick={() => onDownloadAttendance?.(session.id)}>
                    <Download className="w-4 h-4 mr-2" />
                    Download Attendance
                  </Button>
                )}
              </>
            )}
            
            {session.meetingLink && (
              <Button variant="ghost" onClick={handleCopyLink}>
                <Copy className="w-4 h-4 mr-2" />
                Copy Link
              </Button>
            )}
          </div>
        </div>
      </Card>
    );
  }

  // Grid View (default)
  return (
    <Card className={`overflow-hidden hover:shadow-xl transition-all duration-300 ${className}`}>
      {/* Header */}
      <div className="relative h-32 bg-gradient-to-r from-primary-600 to-primary-800">
        <div className="absolute top-4 right-4">
          <Badge className={getStatusColor()}>
            <span className="flex items-center">
              {getStatusIcon()}
              <span className="ml-1">{getStatusText()}</span>
            </span>
          </Badge>
        </div>
        <div className="absolute bottom-4 left-4">
          <div className="w-12 h-12 bg-white rounded-xl shadow-lg flex items-center justify-center">
            <Video className="w-6 h-6 text-primary-600" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-1 line-clamp-1">{session.title}</h3>
        <p className="text-sm text-gray-600 mb-2">{session.courseName}</p>

        {/* Schedule */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="w-4 h-4 mr-2" />
            {formatDate(session.scheduledStart)}
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="w-4 h-4 mr-2" />
            {formatTime(session.scheduledStart)} - {formatTime(session.scheduledEnd)}
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Users className="w-4 h-4 mr-2" />
            {presentCount}/{session.participants.length} participants
          </div>
        </div>

        {/* Attendance Preview */}
        <div className="mb-4">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-500">Attendance</span>
            <span className="font-medium">{attendanceRate.toFixed(0)}%</span>
          </div>
          <ProgressBar value={attendanceRate} color="blue" className="h-1.5" />
        </div>

        {/* Actions */}
        <div className="flex space-x-2">
          {session.status === 'live' && (
            <Button
              variant="primary"
              size="sm"
              className="flex-1"
              onClick={() => onJoin(session.id)}
            >
              <Play className="w-4 h-4 mr-2" />
              Join
            </Button>
          )}
          
          {session.status === 'scheduled' && (
            <>
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => onEdit(session.id)}
              >
                <Settings className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 text-red-600"
                onClick={() => onCancel(session.id)}
              >
                <XCircle className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </>
          )}
          
          {session.status === 'ended' && session.recordingUrl && (
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => onViewRecording?.(session.recordingUrl!)}
            >
              <Download className="w-4 h-4 mr-2" />
              Recording
            </Button>
          )}
        </div>

        {/* Share Link Button (if scheduled) */}
        {session.status === 'scheduled' && session.meetingLink && (
          <button
            onClick={handleCopyLink}
            className="mt-3 w-full text-center text-xs text-primary-600 hover:text-primary-700"
          >
            Copy meeting link
          </button>
        )}
      </div>
    </Card>
  );
};

export default LiveSessionCard;