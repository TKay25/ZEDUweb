// src/components/video/RecordingControls.tsx
import React, { useState, useEffect } from 'react';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

interface RecordingControlsProps {
  isRecording: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onPauseRecording: () => void;
  className?: string;
}

const RecordingControls: React.FC<RecordingControlsProps> = ({
  isRecording,
  onStartRecording,
  onStopRecording,
  onPauseRecording,
  className = '',
}) => {
  const [recordingTime, setRecordingTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (isRecording && !isPaused) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRecording, isPaused]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return [
      hours > 0 ? hours.toString().padStart(2, '0') : null,
      minutes.toString().padStart(2, '0'),
      secs.toString().padStart(2, '0'),
    ]
      .filter(Boolean)
      .join(':');
  };

  const handlePauseResume = () => {
    setIsPaused(!isPaused);
    onPauseRecording();
  };

  const handleStop = () => {
    setRecordingTime(0);
    setIsPaused(false);
    onStopRecording();
  };

  if (!isRecording) {
    return (
      <Button
        variant="danger"
        size="lg"
        onClick={onStartRecording}
        className={className}
      >
        <span className="mr-2">🔴</span>
        Start Recording
      </Button>
    );
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 ${className}`}>
      <div className="flex items-center space-x-4">
        {/* Recording Indicator */}
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 bg-red-600 rounded-full animate-pulse" />
          <span className="text-sm font-medium text-red-600">REC</span>
        </div>

        {/* Timer */}
        <div className="font-mono text-lg font-semibold">
          {formatTime(recordingTime)}
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePauseResume}
          >
            <span className="mr-2">{isPaused ? '▶️' : '⏸️'}</span>
            {isPaused ? 'Resume' : 'Pause'}
          </Button>

          <Button
            variant="danger"
            size="sm"
            onClick={handleStop}
          >
            <span className="mr-2">⏹️</span>
            Stop
          </Button>
        </div>

        {/* Recording Stats */}
        <Badge variant="info" size="sm">
          {isPaused ? 'Paused' : 'Recording'}
        </Badge>
      </div>
    </div>
  );
};

export default RecordingControls;