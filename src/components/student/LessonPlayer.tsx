// src/components/student/LessonPlayer.tsx
import React, { useState, useRef, useEffect } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import Spinner from '../ui/Spinner';
import type { Lesson } from './types/student.types';

interface LessonPlayerProps {
  lesson: Lesson;
  onComplete?: (lessonId: string) => void;
  onNext?: () => void;
  onPrevious?: () => void;
  className?: string;
}

// Define attachment type since it's not in the Lesson type
interface Attachment {
  name: string;
  url: string;
  size?: string;
}

const LessonPlayer: React.FC<LessonPlayerProps> = ({
  lesson,
  onComplete,
  onNext,
  onPrevious,
  className = '',
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState('');
  const [isCompleted, setIsCompleted] = useState(lesson.completed);

  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  // Mock attachments since Lesson type doesn't have it
  const attachments: Attachment[] = [];

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.addEventListener('loadedmetadata', () => {
        setDuration(videoRef.current?.duration || 0);
        setIsVideoLoaded(true);
      });

      videoRef.current.addEventListener('timeupdate', () => {
        setCurrentTime(videoRef.current?.currentTime || 0);
        
        // Mark as completed when reaching 90%
        if (!isCompleted && !lesson.completed && videoRef.current) {
          const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
          if (progress >= 90) {
            setIsCompleted(true);
            onComplete?.(lesson.id);
          }
        }
      });
    }
  }, [lesson.id, lesson.completed, isCompleted, onComplete]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    if (videoRef.current) {
      videoRef.current.volume = vol;
    }
    setIsMuted(vol === 0);
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement && playerRef.current) {
      playerRef.current.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const skipForward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime += 10;
    }
  };

  const skipBackward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime -= 10;
    }
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);

    if (h > 0) {
      return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handlePlaybackRateChange = (rate: number) => {
    setPlaybackRate(rate);
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
    }
  };

  const saveNotes = () => {
    // Save notes to backend
    console.log('Saving notes:', notes);
    setShowNotes(false);
  };

  const downloadVideo = () => {
    if (lesson.videoUrl) {
      const a = document.createElement('a');
      a.href = lesson.videoUrl;
      a.download = `${lesson.title}.mp4`;
      a.click();
    }
  };

  if (!isVideoLoaded && lesson.videoUrl) {
    return (
      <Card className={`flex items-center justify-center h-96 ${className}`}>
        <Spinner size="lg" color="primary" />
      </Card>
    );
  }

  const isLessonCompleted = isCompleted || lesson.completed;

  return (
    <Card className={`overflow-hidden ${className}`} ref={playerRef}>
      {/* Video Player */}
      <div className="relative bg-black aspect-video">
        {lesson.videoUrl ? (
          <video
            ref={videoRef}
            src={lesson.videoUrl}
            className="w-full h-full"
            onClick={togglePlay}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-800">
            <div className="text-center text-white">
              <div className="text-6xl mb-4">📄</div>
              <p className="text-lg">No video available for this lesson</p>
              <p className="text-sm text-gray-400 mt-2">{lesson.content || 'Content is in text format'}</p>
            </div>
          </div>
        )}

        {/* Video Overlay Controls */}
        {lesson.videoUrl && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            {/* Progress Bar */}
            <div className="mb-4">
              <input
                type="range"
                min={0}
                max={duration}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #3b82f6 ${(currentTime / duration) * 100}%, #4b5563 ${(currentTime / duration) * 100}%)`,
                }}
              />
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {/* Play/Pause */}
                <button
                  onClick={togglePlay}
                  className="text-white hover:text-blue-400 transition-colors"
                >
                  <span className="text-2xl">{isPlaying ? '⏸️' : '▶️'}</span>
                </button>

                {/* Skip Backward */}
                <button
                  onClick={skipBackward}
                  className="text-white hover:text-blue-400 transition-colors"
                >
                  <span className="text-xl">⏪ 10s</span>
                </button>

                {/* Skip Forward */}
                <button
                  onClick={skipForward}
                  className="text-white hover:text-blue-400 transition-colors"
                >
                  <span className="text-xl">10s ⏩</span>
                </button>

                {/* Volume Control */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={toggleMute}
                    className="text-white hover:text-blue-400 transition-colors"
                  >
                    <span className="text-xl">{isMuted ? '🔇' : '🔊'}</span>
                  </button>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.1}
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                {/* Time Display */}
                <span className="text-sm text-white">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              <div className="flex items-center space-x-3">
                {/* Playback Speed */}
                <select
                  value={playbackRate}
                  onChange={(e) => handlePlaybackRateChange(parseFloat(e.target.value))}
                  className="bg-black/50 text-white border border-gray-600 rounded px-2 py-1 text-sm"
                >
                  <option value={0.5}>0.5x</option>
                  <option value={1}>1x</option>
                  <option value={1.25}>1.25x</option>
                  <option value={1.5}>1.5x</option>
                  <option value={2}>2x</option>
                </select>

                {/* Notes */}
                <button
                  onClick={() => setShowNotes(!showNotes)}
                  className="text-white hover:text-blue-400 transition-colors"
                  title="Notes"
                >
                  <span className="text-xl">📝</span>
                </button>

                {/* Download */}
                <button
                  onClick={downloadVideo}
                  className="text-white hover:text-blue-400 transition-colors"
                  title="Download"
                >
                  <span className="text-xl">⬇️</span>
                </button>

                {/* Fullscreen */}
                <button
                  onClick={toggleFullscreen}
                  className="text-white hover:text-blue-400 transition-colors"
                >
                  <span className="text-xl">{isFullscreen ? '⤓' : '⤢'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Lesson Info Overlay (top) */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Badge variant="info" size="sm">{lesson.type}</Badge>
            <Badge variant={isLessonCompleted ? 'success' : 'warning'} size="sm">
              {isLessonCompleted ? 'Completed' : 'In Progress'}
            </Badge>
          </div>
          <span className="text-white text-sm">{lesson.duration} min</span>
        </div>
      </div>

      {/* Lesson Info */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {lesson.title}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {lesson.description || lesson.content}
            </p>
          </div>
        </div>

        {/* Attachments (if any) */}
        {attachments.length > 0 && (
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              📎 Attachments
            </h3>
            <div className="space-y-2">
              {attachments.map((file, index) => (
                <a
                  key={index}
                  href={file.url}
                  download
                  className="flex items-center justify-between p-2 bg-white dark:bg-gray-700 rounded hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <span>📄</span>
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {file.name}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">{file.size}</span>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Notes Panel */}
      {showNotes && (
        <div className="absolute top-20 right-4 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-4 z-10">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Your Notes</h3>
            <button
              onClick={() => setShowNotes(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Take notes while watching..."
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
          <div className="flex justify-end space-x-2 mt-3">
            <Button variant="outline" size="sm" onClick={() => setShowNotes(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={saveNotes}>
              Save Notes
            </Button>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-between">
        <Button
          variant="outline"
          onClick={onPrevious}
        >
          ← Previous Lesson
        </Button>
        <Button
          variant={isLessonCompleted ? 'success' : 'primary'}
          onClick={() => {
            if (!isLessonCompleted) {
              setIsCompleted(true);
              onComplete?.(lesson.id);
            }
            onNext?.();
          }}
        >
          {isLessonCompleted ? '✓ Completed' : 'Next Lesson →'}
        </Button>
      </div>
    </Card>
  );
};

export default LessonPlayer;