// src/components/video/LiveClass.tsx
import React, { useState, useEffect } from 'react';
import VideoCall from './VideoCall';
import Whiteboard from './Whiteboard';
import RecordingControls from './RecordingControls';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import Tabs from '../ui/Tabs';
import Avatar from '../ui/Avatar';

// Define Participant interface locally
interface Participant {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'host' | 'participant';
  isAudioEnabled: boolean;
  isVideoEnabled: boolean;
  isHandRaised?: boolean;
}

interface LiveClassProps {
  classId: string;
  className: string;
  instructorName: string;
  startTime: string;
  endTime?: string;
  isInstructor?: boolean;
  onEndClass?: () => void;
}

const LiveClass: React.FC<LiveClassProps> = ({
  classId,
  className,
  instructorName,
  startTime,
  endTime: _endTime, // Prefix with underscore to indicate intentionally unused
  isInstructor = false,
  onEndClass,
}) => {
  const [activeTab, setActiveTab] = useState('video');
  const [participants] = useState<Participant[]>([]); // Removed setParticipants since it's not used
  const [showParticipants, setShowParticipants] = useState(false);
  const [classTimer, setClassTimer] = useState<string>('00:00');
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  const updateTimer = () => {
    const start = new Date(startTime).getTime();
    const now = new Date().getTime();
    const elapsed = now - start;
    
    const minutes = Math.floor(elapsed / 60000);
    const seconds = Math.floor((elapsed % 60000) / 1000);
    
    setClassTimer(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
  };

  const handleLeave = () => {
    if (isInstructor) {
      onEndClass?.();
    } else {
      // Leave class logic
    }
  };

  const handleRecordingStart = () => {
    setIsRecording(true);
  };

  const handleRecordingStop = () => {
    setIsRecording(false);
  };

  // Tabs configuration
  const tabs = [
    { key: 'video', label: 'Video Call' },
    { key: 'whiteboard', label: 'Whiteboard' },
    { key: 'materials', label: 'Materials' },
  ];

  return (
    <div className="h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
      {/* Class Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                {className}
              </h1>
              <p className="text-sm text-gray-500">
                with {instructorName}
              </p>
            </div>
            <Badge variant="success" size="md">Live</Badge>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>⏱️</span>
              <span>{classTimer}</span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Recording Indicator */}
            {isRecording && (
              <div className="flex items-center space-x-2 text-red-600">
                <span className="w-3 h-3 bg-red-600 rounded-full animate-pulse" />
                <span className="text-sm font-medium">Recording</span>
              </div>
            )}

            {/* Participants Button */}
            <button
              onClick={() => setShowParticipants(!showParticipants)}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg flex items-center space-x-2"
            >
              <span>👥</span>
              <span>{participants.length}</span>
            </button>

            {/* End Class Button (Instructor only) */}
            {isInstructor && (
              <Button variant="danger" onClick={handleLeave}>
                End Class
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Main Area */}
        <div className="flex-1 flex flex-col">
          {/* Tabs */}
          <Tabs
            items={tabs}
            activeKey={activeTab}
            onChange={setActiveTab}
            className="px-6 pt-4"
          />

          {/* Tab Content */}
          <div className="flex-1 overflow-hidden">
            {activeTab === 'video' && (
              <VideoCall
                sessionId={classId}
                userName={instructorName}
                isHost={isInstructor}
                onLeave={handleLeave}
              />
            )}

            {activeTab === 'whiteboard' && (
              <div className="h-full p-6">
                <Whiteboard
                  classId={classId}
                  isInstructor={isInstructor}
                />
              </div>
            )}

            {activeTab === 'materials' && (
              <div className="p-6">
                <Card>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Class Materials</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded">
                        <div className="flex items-center space-x-3">
                          <span>📄</span>
                          <span>Lecture Slides.pdf</span>
                        </div>
                        <Button size="sm">Download</Button>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded">
                        <div className="flex items-center space-x-3">
                          <span>📝</span>
                          <span>Exercise Worksheet.docx</span>
                        </div>
                        <Button size="sm">Download</Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </div>
        </div>

        {/* Participants Sidebar */}
        {showParticipants && (
          <div className="w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 overflow-y-auto">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold">Participants ({participants.length})</h3>
            </div>
            <div className="p-4 space-y-3">
              {participants.map((participant) => (
                <div
                  key={participant.id}
                  className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded"
                >
                  <div className="flex items-center space-x-3">
                    <Avatar
                      size="sm"
                      name={participant.name}
                      src={participant.avatar}
                    />
                    <div>
                      <p className="text-sm font-medium">{participant.name}</p>
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        {participant.role === 'host' && (
                          <Badge variant="primary" size="sm">Host</Badge>
                        )}
                        {!participant.isAudioEnabled && (
                          <span>🔇</span>
                        )}
                        {participant.isHandRaised && (
                          <span>✋</span>
                        )}
                      </div>
                    </div>
                  </div>
                  {isInstructor && participant.role !== 'host' && (
                    <button className="text-gray-400 hover:text-gray-600">
                      ⋯
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Recording Controls (Instructor only) */}
      {isInstructor && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2">
          <RecordingControls
            isRecording={isRecording}
            onStartRecording={handleRecordingStart}
            onStopRecording={handleRecordingStop}
            onPauseRecording={() => {}}
          />
        </div>
      )}
    </div>
  );
};

export default LiveClass;