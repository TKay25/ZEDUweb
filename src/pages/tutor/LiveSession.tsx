import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Video, Mic, MicOff, VideoOff, PhoneOff,
  MessageCircle, Users, ScreenShare,
  Hand, Maximize, Minimize, Send
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Avatar } from '../../components/ui/Avatar';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import toast from 'react-hot-toast';
import axios from 'axios';
import { format } from 'date-fns';

// Simple Tabs component
const Tabs: React.FC<{
  tabs: { id: string; label: string; }[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
}> = ({ tabs, activeTab, onChange, className = '' }) => {
  return (
    <div className={`border-b border-gray-200 ${className}`}>
      <nav className="flex space-x-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === tab.id
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
};

interface Participant {
  id: string;
  name: string;
  avatar?: string;
  role: 'tutor' | 'student';
  hasHandRaised: boolean;
  isMuted: boolean;
  isVideoOn: boolean;
  joinedAt: Date;
}

interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  message: string;
  timestamp: Date;
  type: 'text' | 'system' | 'question';
  isPinned?: boolean;
}

interface SessionPoll {
  id: string;
  question: string;
  options: Array<{
    id: string;
    text: string;
    votes: number;
  }>;
  isActive: boolean;
  totalVotes: number;
}

// Mock user for demo purposes
const mockUser = {
  id: 'tutor-1',
  name: 'Dr. Smith',
  avatar: '',
  role: 'tutor'
};

export const LiveSession: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const screenRef = useRef<HTMLVideoElement>(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [activeTab, setActiveTab] = useState('participants');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [activePoll, setActivePoll] = useState<SessionPoll | null>(null);
  const [handRaised, setHandRaised] = useState<Participant[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);

  const API_BASE_URL = (window as any).process?.env?.REACT_APP_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    loadSession();
    initializeMedia();
    joinSession();

    return () => {
      cleanup();
    };
  }, [sessionId]);

  useEffect(() => {
    if (isRecording) {
      const timer = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isRecording]);

  const loadSession = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/tutor/live-sessions/${sessionId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSession(response.data);
      setParticipants(response.data.participants || []);
      setChatMessages(response.data.chatMessages || []);
    } catch (error) {
      console.error('Failed to load session:', error);
      toast.error('Failed to load session');
      // Set mock data for demo
      setMockData();
    } finally {
      setLoading(false);
    }
  };

  const setMockData = () => {
    setSession({
      id: sessionId,
      title: 'Advanced Mathematics - Live Session',
      description: 'Join us for an interactive session on calculus'
    });
    setParticipants([
      {
        id: '1',
        name: 'John Doe',
        role: 'student',
        hasHandRaised: false,
        isMuted: true,
        isVideoOn: true,
        joinedAt: new Date()
      },
      {
        id: '2',
        name: 'Jane Smith',
        role: 'student',
        hasHandRaised: true,
        isMuted: false,
        isVideoOn: true,
        joinedAt: new Date()
      }
    ]);
  };

  const initializeMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      setLocalStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Failed to access camera/microphone:', error);
      toast.error('Failed to access camera/microphone');
    }
  };

  const joinSession = () => {
    // Mock joining session - in real app, would emit to socket
    addSystemMessage('You joined the session');
  };

  const cleanup = () => {
    localStream?.getTracks().forEach(track => track.stop());
    screenStream?.getTracks().forEach(track => track.stop());
  };

  const addSystemMessage = (message: string) => {
    const systemMessage: ChatMessage = {
      id: `sys-${Date.now()}`,
      userId: 'system',
      userName: 'System',
      message,
      timestamp: new Date(),
      type: 'system'
    };
    setChatMessages(prev => [...prev, systemMessage]);
  };

  const toggleMute = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsVideoOn(!isVideoOn);
    }
  };

  const toggleScreenShare = async () => {
    if (!isScreenSharing) {
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: true
        });
        setScreenStream(stream);
        setIsScreenSharing(true);
        addSystemMessage('Screen sharing started');

        // Handle when user stops sharing
        stream.getVideoTracks()[0].onended = () => {
          stopScreenShare();
        };
      } catch (error) {
        console.error('Failed to share screen:', error);
        toast.error('Failed to share screen');
      }
    } else {
      stopScreenShare();
    }
  };

  const stopScreenShare = () => {
    screenStream?.getTracks().forEach(track => track.stop());
    setScreenStream(null);
    setIsScreenSharing(false);
    addSystemMessage('Screen sharing stopped');
  };

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const message: ChatMessage = {
      id: `msg-${Date.now()}`,
      userId: mockUser.id,
      userName: mockUser.name,
      userAvatar: mockUser.avatar,
      message: newMessage,
      timestamp: new Date(),
      type: 'text'
    };

    setChatMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  const toggleRecording = async () => {
    if (!isRecording) {
      setIsRecording(true);
      addSystemMessage('Recording started');
    } else {
      setIsRecording(false);
      addSystemMessage('Recording stopped');
    }
  };

  const createPoll = () => {
    const poll: SessionPoll = {
      id: `poll-${Date.now()}`,
      question: 'What would you like to learn next?',
      options: [
        { id: '1', text: 'Advanced Topics', votes: 0 },
        { id: '2', text: 'Practice Problems', votes: 0 },
        { id: '3', text: 'Review Basics', votes: 0 }
      ],
      isActive: true,
      totalVotes: 0
    };

    setActivePoll(poll);
    addSystemMessage('Poll started: ' + poll.question);
  };

  const endPoll = () => {
    if (activePoll) {
      setActivePoll(null);
      addSystemMessage('Poll ended');
    }
  };

  const lowerAllHands = () => {
    setHandRaised([]);
    addSystemMessage('All hands lowered');
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
    setIsFullscreen(!isFullscreen);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-900">
      {/* Top Bar */}
      <div className="bg-gray-800 text-white px-4 py-2 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <h2 className="font-semibold">{session?.title || 'Live Session'}</h2>
          <Badge className="bg-green-600">
            <span className="flex items-center">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse mr-2" />
              LIVE
            </span>
          </Badge>
          {isRecording && (
            <Badge className="bg-red-600">
              <span className="flex items-center">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse mr-2" />
                REC {formatTime(recordingTime)}
              </span>
            </Badge>
          )}
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-gray-700"
            onClick={toggleFullscreen}
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => {
              cleanup();
              navigate('/tutor/dashboard');
            }}
          >
            <PhoneOff className="w-4 h-4 mr-2" />
            End Session
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Video Grid */}
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Tutor Video */}
            <div className="relative bg-gray-800 rounded-lg overflow-hidden aspect-video">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 left-2 flex items-center space-x-2">
                <Badge className="bg-primary-600">You (Tutor)</Badge>
                {isMuted && <MicOff className="w-4 h-4 text-red-500" />}
                {!isVideoOn && <VideoOff className="w-4 h-4 text-red-500" />}
              </div>
            </div>

            {/* Screen Share */}
            {isScreenSharing && (
              <div className="relative bg-gray-800 rounded-lg overflow-hidden md:col-span-2 aspect-video">
                <video
                  ref={screenRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-2">
                  <Badge className="bg-purple-600">Screen Share</Badge>
                </div>
                <button
                  onClick={stopScreenShare}
                  className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Participant Videos */}
            {participants
              .filter(p => p.role === 'student')
              .map(participant => (
                <div key={participant.id} className="relative bg-gray-800 rounded-lg overflow-hidden aspect-video">
                  <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                    {participant.isVideoOn ? (
                      <div className="text-gray-400">Video Stream</div>
                    ) : (
                      <Avatar
                        src={participant.avatar}
                        name={participant.name}
                        size="lg"
                      />
                    )}
                  </div>
                  <div className="absolute bottom-2 left-2 flex items-center space-x-2">
                    <span className="text-white text-sm bg-black bg-opacity-50 px-2 py-1 rounded">
                      {participant.name}
                    </span>
                    {participant.hasHandRaised && (
                      <Hand className="w-4 h-4 text-yellow-500" />
                    )}
                    {participant.isMuted && <MicOff className="w-4 h-4 text-red-500" />}
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-80 bg-white border-l flex flex-col">
          {/* Tabs */}
          <Tabs
            tabs={[
              { id: 'participants', label: `Participants (${participants.length})` },
              { id: 'chat', label: 'Chat' },
              { id: 'polls', label: 'Polls' }
            ]}
            activeTab={activeTab}
            onChange={setActiveTab}
            className="px-4 pt-2"
          />

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {/* Participants Tab */}
            {activeTab === 'participants' && (
              <div className="space-y-4">
                {/* Hand Raised Section */}
                {handRaised.length > 0 && (
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium flex items-center">
                        <Hand className="w-4 h-4 text-yellow-500 mr-2" />
                        Hands Raised ({handRaised.length})
                      </h3>
                      <Button variant="ghost" size="sm" onClick={lowerAllHands}>
                        Lower All
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {handRaised.map(participant => (
                        <div key={participant.id} className="flex items-center justify-between p-2 bg-yellow-50 rounded">
                          <div className="flex items-center">
                            <Avatar src={participant.avatar} name={participant.name} size="sm" className="mr-2" />
                            <span className="text-sm">{participant.name}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setHandRaised(prev => prev.filter(p => p.id !== participant.id));
                            }}
                          >
                            Allow
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Participants List */}
                <div>
                  <h3 className="font-medium mb-2">All Participants</h3>
                  <div className="space-y-2">
                    {/* Tutor */}
                    <div className="flex items-center justify-between p-2 bg-primary-50 rounded">
                      <div className="flex items-center">
                        <Avatar name={mockUser.name} size="sm" className="mr-2" />
                        <div>
                          <p className="text-sm font-medium">{mockUser.name}</p>
                          <p className="text-xs text-gray-500">Tutor (You)</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        {isMuted && <MicOff className="w-3 h-3 text-red-500" />}
                        {!isVideoOn && <VideoOff className="w-3 h-3 text-red-500" />}
                      </div>
                    </div>
                    
                    {/* Students */}
                    {participants.map(participant => (
                      <div key={participant.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                        <div className="flex items-center">
                          <Avatar src={participant.avatar} name={participant.name} size="sm" className="mr-2" />
                          <div>
                            <p className="text-sm font-medium">{participant.name}</p>
                            <p className="text-xs text-gray-500">Student</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          {participant.hasHandRaised && <Hand className="w-3 h-3 text-yellow-500" />}
                          {participant.isMuted && <MicOff className="w-3 h-3 text-red-500" />}
                          {!participant.isVideoOn && <VideoOff className="w-3 h-3 text-red-500" />}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Chat Tab */}
            {activeTab === 'chat' && (
              <div className="flex flex-col h-full">
                <div className="flex-1 space-y-4 mb-4 overflow-y-auto max-h-[calc(100vh-300px)]">
                  {chatMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.type === 'system' ? 'justify-center' : 'items-start'}`}
                    >
                      {msg.type === 'system' ? (
                        <div className="bg-gray-100 text-xs text-gray-600 px-2 py-1 rounded">
                          {msg.message}
                        </div>
                      ) : (
                        <>
                          <Avatar
                            src={msg.userAvatar}
                            name={msg.userName}
                            size="sm"
                            className="mr-2 flex-shrink-0"
                          />
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="font-medium text-sm">{msg.userName}</span>
                              <span className="text-xs text-gray-500">
                                {format(new Date(msg.timestamp), 'h:mm a')}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700 break-words">{msg.message}</p>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="flex items-center space-x-2 mt-auto pt-4 border-t">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    className="flex-1"
                  />
                  <Button size="sm" onClick={sendMessage}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Polls Tab */}
            {activeTab === 'polls' && (
              <div className="space-y-4">
                {activePoll ? (
                  <Card className="p-4">
                    <h3 className="font-semibold mb-3">{activePoll.question}</h3>
                    <div className="space-y-3 mb-4">
                      {activePoll.options.map(option => {
                        const percentage = activePoll.totalVotes > 0 
                          ? (option.votes / activePoll.totalVotes) * 100 
                          : 0;
                        return (
                          <div key={option.id}>
                            <div className="flex justify-between text-sm mb-1">
                              <span>{option.text}</span>
                              <span className="text-gray-500">
                                {option.votes} votes ({percentage.toFixed(0)}%)
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-primary-600 h-2 rounded-full transition-all"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">
                        Total votes: {activePoll.totalVotes}
                      </span>
                      <Button variant="outline" size="sm" onClick={endPoll}>
                        End Poll
                      </Button>
                    </div>
                  </Card>
                ) : (
                  <div className="text-center py-8">
                    <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500 mb-4">No active poll</p>
                    <Button onClick={createPoll}>
                      Create Poll
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="bg-gray-800 text-white px-4 py-3 flex justify-center space-x-4">
        <Button
          variant="ghost"
          className={`text-white hover:bg-gray-700 ${isMuted ? 'bg-red-600 hover:bg-red-700' : ''}`}
          onClick={toggleMute}
        >
          {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </Button>

        <Button
          variant="ghost"
          className={`text-white hover:bg-gray-700 ${!isVideoOn ? 'bg-red-600 hover:bg-red-700' : ''}`}
          onClick={toggleVideo}
        >
          {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
        </Button>

        <Button
          variant="ghost"
          className={`text-white hover:bg-gray-700 ${isScreenSharing ? 'bg-green-600 hover:bg-green-700' : ''}`}
          onClick={toggleScreenShare}
        >
          <ScreenShare className="w-5 h-5" />
        </Button>

        <Button
          variant="ghost"
          className={`text-white hover:bg-gray-700 ${isRecording ? 'bg-red-600 hover:bg-red-700' : ''}`}
          onClick={toggleRecording}
        >
          <span className="flex items-center">
            <span className={`w-2 h-2 rounded-full ${isRecording ? 'bg-white animate-pulse' : 'bg-red-500'} mr-2`} />
            {isRecording ? 'Stop' : 'Record'}
          </span>
        </Button>

        <Button
          variant="ghost"
          className="text-white hover:bg-gray-700"
          onClick={() => setActiveTab('polls')}
        >
          <MessageCircle className="w-5 h-5" />
        </Button>

        <Button
          variant="ghost"
          className="text-white hover:bg-gray-700"
          onClick={() => setActiveTab('participants')}
        >
          <Users className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

export default LiveSession;