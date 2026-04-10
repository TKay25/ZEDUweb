// src/components/video/ScreenShare.tsx
import React, { useState, useRef, useEffect } from 'react';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Alert from '../ui/Alert';
import Badge from '../ui/Badge';

interface ScreenShareProps {
  onShareStart?: () => void;
  onShareStop?: () => void;
  isPresenter?: boolean;
  className?: string;
}

interface ScreenSource {
  id: string;
  name: string;
  thumbnail?: string;
}

// Type declaration for Electron API
declare global {
  interface Window {
    electron?: {
      getSources: (options: {
        types: string[];
        thumbnailSize: { width: number; height: number };
      }) => Promise<ScreenSource[]>;
    };
  }
}

// Define DisplayMediaStreamConstraints type locally since it's not globally available
interface DisplayMediaStreamConstraints {
  video?: boolean | {
    cursor?: "always" | "motion" | "never";
    displaySurface?: "application" | "browser" | "monitor" | "window";
    logicalSurface?: boolean;
  };
  audio?: boolean | {
    echoCancellation?: boolean;
    noiseSuppression?: boolean;
    sampleRate?: number;
  };
}

const ScreenShare: React.FC<ScreenShareProps> = ({
  onShareStart,
  onShareStop,
  isPresenter = true,
  className = '',
}) => {
  const [isSharing, setIsSharing] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sources, setSources] = useState<ScreenSource[]>([]);
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const [showSourcePicker, setShowSourcePicker] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const previewVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (isPresenter) {
      loadScreenSources();
    }
  }, [isPresenter]);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const loadScreenSources = async () => {
    try {
      // Check if Electron API is available
      if (window.electron && window.electron.getSources) {
        const sources = await window.electron.getSources({
          types: ['screen', 'window'],
          thumbnailSize: { width: 150, height: 100 },
        });
        setSources(sources);
      }
    } catch (err) {
      console.error('Failed to load screen sources:', err);
    }
  };

  const startScreenShare = async (sourceId?: string) => {
    try {
      let mediaStream: MediaStream;
      
      if (sourceId && window.electron) {
        // Electron desktop app with specific source
        const constraints = {
          video: {
            mandatory: {
              chromeMediaSource: 'desktop',
              chromeMediaSourceId: sourceId,
            },
          } as any,
          audio: false,
        };
        mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      } else {
        // Web browser with native picker - using the locally defined interface
        const constraints: DisplayMediaStreamConstraints = {
          video: {
            cursor: "always",
            displaySurface: "monitor",
          },
          audio: false,
        };
        mediaStream = await (navigator.mediaDevices as any).getDisplayMedia(constraints);
      }
      
      setStream(mediaStream);
      setIsSharing(true);
      onShareStart?.();

      // Handle when user stops sharing via browser UI
      const videoTrack = mediaStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.onended = () => {
          stopScreenShare();
        };
      }
    } catch (err) {
      console.error('Failed to start screen share:', err);
      setError('Failed to start screen share. Please try again.');
    }
  };

  const stopScreenShare = () => {
    stream?.getTracks().forEach(track => track.stop());
    setStream(null);
    setIsSharing(false);
    onShareStop?.();
  };

  const handleSourceSelect = (sourceId: string) => {
    setSelectedSource(sourceId);
    setShowSourcePicker(false);
    startScreenShare(sourceId);
  };

  const handlePreviewSource = async (sourceId: string) => {
    try {
      const previewStream = await navigator.mediaDevices.getUserMedia({
        video: {
          mandatory: {
            chromeMediaSource: 'desktop',
            chromeMediaSourceId: sourceId,
          },
        } as any,
      });

      if (previewVideoRef.current) {
        previewVideoRef.current.srcObject = previewStream;
      }
    } catch (err) {
      console.error('Failed to preview source:', err);
    }
  };

  if (!isPresenter) {
    return (
      <Card className={`flex items-center justify-center h-64 ${className}`}>
        <div className="text-center">
          <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🖥️</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {isSharing ? 'Screen Sharing Active' : 'Waiting for Presenter'}
          </h3>
          {isSharing && (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600"
            />
          )}
        </div>
      </Card>
    );
  }

  if (showSourcePicker) {
    return (
      <Card className={className}>
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-lg font-semibold">Choose what to share</h2>
          <Button variant="ghost" size="sm" onClick={() => setShowSourcePicker(false)}>
            Cancel
          </Button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-2 gap-4">
            {sources.map((source) => (
              <div
                key={source.id}
                className={`
                  cursor-pointer rounded-lg overflow-hidden border-2 transition-all
                  ${selectedSource === source.id
                    ? 'border-blue-600 shadow-lg'
                    : 'border-transparent hover:border-gray-300'
                  }
                `}
                onClick={() => handleSourceSelect(source.id)}
                onMouseEnter={() => handlePreviewSource(source.id)}
              >
                {source.thumbnail ? (
                  <img
                    src={source.thumbnail}
                    alt={source.name}
                    className="w-full h-32 object-cover"
                  />
                ) : (
                  <div className="w-full h-32 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <span className="text-4xl">🖥️</span>
                  </div>
                )}
                <div className="p-2 bg-gray-50 dark:bg-gray-800">
                  <p className="text-sm font-medium truncate">{source.name}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Preview */}
          {selectedSource && (
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Preview:</h4>
              <video
                ref={previewVideoRef}
                autoPlay
                playsInline
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600"
              />
            </div>
          )}
        </div>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <div className="p-6">
        {error && (
          <Alert
            variant="error"
            message={error}
            className="mb-4"
            dismissible
            onDismiss={() => setError(null)}
          />
        )}

        {isSharing ? (
          <div className="space-y-4">
            <div className="relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600"
              />
              <div className="absolute top-2 right-2">
                <Badge variant="danger" size="md">🔴 LIVE</Badge>
              </div>
            </div>

            <div className="flex items-center justify-center space-x-4">
              <Button
                variant="danger"
                onClick={stopScreenShare}
                size="lg"
              >
                Stop Sharing
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  // Toggle audio sharing
                  if (stream) {
                    const audioTracks = stream.getAudioTracks();
                    if (audioTracks.length) {
                      audioTracks.forEach(track => track.enabled = !track.enabled);
                    }
                  }
                }}
              >
                {stream?.getAudioTracks().length ? 'Mute Audio' : 'Share Audio'}
              </Button>
            </div>

            <p className="text-sm text-gray-500 text-center">
              You are sharing your screen. Click "Stop Sharing" when done.
            </p>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl text-white">🖥️</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Share Your Screen
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
              Share your entire screen, a specific window, or a browser tab with the class
            </p>
            <div className="flex items-center justify-center space-x-4">
              <Button
                variant="primary"
                size="lg"
                onClick={() => {
                  if (sources.length > 0) {
                    setShowSourcePicker(true);
                  } else {
                    startScreenShare();
                  }
                }}
              >
                Start Sharing
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => {
                  // Share specific window
                  startScreenShare();
                }}
              >
                Share Window
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ScreenShare;