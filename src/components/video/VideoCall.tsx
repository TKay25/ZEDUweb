// src/components/video/VideoCall.tsx
import React, { useState, useEffect, useRef } from 'react';
import Card from '../ui/Card';
import Avatar from '../ui/Avatar';
import Badge from '../ui/Badge';
import Alert from '../ui/Alert';
import videoAPI from '../../api/video.api';

// Define local types
interface Participant {
  id: string;
  name: string;
  avatar?: string;
  role: 'host' | 'participant';
  isVideoEnabled: boolean;
  isAudioEnabled: boolean;
  isScreenSharing: boolean;
  isHandRaised: boolean;
  joinTime: string;
  stream?: MediaStream;
}

interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  message: string;
  timestamp: string;
  type: 'text' | 'file' | 'system';
}

type VideoQuality = 'low' | 'medium' | 'high' | 'hd';

interface VideoCallProps {
  sessionId: string;
  userName: string;
  userAvatar?: string;
  isHost?: boolean;
  onLeave?: () => void;
  className?: string;
}

// Environment variable for Agora App ID (should be set in .env file)
const AGORA_APP_ID = import.meta.env.VITE_AGORA_APP_ID || '';

const VideoCall: React.FC<VideoCallProps> = ({
  sessionId,
  userName,
  userAvatar,
  isHost = false,
  onLeave,
  className = '',
}) => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [showChat, setShowChat] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [isConnecting, setIsConnecting] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [videoQuality, setVideoQuality] = useState<VideoQuality>('medium');
  const [selectedParticipant, setSelectedParticipant] = useState<string | null>(null);
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const screenVideoRef = useRef<HTMLVideoElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    initializeCall();
    return () => {
      cleanupCall();
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const initializeCall = async () => {
    try {
      setIsConnecting(true);
      
      // Get user media
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      
      localStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Initialize Agora with token from backend
      try {
        const response = await fetch(`/api/video/token?channel=${sessionId}&uid=${userName}`);
        const tokenData = await response.json();
        
        await videoAPI.initializeAgora({
          appId: AGORA_APP_ID,
          channelName: sessionId,
          token: tokenData.token,
          uid: tokenData.uid || userName
        });
      } catch (err) {
        console.warn('Agora initialization failed, continuing without Agora:', err);
      }

      // Add local participant
      const localParticipant: Participant = {
        id: 'local',
        name: userName,
        avatar: userAvatar,
        role: isHost ? 'host' : 'participant',
        isVideoEnabled: true,
        isAudioEnabled: true,
        isScreenSharing: false,
        isHandRaised: false,
        joinTime: new Date().toISOString(),
        stream,
      };
      setParticipants([localParticipant]);

      setIsConnecting(false);
    } catch (err) {
      console.error('Failed to initialize call:', err);
      setError('Failed to connect to video call. Please check your permissions.');
      setIsConnecting(false);
    }
  };

  const cleanupCall = async () => {
    localStreamRef.current?.getTracks().forEach(track => track.stop());
    screenStream?.getTracks().forEach(track => track.stop());
    await videoAPI.leaveChannel();
  };

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleMute = async () => {
    try {
      await videoAPI.toggleAudio();
      setIsMuted(!isMuted);
      
      setParticipants(prev =>
        prev.map(p =>
          p.id === 'local' ? { ...p, isAudioEnabled: !isMuted } : p
        )
      );
    } catch (err) {
      console.error('Failed to toggle audio:', err);
    }
  };

  const toggleVideo = async () => {
    try {
      await videoAPI.toggleVideo();
      setIsVideoOff(!isVideoOff);
      
      setParticipants(prev =>
        prev.map(p =>
          p.id === 'local' ? { ...p, isVideoEnabled: !isVideoOff } : p
        )
      );
    } catch (err) {
      console.error('Failed to toggle video:', err);
    }
  };

  const startScreenShare = async () => {
    try {
      // Use browser's built-in screen sharing
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false,
      });
      
      setScreenStream(stream);
      
      // Create a separate video element for screen share
      if (screenVideoRef.current) {
        screenVideoRef.current.srcObject = stream;
      }
      
      setIsScreenSharing(true);
      setParticipants(prev =>
        prev.map(p =>
          p.id === 'local' ? { ...p, isScreenSharing: true } : p
        )
      );
      
      // Handle when user stops sharing via browser UI
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.onended = () => {
          stopScreenShare();
        };
      }
    } catch (err) {
      console.error('Failed to start screen share:', err);
    }
  };

  const stopScreenShare = async () => {
    if (screenStream) {
      screenStream.getTracks().forEach(track => track.stop());
      setScreenStream(null);
      
      if (screenVideoRef.current) {
        screenVideoRef.current.srcObject = null;
      }
    }
    
    setIsScreenSharing(false);
    setParticipants(prev =>
      prev.map(p =>
        p.id === 'local' ? { ...p, isScreenSharing: false } : p
      )
    );
  };

  const toggleScreenShare = async () => {
    if (!isScreenSharing) {
      await startScreenShare();
    } else {
      await stopScreenShare();
    }
  };

  const toggleHandRaise = () => {
    setIsHandRaised(!isHandRaised);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      userId: 'local',
      userName,
      userAvatar,
      message: newMessage,
      timestamp: new Date().toISOString(),
      type: 'text',
    };

    try {
      setChatMessages(prev => [...prev, message]);
      setNewMessage('');
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const changeVideoQuality = async (quality: VideoQuality) => {
    setVideoQuality(quality);
    let videoConstraints: MediaTrackConstraints = {};
    
    switch (quality) {
      case 'low':
        videoConstraints = { width: 320, height: 240, frameRate: 15 };
        break;
      case 'medium':
        videoConstraints = { width: 640, height: 480, frameRate: 24 };
        break;
      case 'high':
        videoConstraints = { width: 1280, height: 720, frameRate: 30 };
        break;
      case 'hd':
        videoConstraints = { width: 1920, height: 1080, frameRate: 30 };
        break;
    }
    
    const track = localStreamRef.current?.getVideoTracks()[0];
    if (track) {
      try {
        await track.applyConstraints(videoConstraints);
      } catch (err) {
        console.error('Failed to apply video constraints:', err);
      }
    }
  };

  const handleParticipantClick = (participantId: string) => {
    setSelectedParticipant(participantId === selectedParticipant ? null : participantId);
  };

  const muteParticipant = async (participantId: string) => {
    if (isHost) {
      try {
        await videoAPI.muteParticipant(participantId);
      } catch (err) {
        console.error('Failed to mute participant:', err);
      }
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderParticipant = (participant: Participant, isLocal: boolean = false) => {
    const isSelected = selectedParticipant === participant.id;

    return (
      <div
        key={participant.id}
        className={`
          relative group cursor-pointer
          ${isSelected ? 'ring-4 ring-blue-500' : ''}
        `}
        onClick={() => handleParticipantClick(participant.id)}
      >
        <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video">
          {participant.isVideoEnabled ? (
            <video
              ref={isLocal ? localVideoRef : undefined}
              autoPlay
              playsInline
              muted={isLocal}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-gray-800 to-gray-900">
              <Avatar
                size="xl"
                name={participant.name}
                src={participant.avatar}
              />
            </div>
          )}

          <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-white font-medium">
                  {participant.name}
                  {isLocal && ' (You)'}
                </span>
                {participant.role === 'host' && (
                  <Badge variant="primary" size="sm">Host</Badge>
                )}
              </div>
              <div className="flex items-center space-x-1">
                {!participant.isAudioEnabled && (
                  <span className="text-red-400 text-sm">🔇</span>
                )}
                {participant.isScreenSharing && (
                  <span className="text-blue-400 text-sm">🖥️</span>
                )}
                {participant.isHandRaised && (
                  <span className="text-yellow-400 text-sm">✋</span>
                )}
              </div>
            </div>
          </div>

          {participant.isHandRaised && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 animate-pulse">
              <span className="text-6xl">✋</span>
            </div>
          )}
        </div>

        {isHost && !isLocal && isSelected && (
          <div className="absolute top-2 right-2 flex space-x-1">
            <button
              onClick={() => muteParticipant(participant.id)}
              className="p-1 bg-gray-800 rounded hover:bg-gray-700 text-white"
              title="Mute"
            >
              🔇
            </button>
          </div>
        )}
      </div>
    );
  };

  if (isConnecting) {
    return (
      <Card className={`flex items-center justify-center h-96 ${className}`}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Connecting to Video Call
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Please wait while we establish the connection...
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className={`flex h-[calc(100vh-8rem)] ${className}`}>
      <div className={`flex-1 flex flex-col ${showChat ? 'mr-80' : ''}`}>
        {error && (
          <Alert
            variant="error"
            message={error}
            className="m-4"
            dismissible
            onDismiss={() => setError(null)}
          />
        )}

        {/* Screen Share Video */}
        {isScreenSharing && screenStream && (
          <div className="relative m-4">
            <video
              ref={screenVideoRef}
              autoPlay
              playsInline
              className="w-full rounded-lg border-2 border-blue-500"
            />
            <div className="absolute top-2 right-2">
              <Badge variant="info">Screen Sharing</Badge>
            </div>
          </div>
        )}

        <div className="flex-1 p-4 overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            {participants.map(p => renderParticipant(p, p.id === 'local'))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-center space-x-4 flex-wrap gap-2">
            <button
              onClick={toggleMute}
              className={`p-3 rounded-full transition-all ${
                isMuted
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              <span className="text-xl">{isMuted ? '🔇' : '🎤'}</span>
            </button>

            <button
              onClick={toggleVideo}
              className={`p-3 rounded-full transition-all ${
                isVideoOff
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
              title={isVideoOff ? 'Start Video' : 'Stop Video'}
            >
              <span className="text-xl">{isVideoOff ? '📹❌' : '📹'}</span>
            </button>

            <button
              onClick={toggleScreenShare}
              className={`p-3 rounded-full transition-all ${
                isScreenSharing
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
              title={isScreenSharing ? 'Stop Sharing' : 'Share Screen'}
            >
              <span className="text-xl">🖥️</span>
            </button>

            <button
              onClick={toggleHandRaise}
              className={`p-3 rounded-full transition-all ${
                isHandRaised
                  ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
              title={isHandRaised ? 'Lower Hand' : 'Raise Hand'}
            >
              <span className="text-xl">✋</span>
            </button>

            <select
              value={videoQuality}
              onChange={(e) => changeVideoQuality(e.target.value as VideoQuality)}
              className="px-3 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg text-sm"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="hd">HD</option>
            </select>

            <button
              onClick={() => setShowChat(!showChat)}
              className="p-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-full relative"
              title="Toggle Chat"
            >
              <span className="text-xl">💬</span>
              {chatMessages.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center">
                  {chatMessages.length}
                </span>
              )}
            </button>

            <button
              onClick={onLeave}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors"
            >
              Leave
            </button>
          </div>

          <div className="mt-4 text-center text-sm text-gray-500">
            {participants.length} participant{participants.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {showChat && (
        <div className="w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex flex-col">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white">Chat</h3>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.userId === 'local' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex max-w-[80%] ${msg.userId === 'local' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <Avatar
                    size="sm"
                    name={msg.userName}
                    src={msg.userAvatar}
                    className={msg.userId === 'local' ? 'ml-2' : 'mr-2'}
                  />
                  <div>
                    <div
                      className={`rounded-lg px-3 py-2 ${
                        msg.userId === 'local'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                      }`}
                    >
                      <p className="text-sm">{msg.message}</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {msg.userName} • {formatTime(msg.timestamp)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoCall;